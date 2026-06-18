# Arquitetura do Sistema — The Barber

## 1. Objetivo do Sistema

O **The Barber** é uma aplicação web para gerenciamento de uma barbearia. Seu objetivo é permitir que clientes realizem cadastro, autenticação e visualização de serviços disponíveis, além de possibilitar o agendamento de horários com barbeiros. O sistema atualmente cobre o módulo de autenticação e a estrutura inicial do módulo de agendamentos.

---

## 2. Arquitetura Utilizada

O projeto adota o padrão **MVC (Model-View-Controller)**, organizado dentro da pasta `app/`. Esse padrão separa claramente as responsabilidades de dados (Models), lógica de negócio (Controllers) e apresentação (Views), facilitando manutenção e evolução do sistema.

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                     │
│              Faz requisições HTTP (GET / POST)               │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                     SERVER.JS (Entry Point)                  │
│  - Express configurado                                       │
│  - Template Engine (Handlebars)                              │
│  - Session Middleware (express-session + session-file-store) │
│  - Flash Messages (express-flash)                            │
│  - Conexão com banco (Sequelize sync)                        │
└────────────────┬──────────────────────────┬──────────────────┘
                 │                          │
        ┌────────▼─────────┐     ┌──────────▼──────────┐
        │   authRoutes.js  │     │   homeRoutes.js      │
        │ /login /cadastro │     │ / /agendamento       │
        │ /logout          │     │                      │
        └────────┬─────────┘     └──────────┬───────────┘
                 │                          │
        ┌────────▼─────────┐     ┌──────────▼──────────┐
        │  authController  │     │ agendamentoController│
        │  (login, regist.)│     │ (dashboard, show)    │
        └────────┬─────────┘     └──────────┬───────────┘
                 │                          │
        ┌────────▼──────────────────────────▼──────────┐
        │                   MODELS                     │
        │  Cliente  │  Barbeiro  │  Servicos  │ Agend. │
        └────────────────────────┬─────────────────────┘
                                 │
                        ┌────────▼────────┐
                        │   MySQL (DB)    │
                        │  barbearia_db   │
                        └─────────────────┘
```

---

## 3. Fluxo Completo da Aplicação

### Fluxo de Cadastro
```
Browser → POST /cadastro → authController.registerPost
  → valida confirmação de senha
  → verifica se telefone já existe (Cliente.findOne)
  → criptografa senha (bcryptjs)
  → cria cliente no banco (Cliente.create)
  → salva userId na sessão
  → redireciona para /
```

### Fluxo de Login
```
Browser → POST /login → authController.loginPost
  → busca cliente por telefone (Cliente.findOne)
  → compara senha com hash (bcrypt.compareSync)
  → salva userId na sessão
  → redireciona para /
```

### Fluxo de Visualização de Serviços
```
Browser → GET / → homeRoutes (inline handler)
  → busca todos os serviços (Servicos.findAll)
  → renderiza agendamento/servico.handlebars
```

### Fluxo de Agendamentos
```
Browser → GET /agendamento → agendamentoController.showAgendamentos
  → renderiza admin/agendamentos.handlebars (view parcialmente implementada)

Browser → POST /agendamento → agendamentoController.dashboard
  → busca cliente com agendamentos incluídos (Cliente.findOne + include: Agendamento)
  → renderiza admin/agendamento.handlebars
```

---

## 4. Organização das Pastas

```
projeto-barbearia/
│
├── server.js                    # Ponto de entrada da aplicação
├── package.json                 # Dependências e scripts do projeto
├── .env                         # Variáveis de ambiente (DB, porta, sessão)
│
├── config/
│   ├── database.js              # Configuração e conexão com o MySQL via Sequelize
│   └── env.js                   # (Arquivo presente, mas sem uso implementado no código)
│
├── app/
│   ├── controllers/
│   │   ├── authController.js    # Lógica de login, cadastro e logout
│   │   └── agendamentoController.js  # Lógica de dashboard e listagem de agendamentos
│   │
│   ├── models/
│   │   ├── Cliente.js           # Model do cliente (tabela: clientes)
│   │   ├── Barbeiro.js          # Model do barbeiro (tabela: barbeiros)
│   │   ├── Servicos.js          # Model de serviços (tabela: servicos)
│   │   └── Agendamento.js       # Model de agendamento + associações
│   │
│   ├── routes/
│   │   ├── authRoutes.js        # Rotas de autenticação
│   │   └── homeRoutes.js        # Rotas da home e agendamento
│   │
│   └── views/
│       ├── layouts/
│       │   └── main.handlebars  # Layout principal (header, nav, footer)
│       ├── auth/
│       │   ├── login.handlebars
│       │   ├── register.handlebars
│       │   └── recuperar.handlebars  # Tela de recuperação (sem backend)
│       ├── agendamento/
│       │   ├── servico.handlebars    # Lista de serviços
│       │   └── agendamento.handlebars # Formulário de agendamento (incompleto)
│       └── admin/
│           └── agendamentos.handlebars # Listagem de agendamentos (incompleto)
│
└── node_modules/                # Dependências instaladas
```

---

## 5. Tecnologias Utilizadas

| Tecnologia          | Versão       | Função                                            |
|---------------------|--------------|---------------------------------------------------|
| Node.js             | LTS          | Runtime JavaScript server-side                    |
| Express.js          | ^5.2.1       | Framework HTTP para rotas e middlewares            |
| Sequelize           | ^6.37.7      | ORM para mapeamento objeto-relacional              |
| MySQL2              | ^3.18.2      | Driver de conexão com o banco MySQL                |
| Express-Handlebars  | ^9.0.1       | Template engine para renderização de views         |
| express-session     | ^1.19.0      | Gerenciamento de sessões HTTP                      |
| session-file-store  | ^1.5.0       | Persistência de sessões em arquivos                |
| bcryptjs            | ^3.0.3       | Criptografia e hash de senhas                      |
| express-flash       | ^0.0.2       | Mensagens flash temporárias na sessão              |
| dotenv              | ^17.3.1      | Carregamento de variáveis de ambiente              |
| nodemon             | ^3.1.14      | Reinício automático do servidor em desenvolvimento |

> **Nota:** O arquivo `config/env.js` está presente no projeto, mas as variáveis do `.env` **não são carregadas via dotenv** no código atual. A configuração do banco (`database.js`) usa credenciais hardcoded.

---

## 6. Papel de Cada Camada

### Routes (`app/routes/`)
Responsáveis por mapear as URLs (endpoints) às funções dos controllers. Não contêm lógica de negócio. Apenas definem o método HTTP, o caminho e delgam ao controller correspondente.

### Controllers (`app/controllers/`)
Contêm a **lógica de negócio** da aplicação. Recebem a requisição (`req`), executam operações (consultas ao banco, validações, criptografia), e enviam a resposta (`res`) — seja um redirecionamento, uma renderização de view ou um status HTTP.

### Models (`app/models/`)
Definem a estrutura das tabelas no banco de dados usando Sequelize. Cada arquivo representa uma entidade e seus respectivos campos, tipos e relacionamentos. São a interface com o MySQL.

### Views (`app/views/`)
Templates Handlebars que geram o HTML enviado ao navegador. Recebem dados dos controllers via `res.render()` e exibem conteúdo dinâmico. O layout principal (`main.handlebars`) define a estrutura comum de todas as páginas.

### Banco de Dados (MySQL via Sequelize)
Camada de persistência. O Sequelize cria e gerencia as tabelas automaticamente via `conn.sync()` na inicialização do servidor. Nenhuma migration manual é necessária no estado atual do projeto.
