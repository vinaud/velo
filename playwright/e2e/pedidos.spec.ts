import { test, expect } from '@playwright/test'

import { generateOrderCode } from '../support/helpers'

import { OrderLockupPage, OrderDetails } from '../support/pages/OrderLockupPage'
import { LandingPage } from '../support/pages/LandingPage'
import { Navbar } from '../support/components/Navbar'

/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', () => {

  let orderLockupPage: OrderLockupPage

  test.beforeEach(async ({ page }) => {
    // Arrange
    const landingPage = new LandingPage(page)
    await landingPage.goto()

    const navbar = new Navbar(page)
    await navbar.orderLockupLink()

    orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.validatePageLoaded()
  })

  test('deve consultar um pedido aprovado', async ({ page }) => {

    // Test Data
    const order: OrderDetails = {
      number: 'VLO-Z5R755',
      status: 'APROVADO' as const,
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'Fernando Papito',
        email: 'papito@velo.dev'
      },
      payment: 'À Vista'
    }

    // Act  
    
    await orderLockupPage.searchOrder(order.number)

    // Assert
    await orderLockupPage.validateOrderDetais(order)
    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(order.status)

  })

  test('deve consultar um pedido reprovado', async ({ page }) => {

    // Test Data
    const order: OrderDetails = {
      number: 'VLO-PV70I4',
      status: 'REPROVADO' as const,
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'Sakurai Masahiro',
        email: 'qa@dev.com'
      },
      payment: 'À Vista'
    }

    // Act  
   
    await orderLockupPage.searchOrder(order.number)

    // Assert
    await orderLockupPage.validateOrderDetais(order)

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em analise', async ({ page }) => {

    // Test Data
    const order: OrderDetails = {
      number: 'VLO-L893TT',
      status: 'EM_ANALISE' as const,
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'Adalberto Silva',
        email: 'email@email.com'
      },
      payment: 'À Vista'
    }

    // Act  
    
    await orderLockupPage.searchOrder(order.number)

    // Assert
    await orderLockupPage.validateOrderDetais(order)

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {

    const order = generateOrderCode()

    
    await orderLockupPage.searchOrder(order)

    await orderLockupPage.validateOrdernotFOund()
    

  })

  test('deve exibir mensagem quando o pedido em formato diferente do padrão não é encontrado', async ({ page }) => {

    const order = 'ABC123'

    await orderLockupPage.searchOrder(order)

    await orderLockupPage.validateOrdernotFOund()
    

  })
})