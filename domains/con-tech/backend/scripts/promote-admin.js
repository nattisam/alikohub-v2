const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const userId = 'g16RZgidQ3ce4OmrRCbn8XW2IZk2';
  console.log(`Promoting user ${userId} to ADMIN in Con-Tech Backend`);

  await prisma.contechProfile.upsert({
    where: { userId },
    update: { role: 'ADMIN' },
    create: {
      userId,
      role: 'ADMIN',
      hasSelectedRole: true,
    },
  });

  console.log('User promoted successfully in Con-Tech Backend.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
