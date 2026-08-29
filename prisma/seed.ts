import { PrismaClient } from '@prisma/client';
import { ensureSeedAllowed } from './seed-policy';

async function main() {
  ensureSeedAllowed(process.env.NODE_ENV);

  const prisma = new PrismaClient();

  await prisma.organization.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Voyager Demo',
      users: {
        create: {
          id: '00000000-0000-0000-0000-000000000002',
          email: 'admin@voyager.test',
          fullName: 'Voyager Admin',
          passwordHash: 'dev-password-hash',
        },
      },
    },
  });

  await prisma.$disconnect();
}

void main();
