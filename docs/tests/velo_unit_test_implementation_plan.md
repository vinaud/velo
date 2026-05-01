# Implementation Plan: Unit Tests for configuratorStore.ts

O objetivo deste plano é estabelecer uma estrutura inicial de testes unitários no projeto, focando exclusivamente no arquivo `src/store/configuratorStore.ts`. Criaremos testes básicos para as funções puras exportadas por este arquivo, para que sirvam de exemplo e fundação para desenvolvimentos futuros.

Como o projeto utiliza o Vite, a ferramenta mais adequada e recomendada para testes unitários é o **Vitest**, que possui configuração nativa compatível e é extremamente rápido.

## User Review Required

> [!IMPORTANT]
> A ferramenta escolhida para rodar os testes é o **Vitest**. Ele será adicionado como dependência de desenvolvimento (`devDependencies`) no seu `package.json`. Você concorda com o uso do Vitest?

## Proposed Changes

### Dependências e Configuração
Iremos adicionar o Vitest ao projeto para permitir a execução dos testes.

#### [MODIFY] package.json
- Adicionar `"vitest"` nas `devDependencies`.
- Adicionar o script `"test": "vitest"` na seção de `scripts`.

---

### Testes Unitários

Criaremos um novo arquivo de testes focado nas funções de cálculo e formatação de preço, que são lógicas de negócio puras (sem dependências externas) presentes na store.

#### [NEW] src/store/configuratorStore.test.ts
Este arquivo conterá testes básicos para as seguintes funções exportadas pelo `configuratorStore.ts`:
- `calculateTotalPrice`: Testar o cálculo base e a adição de opcionais e rodas.
- `calculateInstallment`: Testar o cálculo de parcelamento com juros.
- `formatPrice`: Testar a formatação correta para a moeda brasileira (BRL).

*Obs: Testes do estado global do Zustand (`useConfiguratorStore`) não serão incluídos nesta etapa inicial para manter a simplicidade, mas a estrutura já deixará tudo pronto para que possam ser adicionados no futuro.*

## Verification Plan

### Automated Tests
1. Executar o comando para instalar a nova dependência: `npm install` (ou `npm install -D vitest`).
2. Executar os testes: `npm run test` (ou `npx vitest run`).
3. Verificar se todos os testes básicos de funções passaram com sucesso no terminal.