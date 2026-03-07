import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/categories/stem/layout/Layout";
import { Button } from "@/components/categories/stem/ui/button";
import { Card, CardContent } from "@/components/categories/stem/ui/card";
import { Input } from "@/components/categories/stem/ui/input";
import { Textarea } from "@/components/categories/stem/ui/textarea";
import { Label } from "@/components/categories/stem/ui/label";
import { Checkbox } from "@/components/categories/stem/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/categories/stem/ui/select";
import {
  GraduationCap,
  Building2,
  ArrowRight,
  CheckCircle2,
  Shield,
  User,
  BookOpen,
  Briefcase,
  FileText,
  Upload,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { domains } from "@/data/categories/stem/domains";
import { useCoursesByCategory } from "@/hooks/useAcademy";
import { cn } from "@/lib/categories/stem/utils";

type ApplicantType = "individual" | "organization" | null;

const statusOptions = ["Student", "Graduate", "Working Professional", "Other"];
const levelOptions = ["Beginner", "Intermediate", "Professional"];
const deliveryOptions = ["Online", "Hybrid"];
const timeframeOptions = [
  "Immediately available",
  "Within 1 to 3 months",
  "Later",
];

const Apply = () => {
  const [searchParams] = useSearchParams();
  const preselectedProgram = searchParams.get("program") || "";

  const { data } = useCoursesByCategory("STEM");
  const courses = data?.courses || [];

  const [applicantType, setApplicantType] = useState<ApplicantType>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    currentStatus: "",
    fieldOfStudy: "",
    yearsExperience: "",
    engineeringDomain: "",
    programOfInterest: preselectedProgram,
    preferredLevel: "",
    preferredDelivery: "",
    preferredTimeframe: "",
    motivation: "",
  });

  const domainOptions = domains.map((d) => ({
    value: d.name,
    label: d.shortName,
  }));

  const availablePrograms = useMemo(() => {
    if (!formData.engineeringDomain) return [];
    return courses.filter(
      (c: any) =>
        c.category?.name === formData.engineeringDomain ||
        c.categoryId === formData.engineeringDomain ||
        c.title
          .toLowerCase()
          .includes(formData.engineeringDomain.toLowerCase()),
    );
  }, [formData.engineeringDomain, courses]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "engineeringDomain") {
        updated.programOfInterest = "";
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToDisclaimer) {
      toast.error("Please agree to the disclaimer to proceed.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Mock submission - replace with real API call when backend is available
      console.log("Form submitted:", formData);
      setSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (err: any) {
      toast.error("Failed to submit application", {
        description: err.message || "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <section className="gradient-hero py-24 lg:py-36">
          <div className="container-content">
            <div className="max-w-xl mx-auto text-center">
              <div className="h-20 w-20 rounded-2xl bg-accent-green/20 border border-accent-green/30 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-accent-green/20">
                <CheckCircle2 className="h-10 w-10 text-accent-green" />
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-extrabold text-foreground">
                Thank You for{" "}
                <span className="text-accent-green">Applying</span>
              </h1>
              <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
                Our academic team will review your application and contact you
                shortly with next steps.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="hero" size="lg">
                  <Link to="/my-applications">View My Applications</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/programs">Browse Programs</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero py-20 lg:py-28">
        <div className="container-content">
          <div className="max-w-3xl mx-auto text-center">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent border border-primary/30 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-display text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
              Apply to <span className="text-primary">Aliko Academy</span> STEM
            </h1>
            <p className="mt-5 text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Apply for industry-aligned engineering and STEM training programs.
            </p>
            <p className="mt-4 text-base text-accent-green font-semibold flex items-center justify-center gap-2">
              <Shield className="h-4 w-4" />
              No payment required at this stage.
            </p>
          </div>
        </div>
      </section>

      {/* Applicant Type Selector */}
      <section className="section-padding">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-foreground text-center mb-4">
              Select Your <span className="text-primary">Application Type</span>
            </h2>
            <p className="text-center text-muted-foreground mb-10">
              Choose the option that best describes you.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              <button
                onClick={() => setApplicantType("individual")}
                className={cn(
                  "text-left p-7 rounded-2xl border-2 transition-all duration-300 group",
                  applicantType === "individual"
                    ? "border-primary bg-primary/10 shadow-2xl shadow-primary/20"
                    : "border-divider bg-card hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10",
                )}
              >
                <div className="h-14 w-14 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-5">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  Individual Applicant
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Student or professional applying for a training program.
                </p>
                {applicantType === "individual" && (
                  <div className="mt-4 flex items-center gap-2 text-sm font-bold text-primary">
                    <CheckCircle2 className="h-4 w-4" /> Selected
                  </div>
                )}
              </button>

              <button
                onClick={() => setApplicantType("organization")}
                className={cn(
                  "text-left p-7 rounded-2xl border-2 transition-all duration-300 group",
                  applicantType === "organization"
                    ? "border-accent bg-accent/10 shadow-2xl shadow-accent/20"
                    : "border-divider bg-card hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10",
                )}
              >
                <div className="h-14 w-14 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center mb-5">
                  <Building2 className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  Organization / Enterprise
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Group, institutional, or enterprise training inquiry.
                </p>
                {applicantType === "organization" && (
                  <div className="mt-4 flex items-center gap-2 text-sm font-bold text-accent">
                    <CheckCircle2 className="h-4 w-4" /> Selected
                  </div>
                )}
              </button>
            </div>

            {/* Organization Redirect */}
            {applicantType === "organization" && (
              <Card className="border-accent/30 bg-accent/8 shadow-xl">
                <CardContent className="p-8 text-center">
                  <Building2 className="h-12 w-12 text-accent mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                    Enterprise & Institutional Training
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
                    For group or enterprise training, please submit a request
                    through our Enterprise page.
                  </p>
                  <Button asChild variant="hero" size="lg">
                    <Link to="/enterprise">
                      Go to Enterprise Training{" "}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Individual Application Form */}
            {applicantType === "individual" && (
              <Card className="border-primary/20 bg-card shadow-2xl shadow-primary/5">
                <CardContent className="p-8 lg:p-10">
                  <form onSubmit={handleSubmit} className="space-y-10">
                    {/* A. Personal Information */}
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-display text-xl font-bold text-primary">
                          Personal Information
                        </h3>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="font-bold">
                            First Name *
                          </Label>
                          <Input
                            id="firstName"
                            required
                            value={formData.firstName}
                            onChange={(e) =>
                              updateField("firstName", e.target.value)
                            }
                            placeholder="First name"
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="font-bold">
                            Last Name *
                          </Label>
                          <Input
                            id="lastName"
                            required
                            value={formData.lastName}
                            onChange={(e) =>
                              updateField("lastName", e.target.value)
                            }
                            placeholder="Last name"
                            className="h-12"
                          />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5 mt-5">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="font-bold">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                              updateField("email", e.target.value)
                            }
                            placeholder="you@email.com"
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="font-bold">
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              updateField("phone", e.target.value)
                            }
                            placeholder="+1 234 567 8900"
                            className="h-12"
                          />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5 mt-5">
                        <div className="space-y-2">
                          <Label htmlFor="country" className="font-bold">
                            Country / Region *
                          </Label>
                          <Input
                            id="country"
                            required
                            value={formData.country}
                            onChange={(e) =>
                              updateField("country", e.target.value)
                            }
                            placeholder="e.g., UAE"
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city" className="font-bold">
                            City{" "}
                            <span className="text-muted-foreground font-normal">
                              (optional)
                            </span>
                          </Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) =>
                              updateField("city", e.target.value)
                            }
                            placeholder="e.g., Dubai"
                            className="h-12"
                          />
                        </div>
                      </div>
                    </div>

                    {/* B. Background */}
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-accent" />
                        </div>
                        <h3 className="font-display text-xl font-bold text-accent">
                          Background
                        </h3>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="currentStatus" className="font-bold">
                            Current Status *
                          </Label>
                          <Select
                            value={formData.currentStatus}
                            onValueChange={(v) =>
                              updateField("currentStatus", v)
                            }
                          >
                            <SelectTrigger
                              id="currentStatus"
                              className="bg-background h-12"
                            >
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-divider">
                              {statusOptions.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="yearsExperience"
                            className="font-bold"
                          >
                            Years of Experience
                          </Label>
                          <Input
                            id="yearsExperience"
                            type="number"
                            min="0"
                            value={formData.yearsExperience}
                            onChange={(e) =>
                              updateField("yearsExperience", e.target.value)
                            }
                            placeholder="e.g., 3"
                            className="h-12"
                          />
                        </div>
                      </div>
                      <div className="mt-5 space-y-2">
                        <Label htmlFor="fieldOfStudy" className="font-bold">
                          Field of Study / Work Background *
                        </Label>
                        <Input
                          id="fieldOfStudy"
                          required
                          value={formData.fieldOfStudy}
                          onChange={(e) =>
                            updateField("fieldOfStudy", e.target.value)
                          }
                          placeholder="e.g., Civil Engineering"
                          className="h-12"
                        />
                      </div>
                    </div>

                    {/* C. Program Selection */}
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-lg bg-accent-green/15 border border-accent-green/30 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-accent-green" />
                        </div>
                        <h3 className="font-display text-xl font-bold text-accent-green">
                          Program Selection
                        </h3>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label
                            htmlFor="engineeringDomain"
                            className="font-bold"
                          >
                            Engineering Domain *
                          </Label>
                          <Select
                            value={formData.engineeringDomain}
                            onValueChange={(v) =>
                              updateField("engineeringDomain", v)
                            }
                          >
                            <SelectTrigger
                              id="engineeringDomain"
                              className="bg-background h-12"
                            >
                              <SelectValue placeholder="Select domain" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-divider">
                              {domainOptions.map((d) => (
                                <SelectItem key={d.value} value={d.value}>
                                  {d.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="programOfInterest"
                            className="font-bold"
                          >
                            Program of Interest *
                          </Label>
                          <Select
                            value={formData.programOfInterest}
                            onValueChange={(v) =>
                              updateField("programOfInterest", v)
                            }
                            disabled={!formData.engineeringDomain}
                          >
                            <SelectTrigger
                              id="programOfInterest"
                              className="bg-background h-12"
                            >
                              <SelectValue
                                placeholder={
                                  formData.engineeringDomain
                                    ? "Select program"
                                    : "Select domain first"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-divider max-h-[250px]">
                              {availablePrograms.map((p) => (
                                <SelectItem key={p.id} value={p.title}>
                                  {p.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-5 mt-5">
                        <div className="space-y-2">
                          <Label htmlFor="preferredLevel" className="font-bold">
                            Preferred Level *
                          </Label>
                          <Select
                            value={formData.preferredLevel}
                            onValueChange={(v) =>
                              updateField("preferredLevel", v)
                            }
                          >
                            <SelectTrigger
                              id="preferredLevel"
                              className="bg-background h-12"
                            >
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-divider">
                              {levelOptions.map((l) => (
                                <SelectItem key={l} value={l}>
                                  {l}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="preferredDelivery"
                            className="font-bold"
                          >
                            Delivery Mode *
                          </Label>
                          <Select
                            value={formData.preferredDelivery}
                            onValueChange={(v) =>
                              updateField("preferredDelivery", v)
                            }
                          >
                            <SelectTrigger
                              id="preferredDelivery"
                              className="bg-background h-12"
                            >
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-divider">
                              {deliveryOptions.map((d) => (
                                <SelectItem key={d} value={d}>
                                  {d}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="preferredTimeframe"
                            className="font-bold"
                          >
                            Start Timeframe *
                          </Label>
                          <Select
                            value={formData.preferredTimeframe}
                            onValueChange={(v) =>
                              updateField("preferredTimeframe", v)
                            }
                          >
                            <SelectTrigger
                              id="preferredTimeframe"
                              className="bg-background h-12"
                            >
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-divider">
                              {timeframeOptions.map((t) => (
                                <SelectItem key={t} value={t}>
                                  {t}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* D. Resume Upload */}
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                          <Upload className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-display text-xl font-bold text-primary">
                          Resume / CV
                        </h3>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="resume" className="font-bold">
                          Upload Resume{" "}
                          <span className="text-muted-foreground font-normal">
                            (PDF, DOC, DOCX â€” max 10MB)
                          </span>
                        </Label>
                        <Input
                          id="resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && file.size > 10 * 1024 * 1024) {
                              toast.error("File too large. Max 10MB.");
                              e.target.value = "";
                              return;
                            }
                            setResumeFile(file || null);
                          }}
                          className="h-12"
                        />
                        {resumeFile && (
                          <p className="text-sm text-accent-green font-medium flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            {resumeFile.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* E. Motivation */}
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-lg bg-accent-green/15 border border-accent-green/30 flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-accent-green" />
                        </div>
                        <h3 className="font-display text-xl font-bold text-accent-green">
                          Motivation
                        </h3>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="motivation" className="font-bold">
                          Why are you interested in this program?
                        </Label>
                        <Textarea
                          id="motivation"
                          rows={4}
                          value={formData.motivation}
                          onChange={(e) =>
                            updateField("motivation", e.target.value)
                          }
                          placeholder="Tell us about your goals..."
                        />
                      </div>
                    </div>

                    {/* F. Disclaimer */}
                    <div className="p-6 rounded-xl bg-secondary/50 border border-divider">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="disclaimer"
                          checked={agreedToDisclaimer}
                          onCheckedChange={(checked) =>
                            setAgreedToDisclaimer(checked === true)
                          }
                          className="mt-1"
                        />
                        <label
                          htmlFor="disclaimer"
                          className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                        >
                          I understand that Aliko Academy STEM provides training
                          and preparation only. Certifications and exams are
                          administered by third-party organizations, and
                          outcomes are not guaranteed.
                        </label>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="hero"
                        size="lg"
                        className="w-full sm:w-auto"
                        disabled={isSubmitting || !agreedToDisclaimer}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Application
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                      <p className="mt-4 text-sm text-muted-foreground">
                        Our team will review your application and contact you
                        with next steps.
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Apply;
