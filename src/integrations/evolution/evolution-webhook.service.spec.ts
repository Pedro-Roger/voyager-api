import { UnauthorizedException } from '@nestjs/common';
import { EvolutionWebhookService, InMemoryWebhookEventStore } from './evolution-webhook.service';

describe('EvolutionWebhookService', () => {
  it('rejects an invalid shared secret', async () => {
    const service = new EvolutionWebhookService(new InMemoryWebhookEventStore(), 'expected-secret');

    await expect(service.receive('wrong-secret', { eventId: 'evt-1', event: 'messages.upsert' }))
      .rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('deduplicates provider events', async () => {
    const service = new EvolutionWebhookService(new InMemoryWebhookEventStore(), 'expected-secret');
    const payload = { eventId: 'evt-1', event: 'messages.upsert', data: { message: 'hello' } };

    await expect(service.receive('expected-secret', payload)).resolves.toEqual({ accepted: true, duplicate: false });
    await expect(service.receive('expected-secret', payload)).resolves.toEqual({ accepted: true, duplicate: true });
  });

  it('accepts the native Evolution payload using its API key and message id', async () => {
    const service = new EvolutionWebhookService(
      new InMemoryWebhookEventStore(),
      'webhook-secret',
      'evolution-api-key',
    );
    const payload = {
      event: 'messages.upsert',
      instance: 'larvifort-a933d067',
      apikey: 'evolution-api-key',
      data: { key: { id: '3EB0844F2AC69D5137252F' } },
    };

    await expect(service.receive(undefined, payload)).resolves.toEqual({ accepted: true, duplicate: false });
    await expect(service.receive(undefined, payload)).resolves.toEqual({ accepted: true, duplicate: true });
  });

  it('removes the Evolution API key before storing the payload', async () => {
    const stored: Array<Record<string, unknown>> = [];
    const store = {
      has: async () => false,
      add: async (_eventId: string, payload: Record<string, unknown>) => { stored.push(payload); },
    };
    const service = new EvolutionWebhookService(store, 'webhook-secret', 'evolution-api-key');

    await service.receive(undefined, {
      event: 'messages.upsert',
      apikey: 'evolution-api-key',
      data: { key: { id: 'message-1' } },
    });

    expect(stored).toEqual([{ event: 'messages.upsert', data: { key: { id: 'message-1' } } }]);
  });
});
