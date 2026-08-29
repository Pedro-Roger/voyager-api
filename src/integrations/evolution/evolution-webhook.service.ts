import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export type EvolutionWebhookPayload = {
  eventId?: string;
  event?: string;
  apikey?: string;
  data?: {
    key?: { id?: string };
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export interface WebhookEventStore {
  has(providerEventId: string): Promise<boolean>;
  add(providerEventId: string, payload: EvolutionWebhookPayload): Promise<void>;
}

export class InMemoryWebhookEventStore implements WebhookEventStore {
  private readonly events = new Map<string, EvolutionWebhookPayload>();

  async has(providerEventId: string) {
    return this.events.has(providerEventId);
  }

  async add(providerEventId: string, payload: EvolutionWebhookPayload) {
    this.events.set(providerEventId, payload);
  }
}

export class EvolutionWebhookService {
  constructor(
    private readonly store: WebhookEventStore,
    private readonly sharedSecret: string,
    private readonly apiKey = '',
  ) {}

  async receive(secret: string | undefined, payload: EvolutionWebhookPayload) {
    const authenticatedByHeader = Boolean(this.sharedSecret && secret === this.sharedSecret);
    const authenticatedByEvolution = Boolean(this.apiKey && payload.apikey === this.apiKey);
    if (!authenticatedByHeader && !authenticatedByEvolution) {
      throw new UnauthorizedException('Invalid Evolution webhook secret');
    }
    const providerEventId = payload.eventId ?? payload.data?.key?.id;
    if (!providerEventId || !payload.event) {
      throw new BadRequestException('Evolution webhook requires an event id and event');
    }
    if (await this.store.has(providerEventId)) {
      return { accepted: true, duplicate: true };
    }
    const { apikey: _apiKey, ...safePayload } = payload;
    await this.store.add(providerEventId, safePayload);
    return { accepted: true, duplicate: false };
  }
}
