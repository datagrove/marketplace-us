import { test, expect } from '@playwright/test';

test('test create post and delete it as a provider  ', async ({ page }) => {
  await page.goto('https://todoservis.com/');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.goto('https://todoservis.com/login')
  await page.getByPlaceholder('Correo Electrónico').click();
  await page.getByPlaceholder('Correo Electrónico').fill(`${process.env.USER}@gmail.com`);
  await page.getByPlaceholder('Contraseña').click();    
  await page.getByPlaceholder('Contraseña').fill('Asdfg12345!');
  await page.getByRole('button', { name: 'Acceso' }).click();
  
  await page.goto('https://todoservis.com/posts/createpost');
  await page.getByLabel('Título:fix computers')
  await page.getByLabel('Categoría de Servicio:4')
  await page.frameLocator('iframe[title="Rich Text Area"]').getByLabel('fix computers')
  await page.getByLabel('País:1')
  await page.getByLabel('Provincia:3')
  await page.getByLabel('Cantón:18')
  await page.getByLabel('Distrito:343')
  await page.getByRole('button', { name: 'Publicar' }).click
  await page.goto('https://todoservis.com/provider/profile')
  await page.getByRole('link', { name: 'Guanacaste/Liberia/Mayorga' }) 
  await page.getByLabel('Borrar').click
  await page.goto('https://todoservis.com/provider/profile')
});