<script>
  import { route, navigate } from './router.js';

  const links = [
    { label: 'Portfolio', path: '/' },
    { label: 'Blog', path: '/blog' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  function isActive(path, current) {
    if (path === current) return true;
    // Keep Blog active while reading any individual post.
    if (path === '/blog' && current.startsWith('/blog/')) return true;
    return false;
  }

  function go(e, path) {
    e.preventDefault();
    navigate(path);
  }
</script>

<header
  class="fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-full bg-surface/90 dark:bg-surface/90 backdrop-blur-md border-b border-outline-variant"
>
  <a
    href="#/"
    on:click={(e) => go(e, '/')}
    class="font-label-caps text-label-caps tracking-tighter text-primary dark:text-primary"
  >
    SYS_ARCHITECT_v4.0
  </a>

  <nav class="hidden md:flex items-center gap-gutter">
    {#each links as link}
      <a
        href={`#${link.path}`}
        on:click={(e) => go(e, link.path)}
        class={isActive(link.path, $route)
          ? 'text-primary border-b-2 border-primary pb-1 font-bold font-label-caps text-label-caps opacity-80 transition-all duration-150'
          : 'text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-colors duration-200'}
      >
        {link.label}
      </a>
    {/each}
  </nav>

  <div class="flex items-center gap-stack-md">
    <span class="hidden md:inline font-label-caps text-label-caps text-on-surface-variant">BUILD: 2026.Q3.01</span>
    <button
      type="button"
      class="text-primary hover:text-primary-fixed-dim transition-colors"
      aria-label="System settings"
    >
      <span class="material-symbols-outlined">settings_input_component</span>
    </button>
  </div>
</header>
