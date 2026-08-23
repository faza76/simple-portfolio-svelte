# SYS_ARCHITECT_v4.0 — Portfolio (Svelte)

A four-page portfolio site (Home/Portfolio, About, Blog, Contact) built with Svelte 5 + Vite + Tailwind CSS, matching the clinical-industrial dark design system from the provided reference.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

## Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

## Structure

```
src/
  App.svelte          # Shell: Nav + routed page + Footer
  app.css             # Tailwind directives, fonts, global styles
  lib/
    router.js         # Tiny hash-based router (#/, #/about, #/blog, #/contact)
    Nav.svelte         # Shared top navigation
    Footer.svelte       # Shared footer
    pages/
      Home.svelte      # Portfolio / project grid
      About.svelte     # Bio + experience timeline
      Blog.svelte      # Post list + archive log
      Contact.svelte   # Contact form + direct channels (new page, matches the design system)
tailwind.config.js      # Design tokens ported 1:1 from the reference (colors, spacing, type scale)
```

## Notes

- Routing is a lightweight hash-based router (no extra dependency) — `#/`, `#/about`, `#/blog`, `#/contact`.
- The Contact page wasn't in your original reference, so it was designed to match: same nav/footer, dark clinical-industrial palette, "transmission" form styled like the rest of the system (labels, borders, `TRANSMIT` action).
- The contact form currently just simulates a send (`setTimeout`) — wire the `handleSubmit` function in `src/lib/pages/Contact.svelte` to a real backend (e.g. Formspree, an API route, or your own server) to make it functional.
- All project/blog/timeline content is in the `<script>` block at the top of each page component — edit those arrays to update your real content.
