const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJnTFFuaWNmQlU2ZndTeU45ZzhldTJxTmh5ejMyIiwiaWQiOjI0LCJlbWFpbCI6InRlY2hlckBnbWFpbC5jb20iLCJmaXJzdG5hbWUiOiJ0ZWNoZXIiLCJsYXN0bmFtZSI6IkRvZSIsImdsb2JhbFJvbGUiOiJVU0VSIiwic3RhdHVzIjoiQUNUSVZFIiwiYWNhZGVteVJvbGUiOiJJTlNUUlVDVE9SIiwiYWNhZGVteUFjdGl2ZVJvbGUiOiJJTlNUUlVDVE9SIiwiYWNhZGVteVN0YXR1cyI6IkFDVElWRSIsImNvbnRlY2hSb2xlIjoiQ0xJRU5UIiwiY29udGVjaFN0YXR1cyI6IkFDVElWRSIsImV2ZW50c1JvbGUiOiJVU0VSIiwiZXZlbnRzU3RhdHVzIjoiQUNUSVZFIiwiaWF0IjoxNzcwMDk4NjYwLCJleHAiOjE3NzAxMDIyNjB9.tODFEmARceh7IitxEa_Uhra3ftHHEC3R9BjmTZD7OAM';
const baseUrl = 'http://localhost:3006'; // API Gateway port

async function testAcademyEndpoints() {
    console.log('--- Starting Academy Endpoints Test ---');

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    try {
        // 1. Create Course
        console.log('\n[1] Creating Course...');
        const courseRes = await fetch(`${baseUrl}/academy/courses`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                title: 'Test Course ' + Date.now(),
                category: 'Test Category',
                status: 'PUBLISHED',
                shortDescription: 'Short description for test course',
                longDescription: 'Long description for test course',
                price: 0
            })
        });

        const courseData = await courseRes.json();
        console.log('Create Course Status:', courseRes.status);
        if (!courseRes.ok) {
            console.error('Course Creation Failed:', JSON.stringify(courseData, null, 2));
            return; // Stop if course creation fails
        }
        console.log('Course ID:', courseData.id);


        // 2. Create Module
        console.log('\n[2] Creating Module...');
        const moduleRes = await fetch(`${baseUrl}/academy/modules`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                title: 'Test Module',
                description: 'Test module description',
                courseId: courseData.id
            })
        });

        const moduleData = await moduleRes.json();
        console.log('Create Module Status:', moduleRes.status);
        if (!moduleRes.ok) {
            console.error('Module Creation Failed:', JSON.stringify(moduleData, null, 2));
            return;
        }
        console.log('Module ID:', moduleData.id);

        // 3. Create Lesson
        console.log('\n[3] Creating Lesson...');
        const lessonRes = await fetch(`${baseUrl}/academy/lessons`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                title: 'Test Lesson',
                type: 'VIDEO',
                moduleId: moduleData.id,
                order: 1
            })
        });

        const lessonData = await lessonRes.json();
        console.log('Create Lesson Status:', lessonRes.status);
        if (!lessonRes.ok) {
            console.error('Lesson Creation Failed:', JSON.stringify(lessonData, null, 2));
            return;
        }
        console.log('Lesson ID:', lessonData.id);

        // 4. Create Exercise
        console.log('\n[4] Creating Exercise...');
        const exerciseRes = await fetch(`${baseUrl}/academy/exercises`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                title: 'Test Exercise',
                type: 'QUIZ',
                lessonId: lessonData.id,
                maxScore: 100,
                content: {
                    questions: [
                        {
                            question: 'What is 2+2?',
                            options: ['3', '4', '5'],
                            correctAnswer: '4'
                        }
                    ]
                }
            })
        });
        
        const exerciseData = await exerciseRes.json();
        console.log('Create Exercise Status:', exerciseRes.status);
        
        if (!exerciseRes.ok) {
            console.error('Exercise Creation Failed:', JSON.stringify(exerciseData, null, 2));
        } else {
             console.log('Exercise ID:', exerciseData.id);
        }

    } catch (error) {
        console.error('Test Execution Error:', error);
    }
}

testAcademyEndpoints();
