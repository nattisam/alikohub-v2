import React, { useState } from "react";
import { FaPlus, FaTimes, FaGraduationCap, FaInfoCircle } from "react-icons/fa";
import { courseApi } from "../api/courseApi";

interface AddLessonFormProps {
  moduleId: number;
  onLessonAdded: (lesson: any) => void;
  onCancel: () => void;
}

const AddLessonForm: React.FC<AddLessonFormProps> = ({ moduleId, onLessonAdded, onCancel }) => {
  const [lessonData, setLessonData] = useState({
    title: "",
    type: "VIDEO",
    dueDate: "",
    maxScore: "",
    passingScore: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lessonData.title.trim()) {
      setError("Lesson title is required");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const lessonPayload: any = {
        ...lessonData,
        moduleId,
        maxScore: lessonData.maxScore ? parseInt(lessonData.maxScore) : null,
        passingScore: lessonData.passingScore ? parseInt(lessonData.passingScore) : null
      };
      
      // Remove empty dueDate
      if (!lessonData.dueDate) {
        delete lessonPayload.dueDate;
      }
      
      const newLesson = await courseApi.createLesson(lessonPayload);
      
      onLessonAdded(newLesson.data);
      setLessonData({ 
        title: "", 
        type: "VIDEO", 
        dueDate: "", 
        maxScore: "", 
        passingScore: "" 
      });
    } catch (err: any) {
      console.error("Error creating lesson:", err);
      setError(err.response?.data?.message || "Failed to create lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaGraduationCap className="mr-3 text-blue-600" /> Add New Lesson
            </h3>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>
          
          {error && (
            <div className="mb-5 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                Lesson Title *
                <FaInfoCircle className="ml-2 text-gray-400" title="Enter a descriptive title for your lesson" />
              </label>
              <input
                type="text"
                value={lessonData.title}
                onChange={(e) => setLessonData({...lessonData, title: e.target.value})}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                placeholder="Enter lesson title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                Lesson Type
                <FaInfoCircle className="ml-2 text-gray-400" title="Select the type of content for this lesson" />
              </label>
              <select
                value={lessonData.type}
                onChange={(e) => setLessonData({...lessonData, type: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              >
                <option value="VIDEO">Video</option>
                <option value="PDF">PDF</option>
                <option value="ASSIGNMENT">Assignment</option>
                <option value="QUIZ">Quiz</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                Due Date (Optional)
                <FaInfoCircle className="ml-2 text-gray-400" title="Set a due date for this lesson (optional)" />
              </label>
              <input
                type="date"
                value={lessonData.dueDate}
                onChange={(e) => setLessonData({...lessonData, dueDate: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  Max Score (Optional)
                  <FaInfoCircle className="ml-2 text-gray-400" title="Maximum possible score for this lesson (optional)" />
                </label>
                <input
                  type="number"
                  value={lessonData.maxScore}
                  onChange={(e) => setLessonData({...lessonData, maxScore: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  placeholder="e.g., 100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  Passing Score (Optional)
                  <FaInfoCircle className="ml-2 text-gray-400" title="Minimum score required to pass this lesson (optional)" />
                </label>
                <input
                  type="number"
                  value={lessonData.passingScore}
                  onChange={(e) => setLessonData({...lessonData, passingScore: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  placeholder="e.g., 70"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 font-medium transition-all shadow-md hover:shadow-lg"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium flex items-center shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" /> Add Lesson
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLessonForm;