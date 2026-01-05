import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      const response = await createCourseMutation.mutateAsync(course as Partial<Course>);
      const courseId = response.data?.id || -1;
      
      if (courseId > 0) {
        alert("Course created successfully!");
        navigate("/instructor/mycourses");
      } else {
        alert("Failed to create course. Please try again.");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course. Please try again.");
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
              name="status"
              value={course.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
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