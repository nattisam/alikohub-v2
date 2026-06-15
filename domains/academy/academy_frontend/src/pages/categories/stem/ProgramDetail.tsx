import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { Layout } from "@/components/categories/stem/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Building2,
  ExternalLink,
  AlertCircle,
  BookOpen,
  Award,
  Loader2,
} from "lucide-react";
import { useCourseBySlug } from "@/hooks/useAcademy";
import { cn } from "@/lib/utils";

const ProgramDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: apiProgram, isLoading } = useCourseBySlug(slug || "");

  // Prefer API data
  const programData = apiProgram;

  // Transform to a consistent structure
  const program = programData
    ? {
        ...programData,
        name: programData.title || (programData as any).name,
        description:
          programData.longDescription ||
          programData.shortDescription ||
          (programData as any).description ||
          "A comprehensive STEM program.",
        tuition:
          programData.price ||
          programData.priceInUsd ||
          (programData as any).tuition ||
          1200,
        duration:
          programData.estimatedTime ||
          (programData as any).duration ||
          "12 Weeks",
        durationWeeks: (programData as any).durationWeeks || 12,
        weeklyHours: (programData as any).weeklyHours || 10,
        level:
          (programData as any).level ||
          (programData as any).difficulty ||
          "Beginner",
        deliveryMode: (programData as any).deliveryMode || "Online",
        domain:
          (programData as any).domain ||
          (programData as any).category ||
          "STEM",
        modality: (programData as any).deliveryMode || "Online",
        location: (programData as any).location || "Virtual Classroom",
        enrollmentStatus:
          (programData as any).enrollmentStatus ||
          (programData.status === "PUBLISHED" ? "open" : "closed"),
        startDate: (programData as any).startDate || "Check Cohort Schedule",
        careerPathways: (programData as any).careerPathways ||
          (programData as any).careerOutcomes || [
            "Systems Engineering",
            "Data Analysis",
            "Research and Development",
          ],
        requirements: (programData as any).requirements ||
          (programData as any).prerequisites || [
            "High school diploma or equivalent",
            "Basic math prerequisite",
            "Interest in STEM",
          ],
        skillsGained: (programData as any).skillsGained || [
          "Industry-standard tools and methodologies",
          "Problem-solving and critical thinking",
          "Technical documentation and reporting",
          "Hands-on practical application",
        ],
        industryApplications: (programData as any).industryApplications || [
          "Technology",
          "Engineering",
          "Research",
          "Data Science",
        ],
        alignmentStatement:
          (programData as any).alignmentStatement ||
          "This program is aligned with current industry standards and best practices, preparing graduates for real-world challenges in STEM fields.",
        externalReferenceLink:
          (programData as any).externalReferenceLink || null,
        certification:
          (programData as any).certification ||
          "Aliko Academy Professional Certification",
        featured: (programData as any).featured || false,
        modules: programData.modules || [],
      }
    : null;

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse text-lg">
            Loading program details...
          </p>
        </div>
      </Layout>
    );
  }

  if (!program) {
    return <Navigate to="/stem/programs" replace />;
  }

  // Enhanced contrast level classes
  const levelClasses: Record<string, string> = {
    Beginner: "bg-accent-green/12 text-accent-green border-accent-green/35",
    Intermediate: "bg-primary/12 text-primary border-primary/35",
    Professional: "bg-accent/12 text-accent border-accent/35",
  };

  const deliveryClasses: Record<string, string> = {
    Online: "bg-accent/12 text-accent border-accent/35",
    Hybrid: "bg-accent-green/12 text-accent-green border-accent-green/35",
  };

  const handleEnroll = () => {
    window.location.href = "https://lms.alikohub.com";
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="border-b border-divider bg-card">
        <div className="container-content py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/stem/programs"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Programs
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium truncate">
              {program.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="gradient-hero py-12 lg:py-16">
        <div className="container-content">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge
                variant="outline"
                className={cn(
                  levelClasses[program.level] || levelClasses["Beginner"],
                )}
              >
                {program.level}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  deliveryClasses[program.deliveryMode] ||
                    deliveryClasses["Online"],
                )}
              >
                {program.deliveryMode}
              </Badge>
              <Badge
                variant="outline"
                className="bg-secondary text-secondary-foreground"
              >
                {program.domain}
              </Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              {program.name}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
              {program.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {program.durationWeeks} weeks
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {program.weeklyHours} hours/week
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-content">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Who This Is For */}
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Who This Program Is For
                </h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Card className="border-primary/25 bg-primary/8">
                    <CardContent className="p-4 flex items-start gap-3">
                      <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium text-foreground">
                          Students
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Building industry-ready skills
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-accent/25 bg-accent/8">
                    <CardContent className="p-4 flex items-start gap-3">
                      <Briefcase className="h-5 w-5 text-accent mt-0.5" />
                      <div>
                        <h3 className="font-medium text-foreground">
                          Professionals
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Upskilling or transitioning
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-accent-green/25 bg-accent-green/8">
                    <CardContent className="p-4 flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-accent-green mt-0.5" />
                      <div>
                        <h3 className="font-medium text-foreground">
                          Organizations
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Workforce development
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Skills Gained */}
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Skills & Capabilities You Gain
                </h2>
                <ul className="space-y-3">
                  {program.skillsGained.map((skill: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-accent-green/8 border border-accent-green/20"
                    >
                      <CheckCircle2 className="h-5 w-5 text-accent-green mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/90">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Industry Applications */}
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Typical Industry Applications
                </h2>
                <div className="flex flex-wrap gap-2">
                  {program.industryApplications.map(
                    (app: string, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-sm py-1.5 px-3 bg-primary/10 text-primary border-primary/30"
                      >
                        {app}
                      </Badge>
                    ),
                  )}
                </div>
              </div>

              {/* Curriculum */}
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Curriculum Outline
                </h2>
                {program.modules && program.modules.length > 0 ? (
                  <Accordion type="single" collapsible className="space-y-2">
                    {program.modules.map((module: any, index: number) => (
                      <AccordionItem
                        key={module.id || index}
                        value={`module-${index}`}
                        className="border border-accent/25 rounded-lg px-4 bg-accent/6"
                      >
                        <AccordionTrigger className="hover:no-underline py-4">
                          <span className="font-medium text-foreground text-left">
                            {module.title}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          {module.description && (
                            <p className="text-sm text-muted-foreground mb-3">
                              {module.description}
                            </p>
                          )}
                          {module.lessons && module.lessons.length > 0 && (
                            <ul className="space-y-2">
                              {module.lessons.map(
                                (lesson: any, lessonIndex: number) => (
                                  <li
                                    key={lesson.id || lessonIndex}
                                    className="flex items-center gap-2 text-foreground/80"
                                  >
                                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                                    {lesson.title}
                                    {lesson.type && (
                                      <Badge
                                        variant="secondary"
                                        className="ml-auto text-[10px] px-1 h-4"
                                      >
                                        {lesson.type}
                                      </Badge>
                                    )}
                                  </li>
                                ),
                              )}
                            </ul>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-muted-foreground">
                    Curriculum details will be available soon. Please contact
                    admissions for more information.
                  </p>
                )}
              </div>

              {/* Career Outcomes */}
              {program.careerPathways && program.careerPathways.length > 0 && (
                <div className="bg-accent-green/10 rounded-xl p-6 border border-accent-green/25">
                  <h2 className="font-display text-xl font-bold text-accent-green mb-4">
                    After this program, you can become:
                  </h2>
                  <ul className="space-y-2">
                    {program.careerPathways.map(
                      (outcome: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-center gap-3 text-foreground/90"
                        >
                          <Briefcase className="h-4 w-4 text-accent-green flex-shrink-0" />
                          {outcome}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}

              {/* Industry Alignment */}
              <div className="bg-primary/10 rounded-xl p-6 border border-primary/25">
                <h2 className="font-display text-xl font-bold text-primary mb-3">
                  Industry Alignment
                </h2>
                <p className="text-foreground/85">
                  {program.alignmentStatement}
                </p>
                {program.externalReferenceLink && (
                  <a
                    href={program.externalReferenceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-sm text-accent hover:underline"
                  >
                    Reference Resource
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              {/* Certification Disclaimer */}
              <div className="bg-muted/50 border border-divider rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-muted-foreground">
                      Certification Disclaimer
                    </h3>
                    <p className="mt-1 text-sm text-foreground/80">
                      Certification exams and credentials are administered by
                      third-party vendors. Aliko Academy STEM provides training
                      and preparation only and does not guarantee exam outcomes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Enrollment Card */}
                <Card className="border-primary/30 bg-gradient-to-b from-primary/10 to-transparent">
                  <CardContent className="p-6">
                    <h3 className="font-display text-lg font-semibold text-primary mb-4">
                      Ready to Enroll?
                    </h3>
                    <div className="space-y-4">
                      <Button
                        onClick={handleEnroll}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        size="lg"
                      >
                        Access LMS
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button asChild className="w-full" variant="outline">
                        <Link to="/stem/enterprise">
                          Request Group Training
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Program Details */}
                <Card className="border-accent/25 bg-accent/6">
                  <CardContent className="p-6">
                    <h3 className="font-display text-lg font-semibold text-accent mb-4">
                      Program Details
                    </h3>
                    <dl className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-accent/15">
                        <dt className="text-sm text-muted-foreground">Level</dt>
                        <dd className="font-medium text-foreground">
                          {program.level}
                        </dd>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-accent/15">
                        <dt className="text-sm text-muted-foreground">
                          Delivery Mode
                        </dt>
                        <dd className="font-medium text-foreground">
                          {program.deliveryMode}
                        </dd>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-accent/15">
                        <dt className="text-sm text-muted-foreground">
                          Duration
                        </dt>
                        <dd className="font-medium text-foreground">
                          {program.durationWeeks} weeks
                        </dd>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <dt className="text-sm text-muted-foreground">
                          Weekly Commitment
                        </dt>
                        <dd className="font-medium text-foreground">
                          {program.weeklyHours} hours
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                {/* Prerequisites */}
                {program.requirements.length > 0 && (
                  <Card className="border-accent-green/25 bg-accent-green/6">
                    <CardContent className="p-6">
                      <h3 className="font-display text-lg font-semibold text-accent-green mb-4">
                        Prerequisites
                      </h3>
                      <ul className="space-y-2">
                        {program.requirements.map(
                          (prereq: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm text-foreground/85"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-accent-green mt-2" />
                              {prereq}
                            </li>
                          ),
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Programs */}
      <section className="py-8 border-t border-divider bg-card">
        <div className="container-content">
          <Button asChild variant="ghost">
            <Link to="/stem/programs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Programs
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default ProgramDetail;
