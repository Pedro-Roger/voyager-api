export function ensureSeedAllowed(nodeEnv: string | undefined) {
  if (nodeEnv === 'production') {
    throw new Error('Seed execution blocked in production');
  }
}
