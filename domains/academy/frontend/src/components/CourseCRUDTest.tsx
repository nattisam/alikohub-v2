import React, { useState } from "react";
import { courseApi } from "../api/courseApi";
import { useUser } from "../hooks/useUser";

const CourseCRUDTest: React.FC = () => {
  const { currentUser } = useUser();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [moduleId, setModuleId] = useState<number | null>(null);
  const [lessonId, setLessonId] = useState<number | null>(null);

  const logResult = (message: string) => {
    setTestResults(prev => [...prev, message]);
  };

  const testCreateCourse = async () => {
    try {
      const courseData = {
        title: "Test Course",
        shortDescription: "A test course",
        longDescription: "This is a comprehensive test course for testing CRUD operations",
        category: "Technology",
        status: "DRAFT",
        skills: ["React", "TypeScript"],
        conceptsLearned: ["CRUD Operations", "API Integration"],
        prerequisites: [],
        languages: ["En"]
      };

      const response = await courseApi.createCourse(courseData);
      setCourseId(response.data.id);
      logResult(`✓ Course created with ID: ${response.data.id}`);
    } catch (error) {
      logResult(`✗ Error creating course: ${error}`);
    }
  };

  const testGetCourses = async () => {
    try {
      const response = await courseApi.getCourses();
      logResult(`✓ Retrieved ${response.data.items?.length || response.data.length} courses`);
    } catch (error) {
      logResult(`✗ Error getting courses: ${error}`);
    }
  };

  const testCreateModule = async () => {
    if (!courseId) {
      logResult("✗ No course ID available. Create a course first.");
      return;
    }

    try {
      const moduleData = {
        title: "Test Module",
        description: "A test module for testing",
        courseId: courseId
      };

      const response = await courseApi.createModule(moduleData);
      setModuleId(response.data.id);
      logResult(`✓ Module created with ID: ${response.data.id}`);
    } catch (error) {
      logResult(`✗ Error creating module: ${error}`);
    }
  };

  const testCreateLesson = async () => {
    if (!moduleId) {
      logResult("✗ No module ID available. Create a module first.");
      return;
    }

    try {
      const lessonData = {
        title: "Test Lesson",
        type: "TEXT",
        moduleId: moduleId
      };

      const response = await courseApi.createLesson(lessonData);
      setLessonId(response.data.id);
      logResult(`✓ Lesson created with ID: ${response.data.id}`);
    } catch (error) {
      logResult(`✗ Error creating lesson: ${error}`);
    }
  };

  const testCreateContent = async () => {
    if (!lessonId) {
      logResult("✗ No lesson ID available. Create a lesson first.");
      return;
    }

    try {
      const contentData = {
        title: "Test Content",
        type: "TEXT",
        url: "https://example.com/content",
        lessonId: lessonId
      };

      const response = await courseApi.createContent(contentData);
      logResult(`✓ Content created with ID: ${response.data.id}`);
    } catch (error) {
      logResult(`✗ Error creating content: ${error}`);
    }
  };

  const testDeleteContent = async () => {
    if (!lessonId) {
      logResult("✗ No content to delete. Create content first.");
      return;
    }

    // For testing purposes, we'll skip actual deletion
    logResult("ℹ Content deletion test skipped (to preserve test data)");
  };

  const testDeleteLesson = async () => {
    if (!lessonId) {
      logResult("✗ No lesson to delete. Create a lesson first.");
      return;
    }

    // For testing purposes, we'll skip actual deletion
    logResult("ℹ Lesson deletion test skipped (to preserve test data)");
  };

  const testDeleteModule = async () => {
    if (!moduleId) {
      logResult("✗ No module to delete. Create a module first.");
      return;
    }

    // For testing purposes, we'll skip actual deletion
    logResult("ℹ Module deletion test skipped (to preserve test data)");
  };

  const testDeleteCourse = async () => {
    if (!courseId) {
      logResult("✗ No course to delete. Create a course first.");
      return;
    }

    // For testing purposes, we'll skip actual deletion
    logResult("ℹ Course deletion test skipped (to preserve test data)");
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Only show this component for instructors and admins
  if (currentUser?.role !== "INSTRUCTOR" && currentUser?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6">Course CRUD Operations Test</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Create Operations</h3>
          <div className="space-y-2">
            <button 
              onClick={testCreateCourse}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create Course
            </button>
            <button 
              onClick={testCreateModule}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Create Module
            </button>
            <button 
              onClick={testCreateLesson}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Create Lesson
            </button>
            <button 
              onClick={testCreateContent}
              className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Create Content
            </button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Read & Delete Operations</h3>
          <div className="space-y-2">
            <button 
              onClick={testGetCourses}
              className="w-full px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              Get All Courses
            </button>
            <button 
              onClick={testDeleteContent}
              className="w-full px-4 py-2 bg-red-400 text-white rounded hover:bg-red-500"
            >
              Delete Content
            </button>
            <button 
              onClick={testDeleteLesson}
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete Lesson
            </button>
            <button 
              onClick={testDeleteModule}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete Module
            </button>
            <button 
              onClick={testDeleteCourse}
              className="w-full px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
            >
              Delete Course
            </button>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Test Results</h3>
          <button 
            onClick={clearResults}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
          >
            Clear
          </button>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg h-64 overflow-y-auto">
          {testResults.length > 0 ? (
            <ul className="space-y-1">
              {testResults.map((result, index) => (
                <li key={index} className="font-mono text-sm">
                  {result.startsWith('✓') && <span className="text-green-600">{result}</span>}
                  {result.startsWith('✗') && <span className="text-red-600">{result}</span>}
                  {result.startsWith('ℹ') && <span className="text-blue-600">{result}</span>}
                  {!(result.startsWith('✓') || result.startsWith('✗') || result.startsWith('ℹ')) && result}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No test results yet. Run some tests above.</p>
          )}
        </div>
      </div>
      
      <div className="text-sm text-gray-600">
        <p><strong>Note:</strong> Delete operations are skipped to preserve test data.</p>
        <p>Current User Role: {currentUser?.role}</p>
        {courseId && <p>Course ID: {courseId}</p>}
        {moduleId && <p>Module ID: {moduleId}</p>}
        {lessonId && <p>Lesson ID: {lessonId}</p>}
      </div>
    </div>
  );
};

export default CourseCRUDTest;