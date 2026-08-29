import { getNextAttempt, normalizeWhatsAppRecipient } from './outbox-policy';

describe('outbox policy', () => {
  it('normalizes Brazilian WhatsApp recipients', () => {
    expect(normalizeWhatsAppRecipient('+55 (85) 99999-1111')).toBe('5585999991111');
  });

  it('rejects invalid recipients', () => {
    expect(() => normalizeWhatsAppRecipient('123')).toThrow('Invalid WhatsApp recipient');
  });

  it('schedules exponential retry and stops after five attempts', () => {
    const now = new Date('2026-08-29T03:00:00.000Z');

    expect(getNextAttempt(1, now)).toEqual(new Date('2026-08-29T03:01:00.000Z'));
    expect(getNextAttempt(3, now)).toEqual(new Date('2026-08-29T03:04:00.000Z'));
    expect(getNextAttempt(5, now)).toBeNull();
  });
});
