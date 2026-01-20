import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCreateCourse } from "../../queries/instructorCourses";
import type { Course } from "../../components/common/types.d";

interface CourseData {
  title: string;
  shortDescription: string;
  longDescription: string;
  thumbnail: string;
  category: string;
  status: string;
}

const InstructorCreateCourse: React.FC = () => {
  const [course, setCourse] = useState<CourseData>({
    title: "",
    shortDescription: "",
    longDescription: "",
    thumbnail: "",
    category: "",
    status: "PUBLISHED",
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const createCourseMutation = useCreateCourse();
  
  // Check if user is an instructor
  const { user: currentUser, isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    
    if (!currentUser || !currentUser.academyUser || currentUser.academyActiveRole !== 'INSTRUCTOR') {
      alert('Access denied. You must be logged in as an instructor to create a course.');
      navigate('/dashboard');
      return;
    }
  }, [currentUser, isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get instructor ID from auth context
      const storedUser = window.localStorage.getItem('user');
      if (!storedUser) {
        alert("User session not found. Please log in again.");
        return;
      }
      
      const user = JSON.parse(storedUser);
      const instructorId = user.academyUser?.id;
      
      if (!instructorId) {
        alert("Instructor ID not found. Please make sure you're logged in as an instructor.");
        return;
      }
      
      // Prepare course data with only the fields the backend expects
      // Based on working Postman request: title, shortDescription, longDescription, thumbnail, category, status
      const courseData = {
        title: course.title,
        shortDescription: course.shortDescription,
        longDescription: course.longDescription,
        thumbnail: course.thumbnail,
        category: course.category,
        status: course.status,
      };
      
      console.log("Sending course data:", courseData); // Debug log
      
      const response = await createCourseMutation.mutateAsync(courseData as Partial<Course>);
      console.log("Create course response:", response); // Debug log
      
      const courseId = response.id || response.data?.id || -1;
      
      if (courseId > 0) {
        alert("Course created successfully!");
        navigate("/instructor/mycourses");
      } else {
        alert("Failed to create course. Please try again.");
      }
    } catch (error: any) {
      console.error("Error creating course:", error);
      
      // More specific error handling
      let errorMessage = "Failed to create course. Please try again.";
      
      if (error.response) {
        // Server responded with error status
        console.error("Server error:", error.response.status, error.response.data);
        if (error.response.data?.message) {
          errorMessage = `Error: ${error.response.data.message}`;
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error("Network error:", error.request);
        errorMessage = "Network error. Please check your connection and try again.";
      } else {
        // Something else happened
        console.error("Request setup error:", error.message);
        errorMessage = `Request error: ${error.message}`;
      }
      
      alert(errorMessage);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Course</h1>
          <p className="text-gray-500">
            Create and set up a new course for your students.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={course.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter course title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description
            </label>
            <input
              type="text"
              name="shortDescription"
              value={course.shortDescription}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter short description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Long Description
            </label>
            <textarea
              name="longDescription"
              value={course.longDescription}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter detailed course description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail URL
            </label>
            <input
              type="text"
              name="thumbnail"
              value={course.thumbnail}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter thumbnail URL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={course.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              <option value="STEM">STEM</option>
              <option value="Health">Health</option>
              <option value="Technology">Technology</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={course.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/instructor")}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createCourseMutation.isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createCourseMutation.isPending ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstructorCreateCourse;