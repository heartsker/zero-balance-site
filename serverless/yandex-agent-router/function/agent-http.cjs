'use strict';

function parseAccept(header) {
  return header
    .split(',')
    .map((part, position) => {
      const [mediaType, ...parameters] = part.trim().split(';');
      const [type = '', subtype = ''] = mediaType.toLowerCase().split('/');
      const qualityParameter = parameters.find((parameter) =>
        parameter.trim().toLowerCase().startsWith('q='),
      );
      const parsedQuality = qualityParameter
        ? Number.parseFloat(qualityParameter.split('=')[1] ?? '')
        : 1;
      const quality = Number.isFinite(parsedQuality)
        ? Math.min(1, Math.max(0, parsedQuality))
        : 0;
      return { type, subtype, quality, position };
    })
    .filter((range) => range.type && range.subtype);
}

function preferenceFor(ranges, candidate) {
  const [type, subtype] = candidate.split('/');
  const matches = ranges
    .map((range) => {
      const typeMatches = range.type === '*' || range.type === type;
      const subtypeMatches = range.subtype === '*' || range.subtype === subtype;
      if (!typeMatches || !subtypeMatches) return null;
      const specificity = range.type === '*'
        ? 0
        : range.subtype === '*'
          ? 1
          : 2;
      return { ...range, specificity };
    })
    .filter(Boolean)
    .sort((a, b) =>
      b.specificity - a.specificity ||
      b.quality - a.quality ||
      a.position - b.position,
    );

  return matches[0] ?? null;
}

/** Select the representation preferred by RFC-style Accept ranges and q-values. */
function negotiateRepresentation(acceptHeader) {
  if (!acceptHeader?.trim()) return 'html';
  const ranges = parseAccept(acceptHeader);
  const html = preferenceFor(ranges, 'text/html');
  const markdown = preferenceFor(ranges, 'text/markdown');

  const htmlQuality = html?.quality ?? 0;
  const markdownQuality = markdown?.quality ?? 0;
  if (htmlQuality === 0 && markdownQuality === 0) return null;
  if (markdownQuality > htmlQuality) return 'markdown';
  if (htmlQuality > markdownQuality) return 'html';
  if (markdown && html && markdown.position < html.position) return 'markdown';
  return 'html';
}

function markdownPathFor(pathname) {
  if (pathname === '/404/' || pathname === '/404.html') return '/404.md';
  if (pathname.endsWith('/')) return `${pathname}index.md`;
  if (pathname.endsWith('.html')) return pathname.replace(/\.html$/, '.md');
  return `${pathname}.md`;
}

module.exports = { markdownPathFor, negotiateRepresentation };
