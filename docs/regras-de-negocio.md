# Regras de Negócio — The Barber

## 1. Cadastro de Cliente

### RN-01 — Confirmação de Senha
**Localização:** `authController.js` → `registerPost`

O sistema exige que os campos `senha` e `confirma_senha` sejam idênticos para que o cadastro seja concluído. Caso os valores sejam diferentes, o sistema exibe uma flash message de erro e retorna à tela de cadastro sem criar o registro no banco.

```
SE senha != confirma_senha → exibe "As senhas não conferem, tente novamente"
```

### RN-02 — Telefone Único por Cliente
**Localização:** `authController.js` → `registerPost`

O número de telefone é utilizado como identificador único do cliente no sistema. Antes de criar um novo registro, o sistema verifica se já existe um cliente com aquele número. Caso exista, o cadastro é bloqueado.

```
SE Cliente.findOne({where: {telefone}}) retorna resultado → exibe "O telefone já está em uso"
```

### RN-03 — Criptografia Obrigatória da Senha
**Localização:** `authController.js` → `registerPost`

Toda senha é criptografada com **bcryptjs** antes de ser persistida no banco de dados. O sistema utiliza um salt de fator 10 (`bcrypt.genSaltSync(10)`). A senha em texto puro **nunca é armazenada**.

```
salt = bcrypt.genSaltSync(10)
hashedSenha = bcrypt.hashSync(senha, salt)
```

### RN-04 — Login Automático Após Cadastro
**Localização:** `authController.js` → `registerPost`

Após o cadastro bem-sucedido, o sistema automaticamente inicia uma sessão para o cliente recém-criado, gravando o `userId` na sessão. O cliente não precisa fazer login manualmente após se cadastrar.

---

## 2. Autenticação (Login)

### RN-05 — Identificação por Telefone
**Localização:** `authController.js` → `loginPost`

O login é feito utilizando o número de telefone como identificador principal, não e-mail. O sistema busca o cliente pelo campo `telefone` na tabela `clientes`.

### RN-06 — Validação de Usuário Inexistente
**Localização:** `authController.js` → `loginPost`

Caso não exista nenhum cliente com o telefone informado, o sistema exibe uma flash message e redireciona de volta à tela de login.

```
SE Cliente.findOne({where: {telefone}}) retorna null → exibe "Usuario não encontrado!"
```

### RN-07 — Validação de Senha Incorreta
**Localização:** `authController.js` → `loginPost`

A senha informada é comparada com o hash armazenado usando `bcrypt.compareSync`. Se a comparação falhar, o sistema exibe uma flash message e redireciona ao login.

```
SE bcrypt.compareSync(senha, user.senha) === false → exibe "Senha incorreta! tente novamente"
```

---

## 3. Sessão

### RN-08 — Persistência de Sessão por Arquivo
**Localização:** `server.js`

As sessões são persistidas em arquivos no sistema operacional usando `session-file-store`. Isso garante que as sessões sobrevivam a reinicializações do servidor durante o desenvolvimento.

### RN-09 — Duração da Sessão
**Localização:** `server.js`

O cookie de sessão possui tempo de expiração de **360.000 milissegundos** (6 minutos). O parâmetro `httpOnly: true` impede o acesso ao cookie via JavaScript client-side. O parâmetro `secure: false` indica que HTTPS não é obrigatório (adequado apenas para ambiente de desenvolvimento).

### RN-10 — Propagação da Sessão para as Views
**Localização:** `server.js` (middleware)

Um middleware global verifica se `req.session.userId` está presente e, em caso afirmativo, disponibiliza o objeto `session` para todas as views via `res.locals.session`. Isso permite que o layout principal controle a exibição do menu de navegação conforme o estado de autenticação do usuário.

```
SE req.session.userId → res.locals.session = req.session
```

### RN-11 — Logout destrói a sessão
**Localização:** `authController.js` → `logout`

O logout é realizado através da destruição completa da sessão com `req.session.destroy()`, seguida de redirecionamento para `/login`.

---

## 4. Controle de Acesso

### RN-12 — Verificação de Autenticação no Dashboard
**Localização:** `agendamentoController.js` → `dashboard`

Ao acessar o painel de agendamentos, o sistema verifica se o cliente associado ao `userId` da sessão existe no banco. Se não existir (sessão inválida ou expirada), o usuário é redirecionado para `/login`.

```
SE cliente não encontrado → redirect('/login')
```

> **⚠️ Limitação Identificada:** Não existe um middleware de autenticação global aplicado às rotas protegidas. A verificação de autenticação ocorre pontualmente dentro do controller de agendamentos, mas rotas como `GET /agendamento` (`showAgendamentos`) não verificam se o usuário está logado, sendo acessível sem autenticação.

---

## 5. Agendamentos

### RN-13 — Listagem de Agendamentos do Cliente Logado
**Localização:** `agendamentoController.js` → `dashboard`

O sistema busca agendamentos filtrando pelo `userId` da sessão ativa. Utiliza o mecanismo de `include` do Sequelize para carregar os agendamentos relacionados ao cliente em uma única consulta.

### RN-14 — Indicação de Ausência de Agendamentos
**Localização:** `agendamentoController.js` → `dashboard`

Se o array de agendamentos retornado estiver vazio, o sistema define a variável `emptyAgendamento = true`, que pode ser usada na view para exibir uma mensagem adequada ao usuário.

> **⚠️ Implementação Parcial:** A view `admin/agendamento.handlebars` está praticamente vazia (`<h1>aqui vai ficar os agendamentos do usuario</h1>`). A lógica de renderização dos dados no lado da view ainda não está implementada.

---

## 6. Serviços

### RN-15 — Listagem Pública de Serviços
**Localização:** `homeRoutes.js` → `GET /`

A rota principal `/` exibe todos os serviços cadastrados no banco de forma pública, sem necessidade de autenticação. Utiliza `Servicos.findAll({raw: true})` para buscar todos os registros.

---

## 7. Recuperação de Senha

### RN-16 — Interface de Recuperação sem Backend
**Localização:** `app/views/auth/recuperar.handlebars`

Existe uma tela de recuperação de senha com três etapas visuais (inserção do telefone, código de verificação e nova senha), porém **nenhum controller ou rota foi implementado** para suportar este fluxo. O formulário aponta para `POST /recuperar`, mas não há rota correspondente definida.

> **⚠️ Funcionalidade não implementada:** Recuperação de senha é apenas uma view sem funcionalidade de backend.

---

## 8. Resumo de Status das Regras

| Código | Regra                               | Status              |
|--------|-------------------------------------|---------------------|
| RN-01  | Confirmação de senha no cadastro    | ✅ Implementado     |
| RN-02  | Telefone único                      | ✅ Implementado     |
| RN-03  | Criptografia de senha               | ✅ Implementado     |
| RN-04  | Login automático após cadastro      | ✅ Implementado     |
| RN-05  | Login por telefone                  | ✅ Implementado     |
| RN-06  | Usuário não encontrado              | ✅ Implementado     |
| RN-07  | Senha incorreta                     | ✅ Implementado     |
| RN-08  | Sessão persistida em arquivo        | ✅ Implementado     |
| RN-09  | Expiração do cookie                 | ✅ Implementado     |
| RN-10  | Sessão disponível nas views         | ✅ Implementado     |
| RN-11  | Logout destrói sessão               | ✅ Implementado     |
| RN-12  | Verificação de auth no dashboard    | ✅ Parcialmente     |
| RN-13  | Listagem de agendamentos do usuário | ✅ Parcialmente     |
| RN-14  | Indicação de lista vazia            | ✅ Implementado     |
| RN-15  | Listagem pública de serviços        | ✅ Implementado     |
| RN-16  | Recuperação de senha                | ❌ Não implementado |
