import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  private readonly datasourceUrl: string;

  constructor(source: { DATABASE_URL: string }) {
    super({
      datasourceUrl: source.DATABASE_URL,
    });
    this.datasourceUrl = source.DATABASE_URL;
  }

  getDatasourceUrl() {
    return this.datasourceUrl;
  }
}
