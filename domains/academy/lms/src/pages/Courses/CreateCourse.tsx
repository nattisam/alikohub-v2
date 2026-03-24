import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import InstructorNavbar from "@/components/InstructorNavbar";
import {
  Check,
  Upload,
  DollarSign,
  X,
  AlertCircle,
  PlusCircle,
  ArrowLeft,
  ArrowRight,
  Rocket,
  Target,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCreateCourse } from "@/hooks/useAcademy";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const COURSE_CATEGORIES = ["Health", "Technology", "STEM"];

// ─── Step Indicator ────────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, title: "Foundation", subtitle: "Basics & Details" },
  { number: 2, title: "Outcomes", subtitle: "Skills & Goals" },
  { number: 3, title: "Investment", subtitle: "Pricing & Launch" },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-2xl mx-auto mb-10">
      {STEPS.map((step, i) => {
        const isComplete = currentStep > step.number;
        const isActive = currentStep === step.number;
        return (
          <div
            key={step.number}
            className="flex items-center flex-1 last:flex-none"
          >
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                  isComplete
                    ? "bg-primary/15 border-primary text-primary"
                    : isActive
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-muted border-border text-muted-foreground"
                }`}
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {isComplete ? <Check className="w-4 h-4" /> : step.number}
              </motion.div>
              <div className="text-center">
                <p
                  className={`text-xs font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`}
                >
                  {step.title}
                </p>
                <p className="text-[10px] text-muted-foreground hidden sm:block">
                  {step.subtitle}
                </p>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 mx-3 mt-[-18px]">
                <div
                  className={`h-0.5 rounded ${isComplete ? "bg-primary/40" : "bg-border"}`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

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
    price: "0",
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
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleNext = () => {
    if (activeStep === 1) {
      if (!formData.title || !formData.shortDescription) {
        setError(
          "Please fill in all required fields (Title and Short Summary).",
        );
        return;
      }
    }
    setError(null);
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleFinalCreate();
    }
  };

  const handleBack = () => {
    setError(null);
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinalCreate = async () => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("shortDescription", formData.shortDescription);
    data.append("category", formData.category);
    data.append("price", formData.price.toString());
    data.append("status", "DRAFT");

    if (formData.thumbnail) {
      data.append("thumbnail", formData.thumbnail);
    }

    createCourseMutation.mutate(data, {
      onSuccess: (newCourse) => {
        toast.success("Course shell created successfully!");
        navigate(`/instructor/courses/${newCourse.id}`);
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
    <div className="min-h-screen bg-background flex flex-col">
      <InstructorNavbar />

      {/* Sticky header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-[64px] md:top-[80px] z-40">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/instructor/courses")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-base font-bold text-foreground">
              Create Course
            </h1>
          </div>
          <span className="text-xs text-muted-foreground">
            Step {activeStep} of 3 · Draft
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {/* Step Indicator */}
        <StepIndicator currentStep={activeStep} />

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl flex items-center gap-3 text-sm font-medium"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Steps */}
        <AnimatePresence mode="wait">
          {/* ── Step 1: Foundation ── */}
          {activeStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
              className="space-y-8"
            >
              {/* Course Basics */}
              <section className="space-y-5">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Course Basics
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Give your course a clear identity. A strong title and summary
                  help students decide to enroll.
                </p>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <Label htmlFor="title">
                      Course Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleUpdateField({ title: e.target.value })
                      }
                      placeholder="e.g. Mastering Advanced React Patterns"
                      className="mt-1.5"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(v) => handleUpdateField({ category: v })}
                    >
                      <SelectTrigger id="category" className="mt-1.5">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {COURSE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Short Description */}
                  <div>
                    <Label htmlFor="shortDescription">
                      Short Summary <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="shortDescription"
                      value={formData.shortDescription}
                      onChange={(e) =>
                        handleUpdateField({
                          shortDescription: e.target.value,
                        })
                      }
                      placeholder="Describe your course in 1-2 powerful sentences."
                      className="mt-1.5 min-h-[100px] resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* Thumbnail */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Upload className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Cover Image
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload a high-quality thumbnail. Recommended: 1280×720px,
                  JPG/PNG/WebP, max 5MB.
                </p>

                <div
                  className="relative aspect-video rounded-xl bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center overflow-hidden hover:border-primary group cursor-pointer transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {formData.thumbnailPreview ? (
                    <>
                      <img
                        src={formData.thumbnailPreview}
                        className="w-full h-full object-cover"
                        alt="Preview"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-xs font-semibold uppercase tracking-widest">
                          Change Image
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-3 border border-border">
                        <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
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
              </section>
            </motion.div>
          )}

          {/* ── Step 2: Learning Outcomes ── */}
          {activeStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
              className="space-y-8"
            >
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Learning Outcomes
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Identify the core competencies students will gain. Start with
                  action verbs (Build, Apply, Analyze...). These appear
                  prominently on your course landing page.
                </p>

                {/* Input row */}
                <div className="flex gap-2">
                  <Input
                    value={formData.newSkill}
                    onChange={(e) =>
                      handleUpdateField({ newSkill: e.target.value })
                    }
                    onKeyDown={handleAddSkill}
                    placeholder="e.g. Build production-ready GraphQL APIs"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddSkill}
                    variant="outline"
                    className="gap-1.5 shrink-0"
                  >
                    <PlusCircle className="w-4 h-4" /> Add
                  </Button>
                </div>

                {/* Skills list */}
                <div className="flex flex-wrap gap-2 min-h-[48px]">
                  <AnimatePresence>
                    {formData.skills.map((skill) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Badge
                          variant="secondary"
                          className="text-sm font-medium px-3 py-1.5 flex items-center gap-2"
                        >
                          <Check className="w-3 h-3 text-primary" />
                          {skill}
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Empty state */}
                {formData.skills.length === 0 && (
                  <div className="py-14 w-full text-center border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Target className="w-5 h-5 text-muted-foreground/40" />
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      Add at least 3 outcomes
                    </p>
                  </div>
                )}
              </section>
            </motion.div>
          )}

          {/* ── Step 3: Pricing ── */}
          {activeStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
              className="space-y-8"
            >
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Pricing & Launch
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Set your enrollment fee. You can change this anytime before
                  publishing. Set to 0 for a free course.
                </p>

                {/* Price input */}
                <div className="border border-border rounded-xl p-6 bg-card space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Market Price (USD)
                  </Label>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-3xl font-bold text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={formData.price}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^\d*\.?\d*$/.test(val)) {
                          handleUpdateField({ price: val });
                        }
                      }}
                      placeholder="0.00"
                      className="border-none bg-transparent text-4xl font-black text-foreground focus-visible:ring-0 shadow-none h-auto p-0 w-40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Students will see this as the enrollment fee.
                  </p>
                </div>

                {/* Launch info box */}
                <div className="border border-primary/20 bg-primary/5 rounded-xl p-5 flex gap-4 items-center">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-foreground mb-0.5">
                      Ready to create?
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your course will be created in{" "}
                      <span className="font-semibold text-foreground">
                        Draft
                      </span>{" "}
                      mode. You can then add modules, video lessons, and your
                      full curriculum in the Course Manager.
                    </p>
                  </div>
                </div>

                {/* Checklist */}
                <div className="border border-border rounded-xl p-5 space-y-3 bg-card">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    Pre-launch Checklist
                  </h4>
                  {[
                    {
                      done: !!formData.title,
                      label: "Course title is set",
                    },
                    {
                      done: !!formData.shortDescription,
                      label: "Short summary written",
                    },
                    {
                      done: !!formData.thumbnail,
                      label: "Cover image uploaded",
                    },
                    {
                      done: formData.skills.length >= 1,
                      label: "At least one learning outcome added",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          item.done
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.done && <Check className="w-3 h-3" />}
                      </div>
                      <span
                        className={
                          item.done
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={activeStep === 1 || createCourseMutation.isPending}
            className="gap-2 text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          {activeStep < 3 ? (
            <Button onClick={handleNext} className="gap-2">
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={createCourseMutation.isPending}
              className="gap-2"
            >
              <Rocket className="w-4 h-4" />
              {createCourseMutation.isPending ? "Creating..." : "Create Course"}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default InstructorCreateCourse;
