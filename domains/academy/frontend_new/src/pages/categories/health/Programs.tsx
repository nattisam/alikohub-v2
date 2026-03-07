import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/categories/health/layout/Layout";
import {
  programs as staticPrograms,
  type EnrollmentStatus,
} from "@/data/categories/health/programs";
import { examPrepPrograms } from "@/data/categories/health/examPrepPrograms";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  BookOpen,
  GraduationCap,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHealthCourses } from "@/hooks/useHealth";

type ModalityFilter = "all" | "Hybrid" | "Online" | "In-Person";
type StatusFilter = "all" | EnrollmentStatus;

const Programs = () => {
  const [modalityFilter, setModalityFilter] = useState<ModalityFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { data: healthCoursesData, isLoading } = useHealthCourses();

  // Transform API courses to match the local program structure if needed, or use them directly
  const apiPrograms = (healthCoursesData?.items || []).map((course: any) => ({
    id: course.id,
    name: course.title,
    credential: "Professional Certificate", // Fallback for API
    shortDescription: course.shortDescription,
    description: course.shortDescription,
    duration: "10-12 Weeks", // Fallback for Health programs
    hours: { total: 120 }, // Fallback
    modality: "Hybrid", // Default for Health programs
    location: "Global",
    tuition: course.price || 1200,
    enrollmentStatus: "open",
    startDate: "Next Cohort",
    featured: course.enrolledNum > 5,
    image_url: course.thumbnail,
  }));

  const programs = apiPrograms.length > 0 ? apiPrograms : staticPrograms;

  const filteredPrograms = programs
    .filter((program: any) => {
      if (modalityFilter !== "all" && program.modality !== modalityFilter)
        return false;
      if (statusFilter !== "all" && program.enrollmentStatus !== statusFilter)
        return false;
      return true;
    })
    .sort((a: any, b: any) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.enrollmentStatus === "open" && b.enrollmentStatus !== "open")
        return -1;
      if (a.enrollmentStatus !== "open" && b.enrollmentStatus === "open")
        return 1;
      return 0;
    });

  const filteredExamPrep = examPrepPrograms
    .filter((program) => {
      if (modalityFilter !== "all" && program.modality !== modalityFilter)
        return false;
      if (statusFilter !== "all" && program.enrollmentStatus !== statusFilter)
        return false;
      return true;
    })
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.enrollmentStatus === "open" && b.enrollmentStatus !== "open")
        return -1;
      if (a.enrollmentStatus !== "open" && b.enrollmentStatus === "open")
        return 1;
      return 0;
    });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-br from-white via-teal/5 to-primary/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

        <div className="container-academy relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-12 bg-teal rounded-full" />
            <span className="text-sm font-medium text-teal">
              Explore Programs
            </span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary">
            Programs & Courses
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Explore our comprehensive healthcare training programs and exam
            preparation courses designed to advance your career in the
            healthcare industry.
          </p>

          {/* Quick stats */}
          <div className="mt-8 flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-teal" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {programs.length}
                </p>
                <p className="text-xs">Training Programs</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {examPrepPrograms.length}
                </p>
                <p className="text-xs">Exam Prep Courses</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container-academy">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Modality:
              </span>
              <Select
                value={modalityFilter}
                onValueChange={(v) => setModalityFilter(v as ModalityFilter)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="In-Person">In-Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Enrollment:
              </span>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as StatusFilter)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="training" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-auto p-1">
              <TabsTrigger
                value="training"
                className="text-xs sm:text-sm py-2.5 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <GraduationCap className="h-4 w-4 mr-1 sm:mr-2 shrink-0" />
                <span className="hidden sm:inline">Healthcare </span>Training
                <Badge
                  variant="secondary"
                  className="ml-1.5 sm:ml-2 bg-background/50 text-[10px] sm:text-xs"
                >
                  {filteredPrograms.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="exam-prep"
                className="text-xs sm:text-sm py-2.5 sm:py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                <BookOpen className="h-4 w-4 mr-1 sm:mr-2 shrink-0" />
                <span className="hidden sm:inline">Exam </span>Prep
                <Badge
                  variant="secondary"
                  className="ml-1.5 sm:ml-2 bg-background/50 text-[10px] sm:text-xs"
                >
                  {filteredExamPrep.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="training">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Healthcare Training Programs
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Industry-aligned programs delivered by Aliko Academy – Health
                </p>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-muted-foreground animate-pulse">
                    Loading healthcare programs...
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrograms.map((program: any) => (
                    <Card
                      key={program.id}
                      className="group flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full"
                    >
                      <div className="relative h-48 overflow-hidden">
                        {program.image_url ? (
                          <img
                            src={program.image_url}
                            alt={program.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-teal/10 flex items-center justify-center">
                            <GraduationCap className="h-12 w-12 text-teal/40" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {program.featured && (
                          <div className="absolute top-4 left-4 bg-teal text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                            <Sparkles className="h-3 w-3" />
                            Featured
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                          {program.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {program.credential}
                        </p>
                      </CardHeader>
                      <CardContent className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 shrink-0" />
                          <span>
                            {program.duration} • {program.hours?.total || 0}{" "}
                            hours
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span>
                            {program.modality} • {program.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4 shrink-0" />
                          <span>
                            ${program.tuition?.toLocaleString() || 0} tuition
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <Badge
                            variant={
                              program.enrollmentStatus === "open"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              program.enrollmentStatus === "open"
                                ? "bg-accent text-accent-foreground hover:bg-accent/90"
                                : ""
                            }
                          >
                            {program.enrollmentStatus === "open"
                              ? `Starts ${program.startDate}`
                              : "Start Date: TBD"}
                          </Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button
                          asChild
                          className="w-full"
                          variant={
                            program.enrollmentStatus === "open"
                              ? "default"
                              : "outline"
                          }
                        >
                          <Link to={`/health/programs/${program.id}`}>
                            {program.enrollmentStatus === "open"
                              ? "Apply Now"
                              : "View Details"}
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="exam-prep">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="h-5 w-5 text-accent" />
                  <h2 className="text-xl font-semibold text-foreground">
                    Exam Review & Preparation Programs
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Non-credential, supplemental education programs
                </p>
                <p className="text-xs text-muted-foreground mt-2 italic">
                  These courses are review and preparation programs only.
                  Completion does not guarantee exam success, certification, or
                  licensure.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {filteredExamPrep.map((program) => (
                  <Card
                    key={program.id}
                    className="group flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    {program.featured && (
                      <div className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground px-4 py-1.5 text-xs font-medium flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Popular Course
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg leading-tight group-hover:text-accent transition-colors">
                        {program.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Non-Credential, Supplemental
                      </p>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {program.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span>
                          {program.duration} • {program.hours.total} hours
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>
                          {program.modality} • {program.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4 shrink-0" />
                        <span>${program.tuition.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <Badge
                          variant={
                            program.enrollmentStatus === "open"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            program.enrollmentStatus === "open"
                              ? "bg-accent text-accent-foreground hover:bg-accent/90"
                              : ""
                          }
                        >
                          {program.enrollmentStatus === "open"
                            ? `Starts ${program.startDate}`
                            : "Start Date: TBD"}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button
                        asChild
                        className="w-full"
                        variant={
                          program.enrollmentStatus === "open"
                            ? "default"
                            : "outline"
                        }
                      >
                        <Link to={`/health/exam-prep/${program.id}`}>
                          {program.enrollmentStatus === "open"
                            ? "Enroll Now"
                            : "View Details"}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground italic">
                  Offered in collaboration with Aliko Consultancy, an academic
                  and career advisory partner. Aliko Consultancy is not a
                  licensing, accrediting, or credential-granting body.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Programs;
