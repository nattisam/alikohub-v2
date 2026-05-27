import React, { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
  GripVertical,
  PlayCircle,
} from "lucide-react";
import { Reorder } from "framer-motion";
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
  useUpdateExercise,
  useDeleteExercise,
} from "@/hooks/useAcademy";
import { academyService } from "@/services/academyService";
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
  const updateExerciseMutation = useUpdateExercise();
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
  const [initialExerciseTitle, setInitialExerciseTitle] = useState<string>("");
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

  const reorderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonType, setLessonType] = useState("VIDEO");
  const [editingExercise, setEditingExercise] = useState<any>(null);

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

  const handleAddExercise = (
    moduleId: string,
    lessonId: string,
    initialTitle?: string,
  ) => {
    setSelectedModuleId(moduleId);
    setSelectedLessonId(lessonId);
    setInitialExerciseTitle(initialTitle || "");
    setEditingExercise(null);
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

  const handleEditExercise = (exercise: any) => {
    setEditingExercise(exercise);
    setIsExerciseModalOpen(true);
  };

  const handleUpdateExercise = (exerciseId: string, data: any) => {
    updateExerciseMutation.mutate(
      { exerciseId, data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["course", id] });
          setIsExerciseModalOpen(false);
          setEditingExercise(null);
        },
      },
    );
  };

  const handleReorderLessons = (moduleId: string, newLessons: any[]) => {
    const previousCourse = queryClient.getQueryData(["course", id]);

    queryClient.setQueryData(["course", id], (old: any) => {
      if (!old) return old;
      return {
        ...old,
        modules: old.modules.map((m: any) => {
          if (m.id.toString() === moduleId) {
            return { ...m, lessons: newLessons };
          }
          return m;
        }),
      };
    });

    if (reorderTimeoutRef.current) {
      clearTimeout(reorderTimeoutRef.current);
    }

    reorderTimeoutRef.current = setTimeout(async () => {
      try {
        const updates = newLessons.map((lesson, index) => ({
          lessonId: lesson.id,
          data: { order: index + 1 },
        }));

        await Promise.all(
          updates.map((update) =>
            academyService.instructor.updateLesson(
              update.lessonId,
              update.data,
            ),
          ),
        );

        queryClient.invalidateQueries({ queryKey: ["course", id] });
      } catch (error) {
        console.error("Failed to update lesson order:", error);
        toast.error("Failed to update lesson order");
        if (previousCourse) {
          queryClient.setQueryData(["course", id], previousCourse);
        }
      }
    }, 1000);
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
          onEditExercise={handleEditExercise}
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
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col h-screen overflow-hidden text-slate-200">
      <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 z-50 bg-white text-slate-900 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/instructor/courses")}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
          </button>
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
            <h1 className="text-[15px] font-bold text-slate-900 leading-none">
              Curriculum builder
            </h1>
            <span className="text-[11px] text-slate-500 bg-slate-50 py-1 px-3 rounded-full border border-slate-200 truncate max-w-[150px] sm:max-w-xs block leading-none w-fit">
              {isEdit ? course?.title : "New Course"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {}}
            className="gap-2 font-bold h-9 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <Eye className="w-4 h-4" /> Preview
          </Button>
          <Button
            onClick={handleSaveBasicInfo}
            disabled={
              createCourseMutation.isPending || updateCourseMutation.isPending
            }
            size="sm"
            className="gap-2 font-bold bg-[#7c6ef0] text-white hover:bg-[#6b5ee0] h-9 hidden sm:flex rounded-xl transition-all border-none"
          >
            <Save className="w-4 h-4" />
            {isEdit ? "Save draft" : "Create draft"}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <aside
          className={cn(
            "fixed lg:relative z-40 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 overflow-hidden h-[calc(100vh-64px)] shrink-0 text-slate-700",
            isSidebarOpen
              ? "w-[340px] translate-x-0"
              : "w-0 -translate-x-full lg:w-0",
          )}
        >
          <div className="p-4 flex items-center justify-end border-b border-slate-200 bg-slate-50 lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <ScrollArea className="flex-1">
            <div className="flex flex-col pb-4">
              {showCurriculum && (
                <div className="flex flex-col border-b border-slate-200 pb-4">
                  <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 mb-2">
                    <h2 className="text-sm font-bold text-slate-900">
                      Course structure
                    </h2>
                  </div>

                  <div className="flex flex-col">
                    {course?.modules?.map((module, mIdx) => (
                      <div
                        key={module.id}
                        className="flex flex-col border-b border-slate-100 last:border-0"
                      >
                        <div
                          onClick={() => {
                            toggleModule(module.id.toString());
                            setActiveTab("curriculum");
                          }}
                          className={`flex items-center justify-between px-5 py-3 cursor-pointer transition-all ${
                            expandedModules[module.id]
                              ? "bg-slate-50"
                              : "hover:bg-slate-50/50"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <ChevronRight
                              className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${
                                expandedModules[module.id] ? "rotate-90" : ""
                              }`}
                            />
                            <span className="text-[13px] font-bold text-slate-800 break-words whitespace-normal line-clamp-2 leading-tight pr-2">
                              {mIdx + 1}. {module.title}
                            </span>
                          </div>
                          <div className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 shrink-0">
                            {module.lessons?.length || 0}
                          </div>
                        </div>
                        {expandedModules[module.id] && (
                          <div className="flex flex-col bg-transparent pb-3">
                            <Reorder.Group
                              axis="y"
                              values={module.lessons || []}
                              onReorder={(newLessons) =>
                                handleReorderLessons(
                                  module.id.toString(),
                                  newLessons,
                                )
                              }
                              className="flex flex-col"
                            >
                              {module.lessons?.map((lesson) => (
                                <Reorder.Item
                                  key={lesson.id}
                                  value={lesson}
                                  className="relative"
                                >
                                  <div
                                    className={`group flex items-center p-0 text-left transition-all relative cursor-pointer ${
                                      selectedCurriculumItem?.lessonId ===
                                      lesson.id
                                        ? "bg-slate-50/80"
                                        : "hover:bg-slate-50/50"
                                    }`}
                                    onClick={() => {
                                      handleLessonSelect(
                                        lesson,
                                        module.id.toString(),
                                      );
                                      if (window.innerWidth < 1024)
                                        setIsSidebarOpen(false);
                                    }}
                                  >
                                    <div
                                      className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all ${
                                        selectedCurriculumItem?.lessonId ===
                                        lesson.id
                                          ? "bg-[#7c6ef0]"
                                          : "bg-transparent"
                                      }`}
                                    />
                                    <div className="pl-4 pr-2 opacity-0 group-hover:opacity-40 transition-opacity cursor-grab active:cursor-grabbing text-slate-400">
                                      <GripVertical className="w-3.5 h-3.5" />
                                    </div>

                                    <div className="flex-1 flex items-center justify-between py-2.5 pr-4 pl-1 min-w-0">
                                      <div className="flex items-center gap-3 min-w-0">
                                        <div
                                          className={`w-6 h-6 rounded flex items-center justify-center shrink-0 transition-colors ${
                                            selectedCurriculumItem?.lessonId ===
                                            lesson.id
                                              ? "bg-[#7c6ef0]/10 text-[#7c6ef0] border border-[#7c6ef0]/20"
                                              : "bg-white text-slate-400 border border-slate-200"
                                          }`}
                                        >
                                          {lesson.type === "VIDEO" ? (
                                            <PlayCircle className="w-3 h-3" />
                                          ) : (
                                            <FileText className="w-3 h-3" />
                                          )}
                                        </div>
                                        <span
                                          className={`text-[12px] truncate transition-colors ${
                                            selectedCurriculumItem?.lessonId ===
                                            lesson.id
                                              ? "font-bold text-[#7c6ef0]"
                                              : "font-medium text-slate-600 group-hover:text-slate-900"
                                          }`}
                                        >
                                          {lesson.title}
                                        </span>
                                      </div>
                                      <div className="shrink-0 ml-2 border border-emerald-500/20 bg-emerald-50/50 rounded px-1.5 py-[1px]">
                                        <span className="text-[9px] font-black uppercase text-emerald-600 flex items-center gap-1">
                                          <span className="text-[10px]">*</span>
                                          Pub
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </Reorder.Item>
                              ))}
                            </Reorder.Group>
                            <button
                              onClick={() =>
                                handleAddLesson(module.id.toString())
                              }
                              className="flex items-center gap-2 pl-[3.25rem] pr-6 py-2.5 mt-1 text-[12px] font-medium text-slate-500 hover:text-slate-800 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add lesson
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="px-4 py-6 space-y-2">
                {[
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
                        ? "bg-slate-100 text-slate-900 border border-slate-200"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent"
                    }`}
                  >
                    <tab.icon
                      className={`w-4 h-4 transition-colors ${
                        activeTab === tab.id
                          ? "text-slate-900"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    <span className="flex-1 text-left">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-slate-200 bg-white">
            <button
              onClick={handleAddModule}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-all shadow-sm"
            >
              <PlusSquare className="w-4 h-4" /> New module
            </button>
          </div>
        </aside>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/10 backdrop-blur-[1px] z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

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

      {isContentModalOpen && (
        <ContentModal
          isOpen={true}
          onClose={() => setIsContentModalOpen(false)}
          onAdd={handleCreateContent}
          lessonId={selectedLessonId}
          isAdding={createContentMutation.isPending}
        />
      )}

      {isExerciseModalOpen && (
        <ExerciseModal
          isOpen={true}
          onClose={() => {
            setIsExerciseModalOpen(false);
            setInitialExerciseTitle("");
            setEditingExercise(null);
          }}
          onAddBulk={handleCreateExercise}
          moduleId={selectedModuleId}
          lessonId={selectedLessonId}
          isAdding={
            createExerciseMutation.isPending || updateExerciseMutation.isPending
          }
          initialTitle={initialExerciseTitle}
          initialData={editingExercise}
          onUpdate={handleUpdateExercise}
          existingExercisesCount={
            course?.modules
              ?.flatMap((m) => m.lessons || [])
              .find((l) => l.id.toString() === selectedLessonId.toString())
              ?.exercises?.length || 0
          }
        />
      )}

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
