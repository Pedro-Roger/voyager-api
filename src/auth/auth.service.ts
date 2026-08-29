import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import { LoginDto } from './dto/login.dto';
import { AuthenticatedActor } from './authz.service';

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

type LoginResult = {
  user: Omit<AuthenticatedActor, 'sessionId'>;
  tokens: TokenPair;
};

@Injectable()
export class AuthService {
  private readonly refreshSessions = new Map<
    string,
    Omit<AuthenticatedActor, 'sessionId'> & { sessionId: string }
  >();

  async login(input: LoginDto) {
    const expectedEmail = process.env.DEV_AUTH_EMAIL;
    const expectedPassword = process.env.DEV_AUTH_PASSWORD;

    if (input.email !== expectedEmail || input.password !== expectedPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const sessionId = randomUUID();
    const user = {
      email: expectedEmail ?? '',
      role: (process.env.DEV_AUTH_ROLE ?? 'ADMIN') as AuthenticatedActor['role'],
      organizationId:
        process.env.DEV_AUTH_ORGANIZATION_ID ??
        '10000000-0000-4000-8000-000000000001',
    };
    const tokens = this.issueTokens(sessionId);

    this.refreshSessions.set(tokens.refreshToken, {
      ...user,
      sessionId,
    });

    return { user, tokens } satisfies LoginResult;
  }

  async refresh(refreshToken: string) {
    const session = this.refreshSessions.get(refreshToken);

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    this.refreshSessions.delete(refreshToken);

    const nextSessionId = randomUUID();
    const nextTokens = this.issueTokens(nextSessionId);

    this.refreshSessions.set(nextTokens.refreshToken, {
      email: session.email,
      role: session.role,
      organizationId: session.organizationId,
      sessionId: nextSessionId,
    });

    return {
      user: {
        email: session.email,
        role: session.role,
        organizationId: session.organizationId,
      },
      tokens: nextTokens,
    } satisfies LoginResult;
  }

  private issueTokens(sessionId: string): TokenPair {
    return {
      accessToken: this.signToken('access', sessionId),
      refreshToken: this.signToken('refresh', sessionId),
    };
  }

  private signToken(kind: 'access' | 'refresh', sessionId: string) {
    const secret =
      kind === 'access'
        ? process.env.JWT_ACCESS_SECRET ?? 'access-secret'
        : process.env.JWT_REFRESH_SECRET ?? 'refresh-secret';

    return createHash('sha256')
      .update(`${kind}:${sessionId}:${secret}`)
      .digest('hex');
  }
}
