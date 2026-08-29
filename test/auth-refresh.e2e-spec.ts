import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth refresh flow', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.API_PORT = '3001';
    process.env.APP_ORIGIN = 'http://localhost:3000';
    process.env.DATABASE_URL = 'postgresql://voyager:voyager@127.0.0.1:5432/voyager';
    process.env.JWT_ACCESS_SECRET = 'access-secret';
    process.env.JWT_REFRESH_SECRET = 'refresh-secret';
    process.env.TZ = 'America/Fortaleza';
    process.env.DEV_AUTH_EMAIL = 'admin@voyager.test';
    process.env.DEV_AUTH_PASSWORD = 'voyager-dev';
    process.env.DEV_AUTH_ROLE = 'ADMIN';
    process.env.DEV_AUTH_ORGANIZATION_ID = '10000000-0000-4000-8000-000000000001';

    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/refresh rotates tokens', async () => {
    const login = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'admin@voyager.test',
      password: 'voyager-dev',
    });

    const refresh = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({
        refreshToken: login.body.tokens.refreshToken,
      })
      .expect(201);

    expect(refresh.body.user.email).toBe('admin@voyager.test');
    expect(refresh.body.tokens.accessToken).toEqual(expect.any(String));
    expect(refresh.body.tokens.refreshToken).toEqual(expect.any(String));
    expect(refresh.body.tokens.refreshToken).not.toBe(login.body.tokens.refreshToken);
  });
});
