<script>
  import { route } from './lib/router.js';
  import Nav from './lib/Nav.svelte';
  import Footer from './lib/Footer.svelte';
  import Home from './lib/pages/Home.svelte';
  import About from './lib/pages/About.svelte';
  import Blog from './lib/pages/Blog.svelte';
  import Contact from './lib/pages/Contact.svelte';

  const pages = {
    '/': Home,
    '/about': About,
    '/blog': Blog,
    '/contact': Contact,
  };

  $: activePage = pages[$route] ?? Home;
</script>

<Nav />

<main class="flex-grow pt-24">
  <svelte:component this={activePage} />
</main>

<Footer />
