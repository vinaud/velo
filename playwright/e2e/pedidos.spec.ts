import { test, expect } from '@playwright/test';
import { gerarCodigoPedido } from '../support/helpers';

test.describe('Consulta de pedido', () =>{

  test.beforeAll(async () => {
    console.log(
      'beforeAll: roda uma vez antes de todos os testes.'
    )
  })
  
  test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:5173/');
  
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
  
    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
  })
  
  test.afterEach(async () => {
    console.log(
      'afterEach: roda depois de cada teste.'
    )
  })
  
  test.afterAll(async () => {
    console.log(
      'afterAll: roda uma vez depois de todos os testes.'
    )
  })
  

  test('Deve consultar um pedido aprovado', async ({ page }) => {

    const pedido = 'VLO-H8LZEN';
  
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(pedido); 
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();
  
   
  //  const containerPedido = page.getByRole('paragraph').filter({ hasText: /^Pedido$/ }).locator('..');
  // await expect(containerPedido).toContainText(pedido);
   
  // await expect(page.locator('text=APROVADO')).toBeVisible();

  await expect(page.getByTestId(`order-result-${pedido}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${pedido}
    - img
    - text: APROVADO
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: Glacier Blue
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: aero Wheels
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: Vinaud Vinaud
    - paragraph: Email
    - paragraph: email@qa.com
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: À Vista
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `);
  
  });
  
  test('Deve exibir mensagem de erro para um pedido não encontrado', async ({ page }) => {
  
    const pedido = gerarCodigoPedido()
  
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(pedido); 
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();
  
  
    const titulo = page.getByRole( 'heading', {name: 'Pedido não encontrado'})
    await expect(titulo).toBeVisible()
  
    const mensagem = page.locator('p', {hasText: 'Verifique o número do pedido e tente novamente'})
    await expect(mensagem).toBeVisible()
  
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `)
  
  });
  
})


