import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
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
  const queryClient = useQueryClient();
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
    price: "",
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Curriculum Selection State (Lifted from CurriculumTab)
  const [selectedCurriculumItem, setSelectedCurriculumItem] = useState<{
    type: "CONTENT" | "EXERCISE" | "OVERVIEW" | "LESSON" | "QUIZ_SESSION";
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
        price: course.price ? course.price.toString() : "",
        thumbnail: null,
      });

      // Synchronize selected curriculum item if course data is updated
      if (selectedCurriculumItem) {
        if (selectedCurriculumItem.type === "LESSON") {
          const freshLesson = course.modules
            ?.flatMap((m: any) => m.lessons || [])
            ?.find((l: any) => l.id === selectedCurriculumItem.lessonId);

          if (
            freshLesson &&
            JSON.stringify(freshLesson) !==
              JSON.stringify(selectedCurriculumItem.data)
          ) {
            setSelectedCurriculumItem((prev) =>
              prev ? { ...prev, data: freshLesson } : null,
            );
          } else if (!freshLesson) {
            setSelectedCurriculumItem(null);
          }
        } else if (selectedCurriculumItem.type === "QUIZ_SESSION") {
          const freshLesson = course.modules
            ?.flatMap((m: any) => m.lessons || [])
            ?.find((l: any) => l.id === selectedCurriculumItem.lessonId);

          if (
            freshLesson &&
            freshLesson.exercises &&
            JSON.stringify(freshLesson.exercises) !==
              JSON.stringify(selectedCurriculumItem.data)
          ) {
            setSelectedCurriculumItem((prev) =>
              prev ? { ...prev, data: freshLesson.exercises } : null,
            );
          } else if (!freshLesson) {
            setSelectedCurriculumItem(null);
          }
        }
      }
    }
  }, [course]);

  const handleSaveBasicInfo = async () => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("shortDescription", formData.shortDescription);
    data.append("category", formData.category);
    data.append("price", formData.price ? formData.price.toString() : "0");
    data.append("status", "DRAFT");
    if (formData.thumbnail) {
      data.append("thumbnail", formData.thumbnail);
    }

    if (isEdit) {
      updateCourseMutation.mutate(
        { courseId: id!, formData: data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["course", id] });
            queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
          },
        },
      );
    } else {
      createCourseMutation.mutate(data, {
        onSuccess: (newCourse) => {
          queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
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
          queryClient.invalidateQueries({ queryKey: ["course", id] });
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
          queryClient.invalidateQueries({ queryKey: ["course", id] });
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
        queryClient.invalidateQueries({ queryKey: ["course", id] });
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
        queryClient.invalidateQueries({ queryKey: ["course", id] });
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
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["course", id] });
            setDeleteConfig(null);
          },
        },
      );
    } else if (type === "lesson") {
      deleteLessonMutation.mutate(
        { lessonId: deleteId, courseId: id! },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["course", id] });
            setDeleteConfig(null);
          },
        },
      );
    } else if (type === "content") {
      deleteContentMutation.mutate(deleteId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["course", id] });
          setDeleteConfig(null);
        },
      });
    } else if (type === "exercise") {
      deleteExerciseMutation.mutate(deleteId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["course", id] });
          setDeleteConfig(null);
        },
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
        queryClient.invalidateQueries({ queryKey: ["course", id] });
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
            updateLessonMutation.mutate(
              { lessonId: lid, data, courseId: id! },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["course", id] });
                },
              },
            )
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
    <div className="min-h-screen bg-white flex flex-col h-screen overflow-hidden text-slate-900">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-slate-200 z-50 bg-white shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-md"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/instructor/courses")}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h1 className="text-sm font-semibold truncate max-w-[200px] sm:max-w-md lg:max-w-xl">
              {isEdit ? course?.title : "New Course"}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            onClick={handleSaveBasicInfo}
            disabled={
              createCourseMutation.isPending || updateCourseMutation.isPending
            }
            size="sm"
            className="gap-2 font-bold bg-slate-900 text-white hover:bg-slate-800 h-9 hidden sm:flex rounded-lg"
          >
            <Save className="w-4 h-4" />
            {isEdit ? "Save Changes" : "Create"}
          </Button>
          {(!course?.status ||
            course.status === "DRAFT" ||
            course.status === "REJECTED") && (
            <Button
              onClick={handleSubmitForApproval}
              disabled={submitCourseMutation.isPending || !id}
              variant="outline"
              size="sm"
              className="gap-2 font-bold h-9 rounded-lg"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Submit</span>
            </Button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:relative z-40 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 overflow-hidden h-[calc(100vh-56px)] shrink-0",
            isSidebarOpen
              ? "w-[340px] translate-x-0"
              : "w-0 -translate-x-full lg:w-0",
          )}
        >
          <div className="p-4 flex items-center justify-end border-b border-slate-100 bg-slate-50/50 lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <ScrollArea className="flex-1">
            <div className="flex flex-col pb-4">
              {/* Curriculum Section */}
              {showCurriculum && (
                <div className="mt-2 pb-4 border-b border-slate-100 space-y-2">
                  <div className="px-4 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveTab("curriculum");
                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                      }}
                      className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group ${
                        activeTab === "curriculum"
                          ? "bg-primary/5 text-primary border border-primary/10"
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
                      <span className="flex-1 text-left">
                        Curriculum Builder
                      </span>
                    </button>
                    <button
                      onClick={handleAddModule}
                      className="p-3 bg-primary/5 hover:bg-primary/10 rounded-xl text-primary transition-colors border border-primary/10 shadow-sm"
                      title="Add Module"
                    >
                      <PlusSquare className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col pt-2">
                    {course?.modules?.map((module, mIdx) => (
                      <div
                        key={module.id}
                        className="flex flex-col border-t border-slate-50"
                      >
                        <div
                          onClick={() => {
                            toggleModule(module.id.toString());
                            if (activeTab !== "curriculum")
                              setActiveTab("curriculum");
                          }}
                          className={`flex items-center justify-between px-6 py-3 cursor-pointer transition-all ${
                            expandedModules[module.id]
                              ? "bg-slate-50/80"
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
                          <div className="flex flex-col bg-slate-50/30">
                            {module.lessons?.map((lesson) => (
                              <button
                                key={lesson.id}
                                onClick={() => {
                                  handleLessonSelect(
                                    lesson,
                                    module.id.toString(),
                                  );
                                  if (window.innerWidth < 1024)
                                    setIsSidebarOpen(false);
                                }}
                                className={`group flex items-start gap-3 px-6 py-3 text-left transition-all ${
                                  selectedCurriculumItem?.lessonId === lesson.id
                                    ? "bg-blue-50/40 border-l-4 border-l-primary"
                                    : "hover:bg-slate-50 border-l-4 border-l-transparent text-slate-600"
                                }`}
                              >
                                <div className="pt-0.5 shrink-0">
                                  {lesson.type === "VIDEO" ? (
                                    <MonitorPlay
                                      className={`w-3.5 h-3.5 ${selectedCurriculumItem?.lessonId === lesson.id ? "text-primary" : "text-slate-400"}`}
                                    />
                                  ) : (
                                    <FileText
                                      className={`w-3.5 h-3.5 ${selectedCurriculumItem?.lessonId === lesson.id ? "text-primary" : "text-slate-400"}`}
                                    />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span
                                    className={`text-[12px] font-medium block truncate ${selectedCurriculumItem?.lessonId === lesson.id ? "text-primary font-bold" : ""}`}
                                  >
                                    {lesson.title}
                                  </span>
                                </div>
                              </button>
                            ))}
                            <button
                              onClick={() =>
                                handleAddLesson(module.id.toString())
                              }
                              className="flex items-center gap-2 px-10 py-3 text-[11px] font-bold text-slate-400 hover:text-primary transition-colors hover:bg-slate-50 w-full"
                            >
                              <Plus className="w-3 h-3" /> Add Lesson
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {(!course?.modules || course.modules.length === 0) && (
                      <p className="text-[11px] text-slate-400 italic px-6 py-2">
                        No modules added yet.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Main Navigation */}
              <div className="p-4 space-y-1 bg-white">
                {[
                  { id: "basic", label: "Basic Info", icon: Layout },
                  { id: "settings", label: "Settings", icon: SettingsIcon },
                  ...(isEdit
                    ? [
                        {
                          id: "analytics",
                          label: "Analytics",
                          icon: BarChart3,
                        },
                        { id: "cohorts", label: "Cohorts", icon: Users },
                        { id: "schedule", label: "Schedule", icon: Calendar },
                      ]
                    : []),
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group ${
                      activeTab === tab.id
                        ? "bg-primary/5 text-primary border border-primary/10"
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
            </div>
          </ScrollArea>
        </aside>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/10 backdrop-blur-[1px] z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 flex flex-col relative custom-scrollbar">
          <div className="flex-1 mx-auto w-full flex flex-col transition-all duration-300 max-w-5xl p-4 md:p-10">
            {renderTabContent()}
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>

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
