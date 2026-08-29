import { buildEnv } from './env';

describe('buildEnv', () => {
  it('reads required configuration', () => {
    const env = buildEnv({
      API_PORT: '3001',
      APP_ORIGIN: 'http://localhost:3000',
      DATABASE_URL: 'postgresql://voyager:voyager@127.0.0.1:5432/voyager',
      JWT_ACCESS_SECRET: 'access-secret',
      JWT_REFRESH_SECRET: 'refresh-secret',
      TZ: 'America/Fortaleza',
    });

    expect(env.apiPort).toBe(3001);
    expect(env.appOrigin).toBe('http://localhost:3000');
    expect(env.timezone).toBe('America/Fortaleza');
  });

  it('throws when required variable is missing', () => {
    expect(() =>
      buildEnv({
        API_PORT: '3001',
        APP_ORIGIN: 'http://localhost:3000',
        DATABASE_URL: '',
        JWT_ACCESS_SECRET: 'access-secret',
        JWT_REFRESH_SECRET: 'refresh-secret',
        TZ: 'America/Fortaleza',
      }),
    ).toThrow('Invalid environment configuration');
  });
});
