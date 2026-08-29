import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export type EvolutionWebhookPayload = {
  eventId?: string;
  event?: string;
  data?: unknown;
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
  ) {}

  async receive(secret: string | undefined, payload: EvolutionWebhookPayload) {
    if (!this.sharedSecret || secret !== this.sharedSecret) {
      throw new UnauthorizedException('Invalid Evolution webhook secret');
    }
    if (!payload.eventId || !payload.event) {
      throw new BadRequestException('Evolution webhook requires eventId and event');
    }
    if (await this.store.has(payload.eventId)) {
      return { accepted: true, duplicate: true };
    }
    await this.store.add(payload.eventId, payload);
    return { accepted: true, duplicate: false };
  }
}
