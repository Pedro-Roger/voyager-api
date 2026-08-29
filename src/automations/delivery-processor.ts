import { getNextAttempt } from './outbox-policy';

export type PendingDelivery = {
  id: string;
  recipient: string;
  message: string;
  attempts: number;
};

export interface TextSender {
  sendText(recipient: string, text: string): Promise<{ providerMessageId: string | null }>;
}

export interface DeliveryRepository {
  markSent(id: string, providerMessageId: string | null, sentAt: Date): Promise<void> | void;
  markRetry(id: string, attempts: number, nextAttemptAt: Date, error: string): Promise<void> | void;
  markFailed(id: string, attempts: number, failedAt: Date, error: string): Promise<void> | void;
}

export class DeliveryProcessor {
  constructor(
    private readonly repository: DeliveryRepository,
    private readonly sender: TextSender,
  ) {}

  async process(delivery: PendingDelivery, now = new Date()) {
    try {
      const result = await this.sender.sendText(delivery.recipient, delivery.message);
      await this.repository.markSent(delivery.id, result.providerMessageId, now);
    } catch (error) {
      const attempts = delivery.attempts + 1;
      const message = error instanceof Error ? error.message.slice(0, 500) : 'Unknown provider error';
      const nextAttemptAt = getNextAttempt(attempts, now);
      if (nextAttemptAt) {
        await this.repository.markRetry(delivery.id, attempts, nextAttemptAt, message);
        return;
      }
      await this.repository.markFailed(delivery.id, attempts, now, message);
    }
  }
}
