import { test, expect } from '../support/fixtures'
import { deleteOrderByEmail } from '../support/database/orderRepository'

test.describe('Checkout - validações', () => {

    let alerts: any

    test.beforeEach(async ({ page, app }) => {
        await page.goto('/order');
        await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible();
        alerts = app.checkout.elements.alerts;
    });

    test('deve validar obrigatoriedade de todos os campos em branco', async ({ page, app }) => {



        // Act
        await app.checkout.submit();

        // Assert
        await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres');
        await expect(alerts.lastname).toHaveText('Sobrenome deve ter pelo menos 2 caracteres');
        await expect(alerts.email).toHaveText('Email inválido');
        await expect(alerts.phone).toHaveText('Telefone inválido');
        await expect(alerts.document).toHaveText('CPF inválido');
        await expect(alerts.store).toHaveText('Selecione uma loja');
        await expect(alerts.terms).toHaveText('Aceite os termos');
    });

    test('deve validar limite mínimo de caracteres para Nome e Sobrenome', async ({ page, app }) => {

        const customer = {
            name: 'A',
            lastname: 'B',
            email: 'joao.silva@email.com',
            document: '529.982.247-25',
            phone: '(11) 99999-9999'
        }

        // Arrange
        await app.checkout.fillCustomerData(customer);
        await app.checkout.selectStore('Velô Paulista');
        await app.checkout.acceptTerms


        // Act
        await app.checkout.submit();

        // Assert
        await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres');
        await expect(alerts.lastname).toHaveText('Sobrenome deve ter pelo menos 2 caracteres');
    });

    test('deve exibir erro para e-mail com formato inválido', async ({ page, app }) => {

        const customer = {
            name: 'Fernando',
            lastname: 'Papito',
            email: 'joao.silva@.com',
            document: '529.982.247-25',
            phone: '(11) 99999-9999'
        }

        // Arrange
        await app.checkout.fillCustomerData(customer);
        await app.checkout.selectStore('Velô Paulista');
        await app.checkout.acceptTerms


        // Act
        await app.checkout.submit();

        // Assert
        await expect(alerts.email).toHaveText('Email inválido');
    });

    test('deve exibir erro para CPF inválido', async ({ page, app }) => {

        const customer = {
            name: 'Fernando',
            lastname: 'Papito',
            email: 'joao.silva@email.com',
            document: '529982247aa',
            phone: '(11) 99999-9999'
        }

        // Arrange
        await app.checkout.fillCustomerData(customer);
        await app.checkout.selectStore('Velô Paulista');
        await app.checkout.acceptTerms


        // Act
        await app.checkout.submit();

        // Assert
        await expect(alerts.document).toHaveText('CPF inválido');
    });

    test('deve exigir o aceite dos termos ao finalizar com dados válidos', async ({ page, app }) => {

        const customer = {
            name: 'Fernando',
            lastname: 'Papito',
            email: 'joao.silva@email.com',
            document: '529.982.247-25',
            phone: '(11) 99999-9999'
        }

        // Arrange
        await app.checkout.fillCustomerData(customer);
        await app.checkout.selectStore('Velô Paulista');
        await expect(app.checkout.elements.terms).not.toBeChecked();

        // Act
        await app.checkout.submit();

        // Assert
        await expect(alerts.terms).toHaveText('Aceite os termos');

    });

    test.describe('pagamento e confirmação', () => {
        test('deve criar um pedido com sucesso para pagamento à vista', async ({ page, app }) => {
            const customerMassa = {
                name: 'Fernando',
                lastname: 'Papito',
                email: 'fernando.papito@velosprint.com',
                document: '05366127068',
                phone: '(11) 99999-9999',
                store: 'Velô Paulista',
                totalPrice: 'R$ 40.000,00',
                paymentMethod: 'avista' as const
            };

            // Limpar o banco de dados para evitar duplicidade de pedido
            await deleteOrderByEmail(customerMassa.email);

            // Fluxo End-to-End no mesmo teste (sem hook)
            await app.configurator.openFromHome();

            // Configurar opções padrão (já vêm selecionadas) e finalizar
            await app.configurator.validateTotalPrice(customerMassa.totalPrice);
            await app.configurator.finishConfigurator();
            await app.checkout.expectLoaded();

            // Arrange - Checkout
            await app.checkout.fillCustomerData(customerMassa);
            await app.checkout.selectStore(customerMassa.store);
            await app.checkout.selectPaymentMethod(customerMassa.paymentMethod);
            await app.checkout.expectSummaryTotal(customerMassa.totalPrice);
            await app.checkout.acceptTerms();

            // Act
            await app.checkout.submit();

            // Assert
            await app.checkout.expectOrderApproved();
        });

        test('deve aprovar automaticamente o crédito quando o score do CPF for maior que 700 no financiamento', async ({ page, app }) => {
            const customer = {
                name: 'Steve',
                lastname: 'Woz',
                email: 'steve.wozniak@velosprint.com',
                document: '65493881047',
                phone: '(11) 99999-9999',
                store: 'Velô Paulista',
                totalPrice: 'R$ 40.000,00',
                paymentMethod: 'financiamento' as const
            };

            // Limpar o banco de dados para evitar duplicidade de pedido
            await deleteOrderByEmail(customer.email);

            await app.checkout.mockCreditAnalysis(710);

            // Fluxo End-to-End no mesmo teste (sem hook)
            await app.configurator.openFromHome();

            // Configurar opções padrão (já vêm selecionadas) e finalizar
            await app.configurator.validateTotalPrice(customer.totalPrice);
            await app.configurator.finishConfigurator();
            await app.checkout.expectLoaded();

            // Arrange - Checkout
            await app.checkout.fillCustomerData(customer);
            await app.checkout.selectStore(customer.store);

            // Act
            await app.checkout.selectPaymentMethod(customer.paymentMethod);
            //await app.checkout.expectSummaryTotal(customer.totalPrice);
            await app.checkout.acceptTerms();

            await app.checkout.submit();

            // Assert
            await app.checkout.expectOrderApproved();
        });

        test('deve enviar um pedido para análise quando o score do CPF for entre 501 e 700 no financiamento', async ({ page, app }) => {
            const customer = {
                name: 'Maria',
                lastname: 'Silva',
                email: 'maria.silva@velosprint.com',
                document: '74690251037',
                phone: '(11) 98888-8888',
                store: 'Velô Paulista',
                totalPrice: 'R$ 40.000,00',
                paymentMethod: 'financiamento' as const
            };

            // Limpar o banco de dados para evitar duplicidade de pedido
            await deleteOrderByEmail(customer.email);

            await app.checkout.mockCreditAnalysis(600);

            // Fluxo End-to-End no mesmo teste (sem hook)
            await app.configurator.openFromHome();

            // Configurar opções padrão (já vêm selecionadas) e finalizar
            await app.configurator.validateTotalPrice(customer.totalPrice);
            await app.configurator.finishConfigurator();
            await app.checkout.expectLoaded();

            // Arrange - Checkout
            await app.checkout.fillCustomerData(customer);
            await app.checkout.selectStore(customer.store);

            // Act
            await app.checkout.selectPaymentMethod(customer.paymentMethod);
            await app.checkout.acceptTerms();

            await app.checkout.submit();

            // Assert
            await app.checkout.expectOrderInAnalysis();
        });

        test('deve reprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento sem entrada', async ({ page, app }) => {

            const customer = {
                name: 'Clark',
                lastname: 'Kent',
                email: 'clark@dailyplanet.com',
                document: '52998224725',
                phone: '(11) 99999-9999',
                store: 'Velô Paulista',
                paymentMethod: 'financiamento' as const,
                totalPrice: 'R$ 40.000,00'
            }

            await deleteOrderByEmail(customer.email)

            await app.checkout.mockCreditAnalysis(500)

            // Arrange
            await app.configurator.openFromHome()

            await app.configurator.validateTotalPrice(customer.totalPrice)
            await app.configurator.finishConfigurator()
            await app.checkout.expectLoaded()

            await app.checkout.fillCustomerData(customer)
            await app.checkout.selectStore(customer.store)

            // Act
            await app.checkout.selectPaymentMethod(customer.paymentMethod)
            await app.checkout.acceptTerms()
            await app.checkout.submit()

            // Assert
            await app.checkout.expectOrderRejected()
        })

        test('deve reprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento com entrada menor que 50%', async ({ page, app }) => {

            const customer = {
                name: 'Diana',
                lastname: 'Prince',
                email: 'diana@themiscira.com',
                document: '11144477735',
                phone: '(11) 99999-9999',
                store: 'Velô Paulista',
                paymentMethod: 'financiamento' as const,
                totalPrice: 'R$ 40.000,00',
                downPayment: '10000'
            }

            await deleteOrderByEmail(customer.email)

            await app.checkout.mockCreditAnalysis(500)

            // Arrange
            await app.configurator.openFromHome()

            await app.configurator.validateTotalPrice(customer.totalPrice)
            await app.configurator.finishConfigurator()
            await app.checkout.expectLoaded()

            await app.checkout.fillCustomerData(customer)
            await app.checkout.selectStore(customer.store)

            // Act
            await app.checkout.selectPaymentMethod(customer.paymentMethod)
            await app.checkout.fillDownPayment(customer.downPayment)
            await app.checkout.acceptTerms()
            await app.checkout.submit()

            // Assert
            await app.checkout.expectOrderRejected()
        })

        test('deve aprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento com entrada igual a 50%', async ({ page, app }) => {

            const customer = {
                name: 'Richard',
                lastname: 'Fortus',
                email: 'richard@gmail.com',
                document: '39434745004',
                phone: '(11) 99999-9999',
                store: 'Velô Paulista',
                paymentMethod: 'financiamento' as const,
                totalPrice: 'R$ 40.000,00',
                downPayment: '20000'
            }

            await deleteOrderByEmail(customer.email)

            await app.checkout.mockCreditAnalysis(450)

            // Arrange
            await app.configurator.openFromHome()

            await app.configurator.validateTotalPrice(customer.totalPrice)
            await app.configurator.finishConfigurator()
            await app.checkout.expectLoaded()

            await app.checkout.fillCustomerData(customer)
            await app.checkout.selectStore(customer.store)

            // Act
            await app.checkout.selectPaymentMethod(customer.paymentMethod)
            await app.checkout.fillDownPayment(customer.downPayment)
            await app.checkout.acceptTerms()
            await app.checkout.submit()

            // Assert
            await app.checkout.expectOrderApproved()
        })

        test('deve aprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento com entrada maior que 50%', async ({ page, app }) => {

            const customer = {
                name: 'Axl',
                lastname: 'Rose',
                email: 'axl@gnr.com',
                document: '72658530080',
                phone: '(11) 99999-9999',
                store: 'Velô Paulista',
                paymentMethod: 'financiamento' as const,
                totalPrice: 'R$ 40.000,00',
                downPayment: '30000'
            }

            await deleteOrderByEmail(customer.email)

            await app.checkout.mockCreditAnalysis(450)

            // Arrange
            await app.configurator.openFromHome()

            await app.configurator.validateTotalPrice(customer.totalPrice)
            await app.configurator.finishConfigurator()
            await app.checkout.expectLoaded()

            await app.checkout.fillCustomerData(customer)
            await app.checkout.selectStore(customer.store)

            // Act
            await app.checkout.selectPaymentMethod(customer.paymentMethod)
            await app.checkout.fillDownPayment(customer.downPayment)
            await app.checkout.acceptTerms()
            await app.checkout.submit()

            // Assert
            await app.checkout.expectOrderApproved()
        })
    });
});