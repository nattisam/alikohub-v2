const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@alikohub.com' },
    include: {
      academyUser: true,
      consultancyUser: true,
      contechUser: true,
      eventsUser: true,
      careersUser: true,
    }
  });

  console.log('User found:', user.email);
  try {
    const stringified = JSON.stringify(user);
    console.log('Stringify success, length:', stringified.length);
    const parsed = JSON.parse(stringified);
    console.log('Parse success');
  } catch (e) {
    console.error('JSON Error:', e);
  }
}

main().finally(() => prisma.$disconnect());
