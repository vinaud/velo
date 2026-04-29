import { test as base } from '@playwright/test'

import { createCheckoutActions } from './actions/checkoutActions'
import { createConfiguratorActions } from './actions/configuratorActions'
import { createOrderLookupActions } from './actions/orderLookupActions'
import { createHeroActions } from './actions/heroActions'

import { mockCreditAnalysis } from './mock.api'

type App = {
  configurator: ReturnType<typeof createConfiguratorActions>
  checkout: ReturnType<typeof createCheckoutActions>
  orderLookup: ReturnType<typeof createOrderLookupActions>
  hero: ReturnType<typeof createHeroActions>
  mock: {
    creditAnalysis: (score: number) => Promise<void>
  }
}

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    const app: App = {
      configurator: createConfiguratorActions(page),
      checkout: createCheckoutActions(page),
      orderLookup: createOrderLookupActions(page),
      hero: createHeroActions(page),
      mock: {
        creditAnalysis: async (score: number) => await mockCreditAnalysis(page, score)
      }
    }

    await use(app)
  },
})

export { expect } from '@playwright/test'

