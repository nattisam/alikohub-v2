import { FaSpinner, FaUpload, FaInfoCircle } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { academyApi } from "../api";
import type { Course } from "./types.d.tsx";
import React, { useState, useEffect } from "react";
import { useInstructorCourses } from "../hooks/useInstructorCourses";

interface EditCourseFormProps {
  course: Course;
  onSubmit: (updatedCourse: Course) => void;
  onClose: () => void;
}

const EditCourseForm: React.FC<EditCourseFormProps> = ({
  course,
  onClose,
  onSubmit,
}) => {
  const { updatingCourse } = useInstructorCourses();
  const [formData, setFormData] = useState<Course>({
    ...course,
    skills: course.skills ?? [],
    conceptsLearned: course.conceptsLearned ?? [],
    prerequisites: course.prerequisites ?? [],
    languages: course.languages ?? [],
  });

  const [arrayInputs, setArrayInputs] = useState<{
    skills: string;
    conceptsLearned: string;
    prerequisites: string;
    languages: string;
  }>({
    skills: "",
    conceptsLearned: "",
    prerequisites: "",
    languages: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof arrayInputs
  ) => {
    const { value } = e.target;
    setArrayInputs((prev) => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (
    field: keyof Pick<
      Course,
      "skills" | "conceptsLearned" | "prerequisites" | "languages"
    >,
    inputField: keyof typeof arrayInputs
  ) => {
    const value = arrayInputs[inputField].trim();
    if (value) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...((prev[field] as string[] | undefined) ?? []), value],
      }));
      setArrayInputs((prev) => ({ ...prev, [inputField]: "" }));
    }
  };

  const removeArrayItem = (
    field: keyof Pick<
      Course,
      "skills" | "conceptsLearned" | "prerequisites" | "languages"
    >,
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: ((prev[field] as string[] | undefined) ?? []).filter(
        (_, i) => i !== index
      ),
    }));
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
        // Update the course with the uploaded Cloudinary URL
        setFormData((prev) => ({ ...prev, thumbnail: result.url }));
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Image upload failed. Please try again.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedCourse: Course = {
      ...formData,
      title: formData.title ?? "",
      longDescription: formData.longDescription ?? "",
      shortDescription: formData.shortDescription ?? "",
      category: formData.category ?? "Technology",
      subCategory: formData.subCategory,
      instructorId: formData.instructorId ?? "inst_001",
      status: formData.status ?? "DRAFT",
      skills: formData.skills ?? [],
      conceptsLearned: formData.conceptsLearned ?? [],
      estimatedTime: formData.estimatedTime ?? null,
      targetLevel: formData.targetLevel ?? null,
      enrolledNum: formData.enrolledNum ?? 0,
      rating: formData.rating ?? null,
      price: formData.price ?? null,
      progress: formData.progress ?? null,
      prerequisites: formData.prerequisites ?? [],
      languages: formData.languages ?? [],
      updatedAt: new Date().toISOString(),
    };
    
    // Call the onSubmit function and check the result
    await onSubmit(updatedCourse);
    
    // Close the form modal and return to dashboard
    onClose();
  };

  const renderArrayInput = (
    field: keyof Pick<
      Course,
      "skills" | "conceptsLearned" | "prerequisites" | "languages"
    >,
    label: string,
    inputField: keyof typeof arrayInputs
  ) => (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center">
        {label}
        <FaInfoCircle className="ml-2 text-gray-400" title={`Enter ${label.toLowerCase()} related to this course`} />
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {(formData[field] ?? []).map((item: string, index: number) => (
          <span
            key={`${field}-${index}`}
            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 font-medium"
          >
            {item}
            <button
              type="button"
              onClick={() => removeArrayItem(field, index)}
              className="ml-2 text-red-500 hover:text-red-700 font-bold"
              aria-label={`Remove ${item}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={arrayInputs[inputField]}
          onChange={(e) => handleArrayInputChange(e, inputField)}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        <button
          type="button"
          onClick={() => addArrayItem(field, inputField)}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 font-medium transition-all shadow hover:shadow-md"
        >
          Add
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">Edit Course</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaXmark size={24} className="text-gray-600" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">
                Course Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="Enter course title"
                value={formData.title ?? ""}
                onChange={handleChange}
                required
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="category"
                className="text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category ?? "Technology"}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="Technology">Technology</option>
                <option value="STEM">STEM</option>
                <option value="Health">Health</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="longDescription"
              className="text-sm font-medium text-gray-700"
            >
              Long Description
            </label>
            <textarea
              id="longDescription"
              name="longDescription"
              placeholder="Enter detailed course description"
              value={formData.longDescription ?? ""}
              onChange={handleChange}
              required
              rows={5}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="shortDescription"
              className="text-sm font-medium text-gray-700"
            >
              Short Description
            </label>
            <input
              id="shortDescription"
              type="text"
              name="shortDescription"
              placeholder="Enter short description"
              value={formData.shortDescription ?? ""}
              onChange={handleChange}
              required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="thumbnail"
              className="text-sm font-medium text-gray-700"
            >
              Course Thumbnail
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex flex-col items-center justify-center w-full md:w-64 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FaUpload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                </div>
                <input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {formData.thumbnail && (
                <div className="flex-1">
                  <img
                    src={formData.thumbnail}
                    alt="Course thumbnail"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <p className="text-xs text-gray-500 mt-2 truncate max-w-xs">URL: {formData.thumbnail}</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="subCategory"
                className="text-sm font-medium text-gray-700"
              >
                Subcategory
              </label>
              <input
                id="subCategory"
                type="text"
                name="subCategory"
                placeholder="Enter subcategory"
                value={formData.subCategory ?? ""}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="status" className="text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status ?? "DRAFT"}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="estimatedTime"
                className="text-sm font-medium text-gray-700"
              >
                Estimated Time (hours)
              </label>
              <input
                id="estimatedTime"
                type="number"
                name="estimatedTime"
                placeholder="Enter estimated time"
                value={formData.estimatedTime ?? ""}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="targetLevel"
                className="text-sm font-medium text-gray-700"
              >
                Target Level
              </label>
              <select
                id="targetLevel"
                name="targetLevel"
                value={formData.targetLevel ?? ""}
                onChange={handleChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Select level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-6">
            {renderArrayInput("skills", "Skills", "skills")}
            {renderArrayInput(
              "conceptsLearned",
              "Concepts Learned",
              "conceptsLearned"
            )}
            {renderArrayInput("prerequisites", "Prerequisites", "prerequisites")}
            {renderArrayInput("languages", "Languages", "languages")}
          </div>

          <button
            type="submit"
            disabled={updatingCourse.loading}
            className={`w-full py-3.5 text-white rounded-lg transition-all font-medium flex items-center justify-center ${
              updatingCourse.loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg hover:shadow-xl"
            }`}
          >
            {updatingCourse.loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Updating...
              </>
            ) : (
              "Update Course"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCourseForm;