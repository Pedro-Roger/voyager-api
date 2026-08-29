const MAX_ATTEMPTS = 5;

export function normalizeWhatsAppRecipient(value: string) {
  const normalized = value.replace(/\D/g, '');
  if (normalized.length < 10 || normalized.length > 15) {
    throw new Error('Invalid WhatsApp recipient');
  }
  return normalized;
}

export function getNextAttempt(attempt: number, now = new Date()) {
  if (attempt >= MAX_ATTEMPTS) {
    return null;
  }
  const delayInMinutes = 2 ** (attempt - 1);
  return new Date(now.getTime() + delayInMinutes * 60_000);
}
