import { test, expect } from '../support/fixtures'
import { generateOrderCode } from '../support/helpers'
import type { OrderDetails } from '../support/actions/orderLookupActions'
import { insertOrder, deleteOrderByNumber } from '../support/database/orderRepository'
import crypto from 'crypto'

test.describe('Consulta de Pedido', () => {

  test.beforeEach(async ({ app }) => {
    await app.orderLookup.open()
  })

  // VLO-9X0H93

  test('deve consultar um pedido aprovado', async ({ app }) => {

    const order: OrderDetails = {
      number: 'VLO-SE4R01',
      status: 'APROVADO',
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'Fernando Papito',
        email: 'papito@velo.dev',
        document: '780.228.290-05',
        phone: '(11) 99999-9999',
      },
      payment: 'À Vista',
      total_price: '40000',
    }

    await deleteOrderByNumber(order.number)

    await insertOrder(order)

    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido reprovado', async ({ app }) => {

    const order: OrderDetails = {
      number: 'VLO-SE4R02',
      status: 'REPROVADO',
      color: 'Midnight Black',
      wheels: 'sport Wheels',
      customer: {
        name: 'Steve Jobs',
        email: 'jobs@apple.com',
        document: '780.228.290-05',
        phone: '(11) 99999-9999',
      },
      payment: 'À Vista',
      total_price: '40000',
    }

    await deleteOrderByNumber(order.number)

    await insertOrder(order)

    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em analise', async ({ app }) => {
    const order: OrderDetails = {
      number: 'VLO-SE4R03',
      status: 'EM_ANALISE',
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'João da Silva',
        email: 'joao@velo.dev',
        document: '780.228.290-05',
        phone: '(11) 99999-9999',
      },
      payment: 'À Vista',
      total_price: '40000',
    }

    await deleteOrderByNumber(order.number)

    await insertOrder(order)

    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ app }) => {
    const order = generateOrderCode()
    await app.orderLookup.searchOrder(order)
    await app.orderLookup.validateOrderNotFound()
  })

  test('deve exibir mensagem quando o código do pedido está fora do padrão', async ({ app }) => {
    const orderCode = 'XYZ-999-INVALIDO'
    await app.orderLookup.searchOrder(orderCode)
    await app.orderLookup.validateOrderNotFound()
  })

  test('deve manter o botão de busca desabilitado com campo vazio ou apenas espaços', async ({ app, page }) => {
    const button = app.orderLookup.elements.searchButton
    await expect(button).toBeDisabled()

    await app.orderLookup.elements.orderInput.fill('     ')
    await expect(button).toBeDisabled()
  })
})