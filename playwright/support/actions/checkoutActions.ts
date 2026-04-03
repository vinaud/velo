import { Page, expect } from '@playwright/test'

export function createCheckoutActions(page: Page) {
  const summaryTotal = page.getByTestId('summary-total-price')
  const terms = page.getByTestId('checkout-terms')

  return {
    elements: {
      terms,
      summaryTotal,
    },

    async expectLoaded() {
      await expect(page).toHaveURL(/\/order$/)
      await expect(
        page.getByRole('heading', { name: 'Finalizar Pedido' }),
      ).toBeVisible()
      await expect(summaryTotal).toBeVisible()
    },

    async expectSummaryTotal(expected: string) {
      await expect(summaryTotal).toHaveText(expected)
    },

    async fillCustomerData(data: {
      name: string
      lastname: string
      email: string
      phone: string
      document: string
    }) {
      await page.getByTestId('checkout-name').fill(data.name)
      await page.getByTestId('checkout-surname').fill(data.lastname)
      await page.getByTestId('checkout-email').fill(data.email)
      await page.getByTestId('checkout-phone').fill(data.phone)
      await page.getByTestId('checkout-cpf').fill(data.document)
    },

    async selectStore(storeName: string) {
      await page.getByTestId('checkout-store').click()
      await page.getByRole('option', { name: storeName }).click()
    },

    async acceptTerms() {
      await terms.check()
    },

    async submit() {
      await page.getByRole('button', { name: 'Confirmar Pedido' }).click()
    }
  }
}
