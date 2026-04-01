import crypto from 'crypto'
import { test, expect } from '../support/fixtures'
import { generateOrderCode } from '../support/helpers'
import { insertOrder, deleteOrder } from '../support/database/database'
import type { OrderDetails } from '../support/actions/orderLockupActions'

/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', () => {
  test.beforeEach(async ({ app }) => {
    await app.orderLockup.open()

  })

  test('deve consultar um pedido aprovado', async ({ app }) => {

    // Test Data
    const order: OrderDetails = {
      number: generateOrderCode(),
      status: 'APROVADO',
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'Fernando Papito',
        email: 'papito@velo.dev',
      },
      payment: 'À Vista',
    }

    await insertOrder({
      id: crypto.randomUUID(),
      order_number: order.number,
      color: 'lunar-white',
      wheel_type: 'aero',
      customer_name: order.customer.name,
      customer_email: order.customer.email,
      customer_phone: '(11) 99999-9999',
      customer_cpf: '698.533.476-87',
      payment_method: 'avista',
      total_price: '40000',
      status: order.status,
    })

    try {
      await app.orderLockup.searchOrder(order.number)

      await app.orderLockup.validateOrderDetais(order)

      await app.orderLockup.validateStatusBadge(order.status)
    } finally {
      await deleteOrder(order.number)
    }
  })

  test('deve consultar um pedido reprovado', async ({ app }) => {

    // Test Data
    const order: OrderDetails = {
      number: generateOrderCode(),
      status: 'REPROVADO',
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'Sakurai Masahiro',
        email: 'qa@dev.com',
      },
      payment: 'À Vista',
    }

    await insertOrder({
      id: crypto.randomUUID(),
      order_number: order.number,
      color: 'glacier-blue',
      wheel_type: 'aero',
      customer_name: order.customer.name,
      customer_email: order.customer.email,
      customer_phone: '(11) 99999-9999',
      customer_cpf: '154.060.250-82',
      payment_method: 'avista',
      total_price: '40000',
      status: order.status,
    })

    try {
      // Act  
      await app.orderLockup.searchOrder(order.number)

      // Assert
      await app.orderLockup.validateOrderDetais(order)

      // Validação do badge de status encapsulada na Action
      await app.orderLockup.validateStatusBadge(order.status)
    } finally {
      await deleteOrder(order.number)
    }
  })

  test('deve consultar um pedido em analise', async ({ app }) => {

    // Test Data
    const order: OrderDetails = {
      number: generateOrderCode(),
      status: 'EM_ANALISE',
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'Adalberto Silva',
        email: 'email@email.com',
      },
      payment: 'À Vista',
    }

    await insertOrder({
      id: crypto.randomUUID(),
      order_number: order.number,
      color: 'glacier-blue',
      wheel_type: 'aero',
      customer_name: order.customer.name,
      customer_email: order.customer.email,
      customer_phone: '(11) 99999-9999',
      customer_cpf: '029.326.900-94',
      payment_method: 'avista',
      total_price: '40000',
      status: order.status,
    })

    try {
      // Act  
      await app.orderLockup.searchOrder(order.number)

      // Assert
      await app.orderLockup.validateOrderDetais(order)

      // Validação do badge de status encapsulada na Action
      await app.orderLockup.validateStatusBadge(order.status)
    } finally {
      await deleteOrder(order.number)
    }
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ app }) => {

    const order = generateOrderCode()

    await app.orderLockup.searchOrder(order)

    await app.orderLockup.validateOrdernotFOund()
  })

  test('deve exibir mensagem quando o pedido em formato diferente do padrão não é encontrado', async ({ app }) => {
    const order = 'ABC123'

    await app.orderLockup.searchOrder(order)

    await app.orderLockup.validateOrdernotFOund()
  })

  test('deve manter o botão de busca desabilitado com campo vazio ou apenas espaços', async ({ app, page }) => {
    const button = app.orderLockup.elements.searchButton
    await expect(button).toBeDisabled()

    const orderInput = app.orderLockup.elements.orderInput
    await orderInput.fill('    ')
    await expect(button).toBeDisabled()
  })
})
