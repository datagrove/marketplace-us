import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://todoservis.com/');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.getByPlaceholder('Correo Electrónico').click();
  await page.getByPlaceholder('Correo Electrónico').fill('germanzarkovich@gmail.com');
  await page.getByPlaceholder('Correo Electrónico').press('Tab');
  await page.getByPlaceholder('Contraseña').fill('Asdfg12345!');
  await page.getByRole('button', { name: 'Acceso' }).click();
  await page.getByLabel('Navegación').click();
  await page.getByRole('link', { name: 'Mi Cuenta de proveedor' }).click
  await page.getByText('german', { exact: true })
  await page.getByText('zarko', { exact: true })
});


