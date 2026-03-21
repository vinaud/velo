import { test as base } from '@playwright/test'

import { createConfiguratorActions } from './actions/configuratorActions'
import { createOrderLockupActions } from './actions/orderLockupActions'

type App = {
  configurator: ReturnType<typeof createConfiguratorActions>
  orderLockup: ReturnType<typeof createOrderLockupActions>
}

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    const app: App = {
      configurator: createConfiguratorActions(page),
      orderLockup: createOrderLockupActions(page),
    }

    await use(app)
  },
})

export { expect } from '@playwright/test'

