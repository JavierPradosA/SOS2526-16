// @ts-check
import { test, expect } from '@playwright/test';

let app = 'http://localhost:3000'

test('has title', async ({ page }) => {
  await page.goto(app);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Global Electrical Vehicles/);
});

test('tiene informacion', async ({page}) => {
    await page.goto(app);
    await page.getByRole('link', { name: 'Frontend Javier' }).click();
    await expect(page).toHaveTitle(/global-ev-charging-infrastuctures/);
});