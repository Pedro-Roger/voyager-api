import { ForbiddenException, Injectable } from '@nestjs/common';

export type AuthenticatedActor = {
  email: string;
  organizationId: string;
  role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'VIEWER';
  sessionId: string;
};

type AccessRule = {
  allowedRoles: AuthenticatedActor['role'][];
  organizationId: string;
};

@Injectable()
export class AuthzService {
  assertAccess(actor: AuthenticatedActor, rule: AccessRule) {
    if (actor.organizationId !== rule.organizationId) {
      throw new ForbiddenException('Cross-organization access denied');
    }

    if (!rule.allowedRoles.includes(actor.role)) {
      throw new ForbiddenException('Insufficient role');
    }
  }
}
