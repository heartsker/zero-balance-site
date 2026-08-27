'use strict';

const { readFile, stat } = require('node:fs/promises');
const { extname, resolve, sep } = require('node:path');
const { markdownPathFor, negotiateRepresentation } = require('./agent-http.cjs');

const DEFAULT_SITE_ROOT = '/function/storage/site';
const CONTENT_SIGNAL = 'search=yes, ai-input=yes, ai-train=yes, use=full';
const TEXT_EXTENSIONS = new Set(['.css', '.html', '.js', '.json', '.md', '.txt', '.webmanifest', '.xml']);

const CONTENT_TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.md', 'text/markdown; charset=utf-8'],
  ['.png', 'image/png'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

function headerValue(headers, name) {
  if (!headers) return null;
  const key = Object.keys(headers).find((candidate) => candidate.toLowerCase() === name.toLowerCase());
  return key ? headers[key] : null;
}

function requestPath(event) {
  const raw = event.path || event.url || '/';
  const pathname = raw.startsWith('http://') || raw.startsWith('https://')
    ? new URL(raw).pathname
    : raw.split('?')[0];
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    throw new Error('invalid path encoding');
  }
  if (!decoded.startsWith('/') || decoded.includes('\\') || decoded.includes('\0')) {
    throw new Error('invalid path');
  }
  const segments = decoded.split('/');
  if (segments.some((segment) => segment === '.' || segment === '..')) {
    throw new Error('path traversal');
  }
  return decoded.replace(/\/{2,}/g, '/');
}

function safeObjectPath(siteRoot, key) {
  const root = resolve(siteRoot);
  const objectPath = resolve(root, key);
  if (objectPath !== root && !objectPath.startsWith(`${root}${sep}`)) {
    throw new Error('path traversal');
  }
  return objectPath;
}

async function fileInfo(siteRoot, key) {
  try {
    const info = await stat(safeObjectPath(siteRoot, key));
    return info.isFile() ? info : null;
  } catch {
    return null;
  }
}

function contentTypeFor(key) {
  if (key === 'llms.txt') return 'text/markdown; charset=utf-8';
  if (key === '.well-known/apple-app-site-association') return 'application/json; charset=utf-8';
  return CONTENT_TYPES.get(extname(key).toLowerCase()) ?? 'application/octet-stream';
}

function responseHeaders({ contentType, info, markdownPath, negotiated = false, directMarkdown = false }) {
  const headers = {
    'Cache-Control': directMarkdown
      ? 'public, max-age=0, must-revalidate'
      : 'public, max-age=3600',
    'Content-Signal': CONTENT_SIGNAL,
    'Content-Type': contentType,
    'Permissions-Policy': 'geolocation=(), camera=(), microphone=(), interest-cohort=()',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
  if (info) headers['Last-Modified'] = info.mtime.toUTCString();
  if (markdownPath) {
    headers.Link = `<${markdownPath}>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"`;
  }
  // API Gateway appends Accept-Encoding to Vary at the public edge.
  if (negotiated) headers.Vary = 'Accept';
  if (directMarkdown) headers['X-Robots-Tag'] = 'noindex, nofollow';
  return headers;
}

function plainResponse(statusCode, body, headers = {}, method = 'GET') {
  return {
    statusCode,
    headers,
    body: method === 'HEAD' ? '' : body,
    isBase64Encoded: false,
  };
}

async function objectResponse({ siteRoot, key, statusCode, method, markdownPath, negotiated = false }) {
  const info = await fileInfo(siteRoot, key);
  if (!info) return null;
  const extension = extname(key).toLowerCase();
  const isText = TEXT_EXTENSIONS.has(extension) || key === '.well-known/apple-app-site-association';
  const directMarkdown = extension === '.md';
  const content = method === 'HEAD'
    ? Buffer.alloc(0)
    : await readFile(safeObjectPath(siteRoot, key));
  return {
    statusCode,
    headers: responseHeaders({
      contentType: contentTypeFor(key),
      info,
      markdownPath,
      negotiated,
      directMarkdown,
    }),
    body: method === 'HEAD' ? '' : isText ? content.toString('utf8') : content.toString('base64'),
    isBase64Encoded: method === 'HEAD' ? false : !isText,
  };
}

function notAcceptable(method, markdownPath) {
  return plainResponse(
    406,
    'Not acceptable. Request text/html or text/markdown.\n',
    responseHeaders({
      contentType: 'text/markdown; charset=utf-8',
      markdownPath,
      negotiated: true,
    }),
    method,
  );
}

async function missingResponse(siteRoot, method, accept) {
  const representation = negotiateRepresentation(accept);
  if (representation === null) return notAcceptable(method, '/404.md');
  const key = representation === 'markdown' ? '404.md' : '404.html';
  const response = await objectResponse({
    siteRoot,
    key,
    statusCode: 404,
    method,
    markdownPath: '/404.md',
    negotiated: true,
  });
  if (response) return response;
  const contentType = representation === 'markdown'
    ? 'text/markdown; charset=utf-8'
    : 'text/html; charset=utf-8';
  const fallback = representation === 'markdown'
    ? '# Page not found\n\n- [Homepage](/)\n- [Sitemap](/sitemap-index.xml)\n- [Agent instructions](/llms.txt)\n'
    : '<main><h1>Page not found</h1><a href="/">Homepage</a><a href="/sitemap-index.xml">Sitemap</a><a href="/llms.txt">Agent instructions</a></main>';
  return plainResponse(
    404,
    fallback,
    responseHeaders({ contentType, markdownPath: '/404.md', negotiated: true }),
    method,
  );
}

function createHandler(options = {}) {
  const siteRoot = options.siteRoot || process.env.SITE_ROOT || DEFAULT_SITE_ROOT;

  return async function handler(event = {}) {
    const method = String(event.httpMethod || event.requestContext?.http?.method || 'GET').toUpperCase();
    if (method !== 'GET' && method !== 'HEAD') {
      return plainResponse(405, 'Method not allowed.\n', {
        Allow: 'GET, HEAD',
        'Cache-Control': 'no-store',
        'Content-Type': 'text/plain; charset=utf-8',
      }, method);
    }

    let pathname;
    try {
      pathname = requestPath(event);
    } catch {
      return plainResponse(400, 'Bad request.\n', {
        'Cache-Control': 'no-store',
        'Content-Type': 'text/plain; charset=utf-8',
      }, method);
    }

    const accept = headerValue(event.headers, 'accept');
    if (pathname === '/api/feature_flags') {
      return await objectResponse({
        siteRoot,
        key: 'api/feature_flags.json',
        statusCode: 200,
        method,
      }) ?? await missingResponse(siteRoot, method, accept);
    }

    const key = pathname.slice(1);
    const extension = extname(key).toLowerCase();
    const exact = key && await fileInfo(siteRoot, key);

    if (exact && extension !== '.html') {
      return await objectResponse({
        siteRoot,
        key,
        statusCode: 200,
        method,
        markdownPath: extension === '.md' ? pathname : undefined,
        negotiated: extension === '.md',
      });
    }

    if (pathname !== '/' && !pathname.endsWith('/') && !extension) {
      const directoryIndex = `${key}/index.html`;
      if (await fileInfo(siteRoot, directoryIndex)) {
        return plainResponse(308, '', {
          'Cache-Control': 'no-store',
          Location: `${pathname}/`,
        }, method);
      }
    }

    const htmlKey = pathname === '/'
      ? 'index.html'
      : pathname.endsWith('/')
        ? `${key}index.html`
        : extension === '.html'
          ? key
          : null;
    if (!htmlKey || !await fileInfo(siteRoot, htmlKey)) {
      return missingResponse(siteRoot, method, accept);
    }

    const representation = negotiateRepresentation(accept);
    const markdownPath = markdownPathFor(pathname);
    if (representation === null) return notAcceptable(method, markdownPath);

    const selectedKey = representation === 'markdown'
      ? markdownPath.slice(1)
      : htmlKey;
    const response = await objectResponse({
      siteRoot,
      key: selectedKey,
      statusCode: 200,
      method,
      markdownPath,
      negotiated: true,
    });
    return response ?? notAcceptable(method, markdownPath);
  };
}

const handler = createHandler();

module.exports = { createHandler, handler };
