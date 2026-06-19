import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Users,
  Briefcase,
  Award,
  BookOpen,
  CheckCircle,
  Download,
  Phone,
  Target,
  GraduationCap,
  Loader2,
} from "lucide-react";
import Layout from "@/components/categories/technology/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  ProgramBadge,
  getLevelVariant,
  getDeliveryVariant,
} from "@/components/categories/technology/ui/badge-variants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCourseBySlug } from "@/hooks/useAcademy";

const ProgramDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: apiProgram, isLoading } = useCourseBySlug(slug || "");

  const program = apiProgram
    ? {
        ...apiProgram,
        title: apiProgram.title || (apiProgram as any).name,
        description:
          apiProgram.longDescription ||
          apiProgram.shortDescription ||
          (apiProgram as any).description ||
          "A comprehensive Technology program.",
        type: (apiProgram as any).type || "short-course",
        level: (apiProgram as any).level || "Beginner",
        deliveryMode: (apiProgram as any).deliveryMode || "Online",
        tuition:
          apiProgram.price ||
          apiProgram.priceInUsd ||
          (apiProgram as any).tuition ||
          1200,
        duration:
          apiProgram.estimatedTime ||
          (apiProgram as any).duration ||
          "12 Weeks",
        weeklyHours: (apiProgram as any).weeklyHours || "10-15 hrs/week",
        credential:
          (apiProgram as any).credential ||
          (apiProgram as any).certification ||
          "Aliko Academy Professional Certification",
        startDate: (apiProgram as any).startDate || "Check Cohort Schedule",
        enrollmentStatus:
          (apiProgram as any).enrollmentStatus ||
          (apiProgram.status === "PUBLISHED" ? "open" : "closed"),
        meta: (apiProgram as any).meta || [],
        outcomes: (apiProgram as any).outcomes || [],
        skills: (apiProgram as any).skills || [],
        tools: (apiProgram as any).tools || [],
        projects: (apiProgram as any).projects || [],
        whoItsFor: (apiProgram as any).whoItsFor || [],
        prerequisites: (apiProgram as any).prerequisites || (apiProgram as any).requirements || [],
        mentorship: (apiProgram as any).mentorship || {
          cadence: "Weekly 1-on-1 Mentorship",
          description:
            "Get personalized guidance from industry professionals through weekly mentoring sessions tailored to your learning goals.",
        },
        careerServices: (apiProgram as any).careerServices || [],
        modules: apiProgram.modules || [],
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
    return <Navigate to="/technology/programs" replace />;
  }

  const isCareerTrack = program.type === "career-track";

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-16 bg-gradient-to-b from-muted/40 to-background">
        <div className="container-padding mx-auto max-w-7xl relative">
          <Link
            to="/technology/programs"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Programs
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <ProgramBadge
                  variant={
                    program.type === "career-track"
                      ? "career-track"
                      : "short-course"
                  }
                >
                  {program.type === "career-track"
                    ? "Career Track"
                    : "Short Course"}
                </ProgramBadge>
                <ProgramBadge variant={getLevelVariant(program.level)}>
                  {program.level}
                </ProgramBadge>
                <ProgramBadge
                  variant={getDeliveryVariant(program.deliveryMode)}
                >
                  {program.deliveryMode}
                </ProgramBadge>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {program.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                {program.description}
              </p>

              {program.meta && program.meta.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {program.meta.map((item: string, i: number) => (
                    <span
                      key={i}
                      className="text-sm px-3 py-1 rounded-full bg-muted text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Info Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold text-foreground">
                      {program.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-semibold text-foreground">
                      {program.startDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Weekly Commitment
                    </p>
                    <p className="font-semibold text-foreground">
                      {program.weeklyHours}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Credential</p>
                    <p className="font-semibold text-sm text-foreground">
                      {program.credential}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-2xl font-bold text-foreground">
                    ${Number(program.tuition).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Payment plans available
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <Button
                    onClick={handleEnroll}
                    disabled={program.enrollmentStatus !== "open"}
                    className="w-full bg-secondary text-white hover:bg-secondary/90"
                  >
                    {program.enrollmentStatus === "open"
                      ? "Apply Now"
                      : "Enrollment Closed"}
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/technology/tuition">
                      <Download className="h-4 w-4 mr-2" />
                      Download Syllabus
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full" asChild>
                    <Link to="/technology/contact">
                      <Phone className="h-4 w-4 mr-2" />
                      Book Advising Call
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="section-padding">
        <div className="container-padding mx-auto max-w-7xl space-y-16">
          {/* What You'll Learn */}
          {program.outcomes && program.outcomes.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Target className="h-6 w-6 text-secondary" />
                <h2 className="text-2xl font-bold">What You'll Learn</h2>
              </div>
              <ul className="grid md:grid-cols-2 gap-4">
                {program.outcomes.map((outcome: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl"
                  >
                    <CheckCircle className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Curriculum */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold">Curriculum</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              {program.duration} &bull; {program.weeklyHours} &bull;{" "}
              {program.deliveryMode} learning
            </p>
            {program.modules && program.modules.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {program.modules.map((module: any, index: number) => (
                  <AccordionItem
                    key={module.id || index}
                    value={`module-${index}`}
                    className="border rounded-xl px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-4 text-left">
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-semibold">{module.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {module.estimatedTime ||
                              `${module.lessons?.length || 0} Lessons`}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-12">
                      {module.description && (
                        <p className="text-muted-foreground mb-3">
                          {module.description}
                        </p>
                      )}
                      {module.lessons && module.lessons.length > 0 && (
                        <ul className="space-y-2">
                          {module.lessons.map((lesson: any) => (
                            <li
                              key={lesson.id}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                              <span>{lesson.title}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="bg-muted/50 rounded-xl p-8 text-center">
                <p className="text-muted-foreground">
                  Curriculum details coming soon. Contact admissions for more
                  information.
                </p>
              </div>
            )}
          </div>

          {/* Skills & Tools */}
          {((program.skills && program.skills.length > 0) ||
            (program.tools && program.tools.length > 0)) && (
            <div className="grid md:grid-cols-2 gap-8">
              {program.skills && program.skills.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Skills You'll Learn</h2>
                  <div className="flex flex-wrap gap-2">
                    {program.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {program.tools && program.tools.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Tools & Technologies
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {program.tools.map((tool: string) => (
                      <span
                        key={tool}
                        className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Projects */}
          {program.projects && program.projects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Projects</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {program.projects.map((project: string, index: number) => (
                  <div
                    key={project}
                    className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold shrink-0">
                      {index + 1}
                    </div>
                    <p className="font-medium">{project}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Who It's For */}
          {program.whoItsFor && program.whoItsFor.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">Who It's For</h2>
              </div>
              <ul className="space-y-3">
                {program.whoItsFor.map((item: string, i: number) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Prerequisites */}
          {program.prerequisites && program.prerequisites.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
              <ul className="space-y-2">
                {program.prerequisites.map((prereq: string) => (
                  <li key={prereq} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span>{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mentorship */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Mentorship & Support</h2>
            <div className="bg-muted/50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {program.mentorship.cadence}
                  </h3>
                  <p className="text-muted-foreground">
                    {program.mentorship.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Career Services */}
          {isCareerTrack && program.careerServices.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Career Services</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {program.careerServices.map((service: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl"
                  >
                    <Briefcase className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">
              Ready to Start Your Journey?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of students who have launched their careers through
              our programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleEnroll}
                disabled={program.enrollmentStatus !== "open"}
                className="bg-secondary text-white hover:bg-secondary/90"
              >
                {program.enrollmentStatus === "open"
                  ? "Apply Now"
                  : "Enrollment Closed"}
              </Button>
              <Button variant="outline" asChild>
                <Link to="/technology/contact">Talk to Admissions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProgramDetail;
