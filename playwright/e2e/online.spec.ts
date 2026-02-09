import { test, expect } from '@playwright/test';

test('O aplicativo deve estar online', async ({ page }) => {
  await page.goto('http://localhost:5173');


  await expect(page).toHaveTitle(/Velô by Papito/);
});

