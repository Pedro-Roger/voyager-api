import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const service = new AuthService();

  beforeEach(() => {
    process.env.JWT_ACCESS_SECRET = 'access-secret';
    process.env.JWT_REFRESH_SECRET = 'refresh-secret';
    process.env.DEV_AUTH_EMAIL = 'admin@voyager.test';
    process.env.DEV_AUTH_PASSWORD = 'voyager-dev';
    process.env.DEV_AUTH_ROLE = 'ADMIN';
    process.env.DEV_AUTH_ORGANIZATION_ID = '10000000-0000-4000-8000-000000000001';
  });

  it('returns tokens and actor for valid credentials', async () => {
    const result = await service.login({
      email: 'admin@voyager.test',
      password: 'voyager-dev',
    });

    expect(result.user.organizationId).toBe('10000000-0000-4000-8000-000000000001');
    expect(result.tokens.accessToken).toEqual(expect.any(String));
    expect(result.tokens.refreshToken).toEqual(expect.any(String));
  });

  it('throws unauthorized for invalid credentials', async () => {
    await expect(
      service.login({
        email: 'admin@voyager.test',
        password: 'bad',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
