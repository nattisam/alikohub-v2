import React, { useState, useEffect } from "react";
import InstructorNavbar from "@/components/InstructorNavbar";
import {
  ArrowLeft,
  Save,
  Eye,
  Layout,
  Book,
  Settings as SettingsIcon,
  BarChart3,
  Calendar,
  Send,
  PlusCircle,
  ChevronRight,
  MonitorPlay,
  FileText,
  Plus,
  PlusSquare,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { BasicInfoTab } from "@/pages/Courses/components/BasicInfoTab.tsx";
import { CurriculumTab } from "@/pages/Courses/components/CurriculumTab.tsx";
import { SettingsTab } from "@/pages/Courses/components/SettingsTab.tsx";
import { AnalyticsTab } from "@/pages/Courses/components/AnalyticsTab.tsx";
import { ScheduleTab } from "@/pages/Courses/components/ScheduleTab.tsx";
import { CohortsTab } from "@/pages/Courses/components/CohortsTab.tsx";
import { ModuleModal } from "@/pages/Courses/components/ModuleModal.tsx";
import { LessonModal } from "@/pages/Courses/components/LessonModal.tsx";
import { ContentModal } from "@/pages/Courses/components/ContentModal.tsx";
import { ExerciseModal } from "@/pages/Courses/components/ExerciseModal.tsx";
import { PreviewModal } from "@/pages/Courses/components/PreviewModal.tsx";
import {
  useCourseDetails,
  useCreateCourse,
  useUpdateCourse,
  useCreateModule,
  useDeleteModule,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
  useSubmitCourseForApproval,
  useCreateContent,
  useDeleteContent,
  useCreateExercisesBulk,
  useDeleteExercise,
} from "@/hooks/useAcademy";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";

const InstructorCourseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== "new";
  const { data: course, isLoading } = useCourseDetails(isEdit ? id : "");

  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const createModuleMutation = useCreateModule();
  const deleteModuleMutation = useDeleteModule();
  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();
  const deleteLessonMutation = useDeleteLesson();
  const submitCourseMutation = useSubmitCourseForApproval();
  const createContentMutation = useCreateContent();
  const deleteContentMutation = useDeleteContent();
  const createExerciseMutation = useCreateExercisesBulk();
  const deleteExerciseMutation = useDeleteExercise();

  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    category: "",
    price: "0",
    thumbnail: null as File | null,
  });

  // Modal states
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [previewContent, setPreviewContent] = useState<any>(null);

  // Curriculum Selection State (Lifted from CurriculumTab)
  const [selectedCurriculumItem, setSelectedCurriculumItem] = useState<{
    type: "CONTENT" | "EXERCISE" | "OVERVIEW" | "LESSON";
    data: any;
    moduleId?: string;
    lessonId?: string;
  } | null>(null);

  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({});

  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonType, setLessonType] = useState("VIDEO");

  // Delete states
  const [deleteConfig, setDeleteConfig] = useState<{
    type: "module" | "lesson" | "content" | "exercise";
    id: string;
    title: string;
  } | null>(null);

  const showCurriculum = course && course.status !== "REJECTED";

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        shortDescription: course.shortDescription || "",
        category: course.category || "",
        price: course.price?.toString() || "0",
        thumbnail: null,
      });
    }
  }, [course]);

  const handleSaveBasicInfo = async () => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("shortDescription", formData.shortDescription);
    data.append("category", formData.category);
    data.append("price", formData.price.toString());
    data.append("status", "DRAFT");
    if (formData.thumbnail) {
      data.append("thumbnail", formData.thumbnail);
    }

    if (isEdit) {
      updateCourseMutation.mutate({ courseId: id!, formData: data });
    } else {
      createCourseMutation.mutate(data, {
        onSuccess: (newCourse) => {
          navigate(`/instructor/courses/${newCourse.id}`);
        },
      });
    }
  };

  const handleAddModule = () => {
    if (!isEdit) {
      toast.error("Please save course basic info first");
      return;
    }
    setModuleTitle("");
    setModuleDescription("");
    setIsModuleModalOpen(true);
  };

  const handleCreateModule = () => {
    if (!moduleTitle.trim()) {
      toast.error("Module title is required");
      return;
    }
    createModuleMutation.mutate(
      {
        courseId: id!,
        title: moduleTitle,
        description: moduleDescription || undefined,
      },
      {
        onSuccess: () => {
          setIsModuleModalOpen(false);
          setModuleTitle("");
          setModuleDescription("");
        },
      },
    );
  };

  const handleAddLesson = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setLessonTitle("");
    setLessonType("VIDEO");
    setIsLessonModalOpen(true);
  };

  const handleCreateLesson = () => {
    if (!lessonTitle.trim()) {
      toast.error("Lesson title is required");
      return;
    }
    createLessonMutation.mutate(
      {
        moduleId: selectedModuleId,
        title: lessonTitle,
        type: lessonType,
      },
      {
        onSuccess: () => {
          setIsLessonModalOpen(false);
          setLessonTitle("");
          setLessonType("VIDEO");
        },
      },
    );
  };

  const handleAddContent = (moduleId: string, lessonId: string) => {
    setSelectedModuleId(moduleId);
    setSelectedLessonId(lessonId);
    setIsContentModalOpen(true);
  };

  const handleCreateContent = (data: any) => {
    createContentMutation.mutate(data, {
      onSuccess: () => {
        setIsContentModalOpen(false);
      },
    });
  };

  const handleAddExercise = (moduleId: string, lessonId: string) => {
    setSelectedModuleId(moduleId);
    setSelectedLessonId(lessonId);
    setIsExerciseModalOpen(true);
  };

  const handleCreateExercise = (data: { dtos: any[] }) => {
    createExerciseMutation.mutate(data, {
      onSuccess: () => {
        setIsExerciseModalOpen(false);
      },
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfig) return;

    const { type, id: deleteId } = deleteConfig;

    if (type === "module") {
      deleteModuleMutation.mutate(
        { moduleId: deleteId, courseId: id! },
        { onSuccess: () => setDeleteConfig(null) },
      );
    } else if (type === "lesson") {
      deleteLessonMutation.mutate(
        { lessonId: deleteId, courseId: id! },
        { onSuccess: () => setDeleteConfig(null) },
      );
    } else if (type === "content") {
      deleteContentMutation.mutate(deleteId, {
        onSuccess: () => setDeleteConfig(null),
      });
    } else if (type === "exercise") {
      deleteExerciseMutation.mutate(deleteId, {
        onSuccess: () => setDeleteConfig(null),
      });
    }
  };

  const handleView = (content: any) => {
    setSelectedCurriculumItem({
      type: "CONTENT",
      data: content,
      moduleId: selectedCurriculumItem?.moduleId,
      lessonId: selectedCurriculumItem?.lessonId,
    });
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const handleLessonSelect = (lesson: any, moduleId: string) => {
    setActiveTab("curriculum");
    setSelectedCurriculumItem({
      type: "LESSON",
      data: lesson,
      moduleId,
      lessonId: lesson.id,
    });
  };

  const handleSubmitForApproval = () => {
    if (!id) return;
    submitCourseMutation.mutate(id, {
      onSuccess: () => {
        // Course status will be updated via query invalidation
      },
    });
  };

  // Tab content rendering
  const renderTabContent = () => {
    if (activeTab === "basic") {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-heading">
                Course Basics
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Set up your course title, description, and pricing.
              </p>
            </div>
            <Button
              onClick={handleSaveBasicInfo}
              disabled={
                createCourseMutation.isPending || updateCourseMutation.isPending
              }
              className="gap-2 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white h-11 px-8 shadow-lg shadow-primary/20 transition-all"
            >
              <Save className="w-4 h-4" />
              {isEdit ? "Save Changes" : "Create Course"}
            </Button>
          </div>
          <BasicInfoTab
            formData={formData}
            course={course}
            onFormDataChange={setFormData}
          />
        </div>
      );
    }

    if (activeTab === "curriculum" && showCurriculum) {
      return (
        <CurriculumTab
          course={course}
          selectedItem={selectedCurriculumItem}
          onSetSelectedItem={setSelectedCurriculumItem}
          onAddModule={handleAddModule}
          onAddLesson={handleAddLesson}
          onUpdateLesson={(lid, data) =>
            updateLessonMutation.mutate({ lessonId: lid, ...data })
          }
          onAddContent={handleAddContent}
          onAddExercise={handleAddExercise}
          onDeleteModule={(mid) =>
            setDeleteConfig({ type: "module", id: mid, title: "Module" })
          }
          onDeleteLesson={(lid) =>
            setDeleteConfig({ type: "lesson", id: lid, title: "Lesson" })
          }
          onDeleteContent={(cid) =>
            setDeleteConfig({ type: "content", id: cid, title: "Content" })
          }
          onDeleteExercise={(eid) =>
            setDeleteConfig({ type: "exercise", id: eid, title: "Exercise" })
          }
          onView={handleView}
          isRejected={course?.status === "REJECTED"}
        />
      );
    }

    if (activeTab === "settings") {
      return (
        <SettingsTab
          course={course}
          onSubmitForApproval={handleSubmitForApproval}
          isSubmitting={submitCourseMutation.isPending}
        />
      );
    }

    if (activeTab === "analytics" && isEdit) {
      return <AnalyticsTab courseId={id!} />;
    }

    if (activeTab === "schedule" && isEdit) {
      return <ScheduleTab courseId={id!} />;
    }

    if (activeTab === "cohorts" && isEdit) {
      return <CohortsTab courseId={id!} />;
    }

    return null;
  };

  if (isLoading && isEdit) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-64 mx-auto" />
          <p className="text-slate-500 animate-pulse">
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col h-full z-30 flex-shrink-0">
        <div className="p-6 border-b border-slate-50 space-y-4">
          <Link
            to="/instructor/courses"
            className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Courses
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">
              {isEdit ? course?.title : "New Course"}
            </h1>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
              Instructor Suite
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Main Navigation */}
          <div className="p-4 space-y-1">
            {[
              { id: "basic", label: "Basic Info", icon: Layout },
              { id: "settings", label: "Settings", icon: SettingsIcon },
              ...(isEdit
                ? [
                    { id: "analytics", label: "Analytics", icon: BarChart3 },
                    { id: "cohorts", label: "Cohorts", icon: Users },
                    { id: "schedule", label: "Schedule", icon: Calendar },
                  ]
                : []),
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group ${
                  activeTab === tab.id
                    ? "bg-primary/5 text-primary shadow-sm shadow-primary/5 border border-primary/10"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                }`}
              >
                <tab.icon
                  className={`w-4 h-4 transition-colors ${
                    activeTab === tab.id
                      ? "text-primary"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span className="flex-1 text-left">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Curriculum Section */}
          {showCurriculum && (
            <div className="mt-4 pt-4 border-t border-slate-50 px-4 space-y-2">
              <div className="px-4 mb-2 flex items-center justify-between group/title">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Course Content
                </span>
                <button
                  onClick={handleAddModule}
                  className="p-1 hover:bg-primary/10 rounded-lg text-primary transition-colors opacity-0 group-hover/title:opacity-100"
                >
                  <PlusSquare className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setActiveTab("curriculum")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group ${
                  activeTab === "curriculum"
                    ? "bg-primary/5 text-primary shadow-sm shadow-primary/5 border border-primary/10"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                }`}
              >
                <Book
                  className={`w-4 h-4 transition-colors ${
                    activeTab === "curriculum"
                      ? "text-primary"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span className="flex-1 text-left">Curriculum Builder</span>
              </button>

              <div className="space-y-2 py-2">
                {course?.modules?.map((module, mIdx) => (
                  <div key={module.id} className="space-y-1">
                    <div
                      onClick={() => {
                        toggleModule(module.id.toString());
                        if (activeTab !== "curriculum")
                          setActiveTab("curriculum");
                      }}
                      className={`flex items-center justify-between p-2 px-4 rounded-lg cursor-pointer transition-all ${
                        expandedModules[module.id]
                          ? "bg-slate-50"
                          : "hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <ChevronRight
                          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                            expandedModules[module.id] ? "rotate-90" : ""
                          }`}
                        />
                        <span className="text-[13px] font-bold text-slate-700 truncate">
                          {mIdx + 1}. {module.title}
                        </span>
                      </div>
                    </div>
                    {expandedModules[module.id] && (
                      <div className="ml-6 pl-3 border-l border-slate-100 space-y-1 animate-in slide-in-from-left-2">
                        {module.lessons?.map((lesson) => (
                          <div
                            key={lesson.id}
                            onClick={() =>
                              handleLessonSelect(lesson, module.id.toString())
                            }
                            className={`p-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer flex items-center justify-between group/lesson ${
                              selectedCurriculumItem?.lessonId === lesson.id
                                ? "bg-primary/5 text-primary"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              {lesson.type === "VIDEO" ? (
                                <MonitorPlay className="w-3.5 h-3.5 opacity-50" />
                              ) : (
                                <FileText className="w-3.5 h-3.5 opacity-50" />
                              )}
                              <span className="truncate">{lesson.title}</span>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddLesson(module.id.toString())}
                          className="flex items-center gap-2 p-2 px-3 text-[11px] font-bold text-slate-400 hover:text-primary transition-colors w-full"
                        >
                          <Plus className="w-3 h-3" /> Add Lesson
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {(!course?.modules || course.modules.length === 0) && (
                  <p className="text-[11px] text-slate-400 italic px-4">
                    No modules added yet.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="p-12 max-w-5xl mx-auto">{renderTabContent()}</div>
      </main>

      {/* Module Modal */}
      <ModuleModal
        isOpen={isModuleModalOpen}
        onClose={() => {
          setIsModuleModalOpen(false);
          setModuleTitle("");
          setModuleDescription("");
        }}
        onCreate={handleCreateModule}
        title={moduleTitle}
        description={moduleDescription}
        onTitleChange={setModuleTitle}
        onDescriptionChange={setModuleDescription}
        isCreating={createModuleMutation.isPending}
      />

      {/* Lesson Modal */}
      <LessonModal
        isOpen={isLessonModalOpen}
        onClose={() => {
          setIsLessonModalOpen(false);
          setLessonTitle("");
          setLessonType("VIDEO");
        }}
        onCreate={handleCreateLesson}
        title={lessonTitle}
        lessonType={lessonType}
        onTitleChange={setLessonTitle}
        onTypeChange={setLessonType}
        isCreating={createLessonMutation.isPending}
      />

      {/* Content Modal */}
      <ContentModal
        isOpen={isContentModalOpen}
        onClose={() => setIsContentModalOpen(false)}
        onAdd={handleCreateContent}
        lessonId={selectedLessonId}
        isAdding={createContentMutation.isPending}
      />

      {/* Exercise Modal */}
      <ExerciseModal
        isOpen={isExerciseModalOpen}
        onClose={() => setIsExerciseModalOpen(false)}
        onAddBulk={handleCreateExercise}
        moduleId={selectedModuleId}
        lessonId={selectedLessonId}
        isAdding={createExerciseMutation.isPending}
      />

      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        content={previewContent}
      />

      <DeleteConfirmationModal
        isOpen={!!deleteConfig}
        onClose={() => setDeleteConfig(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${deleteConfig?.title}?`}
        description={`Are you sure you want to delete this ${deleteConfig?.title.toLowerCase()}? This action cannot be undone.`}
        isDeleting={
          deleteModuleMutation.isPending ||
          deleteLessonMutation.isPending ||
          deleteContentMutation.isPending ||
          deleteExerciseMutation.isPending
        }
      />
    </div>
  );
};

export default InstructorCourseEditor;
