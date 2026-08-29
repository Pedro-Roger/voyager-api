import { ensureSeedAllowed } from './seed-policy';

describe('ensureSeedAllowed', () => {
  it('allows seed outside production', () => {
    expect(() => ensureSeedAllowed('development')).not.toThrow();
  });

  it('blocks seed in production', () => {
    expect(() => ensureSeedAllowed('production')).toThrow(
      'Seed execution blocked in production',
    );
  });
});
