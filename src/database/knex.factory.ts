import knex, { Knex } from 'knex';

export function createKnex(source: { DATABASE_URL: string }): Knex {
  return knex({
    client: 'pg',
    connection: source.DATABASE_URL,
  });
}
