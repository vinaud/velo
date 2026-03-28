import { Page, expect } from '@playwright/test'

export function createCheckoutActions(page: Page) {
  const summaryTotal = page.getByTestId('summary-total-price')

  return {
    elements: {
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
  }
}
