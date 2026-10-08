import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:4322', browserName: 'chromium' },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4322 --ignore-lock',
    env: { BASE_PATH: process.env.TEST_BASE_PATH || '/' },
    url: `http://127.0.0.1:4322${process.env.TEST_BASE_PATH || ''}/`,
    reuseExistingServer: !process.env.CI,
  },
});
