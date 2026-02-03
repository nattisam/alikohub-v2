// Test what happens when lessonId is sent as literal "{{lessonId}}"
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJnTFFuaWNmQlU2ZndTeU45ZzhldTJxTmh5ejMyIiwiaWQiOjI0LCJlbWFpbCI6InRlY2hlckBnbWFpbC5jb20iLCJmaXJzdG5hbWUiOiJ0ZWNoZXIiLCJsYXN0bmFtZSI6IkRvZSIsImdsb2JhbFJvbGUiOiJVU0VSIiwic3RhdHVzIjoiQUNUSVZFIiwiYWNhZGVteVJvbGUiOiJJTlNUUlVDVE9SIiwiYWNhZGVteUFjdGl2ZVJvbGUiOiJJTlNUUlVDVE9SIiwiYWNhZGVteVN0YXR1cyI6IkFDVElWRSIsImNvbnRlY2hSb2xlIjoiQ0xJRU5UIiwiY29udGVjaFN0YXR1cyI6IkFDVElWRSIsImV2ZW50c1JvbGUiOiJVU0VSIiwiZXZlbnRzU3RhdHVzIjoiQUNUSVZFIiwiaWF0IjoxNzcwMDMyMzcwLCJleHAiOjE3NzAwMzU5NzB9.LGx6UUG3aSIPJCNtnTrK0xdb-YWdT7Etpnqn3Ek7bUE';
const baseUrl = 'http://localhost:3006';

async function testBadLessonId() {
  console.log('--- Testing with invalid lessonId "{{lessonId}}" ---');

  const formData = new FormData();
  formData.append('lessonId', '{{lessonId}}'); // Simulates unresolved Postman variable
  formData.append('title', 'Test PDF');
  formData.append('type', 'PDF');
  
  const fileContent = Buffer.from('Test PDF content');
  const blob = new Blob([fileContent], { type: 'application/pdf' });
  formData.append('file', blob, 'test.pdf');

  const res = await fetch(`${baseUrl}/academy/content/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });

  const result = await res.json();
  console.log('Status:', res.status);
  console.log('Response:', JSON.stringify(result, null, 2));
}

testBadLessonId().catch(console.error);
