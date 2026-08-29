# Voyager API Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar fundação executável da API Voyager com NestJS, PostgreSQL, Prisma, Knex, healthcheck e configuração validada.

**Architecture:** API NestJS modular com `config`, `health` e `database` na primeira fase. `Prisma` cuida de schema e client tipado; `Knex` fornece query builder para leituras operacionais. Controllers não acessam dados diretamente.

**Tech Stack:** Node.js 22, npm, TypeScript, NestJS, Jest, PostgreSQL, Prisma, Knex, Docker Compose.

---

### Task 1: Bootstrap e healthcheck

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.build.json`
- Create: `nest-cli.json`
- Create: `src/main.ts`
- Create: `src/app.module.ts`
- Create: `src/health/health.module.ts`
- Create: `src/health/health.controller.ts`
- Test: `test/health.e2e-spec.ts`

- [ ] Escrever teste falhando para `GET /health`
- [ ] Rodar teste e confirmar falha
- [ ] Implementar bootstrap mínimo
- [ ] Rodar teste e confirmar sucesso

### Task 2: Config validada

**Files:**
- Create: `src/config/env.ts`
- Create: `src/config/env.spec.ts`

- [ ] Escrever teste falhando para leitura/validação de env
- [ ] Rodar teste e confirmar falha
- [ ] Implementar schema de env
- [ ] Rodar teste e confirmar sucesso

### Task 3: Prisma + Knex base

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/database/prisma.service.ts`
- Create: `src/database/knex.factory.ts`
- Create: `src/database/database.module.ts`
- Test: `src/database/knex.factory.spec.ts`
- Test: `src/database/prisma.service.spec.ts`

- [ ] Escrever testes falhando para factory Knex e Prisma service
- [ ] Rodar testes e confirmar falha
- [ ] Implementar integração mínima
- [ ] Rodar testes e confirmar sucesso

### Task 4: Docs e status

**Files:**
- Modify: `README.md`
- Create: `.env.example`
- Create: `docker-compose.yml`

- [ ] Atualizar checklist da fase 1
- [ ] Registrar última parada
- [ ] Validar `test` e `build`

