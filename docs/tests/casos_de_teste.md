# Casos de Teste - Velô Sprint

---

### CT01 - Landing Page: Navegação para o Configurador

#### Objetivo
Validar se a página inicial carrega corretamente e se o redirecionamento para o configurador funciona (fluxo feliz).

#### Pré-Condições
- O sistema deve estar online.
- O usuário deve estar acessando pelo navegador.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Acessar a URL raiz da aplicação (Landing Page) | A página é carregada corretamente mostrando as informações do carro |
| 2  | Clicar no botão principal para configurar o veículo | O sistema redireciona o usuário para a página de Configurador de Veículo |

#### Resultados Esperados
- O usuário deve ser recebido com a apresentação do veículo e conseguir iniciar o fluxo de compra ao ser direcionado ao módulo de configuração.

#### Critérios de Aceitação
- A Landing Page carrega sem erros de console ou layout.
- O clique no principal botão de ação encaminha imediatamente ao módulo de configuração.

---

### CT02 - Configurador: Valor Base Sem Opcionais

#### Objetivo
Validar se o sistema aplica a regra de negócio do valor base do veículo corretamente (R$ 40.000).

#### Pré-Condições
- O usuário deve estar na tela do Configurador de Veículo.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Observar o resumo do pedido ou da configuração inicial, sem marcar opcionais | O valor total exibido deve ser de R$ 40.000,00 |

#### Resultados Esperados
- O primeiro valor visível para o cliente antes de qualquer modificação é exatamente R$ 40.000.

#### Critérios de Aceitação
- Valor deve ser formatado em BRL (R$ 40.000,00).

---

### CT03 - Configurador: Seleção de Opcionais e Precificação Dinâmica

#### Objetivo
Validar as regras de precificação dinâmica ao adicionar e remover opcionais.

#### Pré-Condições
- O usuário deve estar na tela do Configurador de Veículo, iniciando com R$ 40.000.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Selecionar as Rodas "Sport" | O valor total exibido atualiza para R$ 42.000,00 |
| 2  | Selecionar "Precision Park" | O valor total exibido atualiza para R$ 47.500,00 |
| 3  | Selecionar "Flux Capacitor" | O valor total exibido atualiza para R$ 52.500,00 |
| 4  | Desmarcar as Rodas "Sport" | O valor total exibido atualiza para R$ 50.500,00 |

#### Resultados Esperados
- O valor é modificado dinamicamente e sem recarregar a página, sempre refletindo a soma correta: Base + Sport (2.000) + Precision (5.500) + Capacitor (5.000).

#### Critérios de Aceitação
- Somar e subtrair opcionais deve atualizar instantaneamente o total.
- Os preços dos adicionais devem seguir a tabela descrita na regra de negócio.

---

### CT04 - Configurador: Cálculo de Financiamento Parcelado (Juros a 2% a.m.)

#### Objetivo
Validar se a simulação de financiamento apresenta juros compostos em 12x com taxa fixa de 2% validando cenários sem exceção de crédito.

#### Pré-Condições
- O usuário deve estar na seção de pagamento/simulação de financiamento do Configurador.
- Um carro base (R$ 40.000) deve estar selecionado.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Selecionar a opção de pagamento "Financiamento" ou "Parcelado" | Aparecem campos para simular o parcelamento |
| 2  | Inserir o valor de entrada de R$ 10.000,00 | O saldo devedor é calculado em R$ 30.000,00 |
| 3  | Visualizar o plano de parcelamento (12x) | O sistema calcula e exibe 12 parcelas com base em R$ 30.000, calculando com juros compostos de 2% a.m. |

#### Resultados Esperados
- O sistema mostra o cálculo aproximado das parcelas contendo o acréscimo de 2% de juros compostos mensais sobre o montante financiado.

#### Critérios de Aceitação
- Apenas prazo de 12x está disponível para parcelamento (travado).
- Cálculo das parcelas considera Juros Compostos (PMT) com 2% a.m. de taxa fixa.

---

### CT05 - Checkout: Validação de Campos Obrigatórios de Cadastro

#### Objetivo
Validar se o sistema bloqueia o avanço da compra quando dados inválidos ou incompletos são fornecidos.

#### Pré-Condições
- O usuário está finalizando a configuração e indo para o preenchimento de dados de Checkout/Pedido.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Deixar o campo de "Nome" em branco | Nenhuma mensagem de erro instantânea ou validação de formulário |
| 2  | Deixar o campo de "CPF" em branco | Idem |
| 3  | Clicar no botão "Finalizar Pedido" ou "Continuar" | O sistema bloqueia a transição e exibe mensagens de erro em vermelho indicando que os campos Nome e CPF são obrigatórios |
| 4  | Inserir um CPF com formato inválido (ex: `123`) | O sistema exibe um aviso informando que o CPF é inválido |

#### Resultados Esperados
- O usuário deve ser incapaz de fechar o pedido sem o fornecimento dos dados básicos válidos necessários para identificação e análise de crédito.

#### Critérios de Aceitação
- Campos obrigatórios validam na submissão.
- Input de CPF ou similares faz validação de máscara e/ou verificação de dígitos.

---

### CT06 - Análise de Crédito Automática: Score > 700 (Aprovado)

#### Objetivo
Validar se a API de análise retorna status de Aprovação para um cliente com Score de Crédito alto (Maior que 700).

#### Pré-Condições
- O usuário preencheu dados obrigatórios no Checkout de forma válida.
- Selecionada opção de pagamento via financiamento com entrada MENOR que 50% (para submeter-se ao score).
- O backend de mock de Score retorna valor > 700 (ex: 800) para o CPF informado.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Enviar a requisição de Checkout clicando em "Finalizar Pedido" | O sistema entra no estado de `loading` enquanto confere o score |
| 2  | Aguardar a resposta automática da API | O sistema redireciona para a tela de Confirmação e informa o status de "Aprovado" |

#### Resultados Esperados
- A venda é concretizada e aprovada na hora, enviando o cliente para a etapa final do funil.

#### Critérios de Aceitação
- Score > 700 retorna imediata aprovação de crédito.

---

### CT07 - Análise de Crédito Automática: Score entre 501 a 700 (Em análise)

#### Objetivo
Validar se um usuário posicionado no trecho intermediário do Score de crédito recebe uma mensagem informando que seu pedido seguirá em acompanhamento manual/em análise.

#### Pré-Condições
- Opção de pagamento via financiamento, entrada < 50%.
- O backend retorna score de 600 para o CPF informado.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Clicar em "Finalizar Pedido" | O sistema processa o crédito |
| 2  | Aguardar a finalização | O sistema exibe a página de Confirmação com status de "Em Análise", avisando que a equipe entrará em contato |

#### Resultados Esperados
- O pedido ainda é criado dentro de base, porém aguardará aprovação e liberação.

#### Critérios de Aceitação
- Para scores entre 501 e 700, o cliente é notificado com clareza da situação processual de seu financiamento ("Em análise").

---

### CT08 - Análise de Crédito Automática: Score <= 500 (Reprovado)

#### Objetivo
Validar o fluxo negativo onde a análise de crédito online nega o parcelamento pro cliente.

#### Pré-Condições
- Opção via financiamento, entrada < 50%.
- O backend retorna score de 400.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Clicar em "Finalizar Pedido" | O processamento se inicia e a chamada da API é performada |
| 2  | Aguardar a confirmação de aprovação | O sistema apresenta uma tela ou modal de recusa do pedido ("Reprovado") e oferece alternativas de pagamento à vista caso disponível |

#### Resultados Esperados
- O financiamento não pôde ser ativado e uma recusa de crédito precisa ser reportada na interface.

#### Critérios de Aceitação
- Cliente com Score <= 500 não avança no checkout ou gera um pedido com status explicitamente Reprovado.

---

### CT09 - Análise de Crédito (Exceção): Entrada >= 50% Aprova Automaticamente do Pedido

#### Objetivo
Validar a política de contorno que força liberação de crédito para negociações com metade ou mais do valor dado em entrada.

#### Pré-Condições
- O carrinho tem o valor total (ex: R$ 40.000).
- Dados do usuário simulariam um Score baixo (ex: <= 500), que naturalmente geraria reprovação.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Inserir no campo de Entrada um valor de R$ 20.000 (>= 50% de 40mil) | O sistema atualiza o saldo a ser financiado |
| 2  | Avançar com checkout mesmo possuindo um CPF com score negativo associado | O sistema envia os dados para fechar o pedido |
| 3  | Avaliar o retorno da página de Confirmação | O pedido transita para status "Aprovado" automaticamente, ignorando regra do Score |

#### Resultados Esperados
- O pedido é aprovado logo após submissão. Cota de entrada elevada mitiga necessidade de check de score.

#### Critérios de Aceitação
- Entradas maiores ou iguais a 50% realizam by-pass nas regras de bloqueio de score.

---

### CT10 - Confirmação: Exibição da Tela de Sucesso e Número do Pedido

#### Objetivo
Validar se após a finalização de uma compra a página mostra os dados cruciais para acompanhamento do cliente.

#### Pré-Condições
- O cliente passou com sucesso pelo processo de checkout (compra aprovada ou em análise).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Atingir a Tela de Confirmação | O sistema informa um texto de agradecimento |
| 2  | Localizar o número do documento/pedido | O sistema fornece em destaque o `order_number` amigável gerado e instruções de como acompanhá-lo |

#### Resultados Esperados
- Entrega fundamental de referencial para consulta por parte do consumidor.

#### Critérios de Aceitação
- A tela deve renderizar no mínimo uma indicação clara de que o pedido deu certo e o respectivo número identificador `order_number`.

---

### CT11 - Consulta de Pedidos: Busca de pedido válida

#### Objetivo
Garantir o fluxo de "Acompanhe seu pedido" usando a chave identificadora correta respeitando normas de segurança.

#### Pré-Condições
- O cliente visualiza a interface de "Consultar Pedido".
- O pedido `123XYZ` existe na base de dados.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Preencher o input de número do pedido com `123XYZ` | O valor é fixado no campo de texto |
| 2  | Clicar em "Consultar" | O sistema realiza a busca nas bases back-end |
| 3  | Verificar o resultado na tela | O status atual (ex: Fabricação, Aprovado, Entregue) e dados sensíveis ou não-sensíveis do pedido são exibidos |

#### Resultados Esperados
- O cliente, munido do localizador apropriado, é capaz de verificar o rastreio da compra.

#### Critérios de Aceitação
- A API retorna dados exclusivamente para o `order_number` informado com match exato.

---

### CT12 - Consulta de Pedidos: Segurança contra buscas sem Order Number correto

#### Objetivo
Validar que não é possível ver pedidos de outros ou pesquisar livremente sem possuir o código exato (tratativa negativa / restrição sem autenticação pesada).

#### Pré-Condições
- O cliente está visualizando a tela de Consulta de Pedidos.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Inserir um `order_number` em formato correto porem não existente (ex: `999FFF`) | Input registrado |
| 2  | Clicar em "Consultar" | O sistema não encontra dados e alerta com "Pedido não encontrado" |
| 3  | Deixar o campo de pesquisa em branco e submeter | O sistema bloqueia a ação em front-end com um erro ("Número do pedido é obrigatório") |

#### Resultados Esperados
- Nenhuma invasão indireta através de campos mal validados para descobrir dados de outrem se não através da chave exata (`order_number`).

#### Critérios de Aceitação
- Pesquisas nulas não vão à API.
- Pedidos que não batem com a base retornam 404 (Not Found) amigável para o cliente.

---
