import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  it('exposes datasource url from env', () => {
    const service = new PrismaService({
      DATABASE_URL: 'postgresql://voyager:voyager@127.0.0.1:5432/voyager',
    });

    expect(service.getDatasourceUrl()).toBe(
      'postgresql://voyager:voyager@127.0.0.1:5432/voyager',
    );
  });
});
