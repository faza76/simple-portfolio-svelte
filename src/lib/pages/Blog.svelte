<script>
  import { posts } from '../posts.js';
  import { navigate } from '../router.js';

  function open(e, slug) {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/blog/${slug}`);
  }

  const featured = posts.find((p) => p.featured) || posts[0];
</script>

<svelte:head>
  <title>Blog — SYS_ARCHITECT_v4.0</title>
</svelte:head>

<div class="px-margin-mobile md:px-margin-desktop w-full max-w-4xl mx-auto flex flex-col gap-stack-lg pb-stack-lg">
  <!-- Page Header -->
  <section class="border-l border-outline-variant pl-gutter py-stack-md mt-stack-md">
    <div class="font-label-caps text-label-caps text-primary mb-stack-sm flex items-center gap-2">
      <span class="w-2 h-2 bg-primary rounded-none inline-block"></span>
      ARCHIVE: {posts.length} ENTRIES
    </div>
    <h1 class="font-headline-xl text-headline-xl text-on-surface mb-stack-sm tracking-tight">
      Technical Insights &amp; Industry Notes
    </h1>
    <p
      class="font-body-md text-body-md text-on-surface-variant max-w-2xl border-l-2 border-primary pl-4 py-1 bg-surface-container-low/50"
    >
      Log entries covering .NET architecture, healthcare informatics scalability, and automated
      manufacturing systems integration. Each entry is authored in Markdown and versioned with
      the codebase.
    </p>
  </section>

  {#if featured}
    <!-- Featured post -->
    <section class="mt-stack-md">
      <a
        href={`#/blog/${featured.slug}`}
        on:click={(e) => open(e, featured.slug)}
        class="flex flex-col-reverse md:flex-row gap-6 border-b border-outline-variant pb-stack-lg group cursor-pointer"
      >
        <div class="flex-grow flex flex-col justify-center">
          <div class="flex items-center gap-3 mb-2">
            <span
              class="font-label-caps text-label-caps text-primary bg-surface-container px-2 py-1 border border-primary/30"
            >
              FEATURED
            </span>
            <span class="font-body-sm text-body-sm text-tertiary">{featured.date}</span>
            <span class="text-outline-variant">•</span>
            <span class="font-body-sm text-body-sm text-primary uppercase tracking-wider">
              {featured.category}
            </span>
          </div>
          <h2
            class="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface group-hover:text-primary transition-colors leading-tight mb-3"
          >
            {featured.title}
          </h2>
          <p class="font-body-md text-body-md text-on-surface-variant mb-4">{featured.description}</p>
          <div class="flex items-center gap-3 font-label-caps text-label-caps text-outline">
            <span class="text-on-surface-variant">{featured.readingTime}</span>
            <span>•</span>
            <span class="text-primary group-hover:underline">READ_TRANSMISSION →</span>
          </div>
        </div>
        {#if featured.image}
          <div
            class="w-full md:w-64 h-48 md:h-44 bg-cover bg-center flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity border border-outline-variant"
            role="img"
            aria-label={featured.alt || featured.title}
            style={`background-image: url('${featured.image}')`}
          ></div>
        {/if}
      </a>
    </section>
  {/if}

  <!-- Post list -->
  <section class="flex flex-col gap-stack-lg">
    <h2 class="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-2 border-b border-outline-variant pb-stack-sm">
      <span class="material-symbols-outlined text-[16px]">list_alt</span>
      RECENT_LOGS
    </h2>
    {#each posts as post}
      <article class="border-b border-outline-variant pb-stack-lg group cursor-pointer">
        <a
          href={`#/blog/${post.slug}`}
          on:click={(e) => open(e, post.slug)}
          class="flex flex-col gap-3"
        >
          <div class="flex items-center gap-3">
            <span class="font-body-sm text-body-sm text-tertiary">{post.date}</span>
            <span class="text-outline-variant">•</span>
            <span class="font-body-sm text-body-sm text-primary uppercase tracking-wider text-xs">
              {post.category}
            </span>
            <span class="text-outline-variant">•</span>
            <span class="font-body-sm text-body-sm text-on-surface-variant">{post.readingTime}</span>
          </div>
          <h2
            class="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface group-hover:text-primary transition-colors leading-tight mb-1"
          >
            {post.title}
          </h2>
          <p class="font-body-md text-body-md text-on-surface-variant">{post.description}</p>
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
        </a>
      </article>
    {/each}
  </section>

  <!-- Archive log -->
  <section class="mt-stack-md pt-stack-md">
    <h3 class="font-label-caps text-label-caps text-on-surface-variant mb-stack-md flex items-center gap-2">
      <span class="material-symbols-outlined text-[16px]">history</span>
      ARCHIVE_LOG
    </h3>
    <div class="flex flex-col gap-2">
      {#each posts as entry}
        <a
          href={`#/blog/${entry.slug}`}
          on:click={(e) => open(e, entry.slug)}
          class="flex flex-col sm:flex-row sm:items-center justify-between p-stack-sm border border-transparent hover:border-outline-variant hover:bg-surface-container-low transition-all group text-left w-full"
        >
          <div class="flex items-center gap-4">
            <span class="font-label-caps text-label-caps text-tertiary hidden sm:inline-block opacity-50">
              {entry.date}
            </span>
            <h4 class="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">
              {entry.title}
            </h4>
          </div>
          <div class="flex items-center gap-4 mt-2 sm:mt-0">
            <span
              class="font-label-caps text-label-caps text-on-surface-variant bg-surface-container px-2 py-1 border border-outline-variant/30"
            >
              {entry.category.toUpperCase().replace(/\s+/g, '_')}
            </span>
            <span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
              arrow_outward
            </span>
          </div>
        </a>
      {/each}
    </div>
  </section>
</div>
