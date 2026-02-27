const BASE_URL = 'http://127.0.0.1:3006';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJnTFFuaWNmQlU2ZndTeU45ZzhldTJxTmh5ejMyIiwiaWQiOjI0LCJlbWFpbCI6InRlY2hlckBnbWFpbC5jb20iLCJmaXJzdG5hbWUiOiJ0ZWNoZXIiLCJsYXN0bmFtZSI6IkRvZSIsImdsb2JhbFJvbGUiOiJVU0VSIiwic3RhdHVzIjoiQUNUSVZFIiwiYWNhZGVteVJvbGUiOiJJTlNUUlVDVE9SIiwiYWNhZGVteUFjdGl2ZVJvbGUiOiJJTlNUUlVDVE9SIiwiYWNhZGVteVN0YXR1cyI6IkFDVElWRSIsImNvbnRlY2hSb2xlIjoiQ0xJRU5UIiwiY29udGVjaFN0YXR1cyI6IkFDVElWRSIsImV2ZW50c1JvbGUiOiJVU0VSIiwiZXZlbnRzU3RhdHVzIjoiQUNUSVZFIiwiaWF0IjoxNzcwMTkxMTE3LCJleHAiOjE3NzAxOTQ3MTd9.CjmRw1RokKidu1uQJ7G6zdN7_OC8Ghkui1itfHJ3GM4';

async function testProfile() {
    console.log(`\nTesting ${BASE_URL}/users/profile with provided token...`);
    try {
        const response = await fetch(`${BASE_URL}/users/profile`, {
            headers: { 'Authorization': `Bearer ${TOKEN}` }
        });
        
        console.log(`Status: ${response.status} ${response.statusText}`);
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Fetch error:', error.message);
    }
}

testProfile();
