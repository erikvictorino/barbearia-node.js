# Roadmap de Evolução — The Barber

## Versão 1.0 — Estado Atual ✅

Funcionalidades já implementadas no projeto:

- ✅ Cadastro de cliente com validação de telefone único e confirmação de senha
- ✅ Autenticação via telefone e senha (com bcryptjs)
- ✅ Logout com destruição de sessão
- ✅ Persistência de sessão em arquivo (`session-file-store`)
- ✅ Flash messages em operações de login/cadastro
- ✅ Listagem pública de serviços na página inicial
- ✅ Estrutura MVC com Express.js e Sequelize
- ✅ Models: Cliente, Barbeiro, Servicos, Agendamento
- ✅ Relacionamentos: Cliente → Agendamento (1:N) e Servicos ↔ Agendamento (N:N)
- ✅ Layout base com Handlebars (header, nav condicional, footer)
- ✅ Interface de recuperação de senha (somente frontend)

---

## Versão 1.1 — Correções e Melhorias Imediatas 🔧

Melhorias naturais baseadas nas inconsistências e pendências identificadas no código atual:

- 🔧 **Corrigir `allownull` → `allowNull`** no model `Cliente` para garantir validação de campos obrigatórios
- 🔧 **Corrigir o bloco `catch`** em `registerPost` para enviar resposta HTTP ao usuário em caso de erro no banco
- 🔧 **Implementar middleware de autenticação** (`isAuthenticated`) para proteger rotas privadas como `/agendamento`
- 🔧 **Externalizar credenciais do banco** para variáveis de ambiente, carregando o `.env` com dotenv no `database.js`
- 🔧 **Implementar a view de agendamentos** (`admin/agendamentos.handlebars` e `admin/agendamento.handlebars`) para exibir os dados recebidos do controller
- 🔧 **Completar o formulário de agendamento** (`agendamento/agendamento.handlebars`) com os campos necessários (data, hora, barbeiro, serviços)
- 🔧 **Implementar o backend de recuperação de senha** (`POST /recuperar` + controller)
- 🔧 **Declarar a FK entre `Agendamento` e `Barbeiro`** para garantir integridade referencial
- 🔧 **Padronizar o nome do banco** (`barbearia` vs `barbearia_db` no `.env`)

---

## Versão 1.2 — Funcionalidades Core do Agendamento 📅

Após as correções, completar o fluxo principal de agendamentos:

- 📅 **Fluxo completo de criação de agendamento:** seleção de serviço → seleção de barbeiro → seleção de data/hora → confirmação
- 📅 **Validação de conflito de horários:** verificar se o barbeiro já possui agendamento no mesmo horário/data
- 📅 **Cancelamento de agendamento** pelo cliente
- 📅 **Status de agendamento:** pendente, confirmado, concluído, cancelado — com atualização via interface
- 📅 **Listagem de agendamentos futuros e histórico** na área do cliente
- 📅 **Validação de data futura:** impedir agendamentos em datas passadas

---

## Versão 2.0 — Novas Funcionalidades 🚀

Recursos que ampliam significativamente o escopo do sistema:

- 🚀 **Painel Administrativo completo** para gerenciar barbeiros, serviços e visualizar todos os agendamentos
- 🚀 **Cadastro e edição de barbeiros** via interface
- 🚀 **Cadastro e edição de serviços** (nome, preço, duração) via interface
- 🚀 **Perfil do cliente:** edição de nome, telefone e senha
- 🚀 **Upload de foto de perfil** para clientes e barbeiros
- 🚀 **Calendário de disponibilidade** por barbeiro (horários disponíveis e bloqueados)
- 🚀 **Notificações via WhatsApp** (Twilio ou Evolution API) para confirmação e lembrete de agendamentos
- 🚀 **Diferenciação de roles:** cliente / barbeiro / administrador com permissões distintas
- 🚀 **Dashboard com métricas:** total de agendamentos, receita estimada, horários mais populares

---

## Versão 3.0 — Recursos Avançados 🌟

Recursos para posicionamento profissional e escalabilidade:

- 🌟 **API REST independente** com autenticação JWT para consumo por aplicativos mobile
- 🌟 **Integração com Google Agenda** para sincronização dos agendamentos dos barbeiros
- 🌟 **Sistema de avaliações** de barbeiros e serviços por clientes após o atendimento
- 🌟 **Pagamento online** com Stripe ou Mercado Pago para reserva com sinal
- 🌟 **Testes automatizados** (Jest + Supertest): unitários para controllers e integração para rotas
- 🌟 **Containerização com Docker** e `docker-compose` para banco + app
- 🌟 **CI/CD com GitHub Actions:** lint → testes → build → deploy automático
- 🌟 **Deploy em produção** (Railway, Render ou VPS com PM2 + Nginx)
- 🌟 **Logs estruturados** com Winston ou Pino para monitoramento em produção
- 🌟 **Rate limiting** para prevenir ataques de força bruta em `/login` e `/cadastro`
- 🌟 **Busca de horários disponíveis em tempo real** com WebSocket ou Server-Sent Events
- 🌟 **PWA (Progressive Web App):** offline support, notificações push, instalação no celular

---

## Linha do Tempo Sugerida

```
Versão 1.0  ──────────────────────────── ATUAL
     │
     │  2–3 semanas
     ▼
Versão 1.1  ── Correções + Middleware + Views completas
     │
     │  3–4 semanas
     ▼
Versão 1.2  ── Fluxo de agendamento funcional de ponta a ponta
     │
     │  4–6 semanas
     ▼
Versão 2.0  ── Painel admin + Perfis + Notificações
     │
     │  2–3 meses
     ▼
Versão 3.0  ── API REST + Deploy + CI/CD + Testes
```
