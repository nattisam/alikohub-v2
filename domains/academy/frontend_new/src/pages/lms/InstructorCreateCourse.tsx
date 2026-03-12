import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import InstructorNavbar from "@/components/InstructorNavbar";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  Layout,
  DollarSign,
  Clock,
  X,
  AlertCircle,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCourse } from "@/hooks/useAcademy";
import { toast } from "sonner";

const COURSE_CATEGORIES = ["Health", "Technology", "STEM"];

const InstructorCreateCourse = () => {
  const navigate = useNavigate();
  const createCourseMutation = useCreateCourse();

  const [activeStep, setActiveStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Health",
    shortDescription: "",
    skills: [] as string[],
    newSkill: "",
    price: 0,
    thumbnail: null as File | null,
    thumbnailPreview: "" as string,
  });

  const handleUpdateField = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    handleUpdateField({ thumbnail: file, thumbnailPreview: previewUrl });
  };

  const handleAddSkill = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && "key" in e && e.key !== "Enter") return;
    if (e) e.preventDefault();

    if (formData.newSkill.trim()) {
      if (!formData.skills.includes(formData.newSkill.trim())) {
        handleUpdateField({
          skills: [...formData.skills, formData.newSkill.trim()],
          newSkill: "",
        });
      }
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    handleUpdateField({
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleNext = () => {
    if (activeStep === 1) {
      if (!formData.title || !formData.shortDescription) {
        setError(
          "Please fill in all required fields (Title, Short Summary, Full Description).",
        );
        return;
      }
    }
    setError(null);
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    } else {
      handleFinalCreate();
    }
  };

  const handleBack = () => {
    setError(null);
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleFinalCreate = async () => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("shortDescription", formData.shortDescription);
    data.append("category", formData.category);
    data.append("status", "DRAFT");

    if (formData.thumbnail) {
      data.append("thumbnail", formData.thumbnail);
    }

    createCourseMutation.mutate(data, {
      onSuccess: (newCourse) => {
        toast.success("Course shell created successfully!");
        // Navigate to the full editor to add modules/lessons and refine details
        navigate(`/instructor/lms/courses/${newCourse.id}`);
      },
      onError: (err: any) => {
        setError(
          err.response?.data?.message ||
            "Failed to create course. Please try again.",
        );
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <InstructorNavbar />

      <div className="bg-white border-b border-border sticky top-[64px] md:top-[80px] z-40">
        <div className="section-container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/instructor/lms/courses")}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">
                Create New Course
              </h1>
              <div className="flex items-center gap-3 mt-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${activeStep >= s ? "bg-accent text-slate-900" : "bg-slate-100 text-slate-400"}`}
                    >
                      {s}
                    </div>
                    {s < 3 && (
                      <div
                        className={`w-6 h-0.5 rounded-full ${activeStep > s ? "bg-accent" : "bg-slate-100"}`}
                      />
                    )}
                  </div>
                ))}
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">
                  {activeStep === 1
                    ? "Course Basics"
                    : activeStep === 2
                      ? "Outcomes"
                      : "Investment"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/instructor/lms/courses")}
              className="text-slate-500 hover:text-slate-900"
            >
              Exit
            </Button>
            <Button
              size="sm"
              onClick={handleNext}
              disabled={createCourseMutation.isPending}
              className="bg-accent hover:bg-amber-light text-slate-900 font-bold px-6"
            >
              {activeStep === 3
                ? createCourseMutation.isPending
                  ? "Creating..."
                  : "Finish"
                : "Next Step"}
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 section-container py-12 max-w-4xl mx-auto w-full">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in duration-300">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {activeStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
                <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-accent" /> Course Identity
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Primary Title
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        handleUpdateField({ title: e.target.value })
                      }
                      placeholder="e.g. Mastering Advanced React Patterns"
                      className="h-12 border-slate-200 focus:ring-accent text-slate-900 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        Field/Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          handleUpdateField({ category: e.target.value })
                        }
                        className="flex h-11 w-full rounded-lg border border-slate-200 bg-background px-3 py-2 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-accent outline-none appearance-none cursor-pointer"
                      >
                        {COURSE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Short Summary
                    </label>
                    <Textarea
                      value={formData.shortDescription}
                      onChange={(e) =>
                        handleUpdateField({ shortDescription: e.target.value })
                      }
                      placeholder="Describe your course in 1-2 powerful sentences."
                      className="resize-none h-20 border-slate-200 focus:ring-accent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-accent" /> Media Cover
                </h2>
                <div
                  className="relative aspect-video rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden hover:border-accent group cursor-pointer transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {formData.thumbnailPreview ? (
                    <img
                      src={formData.thumbnailPreview}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-3 border border-slate-100">
                        <Upload className="w-5 h-5 text-slate-300 group-hover:text-accent transition-colors" />
                      </div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                        Click to upload
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
                <div className="mt-6 flex flex-col gap-2">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    Requirements
                  </p>
                  <ul className="text-[10px] text-slate-400 space-y-1">
                    <li>• Dimension: 1280x720 px</li>
                    <li>• Format: JPG, PNG, WebP</li>
                    <li>• File size: Max 5MB</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-10 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Learning Outcomes
              </h2>
              <p className="text-slate-500 mb-10 leading-relaxed font-medium">
                Identify the core competencies students will gain. These will be
                displayed prominently on your course landing page.
              </p>

              <div className="space-y-8">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Input
                      value={formData.newSkill}
                      onChange={(e) =>
                        handleUpdateField({ newSkill: e.target.value })
                      }
                      onKeyDown={handleAddSkill}
                      placeholder="e.g. Build Production-ready GraphQL APIs"
                      className="h-14 border-slate-200 focus:ring-accent text-slate-900 font-semibold"
                    />
                  </div>
                  <Button
                    onClick={handleAddSkill}
                    className="h-14 w-14 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all"
                  >
                    <PlusCircle className="w-6 h-6" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {formData.skills.map((skill) => (
                    <div
                      key={skill}
                      className="bg-slate-50 border border-slate-200 text-slate-800 px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-4 animate-in zoom-in duration-300"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {formData.skills.length === 0 && (
                    <div className="py-20 w-full text-center border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                        <Check className="w-6 h-6 text-slate-200" />
                      </div>
                      <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em]">
                        Add at least 3 outcomes
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-10 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -z-0" />
              <h2 className="text-2xl font-bold text-slate-900 mb-10 relative z-10">
                Pricing & Delivery
              </h2>

              <div className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100 md:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-accent/10 rounded-lg text-accent">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Market Price
                      </label>
                    </div>
                    <div className="relative">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                        $
                      </span>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={formData.price || ""}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          handleUpdateField({
                            price: val === "" ? 0 : parseInt(val),
                          });
                        }}
                        placeholder="0"
                        className="pl-6 h-14 border-none bg-transparent text-3xl font-black text-slate-900 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
                      Students will see this as the enrollment fee. Set to 0 for
                      free.
                    </p>
                  </div>
                </div>

                <div className="p-8 border-2 border-slate-900 bg-slate-900 rounded-3xl text-white flex gap-6 items-center">
                  <div className="flex-1">
                    <h3 className="text-base font-bold mb-1 flex items-center gap-2">
                      Ready to launch?
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                      Your course will be created in DRAFT mode. You can then
                      add your modules, video lessons, and curriculum in the
                      Course Manager.
                    </p>
                  </div>
                  <Check className="w-10 h-10 text-accent opacity-50" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={activeStep === 1 || createCourseMutation.isPending}
            className="flex items-center gap-2 text-slate-400 font-bold hover:bg-slate-100 transition-all rounded-full px-8 h-12"
          >
            <ChevronLeft className="w-4 h-4" /> Step back
          </Button>

          <Button
            onClick={handleNext}
            disabled={createCourseMutation.isPending}
            className="flex items-center gap-3 bg-slate-900 text-white font-bold h-14 px-10 rounded-full shadow-2xl shadow-slate-400 hover:shadow-slate-500 hover:translate-y-[-2px] active:translate-y-[0px] transition-all disabled:opacity-50"
          >
            {activeStep === 3 ? (
              createCourseMutation.isPending ? (
                "Creating Course..."
              ) : (
                "Finalize & Continue"
              )
            ) : (
              <>
                Next: {activeStep === 1 ? "Learning Outcomes" : "Pricing"}{" "}
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default InstructorCreateCourse;
