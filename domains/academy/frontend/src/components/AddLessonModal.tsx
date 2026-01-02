import React, { useState } from 'react';
import { courseApi } from '../api/courseApi';

// Icons
import { X, Play, FileText, File, Upload, Loader2 } from 'lucide-react';

interface AddLessonModalProps {
  moduleId: number;
  isOpen: boolean;
  onClose: () => void;
  onLessonAdded: () => void;
}

const AddLessonModal: React.FC<AddLessonModalProps> = ({ 
  moduleId, 
  isOpen, 
  onClose, 
  onLessonAdded 
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'VIDEO' | 'TEXT' | 'PDF'>('VIDEO');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Lesson title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create lesson first
      const lessonData = {
        title: title.trim(),
        type,
        moduleId
      };
      
      const lessonResponse = await courseApi.createLesson(lessonData);
      
      // If there's a file, upload it as content
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('lessonId', lessonResponse.data.id.toString());
        formData.append('title', file.name);
        formData.append('type', type);
        
        // Note: We'll need to implement file upload API endpoint
        // For now, we'll just create content record with URL placeholder
        await courseApi.createContent({
          lessonId: lessonResponse.data.id,
          title: file.name,
          type,
          url: URL.createObjectURL(file) // This is just a temporary URL for preview
        });
      }
      
      setTitle('');
      setFile(null);
      onLessonAdded();
      onClose();
    } catch (err: any) {
      console.error('Error creating lesson:', err);
      setError(err.response?.data?.message || 'Failed to create lesson. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200">
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
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
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

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <File size={16} className="text-gray-500" />
                Content Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'VIDEO' | 'TEXT' | 'PDF')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                disabled={loading}
              >
                <option value="VIDEO">Video</option>
                <option value="TEXT">Text</option>
                <option value="PDF">PDF</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Upload size={16} className="text-gray-500" />
                Content Upload
              </label>
              <div className="border-2 border-dashed border-indigo-200 rounded-xl p-6 text-center bg-indigo-50 transition-colors hover:bg-indigo-100">
                <div className="flex flex-col items-center justify-center">
                  <Upload size={24} className="text-indigo-400 mb-2" />
                  <p className="text-gray-600 mb-2">Drag and drop content here, or</p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    disabled={loading}
                  />
                  <label 
                    htmlFor="file-upload"
                    className="cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium bg-white px-4 py-2 rounded-lg border border-indigo-200 transition-colors"
                  >
                    Browse files
                  </label>
                  {file && (
                    <div className="mt-3 text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 inline-block">
                      <span className="text-indigo-600 font-medium">Selected:</span> {file.name}
                    </div>
                  )}
                </div>
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
                  'Create Lesson'
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