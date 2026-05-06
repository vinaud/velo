import { test, expect } from '../support/fixtures'

test('O aplicativo deve estar online', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Velô by Papito/)
})

