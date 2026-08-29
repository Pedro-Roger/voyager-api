import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [
    {
      provide: PrismaService,
      useFactory: () =>
        new PrismaService({
          DATABASE_URL:
            process.env.DATABASE_URL ??
            'postgresql://voyager:voyager@127.0.0.1:5432/voyager',
        }),
    },
  ],
  exports: [PrismaService],
})
export class DatabaseModule {}
