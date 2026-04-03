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
});