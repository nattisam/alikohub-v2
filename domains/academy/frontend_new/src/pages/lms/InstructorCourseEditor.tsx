import React, { useState, useEffect } from "react";
import InstructorNavbar from "@/components/InstructorNavbar";
import {
  ArrowLeft,
  Save,
  Eye,
  Layout,
  Book,
  Settings as SettingsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  useCourseDetails,
  useCreateCourse,
  useUpdateCourse,
  useCreateModule,
  useCreateLesson,
  useUpdateLesson,
  useSubmitCourseForApproval,
} from "@/hooks/useAcademy";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { BasicInfoTab } from "./components/BasicInfoTab";
import { CurriculumTab } from "./components/CurriculumTab";
import { SettingsTab } from "./components/SettingsTab";
import { ModuleModal } from "./components/ModuleModal";
import { LessonModal } from "./components/LessonModal";

const InstructorCourseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== "new";
  const { data: course, isLoading } = useCourseDetails(isEdit ? id : "");

  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const createModuleMutation = useCreateModule();
  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();
  const submitCourseMutation = useSubmitCourseForApproval();

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
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonType, setLessonType] = useState("VIDEO");

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
        courseId: Number(id!),
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
    setLessonType("Exercise");
    setIsLessonModalOpen(true);
  };

  const handleCreateLesson = () => {
    if (!lessonTitle.trim()) {
      toast.error("Lesson title is required");
      return;
    }
    createLessonMutation.mutate(
      {
        moduleId: Number(selectedModuleId),
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
            {course?.status !== "DRAFT" && course?.status !== "REJECTED" && (
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex gap-2"
                asChild
              >
                <Link to={`/lms/course/${course?.slug}`} target="_blank">
                  <Eye className="w-4 h-4" /> Preview
                </Link>
              </Button>
            )}
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

      <main className="section-container py-12 max-w-5xl mx-auto">
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
    </div>
  );
};

export default InstructorCourseEditor;
