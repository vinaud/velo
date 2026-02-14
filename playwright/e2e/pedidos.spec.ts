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

    const pedido = {
      numero: 'VLO-H8LZEN',
      status: 'APROVADO',
      cor: 'Glacier Blue',
      roda: 'aero Wheels',
      cliente: {
        nome:  'Vinaud Vinaud',
        email: 'email@qa.com'
      },
      pagamento: 'À Vista'
    }
  
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(pedido.numero); 
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();
  
   
  //  const containerPedido = page.getByRole('paragraph').filter({ hasText: /^Pedido$/ }).locator('..');
  // await expect(containerPedido).toContainText(pedido);
   
  // await expect(page.locator('text=APROVADO')).toBeVisible();

  await expect(page.getByTestId(`order-result-${pedido.numero}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${pedido.numero}
    - status:
        - img
        - text: ${pedido.status}
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: ${pedido.cor}
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: ${pedido.roda}
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${pedido.cliente.nome}
    - paragraph: Email
    - paragraph: ${pedido.cliente.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: ${pedido.pagamento}
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `);

    const statusBadge = page.getByRole('status').filter({hasText: pedido.status})
    await expect(statusBadge).toHaveClass(/bg-green-100/)
    await expect(statusBadge).toHaveClass(/text-green-700/)

    const statusIcon = statusBadge.locator( 'svg')
    await expect(statusIcon).toHaveClass(/lucide-circle-check-big/)
})

  test('Deve consultar um pedido reprovado', async ({ page }) => {
    
    const pedido = {
      numero: 'VLO-PV70I4',
      status: 'REPROVADO',
      cor: 'Glacier Blue',
      roda: 'aero Wheels',
      cliente: {
        nome:  'Sakurai Masahiro',
        email: 'qa@dev.com'
      },
      pagamento: 'À Vista'
    }
  
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(pedido.numero); 
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    await expect(page.getByTestId(`order-result-${pedido.numero}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${pedido.numero}
      - status:
        - img
        - text: ${pedido.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${pedido.cor}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${pedido.roda}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${pedido.cliente.nome}
      - paragraph: Email
      - paragraph: ${pedido.cliente.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${pedido.pagamento}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

      const statusBadge = page.getByRole('status').filter({hasText: pedido.status})
      await expect(statusBadge).toHaveClass(/bg-red-100/)
      await expect(statusBadge).toHaveClass(/text-red-700/)
  
      const statusIcon = statusBadge.locator( 'svg')
      await expect(statusIcon).toHaveClass(/lucide-circle-x/)

  })

  test('Deve consultar um pedido em análise', async ({ page }) => {
    
    const pedido = {
      numero: 'VLO-L893TT',
      status: 'EM_ANALISE',
      cor: 'Glacier Blue',
      roda: 'aero Wheels',
      cliente: {
        nome:  'Adalberto Silva',
        email: 'email@email.com'
      },
      pagamento: 'À Vista'
    }
  
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(pedido.numero); 
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    await expect(page.getByTestId(`order-result-${pedido.numero}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${pedido.numero}
      - status:
        - img
        - text: ${pedido.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${pedido.cor}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${pedido.roda}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${pedido.cliente.nome}
      - paragraph: Email
      - paragraph: ${pedido.cliente.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${pedido.pagamento}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

      const statusBadge = page.getByRole('status').filter({hasText: pedido.status})
      await expect(statusBadge).toHaveClass(/bg-amber-100/)
      await expect(statusBadge).toHaveClass(/text-amber-700/)
  
      const statusIcon = statusBadge.locator( 'svg')
      await expect(statusIcon).toHaveClass(/lucide-clock/)
  })
  
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


