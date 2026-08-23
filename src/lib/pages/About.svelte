<script>
  const stack = [
    { label: '.NET Core / C#', color: 'tech-dotnet' },
    { label: 'SQL Server / T-SQL', color: 'tech-sql' },
    { label: 'Azure Cloud Services', color: 'tech-cloud' },
    { label: 'React / TypeScript', color: '[#38bdf8]' },
    { label: 'Entity Framework Core', color: 'primary' },
  ];

  const timeline = [
    {
      period: '2022 - PRESENT',
      org: 'Healthcare Tech Inc.',
      orgClass: 'text-primary',
      role: 'Senior Systems Architect',
      description:
        'Architected a distributed microservices platform for real-time patient monitoring. Utilized Azure Service Bus for messaging and optimized SQL Server schemas to handle high-throughput telemetry data.',
    },
    {
      period: '2020 - 2022',
      org: 'Industrial Automation Corp',
      orgClass: 'text-outline',
      role: 'Backend Engineer',
      description:
        'Developed a centralized control dashboard for manufacturing floors. Migrated legacy WinForms applications to a modern React/C# .NET Core stack, improving system response times by 40%.',
    },
    {
      period: '2018 - 2020',
      org: 'Logistics Systems LLC',
      orgClass: 'text-outline',
      role: 'Software Developer',
      description:
        'Maintained and extended core inventory tracking APIs. Gained deep expertise in complex SQL queries, stored procedures, and initial cloud migrations to Azure.',
    },
  ];
</script>

<svelte:head>
  <title>About / Experience - SYS_ARCHITECT_v4.0</title>
</svelte:head>

<div class="w-full max-w-[1024px] mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col gap-stack-lg">
  <!-- Header Section -->
  <header class="mb-stack-md border-b border-outline-variant pb-stack-md">
    <h1 class="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-stack-sm tracking-tighter">
      The Engineer Behind the Systems
    </h1>
    <p class="font-body-md text-body-md text-on-surface-variant max-w-3xl">
      Specializing in robust, scalable .NET architectures for mission-critical applications in healthcare and
      manufacturing environments. Precision engineered from the ground up.
    </p>
  </header>

  <!-- Narrative & Core Stack Bento -->
  <section class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-stack-lg">
    <div class="md:col-span-2">
      <div class="space-y-4 font-body-sm text-body-sm text-on-surface-variant">
        <p>
          My journey began in the rigid constraints of industrial control systems, where failure is not an option
          and every microsecond counts. This environment instilled a foundational respect for structural integrity
          and systemic reliability.
        </p>
        <p>
          Transitioning into healthcare tech, I applied these industrial principles to patient data systems. Here,
          the stakes were just as high, but the focus shifted to data security, HIPAA compliance, and building
          resilient APIs that connect disparate clinical systems seamlessly.
        </p>
        <p>
          Today, I architect full-stack solutions that bridge the gap between heavy-duty backend processing and
          intuitive, low-latency frontend interfaces. The philosophy remains unchanged: build systems that are
          clinically precise and industrially tough.
        </p>
      </div>
    </div>

    <div class="md:col-span-1">
      <h2 class="font-label-caps text-label-caps text-primary mb-4 uppercase border-b border-outline-variant pb-2 inline-block">
        Core Infrastructure
      </h2>
      <div class="flex flex-wrap gap-2">
        {#each stack as item}
          <span class={`px-2 py-1 bg-${item.color}/10 border border-${item.color}/30 font-label-caps text-label-caps text-${item.color}`}>
            {item.label}
          </span>
        {/each}
      </div>
    </div>
  </section>

  <!-- Technical Timeline -->
  <section class="mb-stack-lg">
    <h2 class="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-8 border-b border-outline-variant pb-2">
      Deployment History
    </h2>
    <div class="space-y-8">
      {#each timeline as item}
        <div class="flex flex-col md:flex-row gap-4 md:gap-8 border-l border-outline-variant pl-4 md:border-none md:pl-0">
          <div class="w-full md:w-48 flex-shrink-0 pt-1">
            <span class="font-label-caps text-label-caps text-tertiary block mb-1">{item.period}</span>
            <span class={`font-label-caps text-label-caps ${item.orgClass}`}>{item.org}</span>
          </div>
          <div class="flex-grow">
            <h3 class="font-body-md text-body-md font-bold text-on-surface mb-1">{item.role}</h3>
            <p class="font-body-sm text-body-sm text-on-surface-variant">{item.description}</p>
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>
