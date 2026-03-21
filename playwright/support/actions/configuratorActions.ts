import { Page, expect } from '@playwright/test'

export function createConfiguratorActions(page: Page) {
  const price = page.getByTestId('total-price')
  const vehicleImage = page.locator('img[alt^="Velô Sprint"]')
  const checkoutButton = page.getByRole('button', { name: 'Monte o Seu' })

  return {
    elements: {
      price,
      vehicleImage,
      checkoutButton,
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

    async toggleOptional(name: string | RegExp) {
      await page.getByRole('checkbox', { name }).click()
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

    async goToCheckout() {
      await checkoutButton.click()
    },

    async validateCheckoutPage() {
      await expect(page).toHaveURL(/\/order$/)
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
      await expect(page.getByTestId('summary-total-price')).toBeVisible()
    },
  }
}
