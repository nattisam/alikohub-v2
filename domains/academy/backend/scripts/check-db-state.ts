import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  
  // Check if test user exists in auth service
  const testUserId = 'test-user-student-999';
  
  console.log(`Checking for user: ${testUserId}`);
  
  // Check academy profile
  const profile = await prisma.academyProfile.findUnique({
    where: { userId: testUserId }
  });
  
  console.log('Academy Profile:', profile);
  
  // Check courses
  const courses = await prisma.course.findMany({
    where: { status: 'PUBLISHED' },
    take: 5
  });
  
  console.log('\nPublished courses:', courses.length);
  courses.forEach(c => console.log(`- Course ${c.id}: ${c.title}`));
  
  // Check existing enrollments
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: testUserId }
  });
  
  console.log('\nExisting enrollments for user:', enrollments.length);
  
  await prisma.$disconnect();
}

main();
