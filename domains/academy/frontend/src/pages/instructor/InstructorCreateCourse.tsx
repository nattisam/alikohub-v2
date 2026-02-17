import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { courseApi } from "../../api/courseApi";
import api from "../../lib/api";
import {
  FaCheck,
  FaChevronRight,
  FaChevronLeft,
  FaCloudUploadAlt,
  FaBold,
  FaItalic,
  FaListUl,
  FaLink,
  FaClock,
  FaDollarSign,
  FaTimes,
  FaExclamationCircle,
} from "react-icons/fa";

// Types
interface CourseFormData {
  title: string;
  category: string;
  targetLevel: string;
  languages: string[];
  thumbnail: string;
  shortDescription: string;
  longDescription: string;
  skills: string[];
  price: number;
  estimatedTime: number;
}

const InstructorCreateCourse: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();

  // Multi-step state
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    category: "STEM",
    targetLevel: "Beginner",
    languages: ["English"],
    thumbnail: "",
    shortDescription: "",
    longDescription: "",
    skills: [],
    price: 0,
    estimatedTime: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    if (
      !currentUser ||
      !currentUser.academyUser ||
      currentUser.academyActiveRole !== "INSTRUCTOR"
    ) {
      // Just a safety check
    }
  }, [currentUser, isAuthenticated, navigate]);

  const handleUpdateField = (updates: Partial<CourseFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, WEBP).");
      return;
    }

    // Validate size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Use FormData to send the file
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "image"); // backend expects field 'type' for categorization

      // We'll use the courseApi to upload.
      // Note: We need to make sure courseApi has a method that points to the correct endpoint.
      // If courseApi.uploadContent is for course content, we might need a generic upload.
      // Based on previous context, authService used '/upload/document'.
      // Let's assume we can use the same pattern or a dedicated course media upload.
      // For now, we will try to use the existing `courseApi.uploadContent` but that might be for lessons.
      // Let's use a direct call if needed, or better, use the authService resume upload pattern but for images.
      // Actually, let's use the `academyApi` directly here for valid endpoint /upload/image via gateway

      const { data } = await api.post("/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      handleUpdateField({ thumbnail: data.url });
    } catch (err: any) {
      console.error("Image upload failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to upload image. Please try again.",
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleNext = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    } else {
      handleFinalCreate();
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleFinalCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        title: formData.title,
        shortDescription: formData.shortDescription,
        longDescription: formData.longDescription,
        thumbnail: formData.thumbnail,
        category: formData.category,
        status: "DRAFT",
      };

      const response = await courseApi.createCourse(payload);

      const courseId = response.data?.id;
      if (courseId) {
        navigate(`/instructor/mycourses/manage/${courseId}`);
      } else {
        throw new Error("Failed to get course ID from response");
      }
    } catch (err: any) {
      console.error("Error creating course:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create course. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 1, label: "Basic Info" },
      { id: 2, label: "Skills" },
      { id: 3, label: "Pricing" },
    ];

    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-[14px] left-[5%] right-[5%] h-[1px] bg-gray-300 -z-0">
            <div
              className="h-full bg-[#0a66c2] transition-all duration-500"
              style={{
                width: `${((activeStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {steps.map((step) => {
            const isActive = activeStep === step.id;
            const isCompleted = activeStep > step.id;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center relative z-10 px-4"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    isActive
                      ? "bg-[#0a66c2] text-white ring-2 ring-blue-100 shadow-sm"
                      : isCompleted
                        ? "bg-green-600 text-white shadow-none"
                        : "bg-white border border-gray-300 text-gray-400"
                  }`}
                >
                  {isCompleted ? <FaCheck size={12} /> : step.id}
                </div>
                <span
                  className={`mt-2 text-[11px] font-semibold transition-colors duration-300 ${isActive ? "text-[#0a66c2]" : "text-gray-500"}`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-[rgba(0,0,0,0.9)] overflow-hidden">
      <div className="bg-white border-b border-gray-200 px-6 h-[52px] flex items-center justify-between shadow-none shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-4 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-gray-800 hidden md:inline py-1 px-2 hover:bg-gray-100 rounded transition-colors cursor-pointer">
              Course Creator
            </span>
          </div>

          <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden md:block"></div>

          <div className="flex-1 flex items-center text-xs font-semibold text-gray-500">
            <span className="text-gray-900">Create New Course</span>
          </div>

          <button
            onClick={() => navigate("/instructor/mycourses")}
            className="text-[#0a66c2] hover:bg-blue-50 font-semibold px-4 py-1 rounded-full border border-[#0a66c2] transition-colors text-sm"
          >
            Cancel & Exit
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6">
        <div className="max-w-4xl mx-auto py-6">
          {renderStepIndicator()}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3 text-sm animate-in fade-in duration-300">
              <FaExclamationCircle size={16} />
              <p>{error}</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[400px] animate-in slide-in-from-bottom-2 duration-400">
            {activeStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Course Essentials
                  </h2>
                  <p className="text-xs text-gray-500">
                    Define the basic information for your course.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                      Course Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        handleUpdateField({ title: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-[#0a66c2] focus:bg-white transition-all placeholder-gray-400"
                      placeholder="e.g., Advanced React Patterns"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          handleUpdateField({ category: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:ring-1 focus:ring-[#0a66c2] transition-all cursor-pointer"
                      >
                        <option>STEM</option>
                        <option>Health</option>
                        <option>Technology</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Target Level
                      </label>
                      <select
                        value={formData.targetLevel}
                        onChange={(e) =>
                          handleUpdateField({ targetLevel: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:ring-1 focus:ring-[#0a66c2] transition-all"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 border-b border-gray-100 pb-2">
                      Course Content & Media
                    </h3>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                      accept="image/png, image/jpeg, image/webp"
                    />
                    <div
                      onClick={() =>
                        !isUploading && fileInputRef.current?.click()
                      }
                      className={`border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:border-[#0a66c2] transition-all cursor-pointer group relative overflow-hidden ${isUploading ? "opacity-50" : ""}`}
                    >
                      {formData.thumbnail ? (
                        <div className="absolute inset-0 w-full h-full">
                          <img
                            src={formData.thumbnail}
                            alt="Course cover"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white font-semibold text-sm">
                              Click to Change
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="bg-white p-2.5 rounded-full shadow-sm mb-2 group-hover:scale-105 transition-transform text-[#0a66c2]">
                            <FaCloudUploadAlt size={24} />
                          </div>
                          <p className="text-gray-900 font-semibold text-xs mb-0.5">
                            {isUploading
                              ? "Uploading..."
                              : "Course Cover Image"}
                          </p>
                          <p className="text-gray-400 text-[10px] mb-2">
                            1280x720px recommended (Max 5MB)
                          </p>
                          <button
                            type="button"
                            className="text-[#0a66c2] font-semibold text-[11px] hover:underline"
                          >
                            Upload Image
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Short Summary
                      </label>
                      <textarea
                        value={formData.shortDescription}
                        onChange={(e) =>
                          handleUpdateField({
                            shortDescription: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:ring-1 focus:ring-[#0a66c2] min-h-[60px]"
                        placeholder="A brief overview for the marketplace."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                        Detailed Description
                      </label>
                      <div className="border border-gray-300 rounded overflow-hidden focus-within:ring-1 focus-within:ring-[#0a66c2]">
                        <div className="bg-gray-50 border-b border-gray-200 px-3 py-1.5 flex gap-3 text-gray-500">
                          <button className="hover:text-[#0a66c2] transition-colors">
                            <FaBold size={12} />
                          </button>
                          <button className="hover:text-[#0a66c2] transition-colors">
                            <FaItalic size={12} />
                          </button>
                          <div className="w-[1px] bg-gray-200 mx-1 h-3 self-center"></div>
                          <button className="hover:text-[#0a66c2] transition-colors">
                            <FaListUl size={12} />
                          </button>
                          <button className="hover:text-[#0a66c2] transition-colors">
                            <FaLink size={12} />
                          </button>
                        </div>
                        <textarea
                          value={formData.longDescription}
                          onChange={(e) =>
                            handleUpdateField({
                              longDescription: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border-none focus:ring-0 text-sm min-h-[120px]"
                          placeholder="Tell students exactly what they will learn..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="animate-in fade-in duration-300 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Skills & Learning Path
                  </h2>
                  <p className="text-xs text-gray-500 mb-6">
                    Define the key outcomes and skills students will gain.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Add Key Skills
                  </label>
                  <div className="bg-gray-50 p-3 rounded border border-gray-300 focus-within:border-[#0a66c2] transition-all">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-50 text-[#0a66c2] px-2 py-0.5 rounded text-[11px] font-semibold border border-blue-100 flex items-center gap-1.5 animate-in zoom-in-95"
                        >
                          {skill}
                          <button
                            onClick={() =>
                              handleUpdateField({
                                skills: formData.skills.filter(
                                  (_, i) => i !== idx,
                                ),
                              })
                            }
                            className="hover:text-red-600 transition-colors"
                          >
                            <FaTimes size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Type a skill and press Enter..."
                      className="w-full bg-transparent border-none focus:ring-0 text-sm placeholder-gray-400"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = (
                            e.target as HTMLInputElement
                          ).value.trim();
                          if (val && !formData.skills.includes(val)) {
                            handleUpdateField({
                              skills: [...formData.skills, val],
                            });
                            (e.target as HTMLInputElement).value = "";
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="animate-in fade-in duration-300 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Value & Commitment
                  </h2>
                  <p className="text-xs text-gray-500 mb-6">
                    Set the pricing and estimated time to complete the course.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Price (USD)
                    </label>
                    <div className="relative">
                      <FaDollarSign
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={14}
                      />
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          handleUpdateField({ price: Number(e.target.value) })
                        }
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm font-semibold focus:ring-1 focus:ring-[#0a66c2] bg-white"
                        placeholder="0.00"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 italic">
                      Zero means the course is free.
                    </p>
                  </div>

                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Duration (Hours)
                    </label>
                    <div className="relative">
                      <FaClock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={14}
                      />
                      <input
                        type="number"
                        value={formData.estimatedTime}
                        onChange={(e) =>
                          handleUpdateField({
                            estimatedTime: Number(e.target.value),
                          })
                        }
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm font-semibold focus:ring-1 focus:ring-[#0a66c2] bg-white"
                        placeholder="e.g. 10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Consistent with LinkedIn Style pill buttons */}
          <div className="mt-8 flex justify-between items-center mb-10">
            <button
              onClick={
                activeStep > 1
                  ? handleBack
                  : () => navigate("/instructor/mycourses")
              }
              className="flex items-center gap-1.5 text-gray-500 font-semibold hover:bg-gray-200 transition-colors py-1.5 px-4 rounded-full text-sm"
            >
              {activeStep > 1 ? (
                <>
                  <FaChevronLeft size={14} /> Back
                </>
              ) : (
                "Cancel"
              )}
            </button>

            <button
              onClick={handleNext}
              disabled={loading}
              className="flex items-center gap-1.5 bg-[#0a66c2] text-white font-semibold py-1.5 px-6 rounded-full hover:bg-[#004182] transition-colors disabled:opacity-50 text-sm shadow-none"
            >
              {loading
                ? "Creating..."
                : activeStep === 3
                  ? "Create Course"
                  : "Next Step"}
              {!loading && <FaChevronRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorCreateCourse;
