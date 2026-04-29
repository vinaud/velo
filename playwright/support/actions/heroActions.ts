import { Page } from "playwright/test"

export function createHeroActions(page: Page) {
    return {
        async open() {
            await page.goto('/')
            await page.getByTestId('hero-cta-primary').click()
        },
    }
}