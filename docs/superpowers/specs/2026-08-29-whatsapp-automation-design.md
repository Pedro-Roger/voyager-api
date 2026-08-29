# Voyager WhatsApp Automation Design

## Objetivo

Criar base segura para o Voyager gerar relatórios operacionais e distribuí-los por WhatsApp usando Evolution API.

## Arquitetura

O domínio fica independente do provedor. `Reports` compõe conteúdo factual, `Automations` define recorrência e destinatários, `Outbox` persiste entregas e controla tentativas, e `Evolution` traduz mensagens para a API externa e recebe webhooks.

## Fluxo de saída

1. Automação vencida solicita geração de relatório.
2. Compositor recebe métricas já agregadas e produz texto estável.
3. Relatório e entrega são persistidos na mesma organização.
4. Worker reivindica entrega pendente atomicamente com `FOR UPDATE SKIP LOCKED`.
5. Adapter Evolution envia mensagem e registra sucesso ou nova tentativa.
6. Após limite de tentativas, entrega termina como falha.

## Fluxo de entrada

1. Evolution chama `POST /webhooks/evolution`.
2. Assinatura configurada é validada quando presente.
3. `eventId` impede processamento duplicado.
4. Payload bruto é preservado para auditoria, sem virar instrução executável.

## Modelos

- `Automation`: organização, nome, frequência, timezone, destinatários, próxima execução e estado.
- `OperationalReport`: organização, tipo, período, conteúdo, métricas e estado.
- `WhatsAppDelivery`: relatório, destinatário, mensagem, idempotency key, tentativas e próxima tentativa.
- `WebhookEvent`: provedor, eventId, tipo, payload e data de processamento.

## Segurança

- Toda consulta e escrita inclui `organizationId`.
- Chave Evolution vem somente de variável de ambiente.
- Webhook aceita segredo compartilhado por header.
- Logs e respostas nunca expõem API key.
- Telefone é normalizado para dígitos e validado antes de entrar na outbox.

## Primeira entrega

- schema Prisma e migration SQL
- compositor de resumo diário
- política de retry da outbox
- query Knex de reivindicação concorrente
- adapter Evolution para mensagem de texto
- endpoint webhook idempotente
- testes unitários, E2E de contrato e build

## Fora desta entrega

- conexão com instância Evolution real
- disparo cron em processo separado
- interface web de configuração
- relatórios com dados reais de convênios ainda não modelados
