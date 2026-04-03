import { test, expect } from '../support/fixtures'

test.describe('Checkout - validações', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/order');
        await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible();
    });

    test('deve validar obrigatoriedade de todos os campos em branco', async ({ page, app }) => {
        const submit = page.getByRole('button', { name: 'Confirmar Pedido' });

        const nameAlert = page.locator('//label[text()="Nome"]/..//p');
        const surnameAlert = page.locator('//label[text()="Sobrenome"]/..//p');
        const emailAlert = page.locator('//label[text()="Email"]/..//p');
        const phoneAlert = page.locator('//label[text()="Telefone"]/..//p');
        const cpfAlert = page.locator('//label[text()="CPF"]/..//p');
        const storeAlert = page.locator('//label[text()="Loja para Retirada"]/..//p');
        const termsAlert = page.locator('//label[@for="terms"]/following-sibling::p');

        // Act
        await app.checkout.submit();

        // Assert
        await expect(nameAlert).toHaveText('Nome deve ter pelo menos 2 caracteres');
        await expect(surnameAlert).toHaveText('Sobrenome deve ter pelo menos 2 caracteres');
        await expect(emailAlert).toHaveText('Email inválido');
        await expect(phoneAlert).toHaveText('Telefone inválido');
        await expect(cpfAlert).toHaveText('CPF inválido');
        await expect(storeAlert).toHaveText('Selecione uma loja');
        await expect(termsAlert).toHaveText('Aceite os termos');
    });

    test('deve validar limite mínimo de caracteres para Nome e Sobrenome', async ({ page, app }) => {

        const nameAlert = page.locator('//label[text()="Nome"]/..//p');
        const surnameAlert = page.locator('//label[text()="Sobrenome"]/..//p');

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
        await expect(nameAlert).toHaveText('Nome deve ter pelo menos 2 caracteres');
        await expect(surnameAlert).toHaveText('Sobrenome deve ter pelo menos 2 caracteres');
    });

    test('deve exibir erro para e-mail com formato inválido', async ({ page, app }) => {

        const emailAlert = page.locator('//label[text()="Email"]/..//p');

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
        await expect(emailAlert).toHaveText('Email inválido');
    });

    test('deve exibir erro para CPF inválido', async ({ page, app }) => {

        const cpfAlert = page.locator('//label[text()="CPF"]/..//p');

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
        await expect(cpfAlert).toHaveText('CPF inválido');
    });

    test('deve exigir o aceite dos termos ao finalizar com dados válidos', async ({ page, app }) => {

        const termsAlert = page.locator('//label[@for="terms"]/following-sibling::p');

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
        await expect(termsAlert).toHaveText('Aceite os termos');

    });
});