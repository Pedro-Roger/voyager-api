import { buildClaimDeliveryQuery } from './outbox-query';

describe('buildClaimDeliveryQuery', () => {
  it('claims one pending delivery without blocking other workers', () => {
    const query = buildClaimDeliveryQuery('worker-1');

    expect(query.sql.toLowerCase()).toContain('for update skip locked');
    expect(query.sql.toLowerCase()).toContain('returning');
    expect(query.bindings).toEqual(['worker-1']);
  });
});
