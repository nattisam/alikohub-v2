import { FaImage } from "react-icons/fa";
import type { Course } from "./types.d";
import { academyApi } from "../api";

interface CourseDetailsFormProps {
  course: Partial<Course>;
  onChange: (course: Partial<Course>) => void;
}

const CourseDetailsForm: React.FC<CourseDetailsFormProps> = ({ course, onChange }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange({ ...course, [name]: value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        // Upload via API client to Cloudinary-backed endpoint
        const response = await academyApi.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        const result = response.data;
        console.log("File upload successful:", result);
        onChange({ ...course, thumbnail: result.url });
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Image upload failed. Please try again.');
      }
    }
  };

  // Log the current course state for debugging
  console.log("CourseDetailsForm - Current course state:", course);

  return (
    <>
      <div className="flex flex-col space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-gray-700">
          Course Title
        </label>
        <input
          id="title"
          type="text"
          name="title"
          autoFocus={true}
          placeholder="Enter course title"
          value={course.title ?? ""}
          onChange={handleChange}
          required
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="longDescription" className="text-sm font-medium text-gray-700">
          Long Description
        </label>
        <textarea
          id="longDescription"
          name="longDescription"
          placeholder="Enter detailed course description"
          value={course.longDescription ?? ""}
          onChange={handleChange}
          required
          rows={5}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="shortDescription" className="text-sm font-medium text-gray-700">
          Short Description
        </label>
        <input
          id="shortDescription"
          type="text"
          name="shortDescription"
          placeholder="Enter short description"
          value={course.shortDescription ?? ""}
          onChange={handleChange}
          required
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="thumbnail" className="text-sm font-medium text-gray-700 flex items-center">
          <FaImage className="mr-2 h-4 w-4" /> Course Thumbnail
        </label>
        <input
          id="thumbnail"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="px-4 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {course.thumbnail && (
          <div className="mt-2">
            <img 
              src={course.thumbnail} 
              alt="Course thumbnail preview" 
              className="w-32 h-32 object-cover rounded-lg border"
            />
            <p className="text-sm text-gray-500 mt-1">Thumbnail URL: {course.thumbnail}</p>
          </div>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="category" className="text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={course.category ?? "Technology"}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Technology">Technology</option>
          <option value="STEM">STEM</option>
          <option value="Health">Health</option>
        </select>
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="subCategory" className="text-sm font-medium text-gray-700">
          Subcategory
        </label>
        <input
          id="subCategory"
          type="text"
          name="subCategory"
          placeholder="Enter subcategory"
          value={course.subCategory ?? ""}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="status" className="text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={course.status ?? "DRAFT"}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="estimatedTime" className="text-sm font-medium text-gray-700">
          Estimated Time (hours)
        </label>
        <input
          id="estimatedTime"
          type="number"
          name="estimatedTime"
          placeholder="Enter estimated time"
          value={course.estimatedTime ?? ""}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="targetLevel" className="text-sm font-medium text-gray-700">
          Target Level
        </label>
        <input
          id="targetLevel"
          type="text"
          name="targetLevel"
          placeholder="Enter target level"
          value={course.targetLevel ?? ""}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="price" className="text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          id="price"
          type="number"
          name="price"
          placeholder="Enter price"
          value={course.price ?? ""}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="enrolledNum" className="text-sm font-medium text-gray-700">
          Enrollment Information
        </label>
        <input
          id="enrolledNum"
          type="number"
          name="enrolledNum"
          placeholder="Number of enrolled students"
          value={course.enrolledNum ?? ""}
          onChange={handleChange}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </>
  );
};

export default CourseDetailsForm;