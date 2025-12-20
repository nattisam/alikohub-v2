import React, { useState } from "react";
import { FaPlus, FaSpinner, FaTrash, FaUpload, FaInfoCircle } from "react-icons/fa";
import type { Course } from "./types.d";

import ArrayInput from "./ArrayInput";
import ModuleList from "./ModuleList";
import ModuleInput from "./ModuleInput";
import CourseDetailsForm from "./CourseDetailsForm";
import { useInstructorCourses } from "../hooks/useInstructorCourses";
import { FaXmark } from "react-icons/fa6";  // Changed from FaX to FaXmark
import { academyApi } from "../api";

interface CreateCourseFormProps {
  onClose: () => void;
}

const CreateCourseForm: React.FC<CreateCourseFormProps> = ({ onClose }) => {
  const { createCourse, creatingCourse } = useInstructorCourses();
  const [course, setCourse] = useState<Partial<Course>>({
    title: "",
    longDescription: "",
    shortDescription: "",
    category: "Technology",
    subCategory: "",
    // Set status to PUBLISHED by default so courses appear on homepage immediately
    status: "PUBLISHED",
    skills: [],
    conceptsLearned: [],
    estimatedTime: null,
    targetLevel: "",
    price: null,
    enrolledNum: 0,
    prerequisites: [],
    languages: [],
    // Add the new field for cohort creation
    createDefaultCohort: false,
  });

  const [modules, setModules] = useState<any[]>([]);
  const [creatingModules, setCreatingModules] = useState(false);

  const handleAddArrayItem = (
    field: keyof Pick<
      Course,
      "skills" | "conceptsLearned" | "prerequisites" | "languages"
    >,
    item: string
  ) => {
    setCourse((prev) => ({
      ...prev,
      [field]: [...((prev[field] as string[] | undefined) ?? []), item],
    }));
  };

  const handleRemoveArrayItem = (
    field: keyof Pick<
      Course,
      "skills" | "conceptsLearned" | "prerequisites" | "languages"
    >,
    index: number
  ) => {
    setCourse((prev) => ({
      ...prev,
      [field]: ((prev[field] as string[] | undefined) ?? []).filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleAddModule = (module: any) => {
    // Generate a temporary ID for new modules
    const newModule = {
      ...module,
      id: Date.now(), // Temporary ID
      lessons: module.lessons || [],
    };
    setModules((prev) => [...prev, newModule]);
  };

  const handleRemoveModule = (moduleId: number) => {
    setModules((prev) => prev.filter((module) => module.id !== moduleId));
  };

  const handleAddLesson = (moduleId: number, lesson: any) => {
    setModules((prev) =>
      prev.map((module) =>
        module.id === moduleId
          ? { 
              ...module, 
              lessons: [...module.lessons, { ...lesson, id: Date.now() }] // Temporary ID
            }
          : module
      )
    );
  };

  const handleRemoveLesson = (moduleId: number, lessonId: number) => {
    setModules((prev) =>
      prev.map((module) =>
        module.id === moduleId
          ? { 
              ...module, 
              lessons: module.lessons.filter((lesson: any) => lesson.id !== lessonId)
            }
          : module
      )
    );
  };

  const handleAddContent = (
    moduleId: number,
    lessonId: number,
    content: any
  ) => {
    setModules((prev) =>
      prev.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map((lesson: any) =>
                lesson.id === lessonId
                  ? { 
                      ...lesson, 
                      contents: [...(lesson.contents || []), { ...content, id: Date.now() }] // Temporary ID
                    }
                  : lesson
              ),
            }
          : module
      )
    );
  };

  const handleRemoveContent = (
    moduleId: number,
    lessonId: number,
    contentId: number
  ) => {
    setModules((prev) =>
      prev.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map((lesson: any) =>
                lesson.id === lessonId
                  ? { 
                      ...lesson, 
                      contents: (lesson.contents || []).filter((content: any) => content.id !== contentId)
                    }
                  : lesson
              ),
            }
          : module
      )
    );
  };

  const createModuleWithLessons = async (courseId: number, modules: any[]) => {
    try {
      setCreatingModules(true);
      
      // Create each module
      for (const module of modules) {
        const moduleData = {
          title: module.title,
          description: module.description,
          courseId: courseId,
        };
        
        const moduleResponse = await academyApi.post('/modules', moduleData);
        const createdModuleId = moduleResponse.data.id;
        
        // Create lessons for this module
        for (const lesson of module.lessons) {
          const lessonData = {
            title: lesson.title,
            type: lesson.type,
            moduleId: createdModuleId,
            dueDate: lesson.dueDate,
            maxScore: lesson.maxScore,
            passingScore: lesson.passingScore,
          };
          
          const lessonResponse = await academyApi.post('/lessons', lessonData);
          const createdLessonId = lessonResponse.data.id;
          
          // Create contents for this lesson
          if (lesson.contents && lesson.contents.length > 0) {
            for (const content of lesson.contents) {
              const contentData = {
                title: content.title,  // Use the actual content title instead of a generic one
                type: content.type,
                url: content.url,
                lessonId: createdLessonId,
              };
              
              await academyApi.post('/content', contentData);
            }
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error creating modules and lessons:", error);
      return false;
    } finally {
      setCreatingModules(false);
    }
  };

  const validateCourse = (): string[] => {
    const errors: string[] = [];
    
    if (!course.title || course.title.trim().length < 3) {
      errors.push("Course title must be at least 3 characters long");
    }
    
    if (!course.longDescription || course.longDescription.trim().length < 10) {
      errors.push("Course description must be at least 10 characters long");
    }
    
    if (!course.shortDescription || course.shortDescription.trim().length < 5) {
      errors.push("Short description must be at least 5 characters long");
    }
    
    if (!course.category) {
      errors.push("Category is required");
    }
    
    if (!course.status) {
      errors.push("Status is required");
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate course data
    const errors = validateCourse();
    if (errors.length > 0) {
      alert(`Validation errors:\n${errors.join('\n')}`);
      return;
    }
    
    const newCourse: Partial<Course> = {
      title: course.title ?? "",
      longDescription: course.longDescription ?? "",
      shortDescription: course.shortDescription ?? "",
      thumbnail: course.thumbnail,
      category: course.category ?? "Technology",
      subCategory: course.subCategory,
      status: course.status ?? "PUBLISHED",
      skills: course.skills ?? [],
      conceptsLearned: course.conceptsLearned ?? [],
      estimatedTime: course.estimatedTime ?? null,
      targetLevel: course.targetLevel ?? null,
      enrolledNum: course.enrolledNum ?? 0,
      rating: course.rating ?? null,
      price: course.price ?? null,
      progress: course.progress ?? null,
      prerequisites: course.prerequisites ?? [],
      languages: course.languages ?? [],
      // Include the cohort creation option
      createDefaultCohort: course.createDefaultCohort ?? false,
    };
    
    // Log the course data being sent to the backend
    console.log("Creating course with data:", newCourse);
    
    const courseId = await createCourse(newCourse);
    
    if (courseId > 0) {
      // If modules exist, create them and their lessons
      if (modules.length > 0) {
        const success = await createModuleWithLessons(courseId, modules);
        if (!success) {
          console.error("Course created but there was an error creating modules and lessons. Please add them manually.");
        }
      }
      
      // Reset form on success
      setCourse({
        title: "",
        longDescription: "",
        shortDescription: "",
        category: "Technology",
        subCategory: "",
        status: "PUBLISHED",
        skills: [],
        conceptsLearned: [],
        estimatedTime: null,
        targetLevel: "",
        price: null,
        enrolledNum: 0,
        prerequisites: [],
        languages: [],
        createDefaultCohort: false,
      });
      setModules([]);
      
      // Close the form modal and return to dashboard
      onClose();
    } else if (creatingCourse.error) {
      alert(`Error creating course: ${creatingCourse.errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 z-20 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-xl space-y-8"
      >
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900">
            Create New Course
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            type="button"
          >
            <FaXmark size={24} className="text-gray-600" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center">
              Course Title
              <FaInfoCircle className="ml-2 text-gray-400" title="Enter a descriptive title for your course" />
            </label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Enter course title"
              value={course.title ?? ""}
              onChange={(e) => setCourse(prev => ({ ...prev, title: e.target.value }))}
              required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="category"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              Category
              <FaInfoCircle className="ml-2 text-gray-400" title="Select the main category for your course" />
            </label>
            <select
              id="category"
              name="category"
              value={course.category ?? "Technology"}
              onChange={(e) => setCourse(prev => ({ ...prev, category: e.target.value }))}
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
            className="text-sm font-medium text-gray-700 flex items-center"
          >
            Long Description
            <FaInfoCircle className="ml-2 text-gray-400" title="Provide a detailed description of what students will learn" />
          </label>
          <textarea
            id="longDescription"
            name="longDescription"
            placeholder="Enter detailed course description"
            value={course.longDescription ?? ""}
            onChange={(e) => setCourse(prev => ({ ...prev, longDescription: e.target.value }))}
            required
            rows={5}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="shortDescription"
            className="text-sm font-medium text-gray-700 flex items-center"
          >
            Short Description
            <FaInfoCircle className="ml-2 text-gray-400" title="A brief summary of your course (1-2 sentences)" />
          </label>
          <input
            id="shortDescription"
            type="text"
            name="shortDescription"
            placeholder="Enter short description"
            value={course.shortDescription ?? ""}
            onChange={(e) => setCourse(prev => ({ ...prev, shortDescription: e.target.value }))}
            required
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="thumbnail"
            className="text-sm font-medium text-gray-700 flex items-center"
          >
            Course Thumbnail
            <FaInfoCircle className="ml-2 text-gray-400" title="Upload an image that represents your course" />
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
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const formData = new FormData();
                    formData.append('file', file);
                    
                    academyApi.post('/upload/image', formData, {
                      headers: { 'Content-Type': 'multipart/form-data' },
                      withCredentials: true,
                    }).then(response => {
                      setCourse(prev => ({ ...prev, thumbnail: response.data.url }));
                    }).catch(error => {
                      console.error('Error uploading file:', error);
                      alert('Image upload failed. Please try again.');
                    });
                  }
                }}
                className="hidden"
              />
            </label>
            {course.thumbnail && (
              <div className="flex-1">
                <img
                  src={course.thumbnail}
                  alt="Course thumbnail"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                />
                <p className="text-xs text-gray-500 mt-2 truncate max-w-xs">Uploaded successfully</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="subCategory"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              Subcategory
              <FaInfoCircle className="ml-2 text-gray-400" title="Specify a more detailed category if needed" />
            </label>
            <input
              id="subCategory"
              type="text"
              name="subCategory"
              placeholder="Enter subcategory"
              value={course.subCategory ?? ""}
              onChange={(e) => setCourse(prev => ({ ...prev, subCategory: e.target.value }))}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="status" className="text-sm font-medium text-gray-700 flex items-center">
              Status
              <FaInfoCircle className="ml-2 text-gray-400" title="Set the initial status of your course" />
            </label>
            <select
              id="status"
              name="status"
              value={course.status ?? "DRAFT"}
              onChange={(e) => setCourse(prev => ({ ...prev, status: e.target.value }))}
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
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              Estimated Time (hours)
              <FaInfoCircle className="ml-2 text-gray-400" title="Approximate number of hours to complete the course" />
            </label>
            <input
              id="estimatedTime"
              type="number"
              name="estimatedTime"
              placeholder="Enter estimated time"
              value={course.estimatedTime ?? ""}
              onChange={(e) => setCourse(prev => ({ ...prev, estimatedTime: e.target.value ? Number(e.target.value) : null }))}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="targetLevel"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              Target Level
              <FaInfoCircle className="ml-2 text-gray-400" title="Select the skill level this course is designed for" />
            </label>
            <select
              id="targetLevel"
              name="targetLevel"
              value={course.targetLevel ?? ""}
              onChange={(e) => setCourse(prev => ({ ...prev, targetLevel: e.target.value }))}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
        
        {/* Cohort Creation Option */}
        <div className="border-2 border-dashed border-blue-200 rounded-xl p-5 bg-gradient-to-br from-blue-50 to-indigo-50">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={course.createDefaultCohort ?? false}
              onChange={(e) => setCourse(prev => ({ ...prev, createDefaultCohort: e.target.checked }))}
              className="mt-1 h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div className="flex-1">
              <span className="font-semibold text-gray-800">Create Default Cohort</span>
              <p className="text-sm text-gray-600 mt-1">
                Check this box to automatically create a default cohort for this course. 
                If unchecked, students can enroll directly in the course without joining a specific cohort.
              </p>
            </div>
          </label>
        </div>
        
        <div className="border-t border-gray-200 pt-6 space-y-6">
          <ArrayInput
            items={course.skills ?? []}
            label="Skills"
            inputId="skills"
            onAdd={(item) => handleAddArrayItem("skills", item)}
            onRemove={(index) => handleRemoveArrayItem("skills", index)}
          />
          <ArrayInput
            items={course.conceptsLearned ?? []}
            label="Concepts Learned"
            inputId="conceptsLearned"
            onAdd={(item) => handleAddArrayItem("conceptsLearned", item)}
            onRemove={(index) => handleRemoveArrayItem("conceptsLearned", index)}
          />
          <ArrayInput
            items={course.prerequisites ?? []}
            label="Prerequisites"
            inputId="prerequisites"
            onAdd={(item) => handleAddArrayItem("prerequisites", item)}
            onRemove={(index) => handleRemoveArrayItem("prerequisites", index)}
          />
          <ArrayInput
            items={course.languages ?? []}
            label="Languages"
            inputId="languages"
            onAdd={(item) => handleAddArrayItem("languages", item)}
            onRemove={(index) => handleRemoveArrayItem("languages", index)}
          />
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Course Modules</h3>
            <ModuleInput onAdd={handleAddModule} />
          </div>
          {modules.length > 0 && (
            <div className="space-y-4">
              {modules.map((module) => (
                <div key={module.id} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-lg text-gray-900">{module.title}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveModule(module.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                  <p className="text-gray-600 mb-4">{module.description}</p>
                  
                  <div className="ml-2 pl-4 border-l-2 border-gray-200">
                    <h5 className="font-medium mb-3 text-gray-800">Lessons:</h5>
                    {module.lessons && module.lessons.length > 0 ? (
                      <ul className="space-y-2 mb-3">
                        {module.lessons.map((lesson: any) => (
                          <li key={lesson.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                            <div>
                              <span className="font-medium">{lesson.title}</span>
                              <span className="text-sm text-gray-500 ml-2">({lesson.type})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveLesson(module.id, lesson.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                            >
                              <FaTrash size={16} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 mb-3 italic">No lessons added yet</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={creatingCourse.loading || creatingModules}
          className={`w-full py-3.5 text-white rounded-lg transition-all font-medium flex items-center justify-center ${
            creatingCourse.loading || creatingModules
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg hover:shadow-xl"
          }`}
        >
          {creatingCourse.loading || creatingModules ? (
            <>
              <FaSpinner className="animate-spin mr-2" /> 
              {creatingCourse.loading ? "Creating Course..." : "Creating Modules..."}
            </>
          ) : (
            <>
              <FaPlus className="mr-2 h-5 w-5" /> Create Course
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateCourseForm;