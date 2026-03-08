import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import LmsNavbar from "@/components/LmsNavbar";
import {
  Clock,
  BarChart,
  Users,
  PlayCircle,
  FileText,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCourseDetails, useEnrollInCourse } from "@/hooks/useAcademy";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const CourseDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: course, isLoading } = useCourseDetails(slug || "");
  const enrollMutation = useEnrollInCourse();

  const handleEnroll = () => {
    if (!course) return;
    enrollMutation.mutate(
      { courseId: course.id.toString(), paymentGateway: "CHAPA" },
      {
        onSuccess: (data: any) => {
          if (!data?.checkoutUrl) {
            navigate(`/lms/learn/${course.slug}`);
          }
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LmsNavbar />
        <div className="section-container py-12">
          <Skeleton className="h-[400px] w-full rounded-2xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LmsNavbar />
        <div className="section-container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Button asChild>
            <Link to="/lms/explore">Return to Explore</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <LmsNavbar />

      {/* Course Hero Header */}
      <section className="bg-slate-900 py-12 md:py-20 text-white relative overflow-hidden">
        <div className="section-container relative z-10">
          <Button
            variant="ghost"
            className="text-slate-400 hover:text-white mb-8 p-0"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Explore
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider">
                {course.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-heading font-bold leading-tight">
                {course.title}
              </h1>
              <p className="text-lg text-slate-400 max-w-xl">
                {course.description ||
                  "Master these in-demand skills with our comprehensive, expert-led curriculum designed for career growth."}
              </p>

              <div className="flex flex-wrap gap-6 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-accent" />{" "}
                  {course.difficulty} Level
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" /> 8 Weeks Duration
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" />{" "}
                  {course.enrolledCount || 0} Learners
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-amber-light text-slate-900 font-bold px-8 shadow-lg shadow-accent/20"
                  onClick={handleEnroll}
                  disabled={enrollMutation.isPending}
                >
                  {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                </Button>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3">
                  <span className="text-slate-400 text-xs">Price:</span>
                  <span className="text-xl font-bold">
                    {course.isFree ? "Free" : `$${course.price}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="aspect-video rounded-2xl overflow-hidden border-4 border-white/5 shadow-2xl relative">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                    <PlayCircle className="w-20 h-20 text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <Button
                    variant="outline"
                    className="rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white hover:text-slate-900 gap-2"
                  >
                    <PlayCircle className="w-5 h-5" /> Watch Trailer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent/5 to-transparent pointer-events-none" />
      </section>

      {/* Course Content */}
      <main className="section-container py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-accent" /> Course Overview
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
                <p>
                  This course provides a deep dive into {course.title}, covering
                  everything from foundational principles to advanced techniques
                  used by industry professionals. By the end of this journey,
                  you'll have a portfolio of projects and a professional
                  certification to showcase your skills.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  {[
                    "Interactive labs and real-world projects",
                    "Expert mentorship and peer networking",
                    "Lifetime access to course materials",
                    "Digital certification upon completion",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-slate-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6 flex items-center gap-3">
                <PlayCircle className="w-6 h-6 text-accent" /> Curriculum
              </h2>
              <div className="space-y-4">
                {course.modules?.map((module, idx) => (
                  <div
                    key={module.id}
                    className="bg-white border rounded-xl overflow-hidden"
                  >
                    <div className="p-5 flex items-center justify-between bg-slate-50/50">
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <h3 className="font-bold text-slate-900">
                            {module.title}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {module.lessons?.length || 0} lessons
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <Card className="border-2 border-accent/20 bg-slate-50/30">
              <CardContent className="p-8">
                <h3 className="font-heading font-bold text-xl mb-6">
                  Course Quick Facts
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-white shadow-sm border">
                      <ShieldCheck className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">
                        Security
                      </p>
                      <p className="text-sm font-bold text-slate-900">
                        Verified Pathways
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-white shadow-sm border">
                      <Award className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">
                        Reward
                      </p>
                      <p className="text-sm font-bold text-slate-900">
                        Aliko Hub Certificate
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-white shadow-sm border">
                      <Users className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">
                        Support
                      </p>
                      <p className="text-sm font-bold text-slate-900">
                        Mentorship Included
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t">
                  <p className="text-sm text-slate-500 italic text-center">
                    "This course was instrumental in helping me land my current
                    role. Highly recommended!"
                  </p>
                  <p className="text-xs font-bold text-slate-900 text-center mt-3">
                    — Aliko Learner
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-slate-900 rounded-2xl p-8 text-white text-center">
              <h4 className="font-heading font-bold mb-3">
                Enterprise Access?
              </h4>
              <p className="text-slate-400 text-sm mb-6">
                Contact our team for bulk enrollment and custom training
                options.
              </p>
              <Button
                variant="outline"
                className="w-full border-slate-700 hover:bg-slate-800 text-white bg-transparent"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetails;
