# Voyager API

API do Voyager.

Voyager = observador operacional. Papel: coordenar atividades, receber dados, consolidar fatos, expor contexto e apoiar tomada de ação com regras seguras.

## Status

- Estado atual: fase 3 concluída
- Última atualização: 2026-08-29
- Última parada: webhook nativo da Evolution 2.3.6 validado da instância conectada até a API Voyager, com autenticação pela chave do provedor, remoção da chave antes do armazenamento e idempotência pelo ID da mensagem; próximo passo = persistir webhook e executar worker contínuo

## Stack

- Node.js
- TypeScript
- PostgreSQL
- Prisma
- Knex

## Papéis de dados

- Prisma: schema, migrations, client tipado, integridade de domínio
- Knex: queries operacionais, agregações, relatórios, rotinas SQL controladas
- PostgreSQL: fonte principal de verdade

## Etapas

- [x] Fase 0: criar repositório público e roadmap inicial
- [x] Fase 1: arquitetura API, módulos, convenções, config, healthcheck
- [x] Fase 2: banco base PostgreSQL, Prisma, Knex, migrations, seed dev
- [x] Fase 3: autenticação, refresh token, RBAC, isolamento por organização
- [ ] Fase 4: auditoria, requestId, erros padronizados, logs estruturados
- [ ] Fase 5: módulo municípios e unidades
- [ ] Fase 6: módulo convênios e projetos
- [ ] Fase 7: módulo documentos, requisitos, anexos e storage abstraction
- [ ] Fase 8: módulo pendências
- [ ] Fase 9: módulo tarefas, atualizações e atividades
- [ ] Fase 10: motor determinístico de prazos, vencimentos e alertas
- [ ] Fase 11: dashboard e queries agregadas
- [ ] Fase 12: resumo diário factual e distribuição
- [ ] Fase 13: notificações e adapters externos
- [ ] Fase 14: observabilidade, jobs e operação
- [ ] Fase 15: testes integração, E2E e hardening

## Trilha WhatsApp

- [x] compositor determinístico de resumo diário
- [x] adapter de envio de texto para Evolution API
- [x] contrato `POST /webhooks/evolution` compatível com payload nativo da Evolution
- [x] deduplicação inicial de webhook em memória
- [x] schema e migration para automações, relatórios, entregas e webhooks
- [x] outbox com idempotência por organização
- [x] claim concorrente com `FOR UPDATE SKIP LOCKED`
- [x] retry exponencial e limite de cinco tentativas
- [ ] persistência do webhook usando `WebhookEvent`
- [ ] worker contínuo para reivindicar e processar entregas
- [ ] consultas Knex com dados reais dos módulos operacionais
- [ ] configuração de automações pelo frontend
- [x] validação com uma instância Evolution conectada

## Módulos da API

### Fundação

- config
- health
- auth
- users
- roles
- permissions
- audit

### Domínio operacional

- organizations
- municipalities
- units
- agreements
- projects
- document-types
- requirements
- documents
- attachments
- issues
- tasks
- task-updates
- activities
- alerts
- notifications
- daily-summaries

### Infra

- worker/jobs
- storage abstraction
- webhook/adapters
- observability

## Regra de atualização

Sempre que uma fase subir:

1. marcar checkbox da fase
2. atualizar `Última atualização`
3. atualizar `Última parada`
4. registrar breve nota do que entrou

## Próximo passo

Persistir webhooks, executar worker da outbox e conectar o primeiro relatório aos dados operacionais reais.
