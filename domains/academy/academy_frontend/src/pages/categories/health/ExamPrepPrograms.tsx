import { Link } from "react-router-dom";
import { Layout } from "@/components/categories/health/layout/Layout";
import {
  examPrepPrograms,
  EXAM_PREP_DISCLAIMER,
  COLLABORATION_NOTE,
} from "@/data/categories/health/examPrepPrograms";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar, DollarSign, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ExamPrepPrograms = () => {
  const sortedPrograms = [...examPrepPrograms].sort((a, b) => {
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
      <section className="py-12 lg:py-16 bg-card">
        <div className="container-academy">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary">
            Exam Review & Preparation Programs
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Strengthen your knowledge and boost your confidence with our
            comprehensive exam review and preparation courses designed to help
            you succeed.
          </p>

          {/* Compliance Disclaimer */}
          <Alert className="mt-6 border-accent/50 bg-accent/10">
            <AlertCircle className="h-4 w-4 text-accent" />
            <AlertDescription className="text-sm text-muted-foreground">
              {EXAM_PREP_DISCLAIMER}
            </AlertDescription>
          </Alert>
        </div>
      </section>

      <section className="py-8">
        <div className="container-academy">
          {/* Collaboration Note */}
          <div className="mb-8 p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground italic">
              {COLLABORATION_NOTE}
            </p>
          </div>

          {/* Program Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {sortedPrograms.map((program) => (
              <Card
                key={program.id}
                className="group flex flex-col hover:shadow-lg transition-shadow overflow-hidden"
              >
                {program.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={program.image}
                      alt={program.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-tight">
                      {program.name}
                    </CardTitle>
                    {program.featured && (
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Non-Credential, Supplemental Education
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
                <CardFooter className="pt-0 flex flex-col gap-2">
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

          {/* Bottom Disclaimer */}
          <div className="mt-12 p-6 bg-muted/30 rounded-lg border border-border">
            <h3 className="font-semibold text-foreground mb-2">
              Important Information
            </h3>
            <p className="text-sm text-muted-foreground">
              {EXAM_PREP_DISCLAIMER} These programs are designed to supplement
              your existing education and provide additional practice and review
              materials. Success on certification exams depends on individual
              preparation, prior education, and exam readiness.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ExamPrepPrograms;
