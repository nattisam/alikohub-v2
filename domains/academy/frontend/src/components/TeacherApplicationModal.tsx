import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { academyAPI } from "../services/api";
import { FaCheckCircle } from "react-icons/fa";

interface TeacherApplicationModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface TeacherApplicationData {
  personalDetails: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
  };
  teachingCategories: string[];
  resumeUrl: string;
  interviewResponses: {
    question: string;
    answer: string;
  }[];
}

const TeacherApplicationModal: React.FC<TeacherApplicationModalProps> = ({ 
  onClose, 
  onSuccess 
}) => {
  const navigate = useNavigate();
  const { user: currentUser, selectRole, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState<TeacherApplicationData>({
    personalDetails: {
      firstname: currentUser?.firstname || "",
      lastname: currentUser?.lastname || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
    },
    teachingCategories: [""],
    resumeUrl: "",
    interviewResponses: [
      { question: "Why do you want to teach?", answer: "" },
      { question: "What subjects are you most passionate about?", answer: "" },
      { question: "Describe your teaching experience.", answer: "" },
    ],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [name]: value,
      },
    }));
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newCategories = [...formData.teachingCategories];
    newCategories[index] = value;
    setFormData((prev) => ({
      ...prev,
      teachingCategories: newCategories,
    }));
  };

  const addCategory = () => {
    setFormData((prev) => ({
      ...prev,
      teachingCategories: [...prev.teachingCategories, ""],
    }));
  };

  const removeCategory = (index: number) => {
    if (formData.teachingCategories.length <= 1) return;
    const newCategories = [...formData.teachingCategories];
    newCategories.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      teachingCategories: newCategories,
    }));
  };

  const handleInterviewResponseChange = (index: number, value: string) => {
    const newInterviewResponses = [...formData.interviewResponses];
    newInterviewResponses[index].answer = value;
    setFormData((prev) => ({
      ...prev,
      interviewResponses: newInterviewResponses,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Remove any empty categories
      const filteredCategories = formData.teachingCategories.filter(
        (category) => category.trim() !== ""
      );

      const applicationData = {
        ...formData,
        teachingCategories: filteredCategories,
      };

      await academyAPI.applyTeacher(applicationData);
      
      // After successful application, update the user's role status to pending
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          roleStatus: {
            ...currentUser.roleStatus,
            instructor: 'pending',
            applicationDate: new Date().toISOString(),
          },
          availableRoles: [...(currentUser.availableRoles || []), 'INSTRUCTOR'],
        };
        
        updateUser(updatedUser);
      }
      
      // Show success message
      setSubmitted(true);
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/');
        onSuccess();
      }, 3000);
    } catch (err: any) {
      console.error("Error applying for teacher role:", err);
      setError(
        err.response?.data?.message || 
        "Failed to submit application. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Show success message after submission
  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <FaCheckCircle className="mx-auto h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Application Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for applying to become an instructor. Your application is now under review. 
            We will notify you once it has been approved.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              <strong>What's next?</strong> Our team will review your application within 2-3 business days. 
              You'll receive an email notification about your application status.
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Redirecting to home page...
          </p>
          <div className="mt-4">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Instructor Application</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
              disabled={loading}
            >
              &times;
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Personal Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstname"
                      value={formData.personalDetails.firstname}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      value={formData.personalDetails.lastname}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.personalDetails.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.personalDetails.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Teaching Categories */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-800">Teaching Categories</h3>
                  <button
                    type="button"
                    onClick={addCategory}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    + Add Category
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.teachingCategories.map((category, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => handleCategoryChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Programming, Cloud Computing"
                        required
                      />
                      {formData.teachingCategories.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCategory(index)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Resume URL */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Resume</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resume URL
                  </label>
                  <input
                    type="url"
                    value={formData.resumeUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        resumeUrl: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/resume.pdf"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Please provide a link to your resume (PDF format recommended)
                  </p>
                </div>
              </div>

              {/* Interview Questions */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Interview Questions
                </h3>
                <div className="space-y-4">
                  {formData.interviewResponses.map((item, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {item.question}
                      </label>
                      <textarea
                        value={item.answer}
                        onChange={(e) => handleInterviewResponseChange(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherApplicationModal;