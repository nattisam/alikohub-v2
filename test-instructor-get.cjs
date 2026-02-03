// Using native fetch supported in Node.js 18+

const BASE_URL = 'http://127.0.0.1:3006';
let token = '';

async function login() {
    console.log('Logging in...');
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'techer@gmail.com',
            password: 'Password@123'
        })
    });
    const data = await response.json();
    token = data.accessToken || data.token || data.firebaseCustomToken;
    if (token) {
        console.log('Login successful');
    } else {
        console.error('Login failed. Keys in response:', Object.keys(data));
        console.error('Response data:', JSON.stringify(data, null, 2));
        process.exit(1);
    }
}

async function testEndpoint(name, path, query = '') {
    console.log(`\nTesting ${name}: ${path}${query}`);
    const response = await fetch(`${BASE_URL}${path}${query}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (response.ok) {
        console.log(`Success:`, {
            total: data.total,
            itemCount: data.items ? data.items.length : (Array.isArray(data) ? data.length : 'N/A'),
            firstItemTitle: data.items && data.items[0] ? data.items[0].title : (Array.isArray(data) && data[0] ? data[0].title : 'N/A')
        });
        if (data.page) console.log(`Pagination: page ${data.page}/${data.totalPages}`);
    } else {
        console.error(`Failed ${response.status}:`, data);
    }
}

async function runTests() {
    await login();

    // 1. Instructor's My Courses
    await testEndpoint('My Courses', '/academy/courses/instructor/my');
    await testEndpoint('My Courses (Filtered/Paginated)', '/academy/courses/instructor/my', '?page=1&pageSize=2&status=DRAFT');

    // 2. Instructor's Stats
    await testEndpoint('Course Stats', '/academy/courses/instructor/stats');

    // 3. Instructor's My Lessons
    await testEndpoint('My Lessons', '/academy/lessons/instructor/my');

    // 4. Instructor's My Exercises
    await testEndpoint('My Exercises', '/academy/exercises/instructor/my');

    // 5. Instructor's My Content
    await testEndpoint('My Content', '/academy/content/instructor/my');

    // 6. Instructor's My Cohorts
    await testEndpoint('My Cohorts', '/academy/cohorts/instructor/my');

    // 7. Instructor's My Enrollments
    await testEndpoint('My Enrollments', '/academy/enrollment/instructor/my');

    // 8. Paginated Modules for a course (Assuming we have a course ID from previous tests, e.g., 1)
    // We'll try to find a course ID first
    const coursesRes = await fetch(`${BASE_URL}/academy/courses/instructor/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const coursesData = await coursesRes.json();
    if (coursesData.items && coursesData.items.length > 0) {
        const courseId = coursesData.items[0].id;
        await testEndpoint('Modules for Course', `/academy/modules/course/${courseId}`, '?pageSize=1');
        await testEndpoint('Cohorts for Course', `/academy/cohorts?courseId=${courseId}`);
        await testEndpoint('Enrollments for Course', `/academy/enrollment/course/${courseId}`);
    }
}

runTests();
