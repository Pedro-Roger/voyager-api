import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Evolution webhook', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.EVOLUTION_WEBHOOK_SECRET = 'webhook-secret';
    const testingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = testingModule.createNestApplication();
    await app.init();
  });

  afterAll(async () => app.close());

  it('POST /webhooks/evolution accepts and deduplicates events', async () => {
    const payload = { eventId: 'evt-e2e-1', event: 'messages.upsert', data: { status: 'received' } };

    await request(app.getHttpServer()).post('/webhooks/evolution').set('x-webhook-secret', 'webhook-secret').send(payload).expect(202, { accepted: true, duplicate: false });
    await request(app.getHttpServer()).post('/webhooks/evolution').set('x-webhook-secret', 'webhook-secret').send(payload).expect(202, { accepted: true, duplicate: true });
  });

  it('POST /webhooks/evolution rejects an invalid secret', async () => {
    await request(app.getHttpServer()).post('/webhooks/evolution').set('x-webhook-secret', 'wrong').send({ eventId: 'evt-e2e-2', event: 'messages.upsert' }).expect(401);
  });
});
