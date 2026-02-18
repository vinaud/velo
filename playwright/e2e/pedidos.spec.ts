import { test, expect } from '../support/fixtures'
import { generateOrderCode } from '../support/helpers'
import type { OrderDetails } from '../support/actions/orderLockupActions'

/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', () => {
  test.beforeEach(async ({ app }) => {
    await app.orderLockup.open()
  
  })

  test('deve consultar um pedido aprovado', async ({ app }) => {

    // Test Data
    const order: OrderDetails = {
      number: 'VLO-Z5R755',
      status: 'APROVADO',
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'Fernando Papito',
        email: 'papito@velo.dev',
      },
      payment: 'À Vista',
    }

    
    await app.orderLockup.searchOrder(order.number)
  
    await app.orderLockup.validateOrderDetais(order)
    
    await app.orderLockup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido reprovado', async ({ app }) => {

    // Test Data
    const order: OrderDetails = {
      number: 'VLO-PV70I4',
      status: 'REPROVADO',
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'Sakurai Masahiro',
        email: 'qa@dev.com',
      },
      payment: 'À Vista',
    }

    // Act  
   
    await app.orderLockup.searchOrder(order.number)

    // Assert
    await app.orderLockup.validateOrderDetais(order)

    // Validação do badge de status encapsulada na Action
    await app.orderLockup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em analise', async ({ app }) => {

    // Test Data
    const order: OrderDetails = {
      number: 'VLO-L893TT',
      status: 'EM_ANALISE',
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'Adalberto Silva',
        email: 'email@email.com',
      },
      payment: 'À Vista',
    }

    // Act  
    
    await app.orderLockup.searchOrder(order.number)

    // Assert
    await app.orderLockup.validateOrderDetais(order)

    // Validação do badge de status encapsulada na Action
    await app.orderLockup.validateStatusBadge(order.status)
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
})
