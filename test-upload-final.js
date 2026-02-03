// This test uses existing data from the database to test the upload endpoint
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJnTFFuaWNmQlU2ZndTeU45ZzhldTJxTmh5ejMyIiwiaWQiOjI0LCJlbWFpbCI6InRlY2hlckBnbWFpbC5jb20iLCJmaXJzdG5hbWUiOiJ0ZWNoZXIiLCJsYXN0bmFtZSI6IkRvZSIsImdsb2JhbFJvbGUiOiJVU0VSIiwic3RhdHVzIjoiQUNUSVZFIiwiYWNhZGVteVJvbGUiOiJJTlNUUlVDVE9SIiwiYWNhZGVteUFjdGl2ZVJvbGUiOiJJTlNUUlVDVE9SIiwiYWNhZGVteVN0YXR1cyI6IkFDVElWRSIsImNvbnRlY2hSb2xlIjoiQ0xJRU5UIiwiY29udGVjaFN0YXR1cyI6IkFDVElWRSIsImV2ZW50c1JvbGUiOiJVU0VSIiwiZXZlbnRzU3RhdHVzIjoiQUNUSVZFIiwiaWF0IjoxNzcwMDMyMzcwLCJleHAiOjE3NzAwMzU5NzB9.LGx6UUG3aSIPJCNtnTrK0xdb-YWdT7Etpnqn3Ek7bUE';
const baseUrl = 'http://localhost:3006';
import fs from 'fs';

// Use existing lesson ID from database (from fetch-data.js output)
const lessonId = 5; // The lesson ID created in test-creation.js

async function testUpload() {
  console.log('--- Starting Content Upload Test ---');
  console.log(`Using existing Lesson ID: ${lessonId}`);

  // Perform Upload
  console.log('\n[!] Sending Upload Request...');
  const formData = new FormData();
  formData.append('lessonId', lessonId.toString());
  formData.append('title', 'Test PDF Content ' + Date.now());
  formData.append('type', 'PDF');
  
  // Create a simple test file
  const fileContent = Buffer.from('This is test PDF content for upload testing');
  const blob = new Blob([fileContent], { type: 'application/pdf' });
  formData.append('file', blob, 'test-document.pdf');

  const uploadRes = await fetch(`${baseUrl}/academy/content/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const uploadResult = await uploadRes.json();
  console.log('\n--- Upload Response ---');
  console.log('Status:', uploadRes.status);
  console.log('Body:', JSON.stringify(uploadResult, null, 2));
  
  if (uploadRes.ok) {
    console.log('\n✅ SUCCESS: Content uploaded successfully!');
  } else {
    console.error('\n❌ FAILED: Upload failed');
  }
}

testUpload().catch(console.error);
