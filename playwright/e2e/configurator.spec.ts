import { test, expect } from '../support/fixtures'


test.describe(' Configuração do Veículo ', () => {
  test.beforeEach(async ({ app }) => {
    await app.configurator.open()
  })

  test('deve atualizar a imagem e manter o preço base ao alterar a cor do veículo', async ({ app }) => {
    // Arrange
    await expect(app.configurator.elements.price).toBeVisible()
    await app.configurator.validateBasePrice()

    // Act
    await app.configurator.selectColor('Midnight Black')

    // Assert
    await app.configurator.validateBasePrice()
    await app.configurator.validateVehicleImage(
      '/src/assets/midnight-black-aero-wheels.png',
    )
  })

  test('deve atualizar o preço e a imagem do veículo ao alterar o tipo de roda', async ({ app }) => {
    // Arrange
    await expect(app.configurator.elements.price).toBeVisible()
    await app.configurator.validateBasePrice()

    // Act
    await app.configurator.selectWheels(/Sport Wheels/)

    // Assert
    await app.configurator.validateTotalPrice('R$ 42.000,00')
    await app.configurator.validateVehicleImage(
      '/src/assets/glacier-blue-sport-wheels.png',
    )

    // Act
    await app.configurator.selectWheels(/Aero Wheels/)

    // Assert
    await app.configurator.validateBasePrice()
    await app.configurator.validateVehicleImage(
      '/src/assets/glacier-blue-aero-wheels.png',
    )
  })

  test('deve atualizar corretamente o preço do carro ao selecionar ou remover itens opcionais', async ({ app }) => {
    // Arrange
    await expect(app.configurator.elements.price).toBeVisible()
    await app.configurator.validateBasePrice()

    // Act + Assert (Precision Park)
    await app.configurator.toggleOptional(/Precision Park/)
    await app.configurator.validateTotalPrice('R$ 45.500,00')

    // Act + Assert (Flux Capacitor)
    await app.configurator.toggleOptional(/Flux Capacitor/)
    await app.configurator.validateTotalPrice('R$ 50.500,00')

    // Act + Assert (desmarcar ambos opcionais)
    await app.configurator.toggleOptional(/Precision Park/)
    await app.configurator.validateTotalPrice('R$ 45.000,00')

    await app.configurator.toggleOptional(/Flux Capacitor/)
    await app.configurator.validateBasePrice()

    // Act
    await app.configurator.finishConfigurator()

    // Assert
    await app.checkout.expectLoaded()
    await app.checkout.expectSummaryTotal('R$ 40.000,00')
  })
})