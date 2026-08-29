import { readFileSync } from 'node:fs';
import path from 'node:path';

const schema = readFileSync(path.join(__dirname, 'schema.prisma'), 'utf8');

describe('Prisma schema', () => {
  it.each(['Organization', 'User', 'RefreshSession', 'AuditLog'])(
    'contains model %s',
    (modelName) => {
      expect(schema).toContain(`model ${modelName}`);
    },
  );

  it('uses tenant-aware unique email', () => {
    expect(schema).toContain('@@unique([organizationId, email])');
  });
});
