import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Production uses the custom domain root. Explicit overrides support repository-path previews.
export default defineConfig({
  site: process.env.SITE_URL || 'https://alphpaca.io',
  base: process.env.BASE_PATH || '/',
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') })],
  build: { format: 'directory' },
});
