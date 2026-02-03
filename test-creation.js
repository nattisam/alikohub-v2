const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJnTFFuaWNmQlU2ZndTeU45ZzhldTJxTmh5ejMyIiwiaWQiOjI0LCJlbWFpbCI6InRlY2hlckBnbWFpbC5jb20iLCJmaXJzdG5hbWUiOiJ0ZWNoZXIiLCJsYXN0bmFtZSI6IkRvZSIsImdsb2JhbFJvbGUiOiJVU0VSIiwic3RhdHVzIjoiQUNUSVZFIiwiYWNhZGVteVJvbGUiOiJJTlNUUlVDVE9SIiwiYWNhZGVteUFjdGl2ZVJvbGUiOiJJTlNUUlVDVE9SIiwiYWNhZGVteVN0YXR1cyI6IkFDVElWRSIsImNvbnRlY2hSb2xlIjoiQ0xJRU5UIiwiY29udGVjaFN0YXR1cyI6IkFDVElWRSIsImV2ZW50c1JvbGUiOiJVU0VSIiwiZXZlbnRzU3RhdHVzIjoiQUNUSVZFIiwiaWF0IjoxNzcwMDMyMzcwLCJleHAiOjE3NzAwMzU5NzB9.LGx6UUG3aSIPJCNtnTrK0xdb-YWdT7Etpnqn3Ek7bUE';
const baseUrl = 'http://localhost:3006';

async function testCreation() {
  console.log('--- Starting Creation Tests ---');

  // 1. Create Course
  console.log('\n[1] Creating Course...');
  const courseRes = await fetch(`${baseUrl}/academy/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'Auto-Test Course ' + Date.now(),
      category: 'Test',
      status: 'PUBLISHED'
    })
  });
  
  const course = await courseRes.json();
  if (!courseRes.ok) {
    console.error('Failed to create course:', course);
    return;
  }
  console.log('Course created successfully ID:', course.id);

  // 2. Create Module
  console.log('\n[2] Creating Module...');
  const moduleRes = await fetch(`${baseUrl}/academy/modules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'Module 1',
      description: 'Test Module',
      courseId: course.id
    })
  });
  
  const module = await moduleRes.json();
  if (!moduleRes.ok) {
    console.error('Failed to create module:', module);
    return;
  }
  console.log('Module created successfully ID:', module.id);

  // 3. Create Lesson
  console.log('\n[3] Creating Lesson...');
  const lessonRes = await fetch(`${baseUrl}/academy/lessons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'Lesson 1',
      type: 'VIDEO',
      moduleId: module.id,
      order: 1
    })
  });
  
  const lesson = await lessonRes.json();
  if (!lessonRes.ok) {
    console.error('Failed to create lesson:', lesson);
    return;
  }
  console.log('Lesson created successfully ID:', lesson.id);

  console.log('\n--- All Basic Creation Tests Passed! ---');
  console.log('Summary:', {
    courseId: course.id,
    moduleId: module.id,
    lessonId: lesson.id
  });
}

testCreation().catch(err => {
  console.error('Test Execution Finished with Error:', err);
});
