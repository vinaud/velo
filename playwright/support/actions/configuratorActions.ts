import { Page, expect } from '@playwright/test'

export function createConfiguratorActions(page: Page) {
  const price = page.getByTestId('total-price')
  const vehicleImage = page.locator('img[alt^="Velô Sprint"]')

  return {
    elements: {
      price,
      vehicleImage,
    },

    async open() {
      await page.goto('/configure')
      await expect(price).toBeVisible()
      await expect(price).toHaveText('R$ 40.000,00')
      await expect(vehicleImage).toHaveAttribute(
        'src',
        '/src/assets/glacier-blue-aero-wheels.png',
      )
    },

    async selectColor(name: string) {
      await page.getByRole('button', { name }).click()
    },

    async selectWheels(name: string | RegExp) {
      await page.getByRole('button', { name }).click()
    },

    async validateBasePrice() {
      await expect(price).toHaveText('R$ 40.000,00')
    },

    async validateTotalPrice(expected: string) {
      await expect(price).toHaveText(expected)
    },

    async validateVehicleImage(src: string) {
      await expect(vehicleImage).toHaveAttribute('src', src)
    },
  }
}
