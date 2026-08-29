import { buildEnv } from './env';

describe('buildEnv', () => {
  it('reads required configuration', () => {
    const env = buildEnv({
      API_PORT: '3001',
      APP_ORIGIN: 'http://localhost:3000',
      DATABASE_URL: 'postgresql://voyager:voyager@127.0.0.1:5432/voyager',
      DEV_AUTH_EMAIL: 'admin@voyager.test',
      DEV_AUTH_ORGANIZATION_ID: '10000000-0000-4000-8000-000000000001',
      DEV_AUTH_PASSWORD: 'voyager-dev',
      DEV_AUTH_ROLE: 'ADMIN',
      JWT_ACCESS_SECRET: 'access-secret',
      JWT_REFRESH_SECRET: 'refresh-secret',
      TZ: 'America/Fortaleza',
    });

    expect(env.apiPort).toBe(3001);
    expect(env.appOrigin).toBe('http://localhost:3000');
    expect(env.devAuthEmail).toBe('admin@voyager.test');
    expect(env.timezone).toBe('America/Fortaleza');
  });

  it('throws when required variable is missing', () => {
    expect(() =>
      buildEnv({
        API_PORT: '3001',
        APP_ORIGIN: 'http://localhost:3000',
        DATABASE_URL: '',
        DEV_AUTH_EMAIL: 'admin@voyager.test',
        DEV_AUTH_ORGANIZATION_ID: '10000000-0000-4000-8000-000000000001',
        DEV_AUTH_PASSWORD: 'voyager-dev',
        DEV_AUTH_ROLE: 'ADMIN',
        JWT_ACCESS_SECRET: 'access-secret',
        JWT_REFRESH_SECRET: 'refresh-secret',
        TZ: 'America/Fortaleza',
      }),
    ).toThrow('Invalid environment configuration');
  });
});
