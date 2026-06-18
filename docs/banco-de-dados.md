# Banco de Dados — The Barber

## 1. Visão Geral

O sistema utiliza **MySQL** como banco de dados relacional, gerenciado pelo ORM **Sequelize**. As tabelas são criadas automaticamente pelo Sequelize via `conn.sync()` na inicialização da aplicação, com base nos Models definidos em `app/models/`.

- **Banco de dados:** `barbearia` (definido em `config/database.js`)
- **Variável de ambiente esperada:** `DB_NAME=barbearia_db` (definida em `.env`, porém não utilizada no código atual)
- **Dialect:** MySQL
- **Host:** localhost

> **Observação:** O Sequelize, por padrão, pluraliza os nomes dos models para nomear as tabelas. Assim, `cliente` → tabela `clientes`, `barbeiro` → `barbeiros`, `agendamento` → `agendamentos`. A exceção é `Servicos`, que define explicitamente `tableName: 'servicos'`.

---

## 2. Tabelas

### 2.1 Tabela: `clientes`

Armazena os dados dos clientes cadastrados na plataforma.

| Campo        | Tipo          | Restrições              | Descrição                                |
|--------------|---------------|-------------------------|------------------------------------------|
| `id`         | INTEGER       | PK, AUTO_INCREMENT      | Identificador único do cliente           |
| `nome`       | VARCHAR(255)  | NOT NULL (allownull: false) | Nome completo do cliente             |
| `telefone`   | VARCHAR(255)  | NOT NULL (allownull: false) | Número de celular (usado como login) |
| `senha`      | VARCHAR(255)  | —                       | Hash bcrypt da senha                     |
| `createdAt`  | DATETIME      | Gerenciado pelo Sequelize | Data/hora de criação                   |
| `updatedAt`  | DATETIME      | Gerenciado pelo Sequelize | Data/hora da última atualização        |

> **Nota técnica:** O campo `nome` e `telefone` utilizam `allownull` (com dois "l"), que **não é reconhecido pelo Sequelize**. O campo correto seria `allowNull`. Isso significa que, na prática, esses campos **aceitam valores nulos**, pois a validação não funciona conforme a intenção do código.

---

### 2.2 Tabela: `barbeiros`

Armazena os barbeiros disponíveis na barbearia.

| Campo        | Tipo          | Restrições              | Descrição                      |
|--------------|---------------|-------------------------|--------------------------------|
| `id`         | INTEGER       | PK, AUTO_INCREMENT      | Identificador único do barbeiro |
| `nome`       | VARCHAR(255)  | NOT NULL                | Nome do barbeiro               |
| `createdAt`  | DATETIME      | Gerenciado pelo Sequelize | Data/hora de criação         |
| `updatedAt`  | DATETIME      | Gerenciado pelo Sequelize | Data/hora de atualização     |

> **Observação:** O model `Barbeiro` não possui relacionamentos declarados no código (`/*colocar relacionamentos*/` é apenas um comentário). O campo `barbeiro_id` existe na tabela `agendamentos`, mas **não há FK declarada pelo Sequelize** entre `Agendamento` e `Barbeiro`.

---

### 2.3 Tabela: `servicos`

Armazena os serviços oferecidos pela barbearia.

| Campo        | Tipo           | Restrições              | Descrição                      |
|--------------|----------------|-------------------------|--------------------------------|
| `id`         | INTEGER        | PK, AUTO_INCREMENT      | Identificador único do serviço |
| `nome`       | VARCHAR(255)   | NOT NULL                | Nome do serviço                |
| `preco`      | DECIMAL        | NOT NULL                | Preço do serviço               |
| `createdAt`  | DATETIME       | Gerenciado pelo Sequelize | Data/hora de criação         |
| `updatedAt`  | DATETIME       | Gerenciado pelo Sequelize | Data/hora de atualização     |

---

### 2.4 Tabela: `agendamentos`

Armazena os agendamentos realizados pelos clientes.

| Campo        | Tipo          | Restrições              | Descrição                                         |
|--------------|---------------|-------------------------|---------------------------------------------------|
| `id`         | INTEGER       | PK, AUTO_INCREMENT      | Identificador único do agendamento                |
| `barbeiro_id`| INTEGER       | —                       | ID do barbeiro (sem FK formal declarada)          |
| `data`       | DATEONLY      | NOT NULL                | Data do agendamento (somente data, sem hora)      |
| `hora`       | TIME          | NOT NULL                | Horário do agendamento                            |
| `status`     | VARCHAR(255)  | NOT NULL                | Status do agendamento (ex: "pendente", "confirmado") |
| `clienteId`  | INTEGER       | FK → clientes.id        | Chave estrangeira gerada pela associação hasMany  |
| `createdAt`  | DATETIME      | Gerenciado pelo Sequelize | Data/hora de criação                            |
| `updatedAt`  | DATETIME      | Gerenciado pelo Sequelize | Data/hora de atualização                        |

---

### 2.5 Tabela Intermediária: `ServicoAgendamento`

Tabela criada automaticamente pelo Sequelize para a associação `belongsToMany` entre `Servicos` e `Agendamento`.

| Campo         | Tipo    | Restrições         | Descrição                       |
|---------------|---------|--------------------|---------------------------------|
| `createdAt`   | DATETIME| Gerenciado pelo Sequelize | Data/hora de criação      |
| `updatedAt`   | DATETIME| Gerenciado pelo Sequelize | Data/hora de atualização  |
| `servicoId`   | INTEGER | FK → servicos.id   | Referência ao serviço           |
| `agendamentoId`| INTEGER| FK → agendamentos.id | Referência ao agendamento    |

---

## 3. Relacionamentos

### 3.1 Associações Sequelize

```javascript
// Cliente → Agendamento (1:N)
Cliente.hasMany(Agendamento)
Agendamento.belongsTo(Cliente)

// Servicos ↔ Agendamento (N:N via ServicoAgendamento)
Servicos.belongsToMany(Agendamento, { through: 'ServicoAgendamento' })
Agendamento.belongsToMany(Servicos, { through: 'ServicoAgendamento' })
```

> **Relacionamento Ausente:** A entidade `Barbeiro` não possui associação formal declarada com `Agendamento`, apesar de existir o campo `barbeiro_id` na tabela. Isso representa uma inconsistência no modelo de dados.

---

## 4. Diagrama Textual de Entidades

```
┌─────────────┐         ┌───────────────────┐         ┌─────────────┐
│   clientes  │         │   agendamentos    │         │  barbeiros  │
│─────────────│         │───────────────────│         │─────────────│
│ id (PK)     │◄────────│ clienteId (FK)    │         │ id (PK)     │
│ nome        │  1 : N  │ id (PK)           │         │ nome        │
│ telefone    │         │ barbeiro_id       │- - - - -│ (sem FK)    │
│ senha       │         │ data              │         └─────────────┘
└─────────────┘         │ hora              │
                        │ status            │
                        └────────┬──────────┘
                                 │ N : N
                        ┌────────▼──────────────┐
                        │  ServicoAgendamento   │
                        │  (tabela intermediária)│
                        │ servicoId (FK)         │
                        │ agendamentoId (FK)     │
                        └────────┬──────────────┘
                                 │
                        ┌────────▼──────────┐
                        │     servicos      │
                        │───────────────────│
                        │ id (PK)           │
                        │ nome              │
                        │ preco             │
                        └───────────────────┘

Legenda:
  ◄──────  Relacionamento formal via Sequelize (FK gerada)
  - - - -  Campo presente, sem relacionamento formal declarado
```

---

## 5. Observações e Inconsistências Identificadas

| Item | Descrição |
|------|-----------|
| `allownull` vs `allowNull` | Nos campos `nome` e `telefone` do model `Cliente`, a propriedade foi escrita incorretamente como `allownull` (minúsculas). O Sequelize ignora esta propriedade, tornando os campos opcionalmente nulos. |
| Credenciais no código | O arquivo `config/database.js` possui usuário e senha do banco hardcoded (`root`, `root123`), ignorando as variáveis do `.env`. |
| `barbeiro_id` sem FK | O campo `barbeiro_id` em `Agendamento` não possui associação `belongsTo(Barbeiro)` declarada, quebrando a integridade referencial. |
| `config/env.js` sem uso | O arquivo existe mas não é importado nem utilizado em nenhuma parte do código. |
| Banco `barbearia` vs `barbearia_db` | O nome do banco no código é `barbearia`, enquanto o `.env` define `DB_NAME=barbearia_db`. |
