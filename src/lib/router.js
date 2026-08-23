import { writable } from 'svelte/store';

function normalize(hash) {
  const path = hash.replace(/^#/, '') || '/';
  return path === '' ? '/' : path;
}

function currentPath() {
  if (typeof window === 'undefined') return '/';
  return normalize(window.location.hash);
}

export const route = writable(currentPath());

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    route.set(currentPath());
  });
}

/** Navigate to a path (e.g. "/", "/about", "/blog", "/contact") and scroll to top. */
export function navigate(path) {
  if (typeof window === 'undefined') return;
  window.location.hash = path === '/' ? '' : path;
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}
