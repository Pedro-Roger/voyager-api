import { createKnex } from './knex.factory';

describe('createKnex', () => {
  it('creates postgres client config from env', () => {
    const instance = createKnex({
      DATABASE_URL: 'postgresql://voyager:voyager@127.0.0.1:5432/voyager',
    });

    expect(instance.client.config.client).toBe('pg');
    expect(instance.client.config.connection).toMatchObject({
      database: 'voyager',
      host: '127.0.0.1',
      port: '5432',
      user: 'voyager',
    });

    void instance.destroy();
  });
});
