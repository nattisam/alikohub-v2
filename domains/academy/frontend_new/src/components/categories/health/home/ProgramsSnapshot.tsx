import { Link } from "react-router-dom";
import { useHealthCourses } from "@/hooks/useHealth";
import { programs as staticPrograms } from "@/data/categories/health/programs";
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
  Clock,
  MapPin,
  Calendar,
  BookOpen,
  ArrowRight,
  Sparkles,
  GraduationCap,
} from "lucide-react";

export function ProgramsSnapshot() {
  const { data: dbPrograms = [], isLoading } = useHealthCourses();

  // Merge DB data with static data for rich display, limit to 4
  const displayPrograms =
    dbPrograms.length > 0
      ? dbPrograms
          .map((dbp) => {
            const staticMatch = staticPrograms.find(
              (sp) => sp.id === dbp.id || sp.name === dbp.title,
            );
            return {
              ...staticMatch,
              ...dbp,
              name: dbp.title || staticMatch?.name,
              id: dbp.id,
            };
          })
          .slice(0, 4)
      : [...staticPrograms]
          .sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
          })
          .slice(0, 4);

  const featuredExamPrep = examPrepPrograms
    .filter((p) => p.featured)
    .slice(0, 2);

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container-academy">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal/10 text-teal text-sm font-semibold mb-4">
            Training Programs
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Healthcare Training Programs
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Industry-aligned programs delivered by Aliko Academy – Health,
            designed to launch your healthcare career.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPrograms.map((program: any) => (
            <Card
              key={program.id}
              className={`group flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden ${
                program.featured ? "ring-2 ring-primary/20" : ""
              }`}
            >
              {/* Thumbnail */}
              {program.image_url || program.image ? (
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img
                    src={program.image_url || program.image}
                    alt={program.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {program.featured && (
                    <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs">
                      <Sparkles className="h-3 w-3 mr-1" /> Featured
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="aspect-[16/10] bg-gradient-to-br from-primary/10 to-teal/10 flex items-center justify-center">
                  <GraduationCap className="h-10 w-10 text-primary/30" />
                </div>
              )}

              <CardHeader className="pb-3">
                <CardTitle className="text-base leading-tight group-hover:text-primary transition-colors">
                  {program.name}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {program.credential || "Healthcare Training"}
                </p>
              </CardHeader>
              <CardContent className="flex-1 space-y-2">
                {program.duration && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                    <span>
                      {program.duration}
                      {program.hours?.total
                        ? ` • ${program.hours.total} hours`
                        : program.duration_weeks
                          ? ` • ${program.duration_weeks} wks`
                          : ""}
                    </span>
                  </div>
                )}
                {(program.modality || program.location) && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                    <span>
                      {[program.modality, program.location]
                        .filter(Boolean)
                        .join(" • ")}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                  <Badge
                    variant={
                      program.enrollmentStatus === "open"
                        ? "default"
                        : "secondary"
                    }
                    className={
                      program.enrollmentStatus === "open"
                        ? "bg-accent text-accent-foreground hover:bg-accent/90 text-xs"
                        : "text-xs"
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
                  className="w-full group/btn"
                  size="sm"
                  variant={
                    program.enrollmentStatus === "open" ? "default" : "outline"
                  }
                >
                  <Link to={`/health/programs/${program.id}`}>
                    {program.enrollmentStatus === "open"
                      ? "Apply Now"
                      : "View Details"}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="group">
            <Link to="/health/programs">
              View All Programs
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Exam Review & Preparation Section */}
        <div className="mt-24 pt-16 border-t border-border">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
              <BookOpen className="h-4 w-4" />
              Supplemental Education
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Exam Review & Preparation
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Strengthen your knowledge and boost your confidence with
              comprehensive exam preparation courses.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {featuredExamPrep.map((program) => (
              <Card
                key={program.id}
                className="group flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-accent/20 overflow-hidden"
              >
                {program.image && (
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <img
                      src={program.image}
                      alt={program.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                    {program.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {program.description}
                  </p>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 shrink-0 text-accent/60" />
                    <span>
                      {program.duration} • {program.hours.total} hours
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 text-accent/60" />
                    <span>{program.modality}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 text-accent/60" />
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
                    className="w-full group/btn"
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
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button asChild variant="outline" size="lg" className="group">
              <Link to="/health/exam-prep">
                View All Exam Prep Courses
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border max-w-2xl mx-auto">
            <p className="text-xs text-muted-foreground text-center">
              These courses are review and preparation programs only. Completion
              does not guarantee exam success, certification, or licensure.
              Offered in collaboration with Aliko Consultancy, an academic and
              career advisory partner.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
