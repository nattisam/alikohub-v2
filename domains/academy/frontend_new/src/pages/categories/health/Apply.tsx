import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FileText,
  Upload,
  CheckCircle,
  GraduationCap,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Shield,
  Clock,
  Sparkles,
  FileCheck,
  Heart,
  Users,
  Award,
  Trash2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Layout } from "@/components/categories/health/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { programs } from "@/data/categories/health/programs";
import { cn } from "@/lib/utils";

const applicationSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number").max(15),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  streetAddress: z.string().min(5, "Please enter your street address"),
  city: z.string().min(2, "Please enter your city"),
  state: z.string().min(2, "Please select your state"),
  zipCode: z.string().min(5, "Please enter a valid ZIP code").max(10),
  programId: z.string().min(1, "Please select a program"),
  startMonth: z.string().min(1, "Please select a start month"),
  highestEducation: z
    .string()
    .min(1, "Please select your highest education level"),
  previousHealthcareExperience: z.string().optional(),
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactPhone: z
    .string()
    .min(10, "Please enter a valid phone number"),
  emergencyContactRelation: z
    .string()
    .min(1, "Please specify the relationship"),
  howDidYouHear: z.string().optional(),
  additionalNotes: z.string().optional(),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
  backgroundCheckConsent: z
    .boolean()
    .refine((val) => val === true, "Background check consent is required"),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const generateStartMonths = () => {
  const months = [];
  const startDate = new Date(2026, 2, 1);
  for (let i = 0; i < 12; i++) {
    const date = new Date(startDate);
    date.setMonth(startDate.getMonth() + i);
    const monthYear = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    months.push({ value: monthYear, label: monthYear });
  }
  return months;
};

const startMonths = generateStartMonths();

const educationLevels = [
  { value: "high-school", label: "High School Diploma / GED" },
  { value: "some-college", label: "Some College" },
  { value: "associates", label: "Associate's Degree" },
  { value: "bachelors", label: "Bachelor's Degree" },
  { value: "masters", label: "Master's Degree or Higher" },
];

const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const hearAboutOptions = [
  "Google Search",
  "Social Media",
  "Friend or Family Referral",
  "Healthcare Employer",
  "Community Event",
  "Job Fair",
  "Other",
];

const documentTypes = [
  {
    id: "governmentId",
    label: "Government-Issued ID",
    required: true,
    hint: "Driver's license, state ID, or passport",
    icon: Shield,
  },
  {
    id: "highSchoolDiploma",
    label: "High School Diploma or GED",
    required: true,
    hint: "Official transcript or diploma copy",
    icon: Award,
  },
  {
    id: "immunizationRecords",
    label: "Immunization Records",
    required: false,
    hint: "Required for clinical programs",
    icon: Heart,
  },
  {
    id: "resume",
    label: "Resume / CV",
    required: false,
    hint: "PDF or Word document",
    icon: FileText,
  },
  {
    id: "otherDocuments",
    label: "Other Documents",
    required: false,
    hint: "Any additional supporting documents",
    icon: Upload,
  },
];

const Apply = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{
    [key: string]: { file: File; uploading: boolean; url?: string } | null;
  }>({});

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      programId: "",
      startMonth: "",
      highestEducation: "",
      previousHealthcareExperience: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelation: "",
      howDidYouHear: "",
      additionalNotes: "",
      termsAccepted: false,
      backgroundCheckConsent: false,
    },
  });

  const watchedFields = form.watch();

  const calculateProgress = () => {
    const fields = [
      watchedFields.firstName,
      watchedFields.lastName,
      watchedFields.email,
      watchedFields.phone,
      watchedFields.dateOfBirth,
      watchedFields.streetAddress,
      watchedFields.city,
      watchedFields.state,
      watchedFields.zipCode,
      watchedFields.programId,
      watchedFields.startMonth,
      watchedFields.highestEducation,
      watchedFields.emergencyContactName,
      watchedFields.emergencyContactPhone,
      watchedFields.emergencyContactRelation,
    ];
    const filledFields = fields.filter((f) => f && f.length > 0).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const progress = calculateProgress();

  const handleFileUpload = async (documentType: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadedFiles((prev) => ({
      ...prev,
      [documentType]: { file, uploading: true },
    }));

    // Mock upload for now
    setTimeout(() => {
      setUploadedFiles((prev) => ({
        ...prev,
        [documentType]: {
          file,
          uploading: false,
          url: `mock-url-${file.name}`,
        },
      }));
      toast({
        title: "Document uploaded",
        description: `${file.name} uploaded successfully`,
      });
    }, 1000);
  };

  const removeFile = async (documentType: string) => {
    setUploadedFiles((prev) => ({ ...prev, [documentType]: null }));
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    try {
      // Mock API submission
      console.log("Health Application Data:", data);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSubmitted(true);
      toast({
        title: "Application Submitted!",
        description:
          "We've received your application and will contact you within 2-3 business days.",
      });
    } catch (err: any) {
      toast({
        title: "Submission Error",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProgram = programs.find(
    (p) => p.id === watchedFields.programId,
  );

  if (isSubmitted) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-card to-accent/5 py-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto text-center overflow-hidden animate-fade-in">
              <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
              <CardContent className="pt-12 pb-8">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="h-12 w-12 text-accent-foreground" />
                  </div>
                </div>
                <Badge className="mb-4 bg-accent/10 text-accent border-accent/30">
                  Application Received
                </Badge>
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  You're on Your Way!
                </h1>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Thank you for applying to Aliko Academy Health. Our admissions
                  team is excited to review your application.
                </p>
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 mb-8 text-left border border-primary/10">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent" /> What Happens
                    Next?
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        step: 1,
                        text: "Application review by our admissions team (2-3 business days)",
                        icon: FileCheck,
                      },
                      {
                        step: 2,
                        text: "You'll receive an email with your application status",
                        icon: Mail,
                      },
                      {
                        step: 3,
                        text: "Schedule orientation for your selected start date",
                        icon: Calendar,
                      },
                    ].map(({ step, text, icon: Icon }) => (
                      <div key={step} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground pt-1">
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild variant="outline">
                    <a href="/programs">Explore Programs</a>
                  </Button>
                  <Button
                    asChild
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <a href="/">Return to Home</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-card to-accent/5">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                  <span>Applications Open for Spring 2026</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
                  Start Your Application
                </h1>
                <p className="text-lg text-primary-foreground/90 max-w-xl">
                  Take the first step toward your healthcare career. Complete
                  your application in just 10-15 minutes.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold">{progress}%</div>
                <div className="text-sm text-primary-foreground/80">
                  Complete
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Bar */}
        <div className="sticky top-[73px] z-40 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Application Progress
                </span>
                <span className="text-sm text-muted-foreground">
                  {progress}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>

        {/* Form */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Step 1: Personal Information */}
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group">
                    <div className="h-1 bg-gradient-to-r from-primary to-primary/50" />
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                          <User className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs">
                            Step 1 of 7
                          </Badge>
                          <CardTitle className="mt-1">
                            Personal Information
                          </CardTitle>
                          <CardDescription>
                            Tell us about yourself
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 grid gap-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="John"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Doe"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="john.doe@example.com"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="(555) 123-4567"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem className="max-w-xs">
                            <FormLabel>Date of Birth *</FormLabel>
                            <FormControl>
                              <Input type="date" className="h-11" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Step 2: Address */}
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group">
                    <div className="h-1 bg-gradient-to-r from-primary/50 to-primary/30" />
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/90 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                          <MapPin className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs">
                            Step 2 of 7
                          </Badge>
                          <CardTitle className="mt-1">
                            Mailing Address
                          </CardTitle>
                          <CardDescription>
                            Where should we send correspondence?
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 grid gap-6">
                      <FormField
                        control={form.control}
                        name="streetAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123 Main Street, Apt 4B"
                                className="h-11"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Seattle"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Select state" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {usStates.map((state) => (
                                    <SelectItem key={state} value={state}>
                                      {state}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="98101"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Step 3: Program Selection */}
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group border-2 border-primary/20">
                    <div className="h-1 bg-gradient-to-r from-accent to-primary" />
                    <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                          <GraduationCap className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <Badge className="bg-accent/10 text-accent border-accent/30 text-xs">
                            Important
                          </Badge>
                          <CardTitle className="mt-1">
                            Program Selection
                          </CardTitle>
                          <CardDescription>
                            Choose your program and start date
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 grid gap-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="programId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Program *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Choose a program" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {programs
                                    .filter(
                                      (p) => p.enrollmentStatus === "open",
                                    )
                                    .map((program) => (
                                      <SelectItem
                                        key={program.id}
                                        value={program.id}
                                      >
                                        {program.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="startMonth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Start Month *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Select start month" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {startMonths.map((month) => (
                                    <SelectItem
                                      key={month.value}
                                      value={month.value}
                                    >
                                      {month.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {selectedProgram && (
                        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-4 border border-primary/10 animate-fade-in">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Award className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">
                                {selectedProgram.name}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {selectedProgram.description?.substring(0, 100)}
                                ...
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  {selectedProgram.duration}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {selectedProgram.modality}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  ${selectedProgram.tuition.toLocaleString()}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Step 4: Education Background */}
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group">
                    <div className="h-1 bg-gradient-to-r from-primary/40 to-primary/20" />
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                          <BookOpen className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs">
                            Step 4 of 7
                          </Badge>
                          <CardTitle className="mt-1">
                            Education Background
                          </CardTitle>
                          <CardDescription>
                            Tell us about your educational history
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 grid gap-6">
                      <FormField
                        control={form.control}
                        name="highestEducation"
                        render={({ field }) => (
                          <FormItem className="max-w-md">
                            <FormLabel>Highest Education Level *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Select education level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {educationLevels.map((level) => (
                                  <SelectItem
                                    key={level.value}
                                    value={level.value}
                                  >
                                    {level.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="previousHealthcareExperience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Previous Healthcare Experience (Optional)
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe any relevant healthcare experience..."
                                className="min-h-[100px] resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Step 5: Document Upload - FULLY INTEGRATED */}
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group">
                    <div className="h-1 bg-gradient-to-r from-primary/30 to-primary/10" />
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/70 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                          <FileText className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs">
                            Step 5 of 7
                          </Badge>
                          <CardTitle className="mt-1">
                            Required Documents
                          </CardTitle>
                          <CardDescription>
                            Upload your supporting documentation (PDF, JPG, PNG
                            - Max 5MB each)
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        {documentTypes.map(
                          ({ id, label, required, hint, icon: Icon }) => {
                            const fileData = uploadedFiles[id];
                            return (
                              <div
                                key={id}
                                className={cn(
                                  "relative rounded-xl border-2 border-dashed p-4 transition-all duration-200",
                                  fileData?.url
                                    ? "border-accent bg-accent/5"
                                    : "border-border hover:border-primary/50 hover:bg-primary/5",
                                )}
                              >
                                <div className="flex items-start gap-3 mb-3">
                                  <div
                                    className={cn(
                                      "w-10 h-10 rounded-lg flex items-center justify-center",
                                      fileData?.url
                                        ? "bg-accent/20"
                                        : "bg-muted",
                                    )}
                                  >
                                    {fileData?.url ? (
                                      <CheckCircle className="h-5 w-5 text-accent" />
                                    ) : (
                                      <Icon className="h-5 w-5 text-muted-foreground" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <label
                                      htmlFor={id}
                                      className="font-medium text-sm cursor-pointer"
                                    >
                                      {label}{" "}
                                      {required && (
                                        <span className="text-destructive">
                                          *
                                        </span>
                                      )}
                                    </label>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {hint}
                                    </p>
                                  </div>
                                </div>

                                {fileData?.url ? (
                                  <div className="space-y-2">
                                    <p className="text-xs text-accent flex items-center gap-1">
                                      <FileCheck className="h-3 w-3" />{" "}
                                      {fileData.file.name}
                                    </p>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="text-xs text-destructive"
                                      onClick={() => removeFile(id)}
                                    >
                                      <Trash2 className="h-3 w-3 mr-1" /> Remove
                                    </Button>
                                  </div>
                                ) : fileData?.uploading ? (
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                                    Uploading {fileData.file.name}...
                                  </div>
                                ) : (
                                  <Input
                                    id={id}
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleFileUpload(id, file);
                                    }}
                                    className="file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                  />
                                )}
                              </div>
                            );
                          },
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Step 6: Emergency Contact */}
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group">
                    <div className="h-1 bg-gradient-to-r from-primary/20 to-primary/5" />
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/60 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                          <Phone className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs">
                            Step 6 of 7
                          </Badge>
                          <CardTitle className="mt-1">
                            Emergency Contact
                          </CardTitle>
                          <CardDescription>
                            Someone we can contact in case of emergency
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 grid gap-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="emergencyContactName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Jane Doe"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="emergencyContactPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Phone *</FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="(555) 987-6543"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="emergencyContactRelation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Relationship *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Parent, Spouse, etc."
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Step 7: Review & Submit */}
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group">
                    <div className="h-1 bg-gradient-to-r from-accent to-primary" />
                    <CardHeader className="bg-gradient-to-r from-accent/5 to-transparent">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                          <CheckCircle className="h-6 w-6 text-accent-foreground" />
                        </div>
                        <div>
                          <Badge className="bg-accent/10 text-accent border-accent/30 text-xs">
                            Final Step
                          </Badge>
                          <CardTitle className="mt-1">
                            Review & Submit
                          </CardTitle>
                          <CardDescription>
                            Complete your application
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      <FormField
                        control={form.control}
                        name="howDidYouHear"
                        render={({ field }) => (
                          <FormItem className="max-w-md">
                            <FormLabel>How did you hear about us?</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {hearAboutOptions.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="additionalNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Additional Notes or Questions (Optional)
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Any additional information..."
                                className="min-h-[80px] resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                        <FormField
                          control={form.control}
                          name="termsAccepted"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="mt-0.5"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-normal text-sm">
                                  I agree to the{" "}
                                  <a
                                    href="/policies"
                                    className="text-primary underline hover:text-primary/80"
                                  >
                                    Terms of Service and Privacy Policy
                                  </a>{" "}
                                  *
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="backgroundCheckConsent"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="mt-0.5"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-normal text-sm">
                                  I consent to a background check as required
                                  for healthcare education programs *
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Submit Button */}
                  <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Estimated time to complete: 10-15 minutes
                      </span>
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="px-12 h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Submitting Application..."
                      ) : (
                        <>
                          Submit Application{" "}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4 max-w-md mx-auto">
                      By submitting this application, you certify that all
                      information provided is accurate and complete.
                    </p>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="py-8 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Need Help?</h3>
                    <p className="text-sm text-muted-foreground">
                      Our admissions team is here to assist you
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" asChild>
                    <a href="/contact">Contact Us</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="tel:+12065550100">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Apply;
