import { test, expect } from "@playwright/test";


test('test', async ({ page }) => {
  await page.goto('http://localhost:4321/');
  await page.getByRole('heading', { name: 'LearnGrove', exact: true }).getByRole('link').click();
  await expect(page.locator('#navLines')).toContainText('LearnGrove');
});
