# Decisões Técnicas — The Barber

## 1. Node.js como Runtime

**Decisão:** Utilizar Node.js como ambiente de execução server-side.

**Justificativa técnica:**
Node.js executa JavaScript no servidor, unificando a linguagem entre frontend e backend. Seu modelo de I/O assíncrono e não-bloqueante é ideal para aplicações web com múltiplas requisições concorrentes, como um sistema de agendamentos. A vasta ecosistema de pacotes via npm reduz significativamente o tempo de desenvolvimento. O projeto utiliza **ES Modules** (`"type": "module"` no `package.json`), adotando a sintaxe moderna de `import/export`.

---

## 2. Express.js como Framework HTTP

**Decisão:** Utilizar Express.js (versão 5.x) como framework principal da aplicação.

**Justificativa técnica:**
Express é o framework Node.js mais adotado na indústria. Sua filosofia minimalista oferece total controle sobre a arquitetura da aplicação, sem impor convenções rígidas. A versão 5 (utilizada neste projeto via `^5.2.1`) introduz tratamento de erros assíncronos nativo, eliminando a necessidade de wrappers manuais para rotas `async/await`. O sistema de middlewares do Express é direto e componível, facilitando a adição de funcionalidades como sessões, flash messages e parsing de formulários.

---

## 3. Sequelize como ORM

**Decisão:** Utilizar Sequelize (versão 6.x) para mapeamento objeto-relacional.

**Justificativa técnica:**
O Sequelize abstrai as queries SQL, permitindo que os models sejam definidos em JavaScript puro sem escrita manual de DDL. Funcionalidades como `sync()`, associações (`hasMany`, `belongsTo`, `belongsToMany`) e `findOne` com `include` simplificam operações complexas de banco com código legível. A capacidade de criar as tabelas automaticamente via `conn.sync()` agiliza o desenvolvimento inicial, sem necessidade de executar scripts SQL manualmente.

O tradeoff é que o Sequelize gera queries SQL que podem não ser otimizadas para cenários de alta performance — aceitável no estágio atual do projeto.

---

## 4. MySQL como Banco de Dados

**Decisão:** Utilizar MySQL como banco de dados relacional.

**Justificativa técnica:**
MySQL é um banco de dados relacional maduro, com suporte amplo, excelente desempenho para aplicações de médio porte e integração nativa com o Sequelize via driver `mysql2`. A escolha de um banco relacional justifica-se pelo modelo de dados do sistema, que possui entidades bem definidas e relacionamentos explícitos (clientes, barbeiros, serviços, agendamentos). O `mysql2` é o driver recomendado pelo Sequelize por suportar Promises nativamente e prepared statements.

---

## 5. bcryptjs para Criptografia de Senhas

**Decisão:** Utilizar a biblioteca `bcryptjs` para hash e verificação de senhas.

**Justificativa técnica:**
bcryptjs implementa o algoritmo **bcrypt**, especificamente projetado para senhas. Diferente de algoritmos de hash genéricos (MD5, SHA), o bcrypt possui custo computacional ajustável (salt factor), tornando ataques de força bruta progressivamente mais caros. O projeto usa salt factor 10 (`bcrypt.genSaltSync(10)`), que é o valor padrão recomendado — equilibrando segurança e performance.

A versão `bcryptjs` (puro JavaScript) foi escolhida sobre `bcrypt` (binários nativos em C++) por ser mais portável e não requerer compilação nativa, facilitando o setup em diferentes ambientes.

---

## 6. express-session + session-file-store

**Decisão:** Utilizar `express-session` com `session-file-store` para gerenciamento de sessões.

**Justificativa técnica:**
`express-session` é a solução padrão para sessões em aplicações Express. Em vez do store padrão em memória (que é perdido ao reiniciar o servidor), o projeto utiliza `session-file-store` para persistir sessões em arquivos no diretório temporário do sistema operacional. Isso garante que o usuário permaneça autenticado mesmo após o reinício do servidor durante o desenvolvimento.

O cookie de sessão é configurado com `httpOnly: true` (proteção contra XSS via JavaScript) e `secure: false` (adequado apenas para desenvolvimento local, sem HTTPS).

---

## 7. Express-Handlebars como Template Engine

**Decisão:** Utilizar `express-handlebars` para renderização de views server-side.

**Justificativa técnica:**
Handlebars é uma template engine com sintaxe simples e lógica mínima nas views (sem código JavaScript arbitrário), o que força a separação de responsabilidades entre controller e view. O sistema de layouts (`main.handlebars`) e partials simplifica a reutilização de estruturas HTML comuns. A integração com Express via `express-handlebars` é direta e bem documentada.

---

## 8. Padrão MVC

**Decisão:** Adotar o padrão arquitetural MVC (Model-View-Controller).

**Justificativa técnica:**
O MVC organiza o código em três camadas com responsabilidades distintas e bem definidas:

- **Model:** isolamento da lógica de dados e acesso ao banco
- **View:** separação total da apresentação visual
- **Controller:** concentração das regras de negócio e orquestração do fluxo

Essa separação reduz o acoplamento entre camadas, facilita manutenção, permite testar controllers independentemente das views e prepara o código para crescimento futuro. É o padrão mais reconhecido no mercado, tornando o projeto facilmente compreensível por outros desenvolvedores.

---

## 9. ES Modules (ESM)

**Decisão:** Utilizar ECMAScript Modules (`import/export`) em vez de CommonJS (`require`).

**Justificativa técnica:**
O projeto define `"type": "module"` no `package.json`, adotando a sintaxe moderna de módulos JavaScript. ESM é o padrão atual do JavaScript, suportado nativamente pelo Node.js desde a versão 12.x. Essa escolha demonstra alinhamento com boas práticas modernas, embora exija atenção com compatibilidade de bibliotecas que ainda usam CommonJS.

---

## 10. nodemon em Desenvolvimento

**Decisão:** Utilizar `nodemon` como dependência de desenvolvimento.

**Justificativa técnica:**
`nodemon` monitora alterações nos arquivos do projeto e reinicia automaticamente o servidor Node.js. Isso elimina o ciclo manual de parar/reiniciar o servidor a cada alteração, acelerando significativamente o fluxo de desenvolvimento.

---

## Resumo das Decisões

| Tecnologia          | Categoria        | Justificativa Principal                            |
|---------------------|------------------|----------------------------------------------------|
| Node.js             | Runtime          | Linguagem unificada, I/O assíncrono                |
| Express.js v5       | Framework HTTP   | Flexibilidade, async nativo, ecossistema maduro    |
| Sequelize           | ORM              | Abstração SQL, sync automático, associações        |
| MySQL               | Banco de Dados   | Relacional, maduro, suporte nativo no Sequelize    |
| bcryptjs            | Segurança        | Hash seguro para senhas, portável                  |
| express-session     | Sessão           | Padrão Express, persistência em arquivo            |
| express-handlebars  | Template Engine  | Separação de responsabilidades, layouts            |
| MVC                 | Arquitetura      | Organização, manutenibilidade, escalabilidade      |
| ES Modules          | Módulos          | Sintaxe moderna, padrão do JavaScript              |
| nodemon             | Dev Tools        | Produtividade no desenvolvimento                   |
