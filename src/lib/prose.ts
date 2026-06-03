// Inline prose helpers for blog copy that is stored as plain strings.
//
// Article bodies live in `copy.sections[].p` / `copy.faqItems[].a` as trusted,
// author-written strings. They are rendered with `set:html`, so any inline
// Markdown link syntax (`[label](href)`) has to be turned into a real anchor
// here - otherwise visitors see the literal brackets.

const MARKDOWN_LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replaceAll('"', '&quot;');
}

/**
 * Convert inline Markdown links in a trusted prose string to HTML anchors,
 * HTML-escaping everything else. Internal paths (e.g. locale-prefixed
 * `/ru/...`) are left intact so the .ru deploy can rewrite them; external
 * `http(s)` links open in a new tab with safe `rel`.
 *
 * The result is intended for use with Astro's `set:html`.
 */
export function renderInlineLinks(text: string): string {
  let html = '';
  let cursor = 0;

  for (const match of text.matchAll(MARKDOWN_LINK)) {
    const start = match.index ?? 0;
    html += escapeHtml(text.slice(cursor, start));

    const label = match[1];
    const href = match[2];
    const isExternal = /^https?:\/\//.test(href);
    const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    html += `<a href="${escapeAttribute(href)}"${attrs}>${escapeHtml(label)}</a>`;

    cursor = start + match[0].length;
  }

  html += escapeHtml(text.slice(cursor));
  return html;
}

/**
 * Reduce inline Markdown links to their plain label text (`[label](href)` ->
 * `label`). Used for JSON-LD structured data, where the answer text must read
 * as clean prose rather than raw Markdown in a search rich result.
 */
export function stripInlineLinks(text: string): string {
  return text.replaceAll(MARKDOWN_LINK, '$1');
}
