import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/categories/health/layout/Layout";
import {
  examPrepPrograms,
  EXAM_PREP_DISCLAIMER,
  COLLABORATION_NOTE,
} from "@/data/categories/health/examPrepPrograms";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle,
  BookOpen,
  Users,
  CheckCircle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ExamPrepDetail = () => {
  const { programId } = useParams<{ programId: string }>();
  const program = examPrepPrograms.find((p) => p.id === programId);

  if (!program) {
    return (
      <Layout>
        <div className="container-academy py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Program Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            The exam prep program you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/health/exam-prep">View All Exam Prep Programs</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 bg-gradient-to-br from-accent/5 via-card to-primary/5 overflow-hidden border-b border-border">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

        <div className="container-academy relative">
          <Link
            to="/health/programs"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-accent mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Programs
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="outline" className="border-accent text-accent">
              Exam Preparation
            </Badge>
            <Badge variant="secondary">Non-Credential</Badge>
            {program.featured && (
              <Badge className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground">
                <Sparkles className="h-3 w-3 mr-1" />
                Popular Course
              </Badge>
            )}
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary">
            {program.name}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            {program.description}
          </p>

          {/* Compliance Disclaimer */}
          <Alert className="mt-6 border-accent/50 bg-accent/10 max-w-3xl">
            <AlertCircle className="h-4 w-4 text-accent" />
            <AlertDescription className="text-sm text-muted-foreground">
              {EXAM_PREP_DISCLAIMER}
            </AlertDescription>
          </Alert>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-semibold text-foreground">
                  {program.duration}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Hours</p>
                <p className="font-semibold text-foreground">
                  {program.hours.total} hours
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Modality</p>
                <p className="font-semibold text-foreground">
                  {program.modality}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tuition</p>
                <p className="font-semibold text-foreground">
                  ${program.tuition.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container-academy">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Topics Covered */}
              <Card className="border-l-4 border-l-accent">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-accent" />
                    </div>
                    <CardTitle className="text-xl">Topics Covered</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {program.topicsCovered.map((topic, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 p-2 rounded-lg bg-muted/30"
                      >
                        <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Target Audience */}
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Who Should Enroll</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {program.targetAudience.map((audience, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-muted-foreground">
                          {audience}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card className="border-l-4 border-l-accent">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-accent" />
                    </div>
                    <CardTitle className="text-xl">Prerequisites</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {program.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle className="h-3.5 w-3.5 text-accent" />
                        </div>
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Collaboration Note */}
              <div className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-border">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  Collaboration Partner
                </h3>
                <p className="text-sm text-muted-foreground italic">
                  {COLLABORATION_NOTE}
                </p>
              </div>
            </div>

            {/* Right Column - CTA Card */}
            <div>
              <Card className="sticky top-24 shadow-xl border-t-4 border-t-accent">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-accent" />
                    </div>
                    <CardTitle className="text-lg">
                      Enrollment Information
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">
                      Next Start Date
                    </p>
                    <Badge
                      variant={
                        program.enrollmentStatus === "open"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        program.enrollmentStatus === "open"
                          ? "bg-accent text-accent-foreground"
                          : ""
                      }
                    >
                      {program.enrollmentStatus === "open"
                        ? program.startDate
                        : "Start Date: TBD"}
                    </Badge>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-3xl font-bold text-accent">
                      ${program.tuition.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Course Fee</p>
                  </div>

                  <Button
                    asChild
                    className="w-full shadow-lg bg-accent text-accent-foreground hover:bg-accent/90"
                    size="lg"
                    disabled={program.enrollmentStatus !== "open"}
                  >
                    <Link to="/health/apply">
                      {program.enrollmentStatus === "open"
                        ? "Enroll Now"
                        : "Join Waitlist"}
                    </Link>
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Questions?{" "}
                    <Link
                      to="/health/contact"
                      className="text-accent hover:underline font-medium"
                    >
                      Contact us
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Disclaimer */}
      <section className="py-8 bg-muted/30 border-t border-border">
        <div className="container-academy">
          <Alert className="border-accent/50 bg-accent/10">
            <AlertCircle className="h-4 w-4 text-accent" />
            <AlertDescription className="text-sm text-muted-foreground">
              <strong>Important:</strong> {EXAM_PREP_DISCLAIMER} Success on
              certification exams depends on individual preparation, prior
              education, and exam readiness.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    </Layout>
  );
};

export default ExamPrepDetail;
