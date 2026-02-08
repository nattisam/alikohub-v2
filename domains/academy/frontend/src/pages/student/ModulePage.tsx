import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useCourse } from "../../queries/courseQueries";
import { useCourseModules } from "../../queries/moduleQueries";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Play,
  FileText,
  Video,
  Clock,
  PlayCircle,
  Search,
  BookOpen,
  Info,
  Award,
} from "lucide-react";
import ErrorState from "../../components/states/ErrorState";

const ModulePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedModules, setExpandedModules] = useState<
    Record<number, boolean>
  >({});

  // Parse courseId
  const parsedCourseId = isNaN(Number(courseId))
    ? parseInt(courseId?.split("-").pop() || "0")
    : Number(courseId);

  const {
    data: courseData,
    isLoading: isCourseLoading,
    isError: isCourseError,
  } = useCourse(parsedCourseId);
  const { data: modules = [], isLoading: areModulesLoading } =
    useCourseModules(parsedCourseId);

  // Initialize expanded modules
  useEffect(() => {
    if (modules.length > 0 && Object.keys(expandedModules).length === 0) {
      const initial: Record<number, boolean> = {};
      modules.forEach((m, idx) => {
        initial[m.id] = idx === 0; // Expand first by default
      });
      setExpandedModules(initial);
    }
  }, [modules]);

  const toggleModule = (id: number) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const navigateToLesson = (lesson: any) => {
    navigate(`/student-dashboard/course/${courseId}/lesson/${lesson.id}`);
  };

  if (isCourseLoading || areModulesLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-10 w-10 border-b-2 border-[#0a66c2] rounded-full" />
          <p className="text-gray-500 font-medium text-sm animate-pulse">
            Loading course architecture...
          </p>
        </div>
      </div>
    );
  }

  if (isCourseError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <ErrorState
          title="Curriculum Unavailable"
          message="We couldn't retrieve the curriculum for this course. Please try again later."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const totalLessons = modules.reduce(
    (acc, m) => acc + (m.lessons?.length || 0),
    0,
  );
  const completedCount = 0; // Mock until progress is integrated
  const progressPercent =
    totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20 selection:bg-[#3E92D1]/10">
      {/* Premium Header Nav */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/student-dashboard/mycourses")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="h-8 w-[1px] bg-gray-200 mx-1"></div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-gray-900 truncate max-w-[300px] md:max-w-[500px]">
                {courseData?.title}
              </h1>
              <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
                Course Curriculum
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-xs font-bold text-gray-900">
                {progressPercent.toFixed(0)}% Complete
              </span>
              <div className="w-32 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <button
              onClick={() => {
                const firstLesson = modules[0]?.lessons?.[0];
                if (firstLesson) navigateToLesson(firstLesson);
              }}
              className="bg-[#3E92D1] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-blue-500/10 hover:bg-[#2d7bb5] transition-all flex items-center gap-2"
            >
              <Play size={14} fill="white" />
              Continue Learning
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-6 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Curriculum Content */}
        <div className="lg:col-span-8">
          {/* Summary Row */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8 flex flex-wrap gap-8 items-center">
            <div className="flex items-center gap-4 text-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#0a66c2]">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-tight">
                  Total Modules
                </p>
                <p className="text-gray-900 font-bold">{modules.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Video size={20} />
              </div>
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-tight">
                  Total Lessons
                </p>
                <p className="text-gray-900 font-bold">{totalLessons}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                <Award size={20} />
              </div>
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-tight">
                  Level
                </p>
                <p className="text-gray-900 font-bold">
                  {courseData?.targetLevel || "In-Progress"}
                </p>
              </div>
            </div>
          </div>

          {/* Curriculum Section */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Learning Path</h2>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:ring-1 focus:ring-[#0a66c2] transition-all w-48 md:w-64"
              />
            </div>
          </div>

          <div className="space-y-4">
            {modules.map((module, mIdx) => {
              const lessons = module.lessons || [];
              const filteredLessons = lessons.filter(
                (l) =>
                  !searchTerm ||
                  l.title.toLowerCase().includes(searchTerm.toLowerCase()),
              );
              const isExpanded = expandedModules[module.id] || searchTerm;

              if (searchTerm && filteredLessons.length === 0) return null;

              return (
                <div
                  key={module.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group duration-300"
                >
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-gray-50/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 border border-gray-200">
                        {mIdx + 1}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                          {module.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 font-medium italic">
                          {lessons.length}{" "}
                          {lessons.length === 1 ? "lesson" : "lessons"} • 1.5
                          hours
                        </p>
                      </div>
                    </div>
                    <div className="p-1.5 rounded-full bg-transparent group-hover:bg-gray-100 transition-all">
                      {isExpanded ? (
                        <ChevronDown size={20} className="text-gray-600" />
                      ) : (
                        <ChevronRight size={20} className="text-gray-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-white">
                      {filteredLessons.length > 0 ? (
                        <div className="divide-y divide-gray-50">
                          {filteredLessons.map((lesson, lIdx) => (
                            <div
                              key={lesson.id}
                              onClick={() => navigateToLesson(lesson)}
                              className="group/lesson flex items-center justify-between p-4 pl-12 hover:bg-blue-50/30 cursor-pointer transition-all"
                            >
                              <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-gray-50 text-gray-400 group-hover/lesson:bg-white group-hover/lesson:text-[#0a66c2] transition-all border border-transparent group-hover/lesson:border-blue-100">
                                  {lesson.type === "VIDEO" ? (
                                    <Video size={16} />
                                  ) : (
                                    <FileText size={16} />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-700 group-hover/lesson:text-[#0a66c2] transition-colors">
                                    {lIdx + 1}. {lesson.title}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                      {lesson.type}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                                      <Clock size={10} /> 15 mins
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="opacity-0 translate-x-4 group-hover/lesson:opacity-100 group-hover/lesson:translate-x-0 transition-all flex items-center gap-3">
                                <span className="text-[10px] font-bold text-[#0a66c2] uppercase tracking-widest">
                                  Watch Now
                                </span>
                                <div className="p-1 bg-[#0a66c2] rounded-full text-white shadow-lg shadow-blue-200">
                                  <ChevronRight size={14} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-10 text-center">
                          <Info
                            size={32}
                            className="mx-auto text-gray-200 mb-3"
                          />
                          <p className="text-sm text-gray-400 italic font-medium">
                            No results matching your search in this module.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Instructor & Additional Info */}
        <div className="lg:col-span-4 space-y-6">
          {/* About Course Sticky Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-24">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Info size={14} className="text-[#0a66c2]" />
              Mastery Insights
            </h4>

            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-2">
                  Instructor
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0a66c2] flex items-center justify-center text-white font-bold text-sm">
                    {courseData?.instructor?.firstname?.charAt(0) || "I"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                      {courseData?.instructor
                        ? `${courseData.instructor.firstname} ${courseData.instructor.lastname || ""}`
                        : "Senior Academy Tutor"}
                    </p>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Verified Expert Instructor
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-2">
                  Description
                </p>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
                  {courseData?.shortDescription ||
                    "Unlock the potential of this advanced curriculum designed to bridge the gap between theory and real-world application."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                  <PlayCircle
                    size={16}
                    className="mx-auto text-blue-500 mb-1"
                  />
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                    On-Demand
                  </p>
                  <p className="text-xs font-bold text-gray-900 mt-1">
                    Full Access
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                  <Award size={16} className="mx-auto text-yellow-500 mb-1" />
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                    Certificate
                  </p>
                  <p className="text-xs font-bold text-gray-900 mt-1">
                    Included
                  </p>
                </div>
              </div>

              <button className="w-full bg-white border-2 border-[#0a66c2] text-[#0a66c2] font-bold py-2 rounded-full text-sm hover:bg-blue-50 transition-all mt-4">
                Share Curriculum
              </button>
            </div>
          </div>

          <div className="bg-[#0a66c2] rounded-xl p-6 text-white shadow-xl shadow-blue-100">
            <h4 className="font-bold text-sm mb-2">Need dedicated help?</h4>
            <p className="text-xs text-blue-100 leading-relaxed mb-4">
              Our specialized tutors are standing by to guide you through this
              path.
            </p>
            <button className="w-full bg-white text-[#0a66c2] py-2 rounded-full text-xs font-bold hover:bg-blue-50 transition-all">
              Schedule Mentor Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulePage;
