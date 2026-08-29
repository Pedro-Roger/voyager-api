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
});
