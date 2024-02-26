import { test, expect } from '@playwright/test';

test('test login as a user ', async ({ page }) => {
  await page.goto('https://todoservis.com/');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.getByPlaceholder('Correo Electrónico').click();
  await page.getByPlaceholder('Correo Electrónico').fill(`${process.env.USER}@gmail.com`);
  await page.getByPlaceholder('Contraseña').click();
  await page.getByPlaceholder('Contraseña').fill('Asdfg12345!');
  await page.getByPlaceholder('Contraseña').press('Tab');
  await page.getByRole('button', { name: 'Acceso' }).click();
  await page.getByRole('heading', { name: 'Servicios' }).click();
});