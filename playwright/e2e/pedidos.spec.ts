import { test, expect } from '@playwright/test';

test('Deve consultar um pedido aprovado', async ({ page }) => {

  const pedido = 'VLO-H8LZEN';
  await page.goto('http://localhost:5173/');

  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');

  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(pedido); 
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();

 
  const containerPedido = page.getByRole('paragraph').filter({ hasText: /^Pedido$/ }).locator('..');
  await expect(containerPedido).toContainText(pedido);
 
  await expect(page.locator('text=APROVADO')).toBeVisible();

});