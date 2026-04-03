import { Page, expect } from '@playwright/test'

export function createCheckoutActions(page: Page) {
  const summaryTotal = page.getByTestId('summary-total-price')
  const terms = page.getByTestId('checkout-terms')

  const alerts = {
    name: page.getByTestId('error-name'),
    lastname: page.getByTestId('error-lastname'),
    email: page.getByTestId('error-email'),
    phone: page.getByTestId('error-phone'),
    document: page.getByTestId('error-document'),
    store: page.getByTestId('error-store'),
    terms: page.getByTestId('error-terms'),
  }

  return {
    elements: {
      terms,
      summaryTotal,
      alerts
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
      await page.getByTestId('checkout-lastname').fill(data.lastname)
      await page.getByTestId('checkout-email').fill(data.email)
      await page.getByTestId('checkout-phone').fill(data.phone)
      await page.getByTestId('checkout-document').fill(data.document)
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
