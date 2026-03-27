import {test, expect} from '@playwright/test';

let app = 'http://localhost:3000/global-ev-stock-volumes';

//Test título
test('has title', async ({ page }) => {
    await page.goto(app)
    await expect(page).toHaveTitle('/Global EV Stock Volumes/')
}) 

//

