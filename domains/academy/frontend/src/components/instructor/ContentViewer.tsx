import React, { useState, useEffect } from "react";
import { FaFilePdf, FaVideo, FaFileAlt, FaQuestionCircle, FaTasks, FaBook } from "react-icons/fa";
import { academyApi } from "../../api";
import { progressApi } from "../../api/progressApi";
import type { LessonContent } from "../common/types.d.tsx";
import { useAuth } from "../../contexts/AuthContext";

interface ContentViewerProps {
  lessonId: number;
  moduleId?: number; // Make it optional for backward compatibility
  onClose: () => void;
  contents?: LessonContent[]; // Optional pre-loaded contents
}

const ContentViewer: React.FC<ContentViewerProps> = ({ lessonId, moduleId, onClose, contents: preloadedContents }) => {
  const [contents, setContents] = useState<LessonContent[]>(preloadedContents || []);
  const [loading, setLoading] = useState(!preloadedContents);
  const [error, setError] = useState("");
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const { user: currentUser } = useAuth();
  const [contentProgress, setContentProgress] = useState<Record<number, string>>({});
  const [lessonProgress, setLessonProgress] = useState<number>(0);

  useEffect(() => {
    // Only fetch content if not preloaded
    if (!preloadedContents) {
      fetchContent();
    }
  }, [lessonId, preloadedContents]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await academyApi.get(`/content/lesson/${lessonId}`);
      setContents(response.data);
    } catch (err) {
      setError("Failed to load content");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to update progress when content is viewed
  const updateContentProgress = async (contentId: number, status: string = "viewed") => {
    if (!moduleId || !currentUser) {
      console.log("Missing moduleId or currentUser, skipping progress update");
      return;
    }

    try {
      // Update local state first for immediate UI feedback
      setContentProgress(prev => ({ ...prev, [contentId]: status }));
      
      // Get the course ID from the lesson
      const lessonResponse = await academyApi.get(`/lessons/${lessonId}`);
      const courseId = lessonResponse.data.module.courseId;
      
      await progressApi.updateContentProgress(
        courseId,
        moduleId,
        lessonId,
        contentId,
        status
      );
      console.log(`Progress updated for content ${contentId} with status ${status}`);
    } catch (error) {
      console.error("Error updating content progress:", error);
    }
  };

  // Function to update lesson progress
  const updateLessonProgress = async (progress: number) => {
    if (!moduleId || !currentUser) {
      console.log("Missing moduleId or currentUser, skipping lesson progress update");
      return;
    }

    try {
      // Update local state first for immediate UI feedback
      setLessonProgress(progress);
      
      // Get the course ID from the lesson
      const lessonResponse = await academyApi.get(`/lessons/${lessonId}`);
      const courseId = lessonResponse.data.module.courseId;
      
      await progressApi.updateProgress({
        courseId,
        moduleId,
        lessonId,
        progress
      });
      console.log(`Lesson progress updated to ${progress}%`);
    } catch (error) {
      console.error("Error updating lesson progress:", error);
    }
  };

  const renderContent = (content: LessonContent) => {
    // Check if the URL is a YouTube URL
    const isYouTubeUrl = (url: string) => {
      return url.includes('youtube.com') || url.includes('youtu.be');
    };

    // Convert YouTube URL to embed URL
    const getYouTubeEmbedUrl = (url: string) => {
      try {
        const urlObj = new URL(url);
        let videoId = '';
        
        if (urlObj.hostname.includes('youtu.be')) {
          // Short URL format: https://youtu.be/videoId
          videoId = urlObj.pathname.substring(1);
        } else if (urlObj.hostname.includes('youtube.com')) {
          // Full URL format: https://www.youtube.com/watch?v=videoId
          videoId = urlObj.searchParams.get('v') || '';
        }
        
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      } catch (error) {
        console.error('Error parsing YouTube URL:', error);
      }
      return url;
    };

    switch (content.type) {
      case "VIDEO":
        if (isYouTubeUrl(content.url)) {
          // Handle YouTube videos with iframe
          const embedUrl = getYouTubeEmbedUrl(content.url);
          return (
            <div className="w-full">
              <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden shadow-lg"> {/* 16:9 Aspect Ratio */}
                <iframe
                  src={embedUrl}
                  className="absolute top-0 left-0 w-full h-full"
                  title={`YouTube Video - ${content.title}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={(e) => {
                    console.error("Error loading YouTube video:", content.url);
                  }}
                  onLoad={() => {
                    // Update progress when video is loaded/viewed
                    updateContentProgress(content.id, "viewed");
                  }}
                />
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Progress:</strong> Content marked as viewed
                </p>
              </div>
            </div>
          );
        } else {
          // Handle regular video files
          return (
            <div className="w-full">
              <video 
                src={content.url} 
                controls 
                className="w-full h-auto max-h-96 rounded-xl shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLVideoElement;
                  target.src = ""; // Reset src to prevent infinite loop
                  console.error("Error loading video:", content.url);
                }}
                onPlay={() => {
                  // Update progress when video starts playing
                  updateContentProgress(content.id, "viewed");
                }}
              >
                Your browser does not support the video tag.
              </video>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Progress:</strong> Content marked as viewed when played
                </p>
              </div>
            </div>
          );
        }
      case "PDF":
        return (
          <div className="w-full">
            <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <FaFilePdf className="text-red-600 mr-2" /> PDF Document
              </h3>
              <p className="text-gray-600 mb-3">{content.title}</p>
              <a 
                href={content.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow"
                onClick={() => {
                  // Update progress when PDF is accessed
                  updateContentProgress(content.id, "viewed");
                }}
              >
                <FaFilePdf className="mr-2" /> Open PDF in New Tab
              </a>
            </div>
            <iframe 
              src={content.url} 
              className="w-full h-96 rounded-xl border border-gray-200"
              title={`PDF Content - ${content.title}`}
              onError={(e) => {
                console.error("Error loading PDF:", content.url);
              }}
              onLoad={() => {
                // Update progress when PDF is loaded/viewed
                updateContentProgress(content.id, "viewed");
              }}
            />
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Progress:</strong> Content marked as viewed when opened
              </p>
            </div>
          </div>
        );
      case "ASSIGNMENT":
        return (
          <div className="w-full p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-100">
            <div className="flex items-center mb-4">
              <FaTasks className="text-blue-600 text-2xl mr-3" />
              <h3 className="text-2xl font-bold text-gray-800">Assignment</h3>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">{content.title}</h4>
            <div className="bg-white rounded-lg p-4 shadow-sm mb-5">
              <h5 className="font-medium text-gray-800 mb-2">Instructions:</h5>
              <div className="prose max-w-none">
                {content.url.startsWith('http') ? (
                  <a 
                    href={content.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Download Assignment Document
                  </a>
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{content.url}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button 
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium flex items-center shadow transition-all"
                onClick={() => {
                  // Update progress when assignment is viewed
                  updateContentProgress(content.id, "viewed");
                }}
              >
                <FaTasks className="mr-2" /> Submit Assignment
              </button>
              {content.url.startsWith('http') && (
                <a 
                  href={content.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 font-medium flex items-center shadow transition-all"
                >
                  <FaFileAlt className="mr-2" /> Download
                </a>
              )}
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Progress:</strong> Content marked as viewed when accessed
              </p>
            </div>
          </div>
        );
      case "QUIZ":
        return (
          <div className="w-full p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg border border-green-100">
            <div className="flex items-center mb-4">
              <FaQuestionCircle className="text-green-600 text-2xl mr-3" />
              <h3 className="text-2xl font-bold text-gray-800">Quiz</h3>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">{content.title}</h4>
            <div className="bg-white rounded-lg p-4 shadow-sm mb-5">
              <h5 className="font-medium text-gray-800 mb-2">Quiz Instructions:</h5>
              <div className="prose max-w-none">
                {content.url.startsWith('http') ? (
                  <a 
                    href={content.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 underline"
                  >
                    Access Quiz Platform
                  </a>
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{content.url}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button 
                className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-medium flex items-center shadow transition-all"
                onClick={() => {
                  // Update progress when quiz is viewed
                  updateContentProgress(content.id, "viewed");
                }}
              >
                <FaQuestionCircle className="mr-2" /> Start Quiz
              </button>
              {content.url.startsWith('http') && (
                <a 
                  href={content.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 font-medium flex items-center shadow transition-all"
                >
                  <FaBook className="mr-2" /> Open Quiz
                </a>
              )}
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Progress:</strong> Content marked as viewed when accessed
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <FaFileAlt className="text-gray-600 text-2xl mr-3" />
              <h3 className="text-2xl font-bold text-gray-800">Content</h3>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">{content.title}</h4>
            <div className="bg-white rounded-lg p-4 shadow-sm mb-5">
              <h5 className="font-medium text-gray-800 mb-2">Content Details:</h5>
              <div className="prose max-w-none">
                {content.url.startsWith('http') ? (
                  <a 
                    href={content.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Access Content
                  </a>
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{content.url}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button 
                className="px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 font-medium flex items-center shadow transition-all"
                onClick={() => {
                  // Update progress when content is accessed
                  updateContentProgress(content.id, "viewed");
                }}
              >
                <FaFileAlt className="mr-2" /> Access Content
              </button>
              {content.url.startsWith('http') && (
                <a 
                  href={content.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium flex items-center shadow transition-all"
                >
                  <FaBook className="mr-2" /> Open in New Tab
                </a>
              )}
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Progress:</strong> Content marked as viewed when accessed
              </p>
            </div>
          </div>
        );
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <FaVideo className="text-red-500" />;
      case "PDF":
        return <FaFilePdf className="text-red-600" />;
      case "ASSIGNMENT":
        return <FaTasks className="text-blue-500" />;
      case "QUIZ":
        return <FaQuestionCircle className="text-green-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  // Update progress when active content changes
  useEffect(() => {
    if (contents.length > 0 && activeContentIndex < contents.length) {
      const activeContent = contents[activeContentIndex];
      updateContentProgress(activeContent.id, "viewed");
      
      // Update overall lesson progress (simple calculation based on content viewed)
      const progress = Math.min(100, Math.round(((activeContentIndex + 1) / contents.length) * 100));
      updateLessonProgress(progress);
    }
  }, [activeContentIndex, contents]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading content...</p>
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

  if (contents.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="flex justify-center mb-4">
            <FaBook className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">No Content Available</h3>
          <p className="mb-6 text-gray-600 text-center">There is no content for this lesson yet.</p>
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

  const activeContent = contents[activeContentIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <FaBook className="mr-3 text-blue-600" /> Lesson Content
              </h2>
              <p className="text-gray-600 mt-1">Review all content items for this lesson</p>
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Lesson Progress:</strong> {lessonProgress}% completed
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="mt-3 sm:mt-0 px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 font-medium transition-all shadow-md hover:shadow-lg"
            >
              Close
            </button>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Content List */}
            <div className="lg:w-1/3">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FaBook className="mr-2 text-blue-600" /> Content Items ({contents.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {contents.map((content, index) => (
                  <div 
                    key={content.id}
                    className={`flex items-center p-4 rounded-xl cursor-pointer transition-all border-2 ${
                      activeContentIndex === index 
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-500 shadow-sm" 
                        : "bg-white hover:bg-gray-50 border-gray-200"
                    }`}
                    onClick={() => setActiveContentIndex(index)}
                  >
                    <div className="mr-3 p-2 bg-white rounded-lg shadow">
                      {getContentIcon(content.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{content.title}</p>
                      <div className="flex items-center mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {content.type}
                        </span>
                        {contentProgress[content.id] && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {contentProgress[content.id]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
             
            {/* Content Viewer */}
            <div className="lg:w-2/3">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 min-h-96 flex items-center justify-center border border-gray-200">
                {activeContent ? (
                  <div className="w-full">
                    <div className="mb-5 pb-3 border-b border-gray-200">
                      <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                        {getContentIcon(activeContent.type)}
                        <span className="ml-2">{activeContent.title}</span>
                      </h3>
                      <div className="flex items-center mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-gray-800 border border-gray-200">
                          {activeContent.type} Content
                        </span>
                        {contentProgress[activeContent.id] && (
                          <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Status: {contentProgress[activeContent.id]}
                          </span>
                        )}
                      </div>
                    </div>
                    {renderContent(activeContent)}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaBook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg">Select a content item to view</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentViewer;