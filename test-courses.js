async function test() {
  const registerRes = await fetch('http://localhost:3006/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `tester_${Date.now()}@test.com`,
      firstname: 'Test',
      lastname: 'User',
      password: 'Password123!'
    })
  });
  
  const regData = await registerRes.json();
  console.log('Register status:', registerRes.status);
  
  if (registerRes.status !== 201) {
      console.log('Register error:', regData);
      return;
  }

  const token = regData.accessToken;
  console.log('Token received');

  const coursesRes = await fetch('http://localhost:3006/academy/courses?page=1&pageSize=10', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const coursesData = await coursesRes.json();
  console.log('Courses status:', coursesRes.status);
  console.log('Courses data:', JSON.stringify(coursesData, null, 2));
}

test().catch(console.error);
