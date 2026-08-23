<script>
  const channels = [
    { label: 'EMAIL', value: 'contact@architect.systems', href: 'mailto:contact@architect.systems', icon: 'mail' },
    { label: 'GITHUB', value: 'github.com/architect', href: 'https://github.com', icon: 'code' },
    { label: 'LINKEDIN', value: 'linkedin.com/in/architect', href: 'https://linkedin.com', icon: 'link' },
    { label: 'LOCATION', value: 'Remote / GMT+7', href: null, icon: 'location_on' },
  ];

  let formName = '';
  let formEmail = '';
  let formSubject = 'PROJECT_INQUIRY';
  let formMessage = '';
  let status = 'idle'; // idle | sending | sent

  const subjects = ['PROJECT_INQUIRY', 'CONSULTING', 'FULL_TIME_ROLE', 'GENERAL'];

  function handleSubmit(e) {
    e.preventDefault();
    if (!formName || !formEmail || !formMessage) return;
    status = 'sending';
    // Placeholder transmit — wire this up to a real endpoint (Formspree, an API route, etc).
    setTimeout(() => {
      status = 'sent';
    }, 900);
  }
</script>

<svelte:head>
  <title>Contact - SYS_ARCHITECT_v4.0</title>
</svelte:head>

<div class="px-margin-mobile md:px-margin-desktop w-full max-w-4xl mx-auto flex flex-col gap-stack-lg pb-stack-lg">
  <!-- Page Header -->
  <section class="border-l border-outline-variant pl-gutter py-stack-md mt-stack-md">
    <div class="font-label-caps text-label-caps text-primary mb-stack-sm flex items-center gap-2">
      <span class="w-2 h-2 bg-primary rounded-none inline-block"></span>
      CHANNEL_STATUS: OPEN
    </div>
    <h1 class="font-headline-xl text-headline-xl text-on-surface mb-stack-sm tracking-tight">Initialize Contact</h1>
    <p class="font-body-md text-body-md text-on-surface-variant max-w-2xl border-l-2 border-primary pl-4 py-1 bg-surface-container-low/50">
      Submit a transmission below, or route directly through one of the channels listed. Response time typically
      under 24 hours.
    </p>
  </section>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-stack-md">
    <!-- Direct Channels -->
    <aside class="md:col-span-1 flex flex-col gap-2">
      <h2 class="font-label-caps text-label-caps text-on-surface-variant mb-stack-sm flex items-center gap-2">
        <span class="material-symbols-outlined text-[16px]">dns</span>
        DIRECT_CHANNELS
      </h2>
      {#each channels as channel}
        <div class="border border-outline-variant bg-surface-container-low p-stack-sm flex items-start gap-3">
          <span class="material-symbols-outlined text-primary text-[18px] mt-0.5">{channel.icon}</span>
          <div class="flex flex-col min-w-0">
            <span class="font-label-caps text-label-caps text-outline text-[10px] mb-0.5">{channel.label}</span>
            {#if channel.href}
              <a
                class="font-body-sm text-body-sm text-on-surface hover:text-primary transition-colors truncate"
                href={channel.href}
                target={channel.href.startsWith('http') ? '_blank' : undefined}
                rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}
              >
                {channel.value}
              </a>
            {:else}
              <span class="font-body-sm text-body-sm text-on-surface truncate">{channel.value}</span>
            {/if}
          </div>
        </div>
      {/each}
    </aside>

    <!-- Transmission Form -->
    <div class="md:col-span-2">
      <h2 class="font-label-caps text-label-caps text-on-surface-variant mb-stack-sm flex items-center gap-2">
        <span class="material-symbols-outlined text-[16px]">terminal</span>
        NEW_TRANSMISSION
      </h2>

      <form
        on:submit={handleSubmit}
        class="border border-outline-variant bg-surface-container-low p-stack-md flex flex-col gap-stack-md"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-stack-md">
          <label class="flex flex-col gap-1">
            <span class="font-label-caps text-label-caps text-on-surface-variant">NAME</span>
            <input
              bind:value={formName}
              required
              type="text"
              placeholder="Jane Doe"
              class="bg-surface border border-outline-variant rounded text-on-surface font-body-sm text-body-sm px-3 py-2 focus:border-primary focus:ring-primary placeholder:text-outline"
            />
          </label>
          <label class="flex flex-col gap-1">
            <span class="font-label-caps text-label-caps text-on-surface-variant">EMAIL</span>
            <input
              bind:value={formEmail}
              required
              type="email"
              placeholder="jane@company.com"
              class="bg-surface border border-outline-variant rounded text-on-surface font-body-sm text-body-sm px-3 py-2 focus:border-primary focus:ring-primary placeholder:text-outline"
            />
          </label>
        </div>

        <label class="flex flex-col gap-1">
          <span class="font-label-caps text-label-caps text-on-surface-variant">SUBJECT</span>
          <select
            bind:value={formSubject}
            class="bg-surface border border-outline-variant rounded text-on-surface font-body-sm text-body-sm px-3 py-2 focus:border-primary focus:ring-primary"
          >
            {#each subjects as s}
              <option value={s}>{s}</option>
            {/each}
          </select>
        </label>

        <label class="flex flex-col gap-1">
          <span class="font-label-caps text-label-caps text-on-surface-variant">MESSAGE</span>
          <textarea
            bind:value={formMessage}
            required
            rows="6"
            placeholder="Describe the project, timeline, and scope..."
            class="bg-surface border border-outline-variant rounded text-on-surface font-body-sm text-body-sm px-3 py-2 focus:border-primary focus:ring-primary placeholder:text-outline resize-none"
          ></textarea>
        </label>

        <div class="flex items-center justify-between pt-stack-sm border-t border-outline-variant">
          <span class="font-label-caps text-label-caps text-outline">
            {#if status === 'sent'}
              TRANSMISSION_RECEIVED
            {:else if status === 'sending'}
              TRANSMITTING...
            {:else}
              READY
            {/if}
          </span>
          <button
            type="submit"
            disabled={status !== 'idle'}
            class="inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label-caps text-label-caps px-6 py-3 transition-colors hover:bg-primary-fixed disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {#if status === 'sent'}
              SENT <span class="material-symbols-outlined text-[16px]">check</span>
            {:else if status === 'sending'}
              SENDING...
            {:else}
              TRANSMIT <span class="material-symbols-outlined text-[16px]">send</span>
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
