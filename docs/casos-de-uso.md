# Casos de Uso — The Barber

## UC-01 — Cadastrar Cliente

**Ator:** Visitante (usuário não autenticado)

**Objetivo:** Criar uma conta no sistema da barbearia para poder realizar agendamentos.

**Pré-condições:**
- O usuário não possui cadastro prévio com o mesmo número de telefone.
- O usuário acessa a URL `/cadastro`.

**Fluxo Principal:**
1. O sistema exibe o formulário de cadastro com campos: Nome, Telefone, Senha e Confirmar Senha.
2. O usuário preenche todos os campos e submete o formulário via `POST /cadastro`.
3. O sistema verifica se os campos `senha` e `confirma_senha` são iguais.
4. O sistema verifica se o número de telefone já está cadastrado no banco.
5. O sistema criptografa a senha com bcryptjs (salt factor 10).
6. O sistema cria o registro do cliente no banco de dados.
7. O sistema inicia uma sessão com o `userId` do cliente recém-criado.
8. O sistema exibe uma flash message "Cadastro realizado com sucesso".
9. O sistema redireciona o usuário para a página inicial `/`.

**Fluxos Alternativos:**

FA-01 — Senhas não conferem:
- No passo 3, se `senha !== confirma_senha`, o sistema exibe a mensagem "As senhas não conferem, tente novamente" e retorna ao formulário de cadastro.

FA-02 — Telefone já cadastrado:
- No passo 4, se o telefone já existir, o sistema exibe a mensagem "O telefone já está em uso" e retorna ao formulário.

**Pós-condições:**
- Um novo registro é criado na tabela `clientes`.
- Uma sessão ativa é criada para o usuário.
- O usuário é redirecionado para a tela inicial já autenticado.

---

## UC-02 — Autenticar Cliente (Login)

**Ator:** Visitante (usuário não autenticado)

**Objetivo:** Acessar o sistema com credenciais já cadastradas.

**Pré-condições:**
- O usuário possui cadastro prévio.
- O usuário acessa a URL `/login`.

**Fluxo Principal:**
1. O sistema exibe o formulário de login com campos: Telefone e Senha.
2. O usuário preenche os campos e submete o formulário via `POST /login`.
3. O sistema busca no banco um cliente com o telefone informado.
4. O sistema compara a senha informada com o hash armazenado (`bcrypt.compareSync`).
5. O sistema salva o `userId` na sessão.
6. O sistema exibe a flash message "Logado com sucesso".
7. O sistema redireciona o usuário para `/`.

**Fluxos Alternativos:**

FA-01 — Usuário não encontrado:
- No passo 3, se o telefone não corresponder a nenhum cliente, o sistema exibe "Usuario não encontrado!" e redireciona para `/login`.

FA-02 — Senha incorreta:
- No passo 4, se a comparação falhar, o sistema exibe "Senha incorreta! tente novamente" e redireciona para `/login`.

**Pós-condições:**
- Uma sessão ativa é criada com o `userId` do cliente.
- O usuário é redirecionado para a página inicial autenticado.

---

## UC-03 — Encerrar Sessão (Logout)

**Ator:** Cliente autenticado

**Objetivo:** Encerrar a sessão ativa do sistema.

**Pré-condições:**
- O usuário está autenticado e possui uma sessão ativa.
- O usuário acessa a URL `GET /logout`.

**Fluxo Principal:**
1. O sistema destrói completamente a sessão via `req.session.destroy()`.
2. O sistema redireciona o usuário para a tela de login `/login`.

**Fluxos Alternativos:**
- Nenhum fluxo alternativo identificado.

**Pós-condições:**
- A sessão do usuário é destruída.
- O arquivo de sessão é removido do sistema de arquivos.
- O usuário não está mais autenticado.

---

## UC-04 — Visualizar Serviços

**Ator:** Visitante ou Cliente autenticado

**Objetivo:** Consultar os serviços disponíveis na barbearia com seus respectivos preços.

**Pré-condições:**
- O usuário acessa a URL `GET /`.
- Existem serviços cadastrados na tabela `servicos`.

**Fluxo Principal:**
1. O sistema executa uma consulta `Servicos.findAll({raw: true})`.
2. O sistema renderiza a view `agendamento/servico.handlebars` com a lista de serviços.
3. O usuário visualiza nome e preço de cada serviço disponível.

**Fluxos Alternativos:**

FA-01 — Nenhum serviço cadastrado:
- A view renderiza a listagem vazia (sem serviços exibidos). Não há mensagem de "lista vazia" implementada.

FA-02 — Erro de banco:
- Se ocorrer erro na consulta, o sistema retorna status 500 com a mensagem "erro".

**Pós-condições:**
- Nenhuma alteração de dados ocorre.
- A view é exibida com os serviços disponíveis.

---

## UC-05 — Acessar Painel de Agendamentos

**Ator:** Cliente autenticado

**Objetivo:** Visualizar os agendamentos associados à conta do cliente logado.

**Pré-condições:**
- O usuário está autenticado (possui `userId` na sessão).
- O usuário envia um `POST /agendamento`.

**Fluxo Principal:**
1. O sistema obtém o `userId` da sessão ativa.
2. O sistema busca o cliente no banco usando `Cliente.findOne` com `include: Agendamento`.
3. O sistema extrai os `dataValues` de cada agendamento retornado.
4. O sistema verifica se o array de agendamentos está vazio.
5. O sistema renderiza a view `admin/agendamento.handlebars` com os dados.

**Fluxos Alternativos:**

FA-01 — Cliente não encontrado na sessão:
- No passo 2, se o cliente não for encontrado, o sistema redireciona para `/login`.

FA-02 — Nenhum agendamento:
- No passo 4, se o array estiver vazio, `emptyAgendamento = true` é passado à view.

> **⚠️ Implementação Parcial:** A view `admin/agendamento.handlebars` não renderiza os dados recebidos. O backend está funcional, mas a apresentação visual não está implementada.

**Pós-condições:**
- A view de agendamentos é renderizada (ainda sem exibição real dos dados na interface).

---

## UC-06 — Listar Agendamentos (Painel Administrativo)

**Ator:** Qualquer usuário (sem verificação de autenticação)

**Objetivo:** Acessar a página administrativa de agendamentos.

**Pré-condições:**
- O usuário acessa a URL `GET /agendamento`.

**Fluxo Principal:**
1. O sistema renderiza a view `admin/agendamentos.handlebars`.

> **⚠️ Implementação Parcial:** Esta rota não verifica autenticação e a view exibe apenas um `<h1>` de placeholder, sem dados reais.

**Pós-condições:**
- A view é renderizada sem verificação de sessão ou exibição de dados.

---

## UC-07 — Recuperar Senha (Interface Disponível, sem Backend)

**Ator:** Visitante

**Objetivo:** Recuperar acesso à conta através de verificação por número de celular.

**Pré-condições:**
- O usuário acessa a URL `/recuperar` (link disponível na tela de login).

**Fluxo Principal (previsto na interface):**
1. O usuário informa o número de celular.
2. O sistema deveria enviar um código de verificação.
3. O usuário insere o código recebido.
4. O usuário define uma nova senha.

> **❌ Funcionalidade não implementada:** A tela de recuperação existe com três etapas visuais (`recuperar.handlebars`), mas **não existe rota `POST /recuperar`** nem controller correspondente. Qualquer submissão do formulário resultará em erro 404.

**Pós-condições:**
- Nenhuma. O fluxo backend não existe.
