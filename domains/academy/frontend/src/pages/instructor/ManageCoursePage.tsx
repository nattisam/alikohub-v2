import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type {
  CourseModule,
  CourseLesson,
} from "../../components/common/types.d";
import { courseApi } from "../../api/courseApi";
import AddLessonModal from "../../components/instructor/AddLessonModal";
import AddModuleModal from "../../components/instructor/AddModuleModal";
import LessonEditor from "../../components/instructor/LessonEditor";

// Icons
import {
  CheckCircle,
  Plus,
  Video,
  File as LucideFile,
  Edit3,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  BookOpen,
  MoreHorizontal,
} from "lucide-react";

const ManageCoursePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const courseId = parseInt(id || "0", 10);

  // Layout State
  const [loading, setLoading] = useState(true);

  // Data State
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [moduleLessons, setModuleLessons] = useState<
    Record<number, CourseLesson[]>
  >({});
  const [lessonsLoading, setLessonsLoading] = useState<Record<number, boolean>>(
    {},
  );
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null);
  const [expandedLessonId, setExpandedLessonId] = useState<number | null>(null);
  const [lessonContent, setLessonContent] = useState<Record<number, any[]>>({});

  // Modals & Editors
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [editorState, setEditorState] = useState<{
    lessonId: number;
    moduleId: number;
  } | null>(null);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);

      // Fetch course
      const courseResponse = await courseApi.getCourse(courseId);
      const courseData = courseResponse.data;
      setCourse(courseData);

      // Fetch modules
      const modulesResponse = await courseApi.getModules(courseId);
      const mData = modulesResponse?.data;
      const modulesArray =
        mData && Array.isArray(mData.items)
          ? mData.items
          : Array.isArray(mData)
            ? mData
            : mData
              ? [mData]
              : [];
      setModules(modulesArray);

      // Initialize lessons map
      const initialLessons: Record<number, CourseLesson[]> = {};
      modulesArray.forEach((m: CourseModule) => {
        if (m && typeof m.id === "number") {
          initialLessons[m.id] = Array.isArray(m.lessons) ? m.lessons : [];
        }
      });
      setModuleLessons(initialLessons);
    } catch (err: any) {
      console.error("Error fetching course data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessonsForModule = async (moduleId: number) => {
    setLessonsLoading((prev) => ({ ...prev, [moduleId]: true }));
    try {
      const response = await courseApi.getInstructorLessons({
        moduleId: moduleId,
        page: 1,
        pageSize: 10,
      });

      const lessons =
        response.data?.items ||
        (Array.isArray(response.data) ? response.data : []);

      setModuleLessons((prev) => ({
        ...prev,
        [moduleId]: lessons,
      }));
    } catch (err) {
      console.error("Failed to load lessons for module", moduleId, err);
    } finally {
      setLessonsLoading((prev) => ({ ...prev, [moduleId]: false }));
    }
  };

  const toggleModule = (moduleId: number) => {
    if (expandedModuleId === moduleId) {
      setExpandedModuleId(null);
    } else {
      setExpandedModuleId(moduleId);
      fetchLessonsForModule(moduleId);
    }
  };

  const toggleLesson = (lessonId: number) => {
    if (expandedLessonId === lessonId) {
      setExpandedLessonId(null);
    } else {
      setExpandedLessonId(lessonId);
      if (!lessonContent[lessonId]) {
        fetchContentForLesson(lessonId);
      }
    }
  };

  const fetchContentForLesson = async (lessonId: number) => {
    try {
      const response = await courseApi.getInstructorContent({
        lessonId: lessonId,
        page: 1,
        pageSize: 10,
      });

      const items =
        response.data?.items ||
        (Array.isArray(response.data) ? response.data : []);
      setLessonContent((prev) => ({ ...prev, [lessonId]: items }));
    } catch (err) {
      console.error("Failed to fetch content for lesson", lessonId, err);
    } finally {
      // contentLoading removed
    }
  };

  const handleAddLessonClick = (moduleId: number) => {
    setSelectedModuleId(moduleId);
    setShowAddLessonModal(true);
  };

  const handleLessonCreated = (_: CourseLesson) => {
    if (selectedModuleId) fetchLessonsForModule(selectedModuleId);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f2ef]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a66c2]"></div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col font-sans text-[rgba(0,0,0,0.9)]">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 h-[52px] flex items-center justify-between shadow-none shrink-0">
        <div className="flex items-center gap-4 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-gray-800 hidden md:inline py-1 px-2 hover:bg-gray-100 rounded transition-colors cursor-pointer">
              Course Manager
            </span>
          </div>

          <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden md:block"></div>

          <div className="flex-1 flex items-center text-xs font-semibold text-gray-500">
            <span className="hover:text-gray-900 cursor-pointer">
              {course?.title}
            </span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Curriculum</span>
          </div>

          <button
            onClick={() => navigate("/instructor/mycourses")}
            className="text-[#0a66c2] hover:bg-blue-50 font-semibold px-4 py-1 rounded-full border border-[#0a66c2] transition-colors text-sm"
          >
            Exit Editor
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full flex gap-6 py-6 flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-12">
          {/* Status Banner */}
          {course?.status === "REJECTED" && (
            <div className="bg-[#fff3f2] border border-[#ffcfcc] rounded-lg p-4 flex gap-3 animate-in slide-in-from-top-2">
              <AlertCircle size={20} className="text-[#d11124] shrink-0" />
              <div>
                <h4 className="text-[#d11124] font-semibold text-sm">
                  Action Required
                </h4>
                <p className="text-gray-600 text-xs mt-0.5">
                  {course?.rejectionReason ||
                    "Please address feedback and resubmit."}
                </p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Curriculum Builder
                </h2>
                <p className="text-[12px] text-gray-500">
                  Build your course structure with modules and lessons.
                </p>
              </div>
              <button
                onClick={() => setShowAddModuleModal(true)}
                className="bg-[#0a66c2] text-white px-4 py-1.5 rounded-full font-semibold hover:bg-[#004182] transition flex items-center gap-1.5 text-sm"
              >
                <Plus size={16} /> Add Module
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {modules.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="text-gray-300" size={32} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 font-sans">
                    No modules added yet
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Get started by adding your first module.
                  </p>
                </div>
              ) : (
                modules.map((m) => (
                  <div key={m.id} className="group transition-colors">
                    <div
                      onClick={() => toggleModule(m.id)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <div className="cursor-grab text-gray-300 hover:text-gray-500">
                          <MoreHorizontal size={16} />
                        </div>
                        <div className="bg-gray-100 text-gray-600 p-2 rounded">
                          <BookOpen size={16} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-gray-900">
                            {m.title}
                          </h3>
                          <span className="text-[11px] text-gray-500 font-medium">
                            {moduleLessons[m.id]?.length || 0} Lessons
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {expandedModuleId === m.id ? (
                          <ChevronUp size={20} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-400" />
                        )}
                      </div>
                    </div>

                    {expandedModuleId === m.id && (
                      <div className="bg-[#f9fafb] px-4 pb-4 pt-0">
                        <div className="space-y-2 ml-10 border-l border-gray-200 pl-4 py-2">
                          {lessonsLoading[m.id] ? (
                            <div className="flex items-center gap-2 text-gray-400 py-3 text-[11px] italic">
                              <div className="animate-spin h-3 w-3 border-b border-gray-400 rounded-full"></div>
                              Updating lessons...
                            </div>
                          ) : (
                            (moduleLessons[m.id] || []).map((l) => (
                              <div key={l.id} className="space-y-1">
                                <div
                                  className={`flex justify-between items-center py-2.5 px-3 bg-white border rounded transition-all text-sm group/lesson cursor-pointer ${expandedLessonId === l.id ? "border-blue-400 shadow-sm" : "border-gray-200 hover:border-blue-300"}`}
                                  onClick={() => toggleLesson(l.id)}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="text-gray-400">
                                      {l.type === "VIDEO" ? (
                                        <Video size={14} />
                                      ) : (
                                        <LucideFile size={14} />
                                      )}
                                    </div>
                                    <span
                                      className={`font-medium text-[13px] ${expandedLessonId === l.id ? "text-blue-600" : "text-gray-700"}`}
                                    >
                                      {l.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditorState({
                                          lessonId: l.id,
                                          moduleId: m.id,
                                        });
                                      }}
                                      className="text-[#0a66c2] hover:text-[#004182] font-semibold text-[12px] opacity-0 group-hover/lesson:opacity-100 transition-opacity flex items-center gap-1"
                                    >
                                      <Edit3 size={12} /> Edit
                                    </button>
                                    {expandedLessonId === l.id ? (
                                      <ChevronUp
                                        size={14}
                                        className="text-blue-400"
                                      />
                                    ) : (
                                      <ChevronDown
                                        size={14}
                                        className="text-gray-400"
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddLessonClick(m.id);
                            }}
                            className="w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-gray-300 rounded text-gray-500 text-xs font-semibold hover:border-[#0a66c2] hover:text-[#0a66c2] hover:bg-blue-50 transition-all mt-2"
                          >
                            <Plus size={14} /> Add Lesson
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - LinkedIn Style Profile-like Overview */}
        <div className="w-[300px] space-y-4 shrink-0 hidden lg:block">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="h-14 bg-gray-100 border-b border-gray-200 flex items-center px-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Course Status
              </span>
            </div>
            <div className="p-4 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">Current Status</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    course?.status === "PUBLISHED"
                      ? "bg-green-100 text-green-800"
                      : course?.status === "PENDING_APPROVAL"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {course?.status}
                </span>
              </div>
              <h1 className="text-base font-bold text-gray-900 leading-snug mb-1">
                {course?.title}
              </h1>
              <p className="text-[12px] text-gray-500 mb-4 line-clamp-2">
                {course?.shortDescription}
              </p>

              <div className="border-t border-gray-100 pt-4 mt-4 space-y-3">
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Modules</span>
                  <span className="font-semibold text-gray-900">
                    {modules.length}
                  </span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Total Lessons</span>
                  <span className="font-semibold text-gray-900">
                    {Object.values(moduleLessons).flat().length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 text-[12px] text-gray-500">
            <div className="flex items-center gap-2 mb-2 text-gray-900">
              <CheckCircle size={14} />
              <span className="font-semibold">Instructor Tips</span>
            </div>
            <ul className="space-y-1.5 list-disc pl-4 marker:text-gray-300">
              <li>Keep lesson titles concise and clear.</li>
              <li>Add a mix of video and text content.</li>
              <li>Structure modules to follow a logical path.</li>
            </ul>
          </div>
        </div>
      </div>

      {showAddLessonModal && selectedModuleId && (
        <AddLessonModal
          moduleId={selectedModuleId}
          isOpen={showAddLessonModal}
          onClose={() => setShowAddLessonModal(false)}
          onLessonAdded={handleLessonCreated}
        />
      )}

      {showAddModuleModal && (
        <AddModuleModal
          courseId={courseId}
          isOpen={showAddModuleModal}
          onClose={() => setShowAddModuleModal(false)}
          onModuleAdded={() => {
            fetchCourseData();
            setShowAddModuleModal(false);
          }}
        />
      )}

      {editorState && (
        <LessonEditor
          lessonId={editorState.lessonId}
          moduleId={editorState.moduleId}
          onClose={() => setEditorState(null)}
          onUpdate={() => fetchLessonsForModule(editorState.moduleId)}
        />
      )}
    </div>
  );
};

export default ManageCoursePage;
