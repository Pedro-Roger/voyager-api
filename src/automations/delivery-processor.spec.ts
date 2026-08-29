import { DeliveryProcessor, DeliveryRepository, TextSender } from './delivery-processor';

describe('DeliveryProcessor', () => {
  const delivery = {
    id: 'delivery-1',
    recipient: '5585999991111',
    message: 'Resumo Voyager',
    attempts: 0,
  };

  it('marks a successful Evolution delivery as sent', async () => {
    const repository: DeliveryRepository = {
      markSent: jest.fn(), markRetry: jest.fn(), markFailed: jest.fn(),
    };
    const sender: TextSender = { sendText: jest.fn().mockResolvedValue({ providerMessageId: 'msg-1' }) };
    const processor = new DeliveryProcessor(repository, sender);

    await processor.process(delivery, new Date('2026-08-29T03:00:00.000Z'));

    expect(repository.markSent).toHaveBeenCalledWith('delivery-1', 'msg-1', new Date('2026-08-29T03:00:00.000Z'));
    expect(repository.markRetry).not.toHaveBeenCalled();
  });

  it('schedules a retry after a provider failure', async () => {
    const repository: DeliveryRepository = {
      markSent: jest.fn(), markRetry: jest.fn(), markFailed: jest.fn(),
    };
    const sender: TextSender = { sendText: jest.fn().mockRejectedValue(new Error('provider unavailable')) };
    const processor = new DeliveryProcessor(repository, sender);

    await processor.process(delivery, new Date('2026-08-29T03:00:00.000Z'));

    expect(repository.markRetry).toHaveBeenCalledWith('delivery-1', 1, new Date('2026-08-29T03:01:00.000Z'), 'provider unavailable');
  });
});
