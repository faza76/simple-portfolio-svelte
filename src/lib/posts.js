import { marked } from 'marked';

// Configure the markdown renderer once. GFM on for tables/strikethrough.
marked.setOptions({ gfm: true, breaks: false });

// Eagerly import every markdown file in the posts directory as a raw string.
// `import: 'default'` gives us the raw string directly instead of a module object.
const postFiles = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  eager: true,
  import: 'default',
});

/**
 * A tiny, intentional frontmatter parser. Supports:
 *   key: value
 *   key: "quoted value"
 *   key: [a, b, c]
 *   key:
 *     - item
 *     - item
 * Booleans (`true`/`false`) are coerced. Keep this — content is author-owned and
 * trusted, so a full YAML dependency is not warranted for a portfolio blog.
 */
function parseFrontmatter(raw) {
  const match = raw.match(/^\s*---\s*\n([\s\S]*?)\n?---\s*\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const fmText = match[1];
  const body = match[2].trim();
  const meta = {};
  let currentKey = null;

  const coerce = (value) => {
    const v = value.trim().replace(/^["']|["']$/g, '');
    if (v === 'true') return true;
    if (v === 'false') return false;
    if (/^-?\d+$/.test(v)) return Number(v);
    return v;
  };

  for (const line of fmText.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;

    // YAML list item:  - value
    const listItem = line.match(/^\s+-\s+(.*)$/);
    if (listItem && currentKey) {
      if (!Array.isArray(meta[currentKey])) meta[currentKey] = [];
      meta[currentKey].push(coerce(listItem[1]));
      continue;
    }

    // key: value  (inline array shorthand [a, b] supported)
    const kv = line.match(/^([\w-]+)\s*:\s*(.*)$/);
    if (kv) {
      const key = kv[1];
      let value = kv[2].trim();
      if (/^\[.*\]$/.test(value)) {
        meta[key] = value
          .slice(1, -1)
          .split(',')
          .map((s) => coerce(s))
          .filter(Boolean);
        currentKey = key;
        continue;
      }
      if (value === '') {
        // Could be a block list; default to empty array until list items appear.
        meta[key] = [];
        currentKey = key;
        continue;
      }
      meta[key] = coerce(value);
      currentKey = key;
    }
  }

  return { meta, body };
}

function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '');
}

function estimateReadingTime(body) {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// Parse, enrich, and sort every post — newest first.
export const posts = Object.entries(postFiles)
  .map(([path, raw]) => {
    const { meta, body } = parseFrontmatter(raw);
    const slug = meta.slug || slugFromPath(path);
    const html = marked.parse(body);
    return {
      slug,
      title: meta.title || slug,
      date: meta.date || '',
      category: meta.category || 'General',
      description: meta.description || '',
      tags: Array.isArray(meta.tags) ? meta.tags : [],
      author: meta.author || 'SYS_ARCHITECT',
      readingTime: meta.readingTime || `${estimateReadingTime(body)} min`,
      featured: meta.featured === true,
      image: meta.image || null,
      alt: meta.alt || '',
      body,
      html,
    };
  })
  .sort((a, b) => {
    const da = Date.parse(b.date) || 0;
    const db = Date.parse(a.date) || 0;
    return da - db || a.slug.localeCompare(b.slug);
  });

/** Resolve a single post by slug, or null when missing. */
export function getPost(slug) {
  if (!slug) return null;
  return posts.find((p) => p.slug === slug) || null;
}

/** All unique categories, useful for the archive / filter UI. */
export const categories = [...new Set(posts.map((p) => p.category))].sort();
