import { readFileSync } from 'node:fs';
import path from 'node:path';

const schema = readFileSync(path.join(__dirname, 'schema.prisma'), 'utf8');

describe('Prisma schema', () => {
  it.each(['Organization', 'User', 'RefreshSession', 'AuditLog', 'Automation', 'OperationalReport', 'WhatsAppDelivery', 'WebhookEvent'])(
    'contains model %s',
    (modelName) => {
      expect(schema).toContain(`model ${modelName}`);
    },
  );

  it('uses tenant-aware unique email', () => {
    expect(schema).toContain('@@unique([organizationId, email])');
  });

  it('uses tenant-aware idempotency and queue indexes', () => {
    expect(schema).toContain('@@unique([organizationId, idempotencyKey])');
    expect(schema).toContain('@@index([status, nextAttemptAt, createdAt])');
    expect(schema).toContain('@@unique([provider, providerEventId])');
    expect(schema).toContain('@@index([organizationId, nextRunAt, active])');
  });
});
