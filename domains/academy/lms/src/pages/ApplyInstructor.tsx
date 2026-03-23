import React, { useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navbar from "@/components/LmsNavbar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useApplyInstructor,
  useUser,
  useSwitchAcademyRole,
  useUploadResume,
} from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  CloudUpload,
  Trash2,
  FileText,
  CheckCircle2,
  Plus,
  X,
  Loader2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  personalDetails: z.object({
    firstname: z.string().min(2, "First name is too short"),
    lastname: z.string().min(2, "Last name is too short"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Invalid phone number"),
  }),
  teachingCategories: z
    .array(z.object({ value: z.string().min(2, "Category is too short") }))
    .min(1, "Add at least one category"),
  resumeUrl: z.string().min(1, "Please upload your resume"),
  interviewResponses: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string().min(20, "Please provide more details"),
      }),
    )
    .length(3),
});

const ApplyInstructor = () => {
  const { data: user } = useUser();
  const navigate = useNavigate();
  const applyMutation = useApplyInstructor();
  const uploadMutation = useUploadResume();
  const switchRoleMutation = useSwitchAcademyRole();
  const [isSwitching, setIsSwitching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalDetails: {
        firstname: user?.firstname || "",
        lastname: user?.lastname || "",
        email: user?.email || "",
        phone: "",
      },
      teachingCategories: [{ value: "" }],
      resumeUrl: "",
      interviewResponses: [
        { question: "Why do you want to teach?", answer: "" },
        {
          question: "What subjects are you most passionate about?",
          answer: "",
        },
        { question: "Describe your teaching experience.", answer: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "teachingCategories" as any, // Type cast to avoid deep type issues
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      const result = await uploadMutation.mutateAsync(file);
      form.setValue("resumeUrl", result.url, { shouldValidate: true });
      toast.success("Resume uploaded successfully");
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Transform teachingCategories back to string[] before sending
    const payload = {
      ...values,
      teachingCategories: values.teachingCategories.map((c: any) => c.value),
    };
    applyMutation.mutate(payload);
  };

  const handleGoToLms = async () => {
    setIsSwitching(true);
    try {
      await switchRoleMutation.mutateAsync({ newRole: "instructor" });
      navigate("/instructor");
    } catch (error) {
      console.error("Failed to switch to instructor role:", error);
    } finally {
      setIsSwitching(false);
    }
  };

  const hasApplication = user?.hasTeacherApplication;
  const instructorStatus = user?.instructorStatus?.toUpperCase();
  const isInstructor =
    user?.academyUser?.role === "INSTRUCTOR" ||
    instructorStatus === "ACCEPTED" ||
    instructorStatus === "APPROVED" ||
    instructorStatus === "ACTIVE" ||
    user?.roleStatus?.instructor === "ACTIVE" ||
    user?.roleStatus?.instructor?.toUpperCase() === "ACTIVE";

  if (isInstructor) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow container max-w-4xl mx-auto px-4 py-20 flex items-center justify-center">
          <Card className="w-full border-none shadow-2xl text-center p-12 bg-white rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />
            <div className="mb-6 inline-flex p-4 rounded-3xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={48} />
            </div>
            <h1 className="text-4xl font-heading font-bold mb-4 text-slate-900">
              You're an Instructor!
            </h1>
            <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto leading-relaxed">
              Welcome, Your application was accepted and you are ready to start
              sharing your expertise.
            </p>
            <Button
              size="lg"
              onClick={handleGoToLms}
              disabled={isSwitching}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-14 px-8 text-lg shadow-xl shadow-slate-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSwitching ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Switching Role...
                </>
              ) : (
                "Enter Instructor Dashboard"
              )}
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  const isPending =
    hasApplication ||
    instructorStatus === "PENDING" ||
    user?.roleStatus?.instructor === "pending" ||
    user?.roleStatus?.instructor?.toUpperCase() === "PENDING";

  if (isPending) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow container max-w-4xl mx-auto px-4 py-20 flex items-center justify-center">
          <Card className="w-full border-none shadow-2xl text-center p-12 bg-white rounded-3xl relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-500" />
            <div className="mb-6 inline-flex p-4 rounded-3xl bg-amber-50 text-amber-600">
              <Clock size={48} />
            </div>
            <h1 className="text-4xl font-heading font-bold mb-4 text-slate-900">
              Application Pending
            </h1>
            <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
              We've received your application! Our team is currently reviewing
              your profile. We'll notify you via email as soon as there's an
              update.
            </p>
            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-sm text-slate-400">
              Estimated review time: 2-3 business days
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow container max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-10">
          <div className="text-center space-y-4">
            <div className="inline-block px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider mb-2">
              Join Our Expert Network
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-slate-900">
              {instructorStatus === "REJECTED"
                ? "Re-apply to Teach"
                : "Become an Instructor"}
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              {instructorStatus === "REJECTED"
                ? "Update your application details and try again. We value your persistence and unique perspective."
                : "Share your passion, reach students globally, and grow your personal brand while earning."}
            </p>
          </div>

          <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white">
            <div className="h-2 bg-gradient-to-r from-slate-800 to-slate-900" />
            <CardHeader className="pt-10 px-8 md:px-12">
              <CardTitle className="text-2xl">Application Form</CardTitle>
              <CardDescription className="text-base">
                Please provide accurate information about your expertise and
                teaching goals.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 md:px-12 pb-12">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-10"
                >
                  {/* Personal Details Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4 py-1">
                      1. Personal Information
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="personalDetails.firstname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-bold">
                              First Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="h-12 rounded-xl focus-visible:ring-slate-900"
                                placeholder="John"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="personalDetails.lastname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-bold">
                              Last Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="h-12 rounded-xl focus-visible:ring-slate-900"
                                placeholder="Doe"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="personalDetails.email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-bold">
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="h-12 rounded-xl focus-visible:ring-slate-900"
                                placeholder="john@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="personalDetails.phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-bold">
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="h-12 rounded-xl focus-visible:ring-slate-900"
                                placeholder="+251..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Expertise Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4 py-1">
                        2. Expert Expertise
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => append({ value: "" })}
                        className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-bold rounded-xl gap-2"
                      >
                        <Plus size={16} /> Add More
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fields.map((field, index) => (
                        <FormField
                          key={field.id}
                          control={form.control}
                          name={`teachingCategories.${index}.value` as any}
                          render={({ field: inputField }) => (
                            <FormItem className="relative group">
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    className="h-12 rounded-xl pr-10 focus-visible:ring-slate-900"
                                    placeholder="e.g. Fullstack Web Dev"
                                    {...inputField}
                                  />
                                  {fields.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => remove(index)}
                                      className="absolute right-3 top-3.5 text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                      <X size={18} />
                                    </button>
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Resume Upload Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4 py-1">
                      3. Professional Background
                    </div>
                    <FormField
                      control={form.control}
                      name="resumeUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-bold">
                            Your Resume
                          </FormLabel>
                          <FormControl>
                            <div className="group relative">
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                              />
                              {!field.value ? (
                                <div
                                  onClick={() =>
                                    !uploadMutation.isPending &&
                                    fileInputRef.current?.click()
                                  }
                                  className={`border-2 border-dashed border-slate-200 rounded-[1.5rem] p-12 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer ${uploadMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                  {uploadMutation.isPending ? (
                                    <Loader2 className="h-10 w-10 text-slate-900 animate-spin mb-4" />
                                  ) : (
                                    <CloudUpload className="h-12 w-12 text-slate-400 group-hover:text-slate-600 transition-colors mb-4" />
                                  )}
                                  <p className="text-base font-bold text-slate-900">
                                    Upload your CV / Resume
                                  </p>
                                  <p className="text-sm text-slate-400 mt-1">
                                    PDF or Word document (Max 5MB)
                                  </p>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between p-6 bg-slate-900 rounded-[1.5rem] text-white shadow-xl">
                                  <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/10 rounded-xl">
                                      <FileText className="text-white" />
                                    </div>
                                    <div>
                                      <p className="font-bold text-white">
                                        Resume Attached
                                      </p>
                                      <a
                                        href={field.value}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-slate-400 hover:text-white underline transition-colors"
                                      >
                                        View File
                                      </a>
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-red-500 hover:text-white rounded-xl"
                                    onClick={() =>
                                      form.setValue("resumeUrl", "")
                                    }
                                  >
                                    <Trash2 size={18} />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Assessment Section */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4 py-1">
                      4. Self-Assessment
                    </div>
                    {form
                      .getValues("interviewResponses")
                      .map((response, index) => (
                        <FormField
                          key={index}
                          control={form.control}
                          name={`interviewResponses.${index}.answer` as any}
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-slate-800 font-bold leading-relaxed">
                                {response.question}
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Share your experience and thoughts..."
                                  className="min-h-[120px] rounded-2xl p-4 focus-visible:ring-slate-900 resize-none border-slate-200"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                  </div>

                  <div className="pt-6">
                    <Button
                      type="submit"
                      className="w-full h-16 text-lg font-bold rounded-[1.25rem] bg-slate-900 hover:bg-slate-800 text-white shadow-2xl shadow-slate-200 transition-all hover:scale-[1.01] active:scale-[0.99]"
                      disabled={
                        applyMutation.isPending || uploadMutation.isPending
                      }
                    >
                      {applyMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                    <p className="text-center text-xs text-slate-400 mt-4 px-8 leading-relaxed">
                      By submitting, you agree to our Instructor Terms and
                      Conditions. Our team typically reviews applications in
                      48-72 hours.
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ApplyInstructor;
