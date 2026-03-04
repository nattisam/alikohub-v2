import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navbar from "@/components/Navbar";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  useApplyInstructor,
  useUser,
  useSwitchAcademyRole,
} from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const categories = [
  "Programming",
  "Cloud Computing",
  "Data Science",
  "Design",
  "Business",
  "Marketing",
] as const;

const formSchema = z.object({
  personalDetails: z.object({
    firstname: z.string().min(2, "First name is too short"),
    lastname: z.string().min(2, "Last name is too short"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Invalid phone number"),
  }),
  teachingCategories: z
    .array(z.string())
    .min(1, "Select at least one category"),
  resumeUrl: z.string().url("Invalid URL"),
  interviewResponses: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string().min(20, "Please provide a more detailed answer"),
      }),
    )
    .length(3),
});

const ApplyInstructor = () => {
  const { data: user } = useUser();
  const navigate = useNavigate();
  const applyMutation = useApplyInstructor();
  const switchRoleMutation = useSwitchAcademyRole();
  const [isSwitching, setIsSwitching] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalDetails: {
        firstname: user?.firstname || "",
        lastname: user?.lastname || "",
        email: user?.email || "",
        phone: "",
      },
      teachingCategories: [],
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    applyMutation.mutate(values);
  };

  const handleGoToLms = async () => {
    setIsSwitching(true);
    try {
      await switchRoleMutation.mutateAsync({ newRole: "instructor" });
      navigate("/instructor/lms");
    } catch (error) {
      console.error("Failed to switch to instructor role:", error);
    } finally {
      setIsSwitching(false);
    }
  };

  const hasApplication = user?.hasTeacherApplication;
  const instructorStatus = user?.instructorStatus; // PENDING, ACCEPTED, REJECTED
  const isInstructor =
    user?.academyUser?.role === "INSTRUCTOR" ||
    instructorStatus === "ACCEPTED" ||
    user?.roleStatus?.instructor === "ACTIVE";

  if (isInstructor) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow container max-w-4xl mx-auto px-4 py-12 flex items-center justify-center">
          <Card className="w-full border-border shadow-lg text-center p-8">
            <h1 className="text-3xl font-bold mb-4">You are an Instructor!</h1>
            <p className="text-muted-foreground mb-6">
              Your application has been accepted. You can now access the
              instructor dashboard.
            </p>
            <Button size="lg" onClick={handleGoToLms} disabled={isSwitching}>
              {isSwitching ? "Switching..." : "Go to Instructor LMS"}
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  if (hasApplication && instructorStatus === "PENDING") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow container max-w-4xl mx-auto px-4 py-12 flex items-center justify-center">
          <Card className="w-full border-border shadow-lg text-center p-8">
            <h1 className="text-3xl font-bold mb-4">Application Pending</h1>
            <p className="text-muted-foreground">
              Your application to become an instructor is currently under
              review. We will notify you once a decision has been made.
            </p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight">
              {instructorStatus === "REJECTED"
                ? "Re-apply as an Instructor"
                : "Apply as an Instructor"}
            </h1>
            <p className="text-xl text-muted-foreground">
              {instructorStatus === "REJECTED"
                ? "Your previous application was not successful. You can try applying again with updated information."
                : "Share your knowledge with our global community of students."}
            </p>
          </div>

          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle>Instructor Application form</CardTitle>
              <CardDescription>
                Please fill in all details accurately. Our team will review your
                application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="personalDetails.firstname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
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
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
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
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} />
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
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+251..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="teachingCategories"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-lg">
                            Teaching Categories
                          </FormLabel>
                          <FormDescription>
                            Select the areas you are qualified to teach.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {categories.map((category) => (
                            <FormField
                              key={category}
                              control={form.control}
                              name="teachingCategories"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={category}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          category,
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                category,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== category,
                                                ),
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {category}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="resumeUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resume URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Link to your portfolio or resume (Drive, Dropbox,
                          etc.)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Self-Assessment</h3>
                    {form
                      .getValues("interviewResponses")
                      .map((response, index) => (
                        <FormField
                          key={index}
                          control={form.control}
                          name={`interviewResponses.${index}.answer`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{response.question}</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us more..."
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-lg"
                    disabled={applyMutation.isPending}
                  >
                    {applyMutation.isPending
                      ? "Submitting..."
                      : "Submit Application"}
                  </Button>
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
