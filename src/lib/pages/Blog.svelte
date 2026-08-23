<script>
  const posts = [
    {
      date: 'Oct 24, 2024',
      category: 'Healthcare Informatics',
      title: 'Optimizing SQL Queries for Real-time Hospital Systems',
      description:
        'Analyzing the execution plans of complex join operations in legacy EHR databases. We explore strategies for index tuning and memory optimization to ensure sub-second response times critical for patient monitoring dashboards.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAfdMKQpw_d5XorfEXgGYABmLrr6ZxAuJD7ws98yD_IkIkSmGsqLZbVlCFYNj2IKgttV9wF-09poDchZeYS5It3S5d3RItEor5yzIprNj5OfeTxwkCqfswA791pmb0837RILNu9cMCVmkcPDHDDYsFt0b7-K9rwzhe0EUHGyjVJjpmrnM13cRWjSIiTITEyJw5Q17yALNocXoUtRNcukHaqgF2qO1Bnvo1GOQq-pDT8GF9tZLOdT5A',
      alt: 'A highly detailed industrial server room rendered in a pristine, clinical white and deep slate palette.',
      featured: true,
    },
    {
      date: 'Sep 15, 2024',
      category: 'Manufacturing',
      title: 'Bridging the Gap: .NET in Modern Manufacturing',
      description:
        'Integrating C# microservices with legacy PLC controllers to create unified dashboards for assembly line automation.',
    },
    {
      date: 'Aug 28, 2024',
      category: 'Architecture',
      title: 'Scaling Microservices for Clinical EHRs',
      description:
        'Architectural considerations when decoupling monolithic Electronic Health Record systems into resilient, independent domains using .NET 8.',
    },
  ];

  const archive = [
    { date: '10.02.24', title: 'Implementing OAuth2 in legacy hospital portals', tag: 'SECURITY' },
    { date: '09.15.24', title: 'SignalR for real-time telemetry on the factory floor', tag: '.NET CORE' },
    { date: '08.28.24', title: 'Designing fault-tolerant message queues for patient data', tag: 'INFRASTRUCTURE' },
  ];
</script>

<svelte:head>
  <title>Blog - SYS_ARCHITECT_v4.0</title>
</svelte:head>

<div class="px-margin-mobile md:px-margin-desktop w-full max-w-4xl mx-auto flex flex-col gap-stack-lg pb-stack-lg">
  <!-- Page Header -->
  <section class="border-l border-outline-variant pl-gutter py-stack-md mt-stack-md">
    <h1 class="font-headline-xl text-headline-xl text-on-surface mb-stack-sm tracking-tight">
      Technical Insights &amp; Industry Notes
    </h1>
    <p class="font-body-md text-body-md text-on-surface-variant max-w-2xl border-l-2 border-primary pl-4 py-1 bg-surface-container-low/50">
      Log entries covering .NET architecture, healthcare informatics scalability, and automated manufacturing
      systems integration.
    </p>
  </section>

  <!-- Blog List -->
  <section class="flex flex-col gap-stack-lg mt-stack-md">
    {#each posts as post}
      <article
        class={`flex ${post.featured ? 'flex-col-reverse md:flex-row' : 'flex-col'} gap-6 border-b border-outline-variant pb-stack-lg group cursor-pointer`}
      >
        <div class="flex-grow flex flex-col justify-center">
          <div class="flex items-center gap-3 mb-2">
            <span class="font-body-sm text-body-sm text-tertiary">{post.date}</span>
            <span class="text-outline-variant">•</span>
            <span class="font-body-sm text-body-sm text-primary uppercase tracking-wider text-xs">{post.category}</span>
          </div>
          <h2
            class={`font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface group-hover:text-primary transition-colors leading-tight ${post.featured ? 'mb-3' : 'mb-2'}`}
          >
            {post.title}
          </h2>
          <p class={`font-body-md text-body-md text-on-surface-variant ${post.featured ? 'mb-4' : ''}`}>
            {post.description}
          </p>
        </div>
        {#if post.image}
          <div
            class="w-full md:w-48 h-48 md:h-32 bg-cover bg-center rounded flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
            role="img"
            aria-label={post.alt}
            style={`background-image: url('${post.image}')`}
          ></div>
        {/if}
      </article>
    {/each}
  </section>

  <!-- Log History List -->
  <section class="mt-stack-md pt-stack-md">
    <h3 class="font-label-caps text-label-caps text-on-surface-variant mb-stack-md flex items-center gap-2">
      <span class="material-symbols-outlined text-[16px]">history</span>
      ARCHIVE LOGS
    </h3>
    <div class="flex flex-col gap-2">
      {#each archive as entry}
        <button
          type="button"
          class="flex flex-col sm:flex-row sm:items-center justify-between p-stack-sm border border-transparent hover:border-outline-variant hover:bg-surface-container-low transition-all group text-left w-full"
        >
          <div class="flex items-center gap-4">
            <span class="font-label-caps text-label-caps text-tertiary hidden sm:inline-block opacity-50">{entry.date}</span>
            <h4 class="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">{entry.title}</h4>
          </div>
          <div class="flex items-center gap-4 mt-2 sm:mt-0">
            <span class="font-label-caps text-label-caps text-on-surface-variant bg-surface-container px-2 py-1 border border-outline-variant/30">
              {entry.tag}
            </span>
            <span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors">arrow_outward</span>
          </div>
        </button>
      {/each}
    </div>
    <div class="mt-stack-md flex justify-center">
      <button
        type="button"
        class="font-label-caps text-label-caps text-on-surface border border-outline-variant hover:border-secondary hover:text-secondary px-6 py-2 transition-colors bg-surface-container-lowest"
      >
        LOAD OLDER LOGS
      </button>
    </div>
  </section>
</div>
