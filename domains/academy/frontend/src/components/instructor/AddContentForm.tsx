import React, { useState } from "react";
import { FaPlus, FaTimes, FaFile, FaInfoCircle } from "react-icons/fa";
import { courseApi } from "../../api/courseApi";

interface AddContentFormProps {
  lessonId: number;
  onContentAdded: (content: any) => void;
  onCancel: () => void;
}

const AddContentForm: React.FC<AddContentFormProps> = ({
  lessonId,
  onContentAdded,
  onCancel,
}) => {
  const [contentData, setContentData] = useState({
    title: "",
    type: "VIDEO",
    url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contentData.title.trim()) {
      setError("Content title is required");
      return;
    }

    if (!contentData.url.trim()) {
      setError("Content URL is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newContent = await courseApi.createContent({
        ...contentData,
        url: contentData.url.trim() || undefined,
        lessonId,
      });

      onContentAdded(newContent.data);
      setContentData({ title: "", type: "VIDEO", url: "" });
    } catch (err: any) {
      console.error("Error creating content:", err);
      setError(err.response?.data?.message || "Failed to create content");
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
              <FaFile className="mr-3 text-blue-600" /> Add New Content
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
                Content Title *
                <FaInfoCircle
                  className="ml-2 text-gray-400"
                  title="Enter a descriptive title for your content"
                />
              </label>
              <input
                type="text"
                value={contentData.title}
                onChange={(e) =>
                  setContentData({ ...contentData, title: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                placeholder="Enter content title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                Content Type
                <FaInfoCircle
                  className="ml-2 text-gray-400"
                  title="Select the type of content you're adding"
                />
              </label>
              <select
                name="type"
                value={contentData.type}
                onChange={(e) =>
                  setContentData({ ...contentData, type: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              >
                <option value="VIDEO">Video</option>
                <option value="PDF">PDF</option>
                <option value="QUIZ">Quiz</option>
                <option value="ASSIGNMENT">Assignment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                Content URL *
                <FaInfoCircle
                  className="ml-2 text-gray-400"
                  title="Enter the URL or text content for this item"
                />
              </label>
              <input
                type="text"
                value={contentData.url}
                onChange={(e) =>
                  setContentData({ ...contentData, url: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                placeholder="Enter content URL or text"
              />
              <p className="text-xs text-gray-500 mt-2">
                For videos, enter a YouTube, Vimeo or direct video link. For
                files, enter the hosted URL.
              </p>
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
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" /> Add Content
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

export default AddContentForm;
