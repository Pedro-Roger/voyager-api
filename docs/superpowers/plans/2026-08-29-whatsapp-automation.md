# Voyager WhatsApp Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar base persistente e testada para relatórios automáticos via Evolution API.

**Architecture:** Separar composição de relatório, persistência de automações, fila de entrega e integração Evolution. Prisma define integridade; Knex reivindica jobs concorrentes com `SKIP LOCKED`; NestJS expõe contratos HTTP.

**Tech Stack:** NestJS, TypeScript, PostgreSQL, Prisma, Knex, Jest, Supertest.

---

### Task 1: Contratos de domínio e relatório

**Files:**
- Create: `src/reports/report-composer.spec.ts`
- Create: `src/reports/report-composer.ts`

- [x] Escrever teste que exige resumo factual com métricas críticas.
- [x] Executar teste e confirmar falha por módulo ausente.
- [x] Implementar composição mínima e validar teste verde.

### Task 2: Política de outbox

**Files:**
- Create: `src/automations/outbox-policy.spec.ts`
- Create: `src/automations/outbox-policy.ts`
- Create: `src/automations/outbox-query.spec.ts`
- Create: `src/automations/outbox-query.ts`

- [x] Escrever testes para normalização, retry e `SKIP LOCKED`.
- [x] Confirmar RED.
- [x] Implementar regras mínimas e confirmar GREEN.

### Task 3: Adapter Evolution

**Files:**
- Create: `src/integrations/evolution/evolution.service.spec.ts`
- Create: `src/integrations/evolution/evolution.service.ts`

- [x] Escrever teste do contrato `message/sendText/{instance}`.
- [x] Confirmar RED.
- [x] Implementar adapter com transporte injetável e confirmar GREEN.

### Task 4: Webhook idempotente

**Files:**
- Create: `src/integrations/evolution/evolution-webhook.service.spec.ts`
- Create: `src/integrations/evolution/evolution-webhook.service.ts`
- Create: `src/integrations/evolution/evolution.controller.ts`
- Create: `src/integrations/evolution/evolution.module.ts`
- Modify: `src/app.module.ts`
- Create: `test/evolution-webhook.e2e-spec.ts`

- [x] Escrever testes de segredo e deduplicação.
- [x] Confirmar RED.
- [x] Implementar endpoint e confirmar GREEN.

### Task 5: Persistência PostgreSQL

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `prisma/schema.spec.ts`
- Create: `prisma/migrations/20260829030000_whatsapp_automation/migration.sql`
- Modify: `.env.example`

- [x] Escrever teste de schema para relações, unicidade e índices.
- [x] Confirmar RED.
- [x] Implementar modelos e migration.
- [x] Executar `npm run prisma:generate` e confirmar GREEN.

### Task 6: Verificação e publicação

**Files:**
- Modify: `README.md`

- [x] Executar testes unitários.
- [x] Executar testes E2E.
- [x] Executar build.
- [x] Atualizar última parada.
- [x] Commitar e enviar ao GitHub público.
