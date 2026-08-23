<script>
  const links = [
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'Documentation', href: '#' },
    { label: 'System Status', href: '#', status: true },
  ];
</script>

<footer
  class="w-full px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col md:flex-row justify-between items-start gap-gutter bg-surface-container-lowest dark:bg-surface-container-lowest border-t border-outline-variant mt-auto"
>
  <div class="font-label-caps text-label-caps text-on-surface">
    © 2026 ARCHITECT SYSTEMS. ALL RIGHTS RESERVED. LICENSED FOR FULL-STACK DEPLOYMENT.
  </div>
  <nav class="flex flex-wrap gap-stack-md">
    {#each links as link}
      <a
        class="text-on-surface-variant font-label-caps text-label-caps hover:text-primary hover:underline transition-all duration-200 flex items-center gap-1"
        href={link.href}
        target={link.href.startsWith('http') ? '_blank' : undefined}
        rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
      >
        {#if link.status}
          <span class="w-2 h-2 rounded-full bg-primary inline-block"></span>
        {/if}
        {link.label}
      </a>
    {/each}
  </nav>
</footer>
