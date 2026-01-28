const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const firebaseId = 'g16RZgidQ3ce4OmrRCbn8XW2IZk2';
  console.log(`Promoting user ${firebaseId} to ADMIN in Auth Service`);

  // Update Global Role
  await prisma.user.update({
    where: { firebaseId },
    data: { globalRole: 'ADMIN' },
  });

  // Update Contech Role
  await prisma.contechUser.update({
    where: { userId: firebaseId },
    data: { role: 'ADMIN' },
  });

  console.log('User promoted successfully in Auth Service.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
