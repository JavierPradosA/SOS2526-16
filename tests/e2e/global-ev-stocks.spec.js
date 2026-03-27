import {test, expect} from '@playwright/test';

let app = 'http://localhost:3000';

test('has title', async ({ page }) => {
  await page.goto(app);

  await page.getByRole('link', { name: 'Frontend Adrián' }).click();

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Global EV Stock Volumes/);
});

test('Contiene información', async ({ page }) => {
  await page.goto(app);

  // Click the get started link.
  await page.getByRole('link', { name: 'Frontend Adrián' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Frontend Adrián' })).toBeVisible();
});


