<script>
  import { route } from './lib/router.js';
  import Nav from './lib/Nav.svelte';
  import Footer from './lib/Footer.svelte';
  import Home from './lib/pages/Home.svelte';
  import About from './lib/pages/About.svelte';
  import Blog from './lib/pages/Blog.svelte';
  import BlogPost from './lib/pages/BlogPost.svelte';
  import Contact from './lib/pages/Contact.svelte';

  function resolvePage(path) {
    if (path === '/') return Home;
    if (path === '/about') return About;
    if (path === '/blog' || path === '/blog/') return Blog;
    if (path.startsWith('/blog/')) return BlogPost;
    if (path === '/contact') return Contact;
    return Home;
  }

  // Extract the post slug from a /blog/<slug> route. Strips any trailing slash.
  $: slug = $route.startsWith('/blog/')
    ? $route.slice('/blog/'.length).replace(/\/+$/, '')
    : '';
  $: activePage = resolvePage($route);
</script>

<Nav />

<main class="flex-grow pt-24">
  {#if activePage === BlogPost}
    <BlogPost {slug} />
  {:else}
    <svelte:component this={activePage} />
  {/if}
</main>

<Footer />
