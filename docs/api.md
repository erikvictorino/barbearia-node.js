# Documentação de Rotas (API) — The Barber

## Visão Geral

O sistema utiliza rotas tradicionais de uma aplicação web server-rendered (não uma API REST pura). As respostas são renderizações de views Handlebars ou redirecionamentos HTTP. Os dados são transmitidos via `application/x-www-form-urlencoded` (formulários HTML).

**Base URL:** `http://localhost:3000`

---

## Módulo: Autenticação (`authRoutes.js`)

---

### GET /login

| Propriedade | Valor |
|---|---|
| **Método** | GET |
| **URL** | `/login` |
| **Controller** | `authController.login` |
| **Autenticação** | Não requerida |
| **Finalidade** | Renderiza a tela de login |

**Resposta esperada:**
- Status `200` — Renderiza a view `auth/login.handlebars`

---

### POST /login

| Propriedade | Valor |
|---|---|
| **Método** | POST |
| **URL** | `/login` |
| **Controller** | `authController.loginPost` |
| **Autenticação** | Não requerida |
| **Finalidade** | Processa as credenciais de login e inicia sessão |

**Corpo esperado (form-urlencoded):**
```
telefone=11999999999
senha=minhasenha123
```

**Respostas esperadas:**

| Condição | Status | Comportamento |
|---|---|---|
| Login bem-sucedido | 302 | Redireciona para `/` com flash "Logado com sucesso" |
| Telefone não encontrado | 302 | Redireciona para `/login` com flash "Usuario não encontrado!" |
| Senha incorreta | 302 | Redireciona para `/login` com flash "Senha incorreta! tente novamente" |

---

### GET /cadastro

| Propriedade | Valor |
|---|---|
| **Método** | GET |
| **URL** | `/cadastro` |
| **Controller** | `authController.register` |
| **Autenticação** | Não requerida |
| **Finalidade** | Renderiza o formulário de cadastro |

**Resposta esperada:**
- Status `200` — Renderiza a view `auth/register.handlebars`

---

### POST /cadastro

| Propriedade | Valor |
|---|---|
| **Método** | POST |
| **URL** | `/cadastro` |
| **Controller** | `authController.registerPost` |
| **Autenticação** | Não requerida |
| **Finalidade** | Cria um novo cliente e inicia sessão automática |

**Corpo esperado (form-urlencoded):**
```
nome=João Silva
telefone=11999999999
senha=minhasenha123
confirma_senha=minhasenha123
```

**Respostas esperadas:**

| Condição | Status | Comportamento |
|---|---|---|
| Cadastro bem-sucedido | 302 | Redireciona para `/` com flash "Cadastro realizado com sucesso" |
| Senhas diferentes | 200 | Renderiza `auth/register` com flash "As senhas não conferem, tente novamente" |
| Telefone já em uso | 200 | Renderiza `auth/register` com flash "O telefone já está em uso" |
| Erro no banco | — | `console.log(err)` — sem resposta HTTP ao usuário (bug) |

> **⚠️ Bug identificado:** O bloco `catch` no `registerPost` apenas loga o erro no console e não envia nenhuma resposta HTTP, o que pode causar timeout no navegador em caso de falha no banco de dados.

---

### GET /logout

| Propriedade | Valor |
|---|---|
| **Método** | GET |
| **URL** | `/logout` |
| **Controller** | `authController.logout` |
| **Autenticação** | Requerida (implícita) |
| **Finalidade** | Destrói a sessão do usuário e redireciona ao login |

**Resposta esperada:**
- Status `302` — Redireciona para `/login`

---

## Módulo: Home e Agendamentos (`homeRoutes.js`)

---

### GET /

| Propriedade | Valor |
|---|---|
| **Método** | GET |
| **URL** | `/` |
| **Controller** | Handler inline em `homeRoutes.js` |
| **Autenticação** | Não requerida |
| **Finalidade** | Exibe a listagem de serviços disponíveis |

**Resposta esperada:**

| Condição | Status | Comportamento |
|---|---|---|
| Sucesso | 200 | Renderiza `agendamento/servico.handlebars` com a lista de serviços |
| Erro no banco | 500 | Retorna texto `'erro'` |

**Dados enviados à view:**
```json
{
  "servicos": [
    { "id": 1, "nome": "Corte Simples", "preco": "25.00" },
    { "id": 2, "nome": "Barba", "preco": "20.00" }
  ]
}
```

---

### GET /agendamento

| Propriedade | Valor |
|---|---|
| **Método** | GET |
| **URL** | `/agendamento` |
| **Controller** | `agendamentoController.showAgendamentos` |
| **Autenticação** | Não verificada (ausência de middleware) |
| **Finalidade** | Renderiza a tela administrativa de agendamentos |

**Resposta esperada:**
- Status `200` — Renderiza `admin/agendamentos.handlebars`

> **⚠️ Implementação Parcial:** A view contém apenas um `<h1>` de placeholder. Não há dados reais exibidos e não há verificação de autenticação.

---

### POST /agendamento

| Propriedade | Valor |
|---|---|
| **Método** | POST |
| **URL** | `/agendamento` |
| **Controller** | `agendamentoController.dashboard` |
| **Autenticação** | Verificada internamente no controller |
| **Finalidade** | Carrega os agendamentos do cliente logado |

**Corpo esperado:** Nenhum dado de corpo necessário (utiliza `req.session.userId`)

**Respostas esperadas:**

| Condição | Status | Comportamento |
|---|---|---|
| Cliente encontrado | 200 | Renderiza `admin/agendamento.handlebars` com dados |
| Cliente não encontrado | 302 | Redireciona para `/login` |

**Dados enviados à view:**
```json
{
  "agendamento": [
    {
      "id": 1,
      "barbeiro_id": 2,
      "data": "2024-03-15",
      "hora": "10:00:00",
      "status": "pendente",
      "clienteId": 1,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "emptyAgendamento": false
}
```

> **⚠️ Implementação Parcial:** A view `admin/agendamento.handlebars` não renderiza os dados recebidos do controller.

---

## Rota Presente na Interface sem Backend

### POST /recuperar

| Propriedade | Valor |
|---|---|
| **Método** | POST |
| **URL** | `/recuperar` |
| **Controller** | Não implementado |
| **Status** | ❌ Rota não existe |

**Observação:** O formulário na view `auth/recuperar.handlebars` aponta para `POST /recuperar`, mas nenhuma rota ou controller foi definido. A requisição resultará em erro **404 Not Found**.

---

## Resumo das Rotas

| Método | URL         | Controller                        | Autenticação | Status              |
|--------|-------------|-----------------------------------|--------------|---------------------|
| GET    | /login      | authController.login              | Não          | ✅ Implementado     |
| POST   | /login      | authController.loginPost          | Não          | ✅ Implementado     |
| GET    | /cadastro   | authController.register           | Não          | ✅ Implementado     |
| POST   | /cadastro   | authController.registerPost       | Não          | ✅ Implementado     |
| GET    | /logout     | authController.logout             | Não (implícita) | ✅ Implementado  |
| GET    | /           | homeRoutes (inline)               | Não          | ✅ Implementado     |
| GET    | /agendamento| agendamentoController.showAgendamentos | Não     | ⚠️ Parcial         |
| POST   | /agendamento| agendamentoController.dashboard   | Sim (interna) | ⚠️ Parcial         |
| POST   | /recuperar  | —                                 | Não          | ❌ Não implementado |
