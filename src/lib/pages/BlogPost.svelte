<script>
  import { getPost } from '../posts.js';
  import { navigate } from '../router.js';

  export let slug;

  $: post = getPost(slug);

  function back(e) {
    e.preventDefault();
    navigate('/blog');
  }
</script>

<svelte:head>
  <title>{post ? `${post.title} — SYS_ARCHITECT_v4.0` : 'Not Found — SYS_ARCHITECT_v4.0'}</title>
</svelte:head>

<div
  class="px-margin-mobile md:px-margin-desktop w-full max-w-3xl mx-auto flex flex-col gap-stack-lg pb-stack-lg mt-stack-md"
>
  <!-- Return link -->
  <a
    href="#/blog"
    on:click={back}
    class="inline-flex items-center gap-2 font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors w-fit"
  >
    <span class="material-symbols-outlined text-[16px]">arrow_back</span>
    RETURN_TO_INDEX
  </a>

  {#if post}
    <!-- Post header -->
    <header class="border-l border-outline-variant pl-gutter py-stack-sm flex flex-col gap-stack-sm">
      <div class="flex flex-wrap items-center gap-3 font-label-caps text-label-caps">
        <span class="text-tertiary">{post.date}</span>
        <span class="text-outline-variant">•</span>
        <span class="text-primary uppercase tracking-wider">{post.category}</span>
        <span class="text-outline-variant">•</span>
        <span class="text-on-surface-variant">{post.readingTime}</span>
      </div>

      <h1
        class="font-headline-lg-mobile md:font-headline-xl md:text-headline-xl text-headline-lg-mobile text-on-surface tracking-tight leading-tight"
      >
        {post.title}
      </h1>

      {#if post.description}
        <p
          class="font-body-md text-body-md text-on-surface-variant border-l-2 border-primary pl-4 py-1 bg-surface-container-low/50"
        >
          {post.description}
        </p>
      {/if}

      {#if post.tags.length}
        <div class="flex flex-wrap gap-2 mt-1">
          {#each post.tags as tag}
            <span
              class="font-label-caps text-label-caps text-on-surface-variant bg-surface-container px-2 py-1 border border-outline-variant/30 text-[10px]"
            >
              {tag}
            </span>
          {/each}
        </div>
      {/if}

      <div class="flex items-center gap-2 font-label-caps text-label-caps text-outline mt-1">
        <span class="w-2 h-2 bg-primary inline-block"></span>
        AUTHOR: {post.author}
      </div>
    </header>

    <hr class="border-outline-variant" />

    {#if post.image}
      <figure class="w-full">
        <div
          class="w-full h-48 md:h-64 bg-cover bg-center border border-outline-variant"
          role="img"
          aria-label={post.alt || post.title}
          style={`background-image: url('${post.image}')`}
        ></div>
        {#if post.alt}
          <figcaption class="font-label-caps text-label-caps text-outline mt-2">{post.alt}</figcaption>
        {/if}
      </figure>
    {/if}

    <!-- Rendered markdown body -->
    <article class="md-content font-body-md text-body-md text-on-surface-variant">
      {@html post.html}
    </article>

    <!-- End-of-transmission footer -->
    <footer
      class="mt-stack-md border-t border-outline-variant pt-stack-md flex flex-col sm:flex-row sm:items-center justify-between gap-stack-md"
    >
      <span class="font-label-caps text-label-caps text-outline flex items-center gap-2">
        <span class="w-2 h-2 bg-primary inline-block"></span>
        END_OF_TRANSMISSION
      </span>
      <a
        href="#/blog"
        on:click={back}
        class="font-label-caps text-label-caps text-primary hover:text-primary-fixed-dim transition-colors inline-flex items-center gap-2"
      >
        BACK_TO_INDEX <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
      </a>
    </footer>
  {:else}
    <!-- Not found -->
    <section class="border border-outline-variant bg-surface-container-low p-stack-lg flex flex-col gap-stack-md">
      <div class="font-label-caps text-label-caps text-error flex items-center gap-2">
        <span class="material-symbols-outlined text-[16px]">error</span>
        404 — RECORD_NOT_FOUND
      </div>
      <h1 class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
        Log entry does not exist
      </h1>
      <p class="font-body-md text-body-md text-on-surface-variant max-w-xl">
        The requested transmission could not be located in the archive. The slug may be malformed,
        or the record may have been redacted from the system.
      </p>
      <a
        href="#/blog"
        on:click={back}
        class="font-label-caps text-label-caps text-primary hover:text-primary-fixed-dim transition-colors w-fit inline-flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-[16px]">arrow_back</span>
        RETURN_TO_INDEX
      </a>
    </section>
  {/if}
</div>
