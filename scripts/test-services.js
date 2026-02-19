const axios = require('axios');

async function testServices() {
  const loginUrl = 'http://localhost:3006/auth/login';
  const academyUrl = 'http://localhost:3006/academy/courses';
  const careersUrl = 'http://localhost:3006/careers/jobs'; // Assuming /jobs exists

  try {
    console.log('Logging in as admin...');
    const loginRes = await axios.post(loginUrl, {
      email: 'admin@alikohub.com',
      password: 'AdminPassword123!'
    });

    const token = loginRes.data.accessToken;
    console.log('Login success. Token obtained.');

    const headers = { Authorization: `Bearer ${token}` };

    console.log('\nTesting Academy Service (GET /academy/courses)...');
    try {
        const academyRes = await axios.get(academyUrl, { headers });
        console.log('Academy Response:', academyRes.status, academyRes.data);
    } catch (e) {
        console.error('Academy Request Failed:', e.response ? e.response.status : e.message, e.response ? e.response.data : '');
    }

    console.log('\nTesting Careers Service (GET /careers/jobs)...');
    try {
        const careersRes = await axios.get(careersUrl, { headers });
        console.log('Careers Response:', careersRes.status, careersRes.data);
    } catch (e) {
        // If /jobs doesn't exist, maybe try /careers/all-jobs or check controller methods
        console.error('Careers Request Failed:', e.response ? e.response.status : e.message, e.response ? e.response.data : '');
        
        console.log('Trying alternative Careers endpoint (/careers/jobs/all)...');
        try {
            const altRes = await axios.get('http://localhost:3006/careers/jobs/all', { headers });
            console.log('Careers Alt Response:', altRes.status, altRes.data);
        } catch (e2) {
             console.error('Careers Alt Request Failed:', e2.response ? e2.response.status : e2.message);
        }
    }

  } catch (error) {
    console.error('Global Error:', error.message);
  }
}

testServices();
