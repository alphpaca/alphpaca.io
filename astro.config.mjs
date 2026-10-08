import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The Pages workflow supplies these automatically for both repository and custom domains.
export default defineConfig({
  site: process.env.SITE_URL || 'https://alphpaca.io',
  base: process.env.BASE_PATH || '/',
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') })],
  build: { format: 'directory' },
});
