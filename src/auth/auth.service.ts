import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  async login(input: LoginDto) {
    const expectedEmail = process.env.DEV_AUTH_EMAIL;
    const expectedPassword = process.env.DEV_AUTH_PASSWORD;

    if (input.email !== expectedEmail || input.password !== expectedPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const sessionId = randomUUID();

    return {
      user: {
        email: expectedEmail ?? '',
        role: process.env.DEV_AUTH_ROLE ?? 'ADMIN',
        organizationId:
          process.env.DEV_AUTH_ORGANIZATION_ID ??
          '10000000-0000-4000-8000-000000000001',
      },
      tokens: {
        accessToken: this.signToken('access', sessionId),
        refreshToken: this.signToken('refresh', sessionId),
      },
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
