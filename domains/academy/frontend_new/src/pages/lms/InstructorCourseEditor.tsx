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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { BasicInfoTab } from "./components/BasicInfoTab";
import { CurriculumTab } from "./components/CurriculumTab";
import { SettingsTab } from "./components/SettingsTab";
import { AnalyticsTab } from "./components/AnalyticsTab";
import { ScheduleTab } from "./components/ScheduleTab";
import { ModuleModal } from "./components/ModuleModal";
import { LessonModal } from "./components/LessonModal";
import { ContentModal } from "./components/ContentModal";
import { ExerciseModal } from "./components/ExerciseModal";
import { PreviewModal } from "./components/PreviewModal";
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
  useCreateExercise,
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
  const createExerciseMutation = useCreateExercise();
  const deleteExerciseMutation = useDeleteExercise();

  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    category: "",
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

  const showCurriculum =
    course && course.status !== "DRAFT" && course.status !== "REJECTED";

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        shortDescription: course.shortDescription || "",
        category: course.category || "",
        thumbnail: null,
      });
    }
  }, [course]);

  const handleSaveBasicInfo = async () => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("shortDescription", formData.shortDescription);
    data.append("category", formData.category);
    data.append("status", "DRAFT");
    if (formData.thumbnail) {
      data.append("thumbnail", formData.thumbnail);
    }

    if (isEdit) {
      updateCourseMutation.mutate({ courseId: id!, formData: data });
    } else {
      createCourseMutation.mutate(data, {
        onSuccess: (newCourse) => {
          navigate(`/instructor/lms/courses/${newCourse.id}`);
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

  const handleCreateExercise = (data: any) => {
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
    setPreviewContent(content);
    setIsPreviewModalOpen(true);
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
        <BasicInfoTab
          formData={formData}
          course={course}
          onFormDataChange={setFormData}
        />
      );
    }

    if (activeTab === "curriculum" && showCurriculum) {
      return (
        <CurriculumTab
          course={course}
          onAddModule={handleAddModule}
          onAddLesson={handleAddLesson}
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
    <div className="min-h-screen bg-slate-50">
      <InstructorNavbar />

      {/* Editor Header */}
      <div className="bg-white border-b border-border sticky top-[64px] md:top-[80px] z-40">
        <div className="section-container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/instructor/lms/courses")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-slate-900 truncate max-w-[200px] md:max-w-md">
                {isEdit ? course?.title : "Create New Course"}
              </h1>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    course?.status === "PUBLISHED"
                      ? "bg-emerald-500"
                      : "bg-amber-500"
                  }`}
                />
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                  {course?.status || "Draft"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleSaveBasicInfo}
              disabled={
                createCourseMutation.isPending || updateCourseMutation.isPending
              }
              className="gap-2 bg-accent hover:bg-amber-light text-slate-900 font-bold"
            >
              {createCourseMutation.isPending ||
              updateCourseMutation.isPending ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Course
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="section-container flex gap-8">
          {[
            { id: "basic", label: "Basic Info", icon: Layout },
            ...(showCurriculum
              ? [{ id: "curriculum", label: "Curriculum", icon: Book }]
              : []),
            { id: "settings", label: "Settings", icon: SettingsIcon },
            ...(isEdit
              ? [
                  { id: "analytics", label: "Analytics", icon: BarChart3 },
                  { id: "schedule", label: "Schedule", icon: Calendar },
                ]
              : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-bold flex items-center gap-2 transition-colors relative ${
                activeTab === tab.id
                  ? "text-accent"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent transition-all duration-200" />
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="section-container py-12 max-w-7xl mx-auto">
        {renderTabContent()}
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
        onAdd={handleCreateExercise}
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
