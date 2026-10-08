# Alphpaca

A static Astro website for Alphpaca, an independent software studio and product company. Dark charcoal and muted gold, with the supplied alpaca emblem, locally hosted fonts, and dedicated product pages for Atlas Cloud and Eduroo.

## Local development

Requires Node.js 24 (see `.nvmrc`).

```sh
npm ci
npm run dev
```

Open http://localhost:4321. The site includes home, studio, services, products, Atlas Cloud, Eduroo, contact, privacy, and a custom 404.

```sh
npm run check
npm run build
npm run preview
```

Build output is in `dist/`. No server, database, API keys, or paid services are required.

## Deploy to GitHub Pages

1. Push this project to a GitHub repository with a `main` branch.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. Push to `main` or run **Deploy to GitHub Pages** from the Actions tab.

The included workflow installs locked dependencies, checks Astro/TypeScript, builds the static pages, and deploys the artifact. It reads the actual Pages origin and base path from GitHub. Internal links, scripts, fonts, the emblem, metadata, and sitemap work both at a domain root and under a repository path such as `/alphpacaio/`.

### Use alphpaca.io

The site defaults to `https://alphpaca.io`, and `public/CNAME` contains the domain. Set **alphpaca.io** as the custom domain in the repository’s **Settings → Pages**, configure your domain’s DNS for GitHub Pages, then enable **Enforce HTTPS** when available. Follow [GitHub’s custom domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) for the exact DNS records. Re-run the deployment after changing the Pages domain settings so canonical URLs and the sitemap reflect the new origin.

If you want to use only the default `github.io` address, remove `public/CNAME` and leave the custom domain field empty. No source changes to navigation are needed.

Deployment configuration follows [Astro’s GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/).

## Content & configuration

- `src/pages/`: page content. Product descriptions and roadmap items are presented as planned capabilities, with both products marked **In development**.
- `src/styles/global.css`: shared colors, typography, responsive layouts, and focus states.
- `src/lib/site.ts`: company identity, contact address, and base-aware URL helpers.
- `src/components/`: shared header, footer, call to action, icons, and illustrative product interfaces.
- `public/alphpaca-emblem.svg`: the supplied emblem, used in branding and as the favicon. The original file in the project root is preserved.

Optional build-time environment settings are documented in `.env.example`. The default contact address is `hello@alphpaca.io`.

The contact form opens a draft in the visitor’s email app. It does not send or store messages; the visitor must review and send the email themselves. Direct email links also work without JavaScript. Connect a form backend only if you want browser-based submissions later.

## Verification

```sh
npx playwright install chromium
npm run build
npm test
```

Browser checks cover route rendering, internal links and assets, mobile overflow, enlarged text, mobile navigation, contact topics, sitemap, and the custom 404. The pull-request workflow runs them against a repository-subpath build to catch GitHub Pages path regressions.

To reproduce that build locally:

```sh
SITE_URL=https://example.github.io BASE_PATH=/alphpacaio npm run build
TEST_BASE_PATH=/alphpacaio npm test
```

Run `npm run build` again afterward to restore the normal domain-root build.

## Before publishing

Confirm the company copy and planned product direction match your actual work. No customer logos, testimonials, usage metrics, legal identity, or program affiliation have been invented. The site supports presenting the business for a startup application; it does not assert acceptance into any startup program.

Verify that `hello@alphpaca.io` receives mail and that your domain is configured. If you need a jurisdiction-specific legal notice or a fuller privacy policy for business operations beyond this static site, add your actual company details.
