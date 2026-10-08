import { test, expect } from '@playwright/test';

const base = process.env.TEST_BASE_PATH || '';
const routes = [
  '',
  'studio/',
  'services/',
  'products/',
  'products/atlas-cloud/',
  'products/eduroo/',
  'contact/',
  'privacy/',
];
const path = (route: string) => `${base}/${route}`;

test('every public page renders and its internal links and assets resolve under the deployment base', async ({
  page,
  request,
}) => {
  const checked = new Set<string>();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const route of routes) {
    const response = await page.goto(path(route));
    expect(response?.status(), route).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /\S+/,
    );
    const targets = await page
      .locator('a[href], img[src], link[rel="stylesheet"], script[src]')
      .evaluateAll((elements) =>
        elements
          .map(
            (element) =>
              element.getAttribute('href') || element.getAttribute('src') || '',
          )
          .filter((target) => target.startsWith('/')),
      );
    for (const target of targets) {
      expect(target.startsWith(`${base}/`), target).toBe(true);
      const clean = target.split(/[?#]/)[0];
      if (checked.has(clean)) continue;
      checked.add(clean);
      expect((await request.get(clean)).ok(), clean).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});

test('all routes fit small mobile screens and enlarged desktop text', async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(path(route));
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow, `${route} at ${width}px`).toBe(false);
    }
  }
  await page.goto(path(''));
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test('mobile navigation supports opening, Escape, and page navigation', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(path(''));
  const toggle = page.getByRole('button', { name: 'Open navigation' });
  await toggle.click();
  await expect(
    page.getByRole('navigation', { name: 'Main navigation' }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Products', exact: true })
    .click();
  await expect(page).toHaveURL(new RegExp(`${base}/products/$`));
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(
    page
      .getByRole('navigation')
      .getByRole('link', { name: 'Products', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
});

test('product inquiries preselect the topic and contact drafts never claim to send', async ({
  page,
}) => {
  for (const interest of ['atlas', 'eduroo']) {
    await page.goto(path(`contact/?interest=${interest}`));
    await expect(
      page.getByLabel('What would you like to talk about?'),
    ).toHaveValue(interest);
  }
  await page.getByLabel('Your name').fill('Example User');
  await page
    .getByLabel('A few words about it')
    .fill('We would like to discuss a learning platform.');
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.method() === 'POST') requests.push(request.url());
  });
  await page.getByRole('button', { name: 'Prepare an email' }).click();
  await expect(page.locator('#form-status')).toContainText(
    'Your message has not been sent.',
  );
  expect(requests).toEqual([]);
});

test('SEO files and the custom 404 use the deployment path', async ({
  request,
  page,
}) => {
  const robots = await request.get(path('robots.txt'));
  expect(await robots.text()).toContain(`${base}/sitemap-index.xml`);
  const sitemap = await request.get(path('sitemap-0.xml'));
  expect(await sitemap.text()).toContain(`${base}/products/atlas-cloud/`);
  await page.goto(path('404.html'));
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, follow',
  );
  await expect(
    page.getByRole('link', { name: 'Back to the studio' }),
  ).toHaveAttribute('href', path(''));
});
