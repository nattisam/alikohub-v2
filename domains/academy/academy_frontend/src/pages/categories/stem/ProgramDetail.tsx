import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { Layout } from "@/components/categories/stem/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  BookOpen,
  Award,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useCourseBySlug } from "@/hooks/useAcademy";

const ProgramDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: apiProgram, isLoading } = useCourseBySlug(slug || "");

  // Prefer API data
  const programData = apiProgram;

  // Transform to a consistent structure like Health
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
        hours: (programData as any).hours || {
          total: 120,
          theory: 60,
          lab: 40,
          clinical: 20,
        },
        modality: (programData as any).deliveryMode || "Online",
        location: (programData as any).location || "Virtual Classroom",
        enrollmentStatus:
          (programData as any).enrollmentStatus ||
          (programData.status === "PUBLISHED" ? "open" : "closed"),
        startDate: (programData as any).startDate || "Check Cohort Schedule",
        careerPathways: (programData as any).careerPathways || [
          "Systems Engineering",
          "Data Analysis",
          "Research and Development",
        ],
        requirements: (programData as any).requirements || [
          "High school diploma or equivalent",
          "Basic math prerequisite",
          "Interest in STEM",
        ],
        certification:
          (programData as any).certification ||
          "Aliko Academy Professional Certification",
        featured: (programData as any).featured || false,
        modules: programData.modules || [],
      }
    : null;

  const handleEnroll = () => {
    window.location.href = "https://lms.alikohub.com";
  };

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

  return (
    <Layout>
      {/* Header */}
      <section className="relative py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-card to-accent/5 overflow-hidden border-b border-border">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

        <div className="container-academy relative">
          <Link
            to="/stem/programs"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Programs
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {program.featured && (
                  <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Featured Program
                  </Badge>
                )}
                <Badge
                  className={
                    program.enrollmentStatus === "open"
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }
                >
                  {program.enrollmentStatus === "open"
                    ? "Enrollment Open"
                    : "Start Date: TBD"}
                </Badge>
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-primary">
                {program.name}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
                {program.description}
              </p>

              {/* Quick stats row */}
              <div className="mt-8 flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {program.duration}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {program.hours.total} hours
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {program.modality}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {program.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="lg:w-80 shrink-0 shadow-xl border-t-4 border-t-primary">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Program Quick Facts</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-lg font-bold text-foreground">
                      ${program.tuition.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total tuition
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Calendar className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {program.enrollmentStatus === "open"
                        ? `Starts ${program.startDate}`
                        : "Check Schedule"}
                    </p>
                    <p className="text-xs text-muted-foreground">Next cohort</p>
                  </div>
                </div>
                <Button
                  onClick={handleEnroll}
                  disabled={program.enrollmentStatus !== "open"}
                  className="w-full shadow-lg bg-accent text-accent-foreground hover:bg-accent/90"
                  size="lg"
                >
                  Access LMS
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="container-academy">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* Career Pathways */}
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Career Pathways</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Graduates of this program find employment in various STEM
                    settings:
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {program.careerPathways.map((pathway: string) => (
                      <li
                        key={pathway}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/30"
                      >
                        <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                        <span className="text-sm">{pathway}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Curriculum */}
              {program.modules && program.modules.length > 0 ? (
                <Card className="border-l-4 border-l-accent overflow-hidden">
                  <CardHeader className="bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-accent" />
                      </div>
                      <CardTitle className="text-xl">
                        Program Curriculum
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {program.modules.map((module: any, idx: number) => (
                        <div
                          key={module.id}
                          className="p-6 hover:bg-muted/20 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <span className="text-xs font-bold text-accent uppercase tracking-wider mb-1 block">
                                Module {idx + 1}
                              </span>
                              <h3 className="text-lg font-bold text-foreground">
                                {module.title}
                              </h3>
                              {module.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {module.description}
                                </p>
                              )}
                            </div>
                            <Badge
                              variant="outline"
                              className="ml-2 whitespace-nowrap"
                            >
                              {module.lessons?.length || 0} Lessons
                            </Badge>
                          </div>
                          {module.lessons && module.lessons.length > 0 && (
                            <div className="space-y-2">
                              {module.lessons.map((lesson: any) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center gap-3 text-sm text-muted-foreground bg-background/50 p-2 rounded border border-border/50"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                                  <span>{lesson.title}</span>
                                  <Badge
                                    variant="secondary"
                                    className="ml-auto text-[10px] px-1 h-4"
                                  >
                                    {lesson.type}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-l-4 border-l-accent">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-accent" />
                      </div>
                      <CardTitle className="text-xl">
                        Curriculum Overview
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      This program provides comprehensive training through a
                      combination of theory, hands-on practice, and projects.
                    </p>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                        <p className="text-3xl font-bold text-primary">
                          {program.hours.theory}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Theory Hours
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5">
                        <p className="text-3xl font-bold text-accent">
                          {program.hours.lab}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Lab Hours
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                        <p className="text-3xl font-bold text-primary">
                          {program.hours.clinical}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Practical Hours
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Admission Requirements */}
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">
                      Admission Requirements
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {program.requirements.map((req: string) => (
                      <li key={req} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Certification */}
              <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-accent" />
                    </div>
                    <CardTitle className="text-xl">
                      Certification Pathway
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Upon successful completion of this program, you will be
                    prepared to take:
                  </p>
                  <p className="mt-3 text-lg font-semibold text-foreground">
                    {program.certification}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tuition Card */}
              <Card className="border-t-4 border-t-accent">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-accent" />
                    </div>
                    <CardTitle className="text-lg">Tuition & Fees</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <span>Program Tuition</span>
                    <span className="text-lg font-bold text-accent">
                      ${program.tuition.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2 font-medium text-foreground">
                      Tuition includes:
                    </p>
                    <ul className="space-y-2">
                      {[
                        "All course materials",
                        "Lab supplies and equipment",
                        "Project placement coordination",
                        "Certification exam preparation",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <CheckCircle className="h-3.5 w-3.5 text-accent" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/stem/tuition">View Payment Options</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Start Date Card */}
              <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-accent" />
                    Next Start Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground mb-3">
                    {program.startDate}
                  </p>
                  <Badge
                    className={
                      program.enrollmentStatus === "open"
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }
                  >
                    {program.enrollmentStatus === "open"
                      ? "Enrollment Open"
                      : "Start Date: TBD"}
                  </Badge>
                  <Button
                    onClick={handleEnroll}
                    disabled={program.enrollmentStatus !== "open"}
                    className="w-full mt-4 shadow-lg bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Access LMS
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-lg">Questions?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our admissions team is here to help you get started.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/stem/contact">Contact Admissions</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProgramDetail;
