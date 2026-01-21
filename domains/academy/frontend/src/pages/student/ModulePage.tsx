import React, { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useCourse } from "../../queries/courseQueries";
import { useCourseModules } from "../../queries/moduleQueries";
import {
  FaChevronDown,
  FaChevronRight,
  FaFile,
  FaVideo,
  FaFilePdf,
} from "react-icons/fa";
import type { CourseModule, CourseLesson } from "../../components/common/types.d";

const ModulePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle both numeric courseId and course title format (course-title-id)
  const parsedCourseId = isNaN(Number(courseId)) ? parseInt(courseId?.split('-').pop() || '0') : Number(courseId);

  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [completedLessons] = useState<number[]>([]);
  const [error] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Get selected lesson ID from URL params
  const selectedLessonId = searchParams.get('lesson');

  const { data: courseData, isLoading: isCourseLoading, isError: isCourseError } = useCourse(parsedCourseId);
  const { data: modules = [], isLoading: areModulesLoading, isError: areModulesError } = useCourseModules(parsedCourseId);

  useEffect(() => {
    if (modules.length > 0) {
      // If there's a selected lesson ID in the URL, find that lesson
      if (selectedLessonId) {
        const lessonIdNum = parseInt(selectedLessonId);
        for (const module of modules) {
          const foundLesson = module.lessons.find((lesson: CourseLesson) => lesson.id === lessonIdNum);
          if (foundLesson) {
            setSelectedLesson(foundLesson);
            return;
          }
        }
      }
      
      // If no lesson is selected yet, auto-select the first lesson of the first module
      if (!selectedLesson) {
        const firstModule = modules[0];
        if (firstModule && firstModule.lessons.length > 0) {
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
    setCurrentContentIndex(0); // Reset to first content when changing lessons
    
    // Update URL to reflect selected lesson
    setSearchParams({ lesson: lesson.id.toString() });
  };

  const renderContent = () => {
    if (!selectedLesson?.contents?.length) {
      return (
        <div className="w-full h-96 flex items-center justify-center bg-gray-800 rounded-lg">
          <p className="text-gray-300">No content available for this lesson.</p>
        </div>
      );
    }

    const current = selectedLesson.contents[currentContentIndex];

    switch (current.type) {
      case "VIDEO":
        return (
          <div className="w-full bg-gray-800 rounded-lg overflow-hidden">
            <video
              src={current.contentUrl || current.content}
              controls
              className="w-full max-h-[500px]"
            />
          </div>
        );
      case "PDF":
        return (
          <div className="w-full rounded-lg overflow-hidden bg-white">
            <iframe
              src={current.contentUrl || current.content}
              className="w-full h-[500px]"
              title="PDF Content"
            />
          </div>
        );
      case "TEXT":
        return (
          <div className="w-full bg-white rounded-lg p-6">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: current.content || "" }}
            />
          </div>
        );
      default:
        return (
          <div className="w-full h-96 flex items-center justify-center bg-gray-800 rounded-lg">
            <p className="text-gray-300">Unsupported content type</p>
          </div>
        );
    }
  };

  const getContentIcon = (type: string) => {
    if (type === "VIDEO") return <FaVideo className="text-red-500" />;
    if (type === "PDF") return <FaFilePdf className="text-red-600" />;
    return <FaFile className="text-blue-500" />;
  };

  const calculateProgress = () => {
    const lessons = modules.flatMap((m: CourseModule) => m.lessons);
    
    const completed = lessons.filter((l: CourseLesson) =>
      completedLessons.includes(l.id)
    ).length;
    return Math.round((completed / lessons.length) * 100);
  };

  if (isCourseError) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 text-center text-red-600">
        Failed to load course information
      </div>
    );
  }

  if (areModulesError) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 text-center text-red-600">
        Failed to load course modules
      </div>
    );
  }

  if (isCourseLoading || areModulesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Grid Layout: Left Side (Content) + Right Sidebar (Navigation) */}
      <div className="flex flex-col lg:flex-row h-screen">
        {/* LEFT SIDE: Main Content Area */}
        <div className="lg:w-2/3 xl:w-3/4 bg-white p-6 overflow-y-auto">
          {/* BACK BUTTON */}
          <Link
            to="/student-dashboard/mycourses"
            className="text-blue-600 hover:underline mb-6 inline-flex items-center"
          >
            <span className="mr-2">←</span> Back to My Courses
          </Link>

          {/* COURSE HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {courseData?.title || "Loading..."}
            </h1>
            <p className="mt-2 text-gray-600 max-w-3xl">
              {courseData?.longDescription || ""}
            </p>
            
            <div className="mt-4 flex items-center gap-4">
              <div className="w-64">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${calculateProgress()}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {calculateProgress()}% complete
                </p>
              </div>
              
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Continue Learning
              </button>
            </div>
          </div>

          {/* MAIN CONTENT: Video/Content + Description */}
          <div className="space-y-6">
            {/* VIDEO/CONTENT PLAYER */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="aspect-video bg-black">
                {renderContent()}
              </div>
            </div>

            {/* LESSON INFO */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {selectedLesson?.title || "Select a lesson"}
              </h3>

              <div className="mt-2 text-sm text-gray-500 flex gap-4">
                <span className="flex items-center gap-1">
                  <span>⏱</span> {(selectedLesson?.title?.length ?? 0 % 12) + 5}:{( (selectedLesson?.title?.length ?? 0) * 7 % 60).toString().padStart(2, '0')}
                </span>
                <span className="flex items-center gap-1">
                  <span>📅</span> Updated recently
                </span>
              </div>

              {selectedLesson?.contents && selectedLesson.contents.length > 1 && (
                <div className="mt-4 flex gap-2">
                  {selectedLesson.contents.map((_content, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentContentIndex(index)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentContentIndex === index
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Part {index + 1}
                    </button>
                  ))}
                </div>
              )}

              {selectedLesson?.description && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedLesson.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: Course Navigation */}
        <div className="lg:w-1/3 xl:w-1/4 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 truncate">
              {courseData?.title || "Course Content"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {modules.reduce((total, module) => total + module.lessons.length, 0)} lessons
            </p>
          </div>

          {/* SEARCH */}
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          {/* MODULES AND LESSONS LIST */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {modules
                .filter(
                  (module) =>
                    searchTerm === "" ||
                    module.title
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    module.lessons.some((lesson) =>
                      lesson.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                )
                .map((module) => (
                  <div key={module.id} className="border border-gray-200 rounded-lg mb-2">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex justify-between items-center px-4 py-3 text-left hover:bg-gray-50 rounded-t-lg"
                    >
                      <span className="font-medium text-gray-900 truncate">{module.title}</span>
                      {expandedModules[module.id] ? (
                        <FaChevronDown className="text-gray-500" />
                      ) : (
                        <FaChevronRight className="text-gray-500" />
                      )}
                    </button>

                    {(expandedModules[module.id] || searchTerm) && (
                      <div className="border-t border-gray-200 bg-white rounded-b-lg">
                        {module.lessons
                          .filter(
                            (lesson) =>
                              searchTerm === "" ||
                              lesson.title
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                          )
                          .map((lesson) => (
                            <div
                              key={lesson.id}
                              onClick={() => handleSelectLesson(lesson)}
                              className={`flex items-center gap-3 px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                                selectedLesson?.id === lesson.id
                                  ? "bg-blue-50 border-l-4 border-blue-500"
                                  : ""
                              }`}
                            >
                              <div className="flex-shrink-0">
                                {getContentIcon(lesson.type)}
                              </div>
                              <span className="truncate">{lesson.title}</span>
                              {lesson.isCompleted && (
                                <span className="ml-auto text-green-600 text-xs">✓</span>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulePage;
