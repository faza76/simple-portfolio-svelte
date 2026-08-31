<script>
  import { route, navigate } from './router.js';

  const links = [
    { label: 'Projects', path: '/' },
    { label: 'Blog', path: '/blog' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  let mobileOpen = false;

  // Blog post pages (e.g. /blog/my-post) get hamburger + title
  $: isBlogPost = $route.startsWith('/blog/') && $route !== '/blog' && $route !== '/blog/';

  function isActive(path, current) {
    if (path === current) return true;
    if (path === '/blog' && current.startsWith('/blog/')) return true;
    return false;
  }

  function go(e, path) {
    e.preventDefault();
    mobileOpen = false;
    navigate(path);
  }
</script>

<header
  class="fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-full bg-surface/90 dark:bg-surface/90 backdrop-blur-md border-b border-outline-variant"
>
  {#if isBlogPost}
    <!-- Blog post: title + hamburger -->
    <a
      href="#/"
      on:click={(e) => go(e, '/')}
      class="font-label-caps text-label-caps tracking-tighter text-primary dark:text-primary"
    >
      Software Engineering 3+ Experience
    </a>

    <div class="flex items-center gap-stack-md">
      <span class="hidden md:inline font-label-caps text-label-caps text-on-surface-variant">BUILD: 2026.Q3.01</span>
      <button
        type="button"
        class="md:hidden text-primary hover:text-primary-fixed-dim transition-colors"
        aria-label="Toggle menu"
        on:click={() => (mobileOpen = !mobileOpen)}
      >
        <span class="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
      </button>
    </div>
  {:else}
    <!-- Normal pages: nav links right-aligned, no title -->
    <div></div>
    <nav class="flex items-center gap-gutter">
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
      <span class="font-label-caps text-label-caps text-on-surface-variant ml-2">BUILD: 2026.Q3.01</span>
    </nav>
  {/if}
</header>

<!-- Mobile menu dropdown (blog post pages only) -->
{#if isBlogPost && mobileOpen}
  <nav
    class="fixed top-16 left-0 w-full z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant md:hidden"
  >
    <div class="flex flex-col px-margin-mobile py-stack-md gap-stack-sm">
      {#each links as link}
        <a
          href={`#${link.path}`}
          on:click={(e) => go(e, link.path)}
          class={isActive(link.path, $route)
            ? 'text-primary font-bold font-label-caps text-label-caps py-2 border-l-2 border-primary pl-3'
            : 'text-on-surface-variant font-label-caps text-label-caps hover:text-primary py-2 pl-3'}
        >
          {link.label}
        </a>
      {/each}
    </div>
  </nav>
{/if}
