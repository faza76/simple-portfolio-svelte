<script>
  import { navigate } from '../router.js';
  import ParticleBackground from '../ParticleBackground.svelte';

  let mobileMenuOpen = false;
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
  function goRoute(e, path) {
    e.preventDefault();
    mobileMenuOpen = false;
    navigate(path);
  }

  const projects = [
    {
      ref: 'REF-001',
      tags: ['HEALTHCARE', 'DATA_PIPELINE'],
      title: 'Clinical Data Pipeline',
      description:
        'Robust ETL pipeline built with C#/.NET Core to process millions of HL7 messages daily, ensuring HIPAA compliance and sub-second querying for downstream clinical analytics systems.',
      stack: [
        { label: 'C#', color: 'tech-dotnet' },
        { label: '.NET 8', color: 'tech-dotnet' },
        { label: 'SQL Server', color: 'tech-sql' },
        { label: 'Azure Service Bus', color: 'tech-cloud' },
      ],
    },
    {
      ref: 'REF-002',
      tags: ['MANUFACTURING', 'INTEGRATION'],
      title: 'Smart Factory MES Integration',
      description:
        'Middleware architecture connecting legacy PLC machinery to modern Manufacturing Execution Systems. Real-time telemetry processing using gRPC and SignalR for live factory floor dashboards.',
      stack: [
        { label: 'ASP.NET Core', color: 'tech-dotnet' },
        { label: 'gRPC', color: 'tech-cloud' },
        { label: 'SignalR', color: 'tech-cloud' },
        { label: 'RabbitMQ', color: 'tech-infra' },
      ],
    },
    {
      ref: 'REF-003',
      tags: ['HEALTHCARE', 'WEB_APP'],
      title: 'EHR Management Suite',
      description:
        'Comprehensive Electronic Health Record interface. Implemented a micro-frontend architecture backed by robust .NET Web APIs, focusing on high availability and secure role-based access control.',
      stack: [
        { label: 'Blazor WebAssembly', color: 'tech-dotnet' },
        { label: 'Entity Framework', color: 'tech-sql' },
        { label: 'IdentityServer', color: 'tech-infra' },
      ],
    },
    {
      ref: 'REF-004',
      tags: ['MANUFACTURING', 'IOT'],
      title: 'Predictive Maintenance Platform',
      description:
        'IoT-driven predictive maintenance system processing vibration and temperature telemetry from 500+ industrial sensors. ML-powered anomaly detection reduces unplanned downtime by 40%.',
      stack: [
        { label: 'C#', color: 'tech-dotnet' },
        { label: 'Apache Kafka', color: 'tech-infra' },
        { label: 'TimescaleDB', color: 'tech-sql' },
        { label: 'Python', color: 'tech-cloud' },
      ],
    },
    {
      ref: 'REF-005',
      tags: ['HEALTHCARE', 'API'],
      title: 'FHIR Interoperability Gateway',
      description:
        'RESTful FHIR R4 API gateway enabling bidirectional data exchange between disparate EHR systems. Handles 2M+ resource transactions daily with strict validation and audit logging.',
      stack: [
        { label: '.NET 8', color: 'tech-dotnet' },
        { label: 'FHIR R4', color: 'tech-cloud' },
        { label: 'Redis', color: 'tech-infra' },
        { label: 'PostgreSQL', color: 'tech-sql' },
      ],
    },
    {
      ref: 'REF-006',
      tags: ['SECURITY', 'INFRASTRUCTURE'],
      title: 'Zero-Trust Kubernetes Platform',
      description:
        'Hardened multi-tenant Kubernetes cluster with mTLS, network policies, and Kyverno admission control. Reduced attack surface by 95% while maintaining developer self-service.',
      stack: [
        { label: 'Kubernetes', color: 'tech-cloud' },
        { label: 'Istio', color: 'tech-infra' },
        { label: 'Kyverno', color: 'tech-cloud' },
        { label: 'Terraform', color: 'tech-infra' },
      ],
    },
    {
      ref: 'REF-007',
      tags: ['DATA_ENGINEERING', 'ANALYTICS'],
      title: 'Real-Time Clinical Analytics Engine',
      description:
        'Stream processing pipeline aggregating clinical events for real-time dashboards. Processes 50K events/sec with sub-100ms end-to-end latency for ICU monitoring.',
      stack: [
        { label: 'Apache Flink', color: 'tech-infra' },
        { label: 'C#', color: 'tech-dotnet' },
        { label: 'ClickHouse', color: 'tech-sql' },
        { label: 'Grafana', color: 'tech-cloud' },
      ],
    },
    {
      ref: 'REF-008',
      tags: ['MANUFACTURING', 'WEB_APP'],
      title: 'Warehouse Automation Dashboard',
      description:
        'Real-time warehouse management interface tracking inventory, AGV fleet status, and pick-path optimization. Replaced legacy WMS with a modern Blazor frontend.',
      stack: [
        { label: 'Blazor Server', color: 'tech-dotnet' },
        { label: 'SignalR', color: 'tech-cloud' },
        { label: 'SQL Server', color: 'tech-sql' },
        { label: 'RabbitMQ', color: 'tech-infra' },
      ],
    },
    {
      ref: 'REF-009',
      tags: ['HEALTHCARE', 'MOBILE'],
      title: 'Clinician Mobile Companion',
      description:
        'Cross-platform mobile app for clinicians providing on-the-go access to patient records, medication orders, and secure messaging. Offline-first architecture with sync-on-reconnect.',
      stack: [
        { label: '.NET MAUI', color: 'tech-dotnet' },
        { label: 'SQLite', color: 'tech-sql' },
        { label: 'gRPC', color: 'tech-cloud' },
        { label: 'Azure AD B2C', color: 'tech-infra' },
      ],
    },
    {
      ref: 'REF-010',
      tags: ['DEVOPS', 'AUTOMATION'],
      title: 'CI/CD Pipeline Orchestrator',
      description:
        'Fully automated deployment pipeline serving 30+ microservices. Blue-green deployments, automated rollback, and canary releases with traffic splitting.',
      stack: [
        { label: 'GitHub Actions', color: 'tech-infra' },
        { label: 'ArgoCD', color: 'tech-cloud' },
        { label: 'Helm', color: 'tech-infra' },
        { label: 'Prometheus', color: 'tech-cloud' },
      ],
    },
  ];

  function goContact(e) {
    e.preventDefault();
    navigate('/contact');
  }
</script>

<svelte:head>
  <title>SYS_ARCHITECT_v4.0 - Portfolio</title>
</svelte:head>

<ParticleBackground />

<div class="pb-stack-lg px-margin-mobile md:px-margin-desktop container mx-auto relative z-10">
<!-- Hero Section -->
<section
  class="py-stack-md mb-stack-md md:py-stack-lg md:mb-stack-lg border-b border-outline-variant relative flex flex-col items-center text-center grid-bg"
>
  <div class="max-w-4xl flex flex-col items-center">
    <div class="font-label-caps text-label-caps text-primary mb-stack-sm flex items-center justify-center gap-2">
      <span class="w-2 h-2 bg-primary rounded-none inline-block"></span>
      SYSTEM_STATUS: ONLINE
    </div>
    <h1
      class="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-xl md:text-headline-xl text-on-background mb-stack-sm md:mb-stack-md"
    >
      Architecting Systems for Life &amp; Industry
    </h1>
    <p class="font-body-sm md:font-body-md text-body-sm md:text-body-md text-on-surface-variant max-w-2xl mb-stack-md md:mb-stack-lg px-2">
      Fullstack .NET Developer specializing in high-reliability architectures. 4+ years engineering scalable data
      pipelines and integration solutions for Healthcare and Manufacturing sectors. Precision-driven, structurally
      sound code.
    </p>
    <div class="flex flex-wrap justify-center gap-stack-sm md:gap-stack-md">
      <a
        class="inline-flex items-center justify-center bg-primary text-on-primary font-label-caps text-label-caps px-5 py-2.5 md:px-6 md:py-3 transition-colors hover:bg-primary-fixed"
        href="#portfolio"
      >
        View Tech Stack
      </a>
      <a
        class="inline-flex items-center justify-center border border-outline text-on-surface font-label-caps text-label-caps px-5 py-2.5 md:px-6 md:py-3 transition-colors hover:border-secondary-container hover:text-secondary"
        href="#/contact"
        on:click={goContact}
      >
        Contact Developer
      </a>
    </div>
  </div>
</section>

<!-- Portfolio Grid Section -->
<section class="py-stack-md" id="portfolio">
  <div class="flex justify-between items-end mb-stack-lg border-b border-outline-variant pb-stack-sm">
    <h2 class="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background">
      Deployment Portfolio
    </h2>
    <span class="font-label-caps text-label-caps text-outline">VIEW: GRID</span>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
    {#each projects as project}
      <div
        class="border border-outline-variant bg-surface-container-low p-stack-md group hover:border-primary transition-colors flex flex-col relative"
      >
        <div class="absolute top-4 right-4 font-label-caps text-label-caps text-outline group-hover:text-primary transition-colors">
          {project.ref}
        </div>
        <div class="flex gap-2 mb-stack-md mt-6">
          {#each project.tags as tag, i}
            {#if i === 0}
              <span class="border-l-2 border-primary bg-surface-container pl-2 pr-3 py-1 font-label-caps text-label-caps text-primary text-[10px]">
                {tag}
              </span>
            {:else}
              <span class="border border-outline-variant bg-surface pl-2 pr-3 py-1 font-label-caps text-label-caps text-on-surface-variant text-[10px]">
                {tag}
              </span>
            {/if}
          {/each}
        </div>
        <h3 class="font-headline-lg-mobile text-[22px] font-semibold text-on-surface mb-stack-sm">
          {project.title}
        </h3>
        <p class="font-body-sm text-body-sm text-on-surface-variant mb-stack-lg flex-grow">
          {project.description}
        </p>
        <div class="border-t border-outline-variant pt-stack-sm mt-auto">
          <div class="flex flex-wrap gap-2 mb-stack-sm text-xs font-label-caps">
            {#each project.stack as tech}
              <span class={`border border-${tech.color} text-${tech.color} px-2 py-0.5`}>{tech.label}</span>
            {/each}
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-2 font-label-caps text-label-caps text-primary hover:text-primary-fixed transition-colors"
          >
            VIEW_DETAILS <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    {/each}
  </div>
</section>
</div>
