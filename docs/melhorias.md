# Melhorias Técnicas — The Barber

Este documento lista melhorias técnicas concretas para elevar o projeto ao nível de produção profissional, cobrindo segurança, qualidade de código, infraestrutura e experiência do desenvolvedor.

---

## 1. Variáveis de Ambiente com dotenv

**Problema atual:** As credenciais do banco de dados (`root`, `root123`, `barbearia`) estão hardcoded diretamente em `config/database.js`. O arquivo `.env` existe mas é ignorado.

**Melhoria:** Carregar o `dotenv` no `database.js` e utilizar as variáveis de ambiente para todas as configurações sensíveis, incluindo o segredo da sessão (`SESSION_SECRET`).

```javascript
import 'dotenv/config'
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  { host: process.env.DB_HOST, dialect: 'mysql' }
)
```

**Benefício:** Separação de configuração e código. Permite deploys em diferentes ambientes (dev, staging, produção) sem alterar o código. Evita exposição de credenciais em repositórios públicos.

---

## 2. Migrations com Sequelize CLI

**Problema atual:** As tabelas são criadas via `conn.sync()`. Em produção, `sync({ force: true })` destrói dados, e `sync()` simples não gerencia alterações de schema.

**Melhoria:** Adotar o sistema de migrations do Sequelize CLI para versionamento do schema do banco de dados.

**Benefício:** Permite evoluir o schema de forma controlada, rastreável e reversível. Cada migration representa uma alteração atômica no banco, mantendo histórico completo das mudanças.

---

## 3. Middleware de Autenticação

**Problema atual:** A verificação de autenticação ocorre pontualmente dentro de `agendamentoController.dashboard`. A rota `GET /agendamento` não possui nenhuma proteção.

**Melhoria:** Criar um middleware reutilizável `checkAuth`:

```javascript
// app/middlewares/checkAuth.js
export function checkAuth(req, res, next) {
  if (!req.session.userId) {
    req.flash('message', 'Faça login para continuar')
    return res.redirect('/login')
  }
  next()
}
```

Aplicar nas rotas protegidas:
```javascript
router.get('/agendamento', checkAuth, agendamentoController.showAgendamentos)
```

**Benefício:** Centraliza a lógica de autorização, elimina repetição de código e garante que todas as rotas privadas estejam protegidas de forma consistente.

---

## 4. Validação de Dados no Backend

**Problema atual:** Não há validação dos dados de entrada além da verificação de igualdade entre senha e confirmação. Campos obrigatórios, formato de telefone e tamanho mínimo de senha não são validados.

**Melhoria:** Utilizar `express-validator` para validar e sanitizar dados antes de processá-los nos controllers.

```javascript
import { body, validationResult } from 'express-validator'

const validateRegister = [
  body('nome').notEmpty().trim().withMessage('Nome é obrigatório'),
  body('telefone').isMobilePhone('pt-BR').withMessage('Telefone inválido'),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter ao menos 6 caracteres'),
]
```

**Benefício:** Previne dados inválidos no banco, melhora a segurança e a experiência do usuário com mensagens de erro específicas.

---

## 5. Tratamento Global de Erros

**Problema atual:** O bloco `catch` em `registerPost` apenas faz `console.log(err)` sem enviar resposta HTTP, causando timeout no navegador em caso de erro.

**Melhoria:** Implementar um middleware global de tratamento de erros no Express:

```javascript
// No server.js (após as rotas)
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render('error', { message: 'Ocorreu um erro interno. Tente novamente.' })
})
```

**Benefício:** Garante que todos os erros não tratados recebam uma resposta HTTP adequada, evitando timeouts e expondo informações sensíveis no cliente.

---

## 6. Sistema de Logs Estruturados

**Melhoria:** Substituir os `console.log()` espalhados pelo código por um sistema de logging estruturado com **Winston** ou **Pino**.

```javascript
import winston from 'winston'
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: 'app.log' })]
})
```

**Benefício:** Logs estruturados (JSON) facilitam busca, filtragem e monitoramento em produção. Permite diferentes níveis (info, warn, error) e destinos (arquivo, console, serviços externos como Datadog ou Logtail).

---

## 7. Testes Automatizados

**Melhoria:** Implementar uma suíte de testes com **Jest** e **Supertest**:

- **Testes unitários:** lógica dos controllers (mock do banco)
- **Testes de integração:** requisições HTTP às rotas com banco de teste
- **Testes de validação:** cenários de erro (senha incorreta, telefone duplicado, etc.)

```javascript
// Exemplo com Supertest
describe('POST /login', () => {
  it('deve retornar redirect ao login com telefone inválido', async () => {
    const res = await request(app).post('/login').send({ telefone: '000', senha: 'abc' })
    expect(res.status).toBe(302)
    expect(res.headers.location).toBe('/login')
  })
})
```

**Benefício:** Previne regressões, documenta o comportamento esperado do sistema e aumenta a confiança em deploys.

---

## 8. Rate Limiting

**Melhoria:** Aplicar limitação de requisições nas rotas de autenticação com `express-rate-limit`:

```javascript
import rateLimit from 'express-rate-limit'
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 tentativas
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
})
router.post('/login', loginLimiter, authController.loginPost)
```

**Benefício:** Proteção contra ataques de força bruta em `/login` e `/cadastro`. Reduz o risco de comprometimento de contas.

---

## 9. Helmet.js para Segurança HTTP

**Melhoria:** Adicionar o middleware **Helmet** para configurar headers HTTP de segurança:

```javascript
import helmet from 'helmet'
app.use(helmet())
```

**Benefício:** Configura automaticamente headers como `Content-Security-Policy`, `X-Frame-Options`, `X-XSS-Protection` e outros, protegendo contra XSS, clickjacking e sniffing de MIME type.

---

## 10. Docker e docker-compose

**Melhoria:** Containerizar a aplicação com Docker e criar um `docker-compose.yml` para orquestrar app + banco:

```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    depends_on: [db]
    environment:
      - DB_HOST=db
  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: barbearia_db
```

**Benefício:** Garante paridade entre ambientes (dev, staging, produção). Elimina o "funciona na minha máquina". Facilita o onboarding de novos desenvolvedores.

---

## 11. CI/CD com GitHub Actions

**Melhoria:** Criar um pipeline de integração e entrega contínua:

```yaml
# .github/workflows/ci.yml
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm test
      - run: npm run lint
```

**Benefício:** Executa testes e lint automaticamente a cada push. Bloqueia merges com falhas. Permite deploy automático em ambientes de staging/produção.

---

## 12. Upload de Imagens

**Melhoria:** Implementar upload de foto de perfil para clientes e barbeiros com **Multer**:

```javascript
import multer from 'multer'
const upload = multer({ dest: 'public/uploads/' })
router.post('/perfil', upload.single('foto'), controller.updatePerfil)
```

**Benefício:** Enriquece a experiência visual do sistema. Permite identificação visual dos barbeiros na tela de agendamento.

---

## 13. Paginação nas Listagens

**Melhoria:** Adicionar paginação nas consultas de agendamentos e serviços com `limit` e `offset` do Sequelize:

```javascript
const agendamentos = await Agendamento.findAll({
  where: { clienteId: userId },
  limit: 10,
  offset: (page - 1) * 10,
  order: [['data', 'DESC']]
})
```

**Benefício:** Evita carregamento excessivo de dados em consultas com muitos registros. Melhora performance e experiência do usuário.

---

## 14. Segredo de Sessão Forte

**Problema atual:** O segredo da sessão está hardcoded como `"nosso_secret"` em `server.js`.

**Melhoria:** Usar uma string longa e aleatória gerada por `crypto.randomBytes(64).toString('hex')` e carregá-la via variável de ambiente `SESSION_SECRET`.

**Benefício:** Impede que um atacante forje ou decodifique cookies de sessão mesmo que tenha acesso ao código-fonte.

---

## Resumo Priorizado

| Prioridade | Melhoria | Impacto |
|---|---|---|
| 🔴 Alta | Variáveis de ambiente (dotenv) | Segurança |
| 🔴 Alta | Middleware de autenticação | Segurança |
| 🔴 Alta | Tratamento global de erros | Estabilidade |
| 🔴 Alta | Segredo de sessão forte | Segurança |
| 🟡 Média | Validação de dados | Qualidade |
| 🟡 Média | Rate limiting | Segurança |
| 🟡 Média | Helmet.js | Segurança |
| 🟡 Média | Migrations | Manutenibilidade |
| 🟢 Baixa | Testes automatizados | Qualidade |
| 🟢 Baixa | Logs estruturados | Observabilidade |
| 🟢 Baixa | Docker + CI/CD | Infraestrutura |
| 🟢 Baixa | Upload de imagens | Funcionalidade |
| 🟢 Baixa | Paginação | Performance |
