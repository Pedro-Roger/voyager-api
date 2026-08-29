import { ForbiddenException } from '@nestjs/common';
import { AuthzService, AuthenticatedActor } from './authz.service';

describe('AuthzService', () => {
  const service = new AuthzService();

  it('allows actor with required role in same organization', () => {
    const actor: AuthenticatedActor = {
      email: 'admin@voyager.test',
      organizationId: '10000000-0000-4000-8000-000000000001',
      role: 'ADMIN',
      sessionId: 'session-1',
    };

    expect(
      service.assertAccess(actor, {
        allowedRoles: ['ADMIN', 'MANAGER'],
        organizationId: '10000000-0000-4000-8000-000000000001',
      }),
    ).toBeUndefined();
  });

  it('rejects actor with wrong role', () => {
    const actor: AuthenticatedActor = {
      email: 'tech@voyager.test',
      organizationId: '10000000-0000-4000-8000-000000000001',
      role: 'TECHNICIAN',
      sessionId: 'session-1',
    };

    expect(() =>
      service.assertAccess(actor, {
        allowedRoles: ['ADMIN'],
        organizationId: '10000000-0000-4000-8000-000000000001',
      }),
    ).toThrow(ForbiddenException);
  });

  it('rejects actor from other organization', () => {
    const actor: AuthenticatedActor = {
      email: 'admin@voyager.test',
      organizationId: '20000000-0000-4000-8000-000000000002',
      role: 'ADMIN',
      sessionId: 'session-1',
    };

    expect(() =>
      service.assertAccess(actor, {
        allowedRoles: ['ADMIN'],
        organizationId: '10000000-0000-4000-8000-000000000001',
      }),
    ).toThrow(ForbiddenException);
  });
});
