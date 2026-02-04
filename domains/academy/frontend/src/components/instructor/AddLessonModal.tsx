import React, { useState } from 'react';
import { courseApi } from '../../api/courseApi';

// Icons
import { X, Play, FileText, File as FileIcon, Upload, Loader2, HelpCircle, CheckCircle } from 'lucide-react';
import { academyApi } from '../../api';

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
  const [type, setType] = useState<'VIDEO' | 'TEXT' | 'PDF' | 'QUIZ'>('VIDEO');
  const [file, setFile] = useState<File | null>(null);
  
  // Exercise/Quiz state
  const [exerciseType, setExerciseType] = useState<'MULTIPLE_CHOICE' | 'TRUE_FALSE'>('MULTIPLE_CHOICE');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [points, setPoints] = useState(10);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (type !== 'QUIZ' && !title.trim()) {
      setError('Lesson title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (type === 'QUIZ') {
        const validOptions = exerciseType === 'TRUE_FALSE' ? ['True', 'False'] : options.filter(o => o.trim() !== "");
        if (exerciseType === 'MULTIPLE_CHOICE' && validOptions.length < 2) {
          setError("Please provide at least 2 options for the quiz");
          setLoading(false);
          return;
        }
        if (!validOptions.includes(correctAnswer)) {
          setError("Correct answer must be one of the provided options");
          setLoading(false);
          return;
        }

        const exerciseData = {
        correctAnswer: correctAnswer, // Assuming 'newExercise' is not defined here, using existing 'correctAnswer'
        points: Number(points), // Assuming 'newExercise' is not defined here, using existing 'points'
        order: 1 // Assuming 'contents' is not defined here, using existing '1'
      };

      await academyApi.post('/academy/exercises', exerciseData);
      } else {
        // Create Lesson
        const lessonData = {
          title: title.trim(),
          type,
          moduleId
        };
        
        const lessonResponse = await courseApi.createLesson(lessonData);
        
        // If there's a file, upload it as content
        if (file) {
          await courseApi.createContent({
            lessonId: lessonResponse.data.id,
            title: file.name,
            type: type === 'PDF' ? 'PDF' : 'VIDEO',
            url: URL.createObjectURL(file) 
          });
        }
      }
      
      setTitle('');
      setFile(null);
      setType('VIDEO');
      setQuestion('');
      setOptions(['', '', '', '']);
      onLessonAdded();
      onClose();
    } catch (err: any) {
      console.error('Error creating item:', err);
      setError(err.response?.data?.message || 'Failed to create item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
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
            <div className={`grid grid-cols-1 ${type !== 'QUIZ' ? 'md:grid-cols-2' : ''} gap-5 mb-5`}>
              {type !== 'QUIZ' && (
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
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <FileIcon size={16} className="text-gray-500" />
                  Content Type *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'VIDEO' | 'TEXT' | 'PDF' | 'QUIZ')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  disabled={loading}
                >
                  <option value="VIDEO">Video</option>
                  <option value="TEXT">Text</option>
                  <option value="PDF">PDF</option>
                  <option value="QUIZ">Quiz / Exercise</option>
                </select>
              </div>
            </div>

            {type === 'QUIZ' ? (
              <div className="space-y-5 mb-6 border-l-4 border-indigo-500 pl-4 py-2 bg-indigo-50/50 rounded-r-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Sub-Type</label>
                    <select
                      value={exerciseType}
                      onChange={(e) => {
                        const val = e.target.value as 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
                        setExerciseType(val);
                        if (val === 'TRUE_FALSE') {
                          setOptions(['True', 'False']);
                          setCorrectAnswer('');
                        } else {
                          setOptions(['', '', '', '']);
                          setCorrectAnswer('');
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white shadow-sm"
                    >
                      <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                      <option value="TRUE_FALSE">True / False</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                    <input
                      type="number"
                      value={points}
                      onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <HelpCircle size={16} className="text-gray-500" />
                    Question *
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm resize-none"
                    placeholder="Enter the question"
                    rows={2}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
                    <CheckCircle size={16} className="text-gray-500" />
                    {exerciseType === 'MULTIPLE_CHOICE' ? "Options (Select correct answer) *" : "Select Correct Answer *"}
                  </label>
                  <div className="space-y-3">
                    {exerciseType === 'MULTIPLE_CHOICE' ? (
                      options.map((option, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={correctAnswer === option && option !== ""}
                            onChange={() => setCorrectAnswer(option)}
                            className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer"
                            disabled={option === "" || loading}
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...options];
                              newOptions[index] = e.target.value;
                              if (correctAnswer === option) setCorrectAnswer(e.target.value);
                              setOptions(newOptions);
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                            placeholder={`Option ${index + 1}`}
                            disabled={loading}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="flex gap-4">
                        {['True', 'False'].map((val) => (
                          <label key={val} className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${correctAnswer === val ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-200'}`}>
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={correctAnswer === val}
                              onChange={() => setCorrectAnswer(val)}
                              className="hidden"
                            />
                            <CheckCircle size={18} className={correctAnswer === val ? 'text-white' : 'text-gray-300'} />
                            <span className="font-semibold">{val}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
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
            )}

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