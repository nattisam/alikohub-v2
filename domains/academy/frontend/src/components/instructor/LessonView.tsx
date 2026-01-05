import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaPlus, FaFile, FaVideo, FaFilePdf, FaQuestionCircle, FaTasks, FaBook, FaGraduationCap, FaSpinner } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { academyApi } from "../../api";
import type { CourseLesson, LessonContent } from "../common/types.d.tsx";
import ContentViewer from "./ContentViewer";
import ConfirmationModal from "../common/ConfirmationModal";

interface LessonViewProps {
  lessonId: number;
  moduleId: number;
  onClose: () => void;
  onEdit: (lessonId: number) => void;
  isInstructorView?: boolean;
}

const LessonView: React.FC<LessonViewProps> = ({ 
  lessonId, 
  moduleId,
  onClose, 
  onEdit,
  isInstructorView = false 
}) => {
  const [lesson, setLesson] = useState<CourseLesson | null>(null);
  const [contents, setContents] = useState<LessonContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showContentViewer, setShowContentViewer] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newContent, setNewContent] = useState({
    title: "",
    type: "VIDEO",
    url: ""
  });
  const [showAddContentForm, setShowAddContentForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(false);
  const [updatedLesson, setUpdatedLesson] = useState({
    title: "",
    type: "VIDEO",
    dueDate: "",
    maxScore: "",
    passingScore: ""
  });

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const response = await academyApi.get(`/lessons/${lessonId}`);
      setLesson(response.data);
      
      // Set initial values for editing
      setUpdatedLesson({
        title: response.data.title || "",
        type: response.data.type || "VIDEO",
        dueDate: response.data.dueDate ? new Date(response.data.dueDate).toISOString().split('T')[0] : "",
        maxScore: response.data.maxScore ? response.data.maxScore.toString() : "",
        passingScore: response.data.passingScore ? response.data.passingScore.toString() : ""
      });
      
      // Fetch content for this lesson
      const contentResponse = await academyApi.get(`/content/lesson/${lessonId}`);
      setContents(contentResponse.data);
    } catch (err) {
      setError("Failed to load lesson data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const contentData = {
        title: newContent.title,
        type: newContent.type,
        url: newContent.url,
        lessonId: lessonId
      };
      
      const response = await academyApi.post('/content', contentData);
      
      setContents(prev => [...prev, response.data]);
      setNewContent({ title: "", type: "VIDEO", url: "" });
      setShowAddContentForm(false);
    } catch (error) {
      console.error("Error adding content:", error);
      alert("Failed to add content");
    }
  };

  const handleDeleteContent = async (contentId: number) => {
    if (!window.confirm("Are you sure you want to delete this content?")) return;
    
    try {
      await academyApi.delete(`/content/${contentId}`);
      setContents(prev => prev.filter(content => content.id !== contentId));
    } catch (error) {
      console.error("Error deleting content:", error);
      alert("Failed to delete content");
    }
  };

  const handleDeleteLesson = async () => {
    try {
      await academyApi.delete(`/lessons/${lessonId}`);
      onClose(); // Close the lesson view and return to module view
    } catch (error) {
      console.error("Error deleting lesson:", error);
      alert("Failed to delete lesson");
    }
  };

  const handleUpdateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const lessonData = {
        title: updatedLesson.title,
        type: updatedLesson.type,
        dueDate: updatedLesson.dueDate || null,
        maxScore: updatedLesson.maxScore ? parseInt(updatedLesson.maxScore) : null,
        passingScore: updatedLesson.passingScore ? parseInt(updatedLesson.passingScore) : null
      };
      
      const response = await academyApi.put(`/lessons/${lessonId}`, lessonData);
      setLesson(response.data);
      setEditingLesson(false);
    } catch (error) {
      console.error("Error updating lesson:", error);
      alert("Failed to update lesson");
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <FaVideo className="text-red-500" />;
      case "PDF":
        return <FaFilePdf className="text-red-600" />;
      case "QUIZ":
        return <FaQuestionCircle className="text-green-500" />;
      case "ASSIGNMENT":
        return <FaTasks className="text-blue-500" />;
      default:
        return <FaFile className="text-gray-500" />;
    }
  };

  const getContentTypeName = (type: string) => {
    switch (type) {
      case "VIDEO":
        return "Video";
      case "PDF":
        return "PDF Document";
      case "QUIZ":
        return "Quiz";
      case "ASSIGNMENT":
        return "Assignment";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center">
          <FaSpinner className="animate-spin text-3xl text-blue-600 mb-4" />
          <p className="text-lg font-medium text-gray-700">Loading lesson data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <h3 className="text-xl font-bold text-red-600 mb-3">Error</h3>
          <p className="mb-5 text-gray-700">{error}</p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 font-medium transition-all shadow-md hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="flex justify-center mb-4">
            <FaBook className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">Lesson not found</h3>
          <p className="mb-6 text-gray-600 text-center">The requested lesson could not be found.</p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 font-medium transition-all shadow-md hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <FaGraduationCap className="mr-3 text-blue-600" />
                {editingLesson ? "Edit Lesson" : `Lesson: ${lesson.title}`}
              </h2>
              <p className="text-gray-600 mt-1">Manage and view lesson content</p>
            </div>
            <div className="flex space-x-2 mt-3 sm:mt-0">
              {isInstructorView && !editingLesson && (
                <>
                  <button
                    onClick={() => setEditingLesson(true)}
                    className="p-3 hover:bg-blue-100 rounded-xl text-blue-600 transition-colors"
                    title="Edit lesson"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="p-3 hover:bg-red-100 rounded-xl text-red-600 transition-colors"
                    title="Delete lesson"
                  >
                    <FaTrash size={18} />
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                title="Close"
              >
                <FaXmark size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
          
          {editingLesson ? (
            <form onSubmit={handleUpdateLesson} className="mb-8 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-sm border border-gray-200 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Title
                </label>
                <input
                  type="text"
                  value={updatedLesson.title}
                  onChange={(e) => setUpdatedLesson({...updatedLesson, title: e.target.value})}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  placeholder="Enter lesson title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Type
                </label>
                <select
                  value={updatedLesson.type}
                  onChange={(e) => setUpdatedLesson({...updatedLesson, type: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                >
                  <option value="VIDEO">Video</option>
                  <option value="PDF">PDF</option>
                  <option value="ASSIGNMENT">Assignment</option>
                  <option value="QUIZ">Quiz</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={updatedLesson.dueDate}
                    onChange={(e) => setUpdatedLesson({...updatedLesson, dueDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Score (Optional)
                  </label>
                  <input
                    type="number"
                    value={updatedLesson.maxScore}
                    onChange={(e) => setUpdatedLesson({...updatedLesson, maxScore: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                    placeholder="e.g., 100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passing Score (Optional)
                  </label>
                  <input
                    type="number"
                    value={updatedLesson.passingScore}
                    onChange={(e) => setUpdatedLesson({...updatedLesson, passingScore: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                    placeholder="e.g., 70"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLesson(false)}
                  className="px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 font-medium transition-all shadow-md hover:shadow-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium transition-all shadow-md hover:shadow-lg"
                >
                  Update Lesson
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Lesson Type</span>
                  <div className="flex items-center mt-1">
                    <div className="mr-2 p-2 bg-gray-100 rounded-lg">
                      {getContentIcon(lesson.type)}
                    </div>
                    <p className="font-medium text-gray-900">{getContentTypeName(lesson.type)}</p>
                  </div>
                </div>
                
                {lesson.dueDate && (
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Due Date</span>
                    <p className="font-medium text-gray-900 mt-1">{new Date(lesson.dueDate).toLocaleDateString()}</p>
                  </div>
                )}
                
                {(lesson.maxScore || lesson.passingScore) && (
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Score Requirements</span>
                    <p className="font-medium text-gray-900 mt-1">
                      {lesson.maxScore ? `Max: ${lesson.maxScore}` : ""} 
                      {lesson.passingScore ? `, Pass: ${lesson.passingScore}` : ""}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Content Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 pb-3 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FaBook className="mr-3 text-blue-600" /> Content Items
                </h3>
                <p className="text-gray-600 mt-1">Manage and view lesson content</p>
              </div>
              <div className="flex space-x-2 mt-3 sm:mt-0">
                {isInstructorView && contents.length > 0 && (
                  <button
                    onClick={() => setShowContentViewer(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium flex items-center text-sm shadow transition-all"
                  >
                    <FaFile className="mr-2" size={14} /> Preview Content
                  </button>
                )}
                {contents.length > 0 && !isInstructorView && (
                  <button
                    onClick={() => setShowContentViewer(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium flex items-center text-sm shadow transition-all"
                  >
                    <FaFile className="mr-2" size={14} /> View Content
                  </button>
                )}
                {isInstructorView && (
                  <button
                    onClick={() => setShowAddContentForm(true)}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 font-medium flex items-center text-sm shadow transition-all"
                  >
                    <FaPlus className="mr-2" size={14} /> Add Content
                  </button>
                )}
              </div>
            </div>
            
            {contents.length > 0 ? (
              <div className="space-y-4">
                {contents.map((content) => (
                  <div key={content.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-sm transition-all">
                    <div className="flex items-center w-full sm:w-auto mb-3 sm:mb-0">
                      <div className="mr-3 p-2 bg-white rounded-lg shadow">
                        {getContentIcon(content.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{content.title}</p>
                        <div className="flex items-center mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800 border border-gray-200">
                            {getContentTypeName(content.type)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 w-full sm:w-auto">
                      <button
                        onClick={() => setShowContentViewer(true)}
                        className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium text-sm shadow transition-all"
                      >
                        {isInstructorView ? "Preview" : "View"}
                      </button>
                      {isInstructorView && (
                        <button
                          onClick={() => handleDeleteContent(content.id)}
                          className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 font-medium text-sm shadow transition-all"
                        >
                          <FaTrash size={14} />
                        </button>
                      )}
                      {!isInstructorView && content.url.startsWith('http') && (
                        <a 
                          href={content.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 font-medium text-sm shadow transition-all"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                <div className="text-gray-400 mb-4">
                  <FaBook className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No content available</h3>
                <p className="text-gray-600 mb-6">There is no content added to this lesson yet.</p>
                {isInstructorView && (
                  <button
                    onClick={() => setShowAddContentForm(true)}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                  >
                    <FaPlus className="mr-2" /> Add Content
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-end mt-8">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 font-medium transition-all shadow-md hover:shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      
      {/* Content Viewer Modal */}
      {showContentViewer && (
        <ContentViewer 
          lessonId={lessonId} 
          moduleId={moduleId} // Pass the moduleId
          contents={contents} // Pass preloaded contents
          onClose={() => setShowContentViewer(false)} 
        />
      )}
      
      {/* Add Content Form Modal */}
      {showAddContentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FaFile className="mr-3 text-blue-600" /> Add New Content
                </h3>
                <button
                  onClick={() => setShowAddContentForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaXmark size={20} className="text-gray-600" />
                </button>
              </div>
              
              <form onSubmit={handleAddContent} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Title
                  </label>
                  <input
                    type="text"
                    value={newContent.title}
                    onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                    placeholder="Enter content title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Type
                  </label>
                  <select
                    value={newContent.type}
                    onChange={(e) => setNewContent({...newContent, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  >
                    <option value="VIDEO">Video</option>
                    <option value="PDF">PDF</option>
                    <option value="QUIZ">Quiz</option>
                    <option value="ASSIGNMENT">Assignment</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content URL
                  </label>
                  <input
                    type="text"
                    value={newContent.url}
                    onChange={(e) => setNewContent({...newContent, url: e.target.value})}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                    placeholder="Enter content URL or text"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    For text content, you can enter the actual text here. For files, enter the file URL.
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddContentForm(false)}
                    className="px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    Add Content
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteLesson}
        title="Delete Lesson"
        message="Are you sure you want to delete this lesson? This action cannot be undone."
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default LessonView;