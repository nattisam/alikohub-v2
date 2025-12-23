import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "postgresql://contech_user:contech_pass@localhost:5433/contechdb"
      }
    }
  });
  
  const userId = process.argv[2];
  if (!userId) {
    console.error("Please provide userId");
    process.exit(1);
  }

  const profile = await prisma.contechProfile.upsert({
    where: { userId },
    update: { role: 'ADMIN' },
    create: { userId, role: 'ADMIN', hasSelectedRole: true }
  });

  console.log(`Updated user ${userId} to role ADMIN:`, profile);
  await prisma.$disconnect();
}

main();
