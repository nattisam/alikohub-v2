import React, { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useCourse } from "../../queries/courseQueries";
import { useCourseModules } from "../../queries/moduleQueries";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  FileText,
  Video,
  File,
  Clock,
  Calendar,
  CheckCircle,
  PlayCircle,
} from "lucide-react";
import type { CourseLesson } from "../../components/common/types.d";
import ErrorState from "../../components/states/ErrorState";

const ModulePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle both numeric courseId and course title format (course-title-id)
  const parsedCourseId = isNaN(Number(courseId))
    ? parseInt(courseId?.split("-").pop() || "0")
    : Number(courseId);

  const [expandedModules, setExpandedModules] = useState<
    Record<number, boolean>
  >({});
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(
    null,
  );
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [completedLessons] = useState<number[]>([]);
  const [error] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Get selected lesson ID from URL params
  const selectedLessonId = searchParams.get("lesson");

  const {
    data: courseData,
    isLoading: isCourseLoading,
    isError: isCourseError,
  } = useCourse(parsedCourseId);
  const {
    data: modules = [],
    isLoading: areModulesLoading,
    isError: areModulesError,
  } = useCourseModules(parsedCourseId);

  useEffect(() => {
    if (Array.isArray(modules) && modules.length > 0) {
      if (selectedLessonId) {
        const lessonIdNum = parseInt(selectedLessonId, 10);
        for (const module of modules) {
          if (Array.isArray(module?.lessons)) {
            const foundLesson = module.lessons.find(
              (lesson: CourseLesson) => lesson?.id === lessonIdNum,
            );
            if (foundLesson) {
              setSelectedLesson(foundLesson);
              return;
            }
          }
        }
      }

      if (!selectedLesson) {
        const firstModule = modules[0];
        if (
          firstModule &&
          Array.isArray(firstModule.lessons) &&
          firstModule.lessons.length > 0
        ) {
          setSelectedLesson(firstModule.lessons[0]);
        }
      }
    }
  }, [modules, selectedLesson, selectedLessonId]);

  const toggleModule = (id: number) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectLesson = (lesson: CourseLesson) => {
    setSelectedLesson(lesson);
    setCurrentContentIndex(0);
    setSearchParams({ lesson: lesson.id.toString() });
  };

  const renderContent = () => {
    if (!selectedLesson?.contents?.length) {
      return (
        <div className="w-full h-96 flex items-center justify-center bg-gray-900 rounded-lg">
          <p className="text-gray-400 flex items-center gap-2">
            <FileText size={20} />
            No content available for this lesson.
          </p>
        </div>
      );
    }

    const current = selectedLesson.contents[currentContentIndex];

    switch (current.type) {
      case "VIDEO":
        return (
          <div className="w-full bg-black rounded-lg overflow-hidden">
            <video
              src={current.contentUrl || current.content}
              controls
              className="w-full max-h-[500px]"
            />
          </div>
        );
      case "PDF":
        return (
          <div className="w-full rounded-lg overflow-hidden bg-white border border-gray-200">
            <iframe
              src={current.contentUrl || current.content}
              className="w-full h-[600px]"
              title="PDF Content"
            />
          </div>
        );
      case "TEXT":
        return (
          <div className="w-full bg-white rounded-lg p-8 border border-gray-200">
            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: current.content || "" }}
            />
          </div>
        );
      default:
        return (
          <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
            <p className="text-gray-500">Unsupported content type</p>
          </div>
        );
    }
  };

  const getContentIcon = (type: string) => {
    if (type === "VIDEO") return <Video size={16} className="text-blue-500" />;
    if (type === "PDF") return <FileText size={16} className="text-red-500" />;
    return <File size={16} className="text-gray-500" />;
  };

  if (isCourseError || areModulesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
        <ErrorState
          title="Failed to Load Content"
          message="We couldn't load the course modules. Please try again later."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (isCourseLoading || areModulesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-[#3E92D1] rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Top Navigation */}
        <Link
          to="/student-dashboard/mycourses"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to My Courses
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {courseData?.title}
              </h1>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {courseData?.longDescription}
              </p>

              <div className="flex flex-wrap gap-6 text-sm text-gray-500 pt-4 border-t border-gray-100">
                <span className="flex items-center gap-2">
                  <PlayCircle size={16} className="text-[#3E92D1]" />
                  {Array.isArray(modules)
                    ? modules.reduce((t, m) => t + (m?.lessons?.length || 0), 0)
                    : 0}{" "}
                  Lessons
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={16} className="text-[#3E92D1]" />
                  {courseData?.estimatedTime
                    ? `${Math.floor(courseData.estimatedTime / 60)}h ${courseData.estimatedTime % 60}m`
                    : "N/A"}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#3E92D1]" />
                  Updated recently
                </span>
              </div>
            </div>

            {/* Content Area */}
            <div className="space-y-4">
              {/* Video/Content Player */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {renderContent()}
              </div>

              {/* Lesson Details Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedLesson?.title || "Select a lesson"}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Clock size={14} />
                      {selectedLesson?.duration
                        ? `${selectedLesson.duration}m`
                        : "15 min"}
                    </div>
                  </div>
                  {selectedLesson?.isCompleted && (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      <CheckCircle size={12} /> Completed
                    </span>
                  )}
                </div>

                {Array.isArray(selectedLesson?.contents) &&
                  selectedLesson.contents.length > 1 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedLesson.contents.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentContentIndex(i)}
                          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                            currentContentIndex === i
                              ? "bg-[#3E92D1] text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          Part {i + 1}
                        </button>
                      ))}
                    </div>
                  )}

                {selectedLesson?.description && (
                  <div className="prose prose-sm max-w-none text-gray-600">
                    <p>{selectedLesson.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR (Curriculum) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-140px)] sticky top-6">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Course Content</h3>
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Search lessons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#3E92D1]"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                {Array.isArray(modules) &&
                  modules.map((module, idx) => (
                    <div
                      key={module.id}
                      className="border border-gray-100 rounded-md overflow-hidden"
                    >
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                      >
                        <span className="text-sm font-medium text-gray-900 line-clamp-1">
                          Module {idx + 1}: {module.title}
                        </span>
                        {expandedModules[module.id] ? (
                          <ChevronDown size={14} className="text-gray-500" />
                        ) : (
                          <ChevronRight size={14} className="text-gray-500" />
                        )}
                      </button>

                      {(expandedModules[module.id] || searchTerm) && (
                        <div className="bg-white border-t border-gray-100">
                          {Array.isArray(module?.lessons) &&
                            module.lessons
                              .filter(
                                (l) =>
                                  !searchTerm ||
                                  l?.title
                                    ?.toLowerCase()
                                    ?.includes(searchTerm.toLowerCase()),
                              )
                              .map((lesson) => (
                                <div
                                  key={lesson.id}
                                  onClick={() => handleSelectLesson(lesson)}
                                  className={`flex items-start gap-3 px-3 py-3 text-sm cursor-pointer border-l-2 transition-colors ${
                                    selectedLesson?.id === lesson.id
                                      ? "bg-blue-50 border-[#3E92D1]"
                                      : "border-transparent hover:bg-gray-50"
                                  }`}
                                >
                                  <div className="mt-0.5 shrink-0">
                                    {getContentIcon(lesson.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className={`font-medium truncate ${selectedLesson?.id === lesson.id ? "text-[#3E92D1]" : "text-gray-700"}`}
                                    >
                                      {lesson.title}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      {lesson.duration
                                        ? `${lesson.duration}m`
                                        : "15m"}
                                    </p>
                                  </div>
                                  {completedLessons.includes(lesson.id) && (
                                    <CheckCircle
                                      size={14}
                                      className="text-green-500 shrink-0"
                                    />
                                  )}
                                </div>
                              ))}
                          {(!module.lessons || module.lessons.length === 0) && (
                            <div className="p-3 text-xs text-gray-400 italic">
                              No lessons
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulePage;
