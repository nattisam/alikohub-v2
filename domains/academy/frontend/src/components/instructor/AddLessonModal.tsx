import React, { useState } from "react";
import { courseApi } from "../../api/courseApi";
import { Play, FileText, Video, Loader2, X } from "lucide-react";

interface AddLessonModalProps {
  moduleId: number;
  isOpen: boolean;
  onClose: () => void;
  onLessonAdded: (lesson: any) => void;
}

const AddLessonModal: React.FC<AddLessonModalProps> = ({
  moduleId,
  isOpen,
  onClose,
  onLessonAdded,
}) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"VIDEO" | "WEBINAR" | "ASSIGNMENT" | "QUIZ">(
    "VIDEO",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Lesson title is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await courseApi.createLesson({
        title: title.trim(),
        type,
        moduleId,
      });

      setTitle("");
      setType("VIDEO");
      onLessonAdded(response.data);
      onClose();
    } catch (err: any) {
      console.error("Error creating lesson:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create lesson. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Play size={20} className="text-indigo-600" />
              Add New Lesson
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1"
              disabled={loading}
            >
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
              <div className="ml-3">
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <FileText size={16} className="text-gray-500" />
                  Lesson Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Enter lesson title"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Video size={16} className="text-gray-500" />
                  Lesson Type *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  disabled={loading}
                >
                  <option value="VIDEO">Video Lesson</option>
                  <option value="WEBINAR">Live Webinar</option>
                  <option value="QUIZ">Quiz</option>
                  <option value="ASSIGNMENT">Assignment</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  You can add specific content blocks (PDF, Text, etc.) inside
                  the lesson editor using the new Editor.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2.5 text-gray-600 hover:text-gray-800 disabled:opacity-50 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Lesson"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLessonModal;
