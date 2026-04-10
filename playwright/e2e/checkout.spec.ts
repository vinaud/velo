import { test, expect } from '../support/fixtures'

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
        test('CT05 - Checkout e Confirmação - Pagamento à Vista (Fluxo Feliz)', async ({ page, app }) => {
            const customerMassa = {
                name: 'Fernando',
                lastname: 'Papito',
                email: 'fernando.papito@velosprint.com',
                document: '05366127068',
                phone: '(11) 99999-9999',
                store: 'Velô Paulista',
                paymentMethod: 'avista' as const
            };

            // Fluxo End-to-End no mesmo teste (sem hook)
            await page.goto('/');

            // Navegar para o configurador
            await page.getByTestId('hero-cta-primary').click();

            // Configurar opções padrão (já vêm selecionadas) e finalizar
            await app.configurator.validateBasePrice();
            await app.configurator.finishConfigurator();
            await app.checkout.expectLoaded();

            // Arrange - Checkout
            await app.checkout.fillCustomerData(customerMassa);
            await app.checkout.selectStore(customerMassa.store);
            await app.checkout.selectPaymentMethod(customerMassa.paymentMethod);
            await app.checkout.expectSummaryTotal('R$ 40.000,00');
            await app.checkout.acceptTerms();

            // Act
            await app.checkout.submit();

            // Assert
            await expect(page).toHaveURL(/\/success/);
            await expect(page.getByRole('heading', { name: 'Pedido Aprovado!' })).toBeVisible();
        });

    });
});