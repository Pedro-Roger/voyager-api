# Voyager API Foundation Design

## Objective

Criar fundação da API do Voyager como backend operacional para observação, coordenação de atividades, consolidação de dados e apoio a tomada de ação segura.

## Scope

Incluído nesta fundação:

- `NestJS` como base da API
- `PostgreSQL` como banco principal
- `Prisma` para schema, migrations, client tipado e operações de domínio
- `Knex` para queries operacionais e agregações controladas
- separação clara entre controller, service e acesso a dados
- configuração centralizada
- healthcheck
- base para multi-tenant
- base para autenticação, RBAC e auditoria nas próximas fases

Não incluído nesta fase:

- regras completas de negócio
- autenticação final
- CRUDs de domínio
- integrações externas
- IA

## Architecture

Voyager API será uma aplicação `NestJS` modular. Controllers traduzem HTTP. Services concentram regras. Camada de persistência fica atrás de serviços e repositórios.

`Prisma` será fonte principal para:

- schema relacional
- migrations
- seed de desenvolvimento
- escritas e leituras transacionais do domínio

`Knex` será usado para:

- queries agregadas
- consultas analíticas
- relatórios
- leitura otimizada quando Prisma gerar acoplamento ruim ou query excessiva

Regra principal: nenhuma regra de negócio crítica fica em SQL ad hoc no controller.

## Initial Modules

- `config`
- `health`
- `database`
- `auth` base
- `audit` base
- `organizations` base
- `users` base
- `activities` placeholder
- `issues` placeholder
- `agreements` placeholder
- `documents` placeholder

## Data Boundaries

- `Prisma` define tipos e integridade
- `Knex` não vira segundo ORM
- `Prisma` e `Knex` compartilham mesma conexão lógica com PostgreSQL
- consultas de relatório devem receber DTOs/controladores próprios
- toda entidade operacional futura terá `organizationId`

## Security Direction

- estrutura pronta para isolamento por `organizationId`
- guards e decorators entram na próxima fase
- logs e erros não devem vazar dados cross-tenant
- auditoria será obrigatória em mutações relevantes

## Testing Direction

Fase 1 deve nascer com TDD para:

- bootstrap da app
- carregamento de configuração
- healthcheck
- criação de client Prisma
- criação de factory Knex

## Stop Point

Se esta fase terminar corretamente, API sobe localmente, responde `/health`, valida configuração e deixa preparada a base para auth e módulos operacionais.
