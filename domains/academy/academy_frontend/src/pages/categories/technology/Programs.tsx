import { Link } from "react-router-dom";
import { ArrowRight, Code2, Sparkles, BookOpen } from "lucide-react";
import Layout from "@/components/categories/technology/layout/Layout";
import ProgramCard from "@/components/categories/technology/programs/ProgramCard";
import { Button } from "@/components/categories/technology/ui/button";
import { useTechCourses } from "@/hooks/categories/technology/useTech";
import { Loader2 } from "lucide-react";

const Programs = () => {
  // useTechCourses returns the array directly (already unwrapped in the hook)
  const { data: techCoursesRaw, isLoading } = useTechCourses();

  // Transform API data to match ProgramCard expectations
  const courses = ((techCoursesRaw as any[]) || []).map((course: any) => ({
    id: course.id,
    title: course.title,
    slug: course.slug || course.id.toString(),
    type: "career-track",
    category: course.category || "Software Engineering",
    short_summary: course.shortDescription,
    description: course.longDescription || course.shortDescription,
    duration: course.estimatedTime || "12 Weeks",
    level: course.level || "Beginner",
    deliveryMode: course.deliveryMode || "Online",
    tuition: course.price ? `$${course.price.toLocaleString()}` : "$1,200",
    outcome: course.outcome || "Professional Certificate",
    skills: course.skills || [],
    featured: (course.enrolledNum || 0) > 5,
    image_url: course.thumbnail,
    startDate: "Rolling Admission",
    weeklyHours: "10-15 hrs/week",
  }));

  return (
    <Layout>
      {/* Hero — original dark gradient styling */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[hsl(207,45%,16%)] to-[hsl(215,40%,13%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--accent)/0.08),transparent_50%),radial-gradient(circle_at_80%_70%,hsl(var(--secondary)/0.08),transparent_50%)]" />
        <div className="relative container-padding mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-1 bg-secondary rounded-full" />
              <span className="text-secondary font-semibold text-sm uppercase tracking-widest">
                Explore Programs
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Technology <span className="text-accent">Programs & Courses</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl leading-relaxed mb-8">
              Comprehensive tech training programs designed to advance your
              career in technology.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-secondary" />
                <div>
                  <p className="font-bold text-white">Full</p>
                  <p className="text-sm text-white/60">Dynamic Catalog</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-accent" />
                <div>
                  <p className="font-bold text-white">{courses.length}</p>
                  <p className="text-sm text-white/60">Available Courses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Catalog — original dark section styling */}
      <section className="section-padding bg-gradient-to-b from-[hsl(220,25%,17%)] to-[hsl(223,22%,15%)] min-h-[400px]">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="mb-14">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
              <Code2 className="h-7 w-7 text-accent" />
              <span>
                Technology <span className="text-accent">Programs</span>
              </span>
            </h2>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="h-10 w-10 text-accent animate-spin" />
                <p className="text-white/60 animate-pulse font-medium">
                  Loading programs...
                </p>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-20 text-white/50 font-bold">
                No programs currently available.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((program: any) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enterprise CTA — original dark styling */}
      <section className="py-16 bg-gradient-to-b from-[hsl(207,45%,16%)] to-[hsl(207,50%,12%)] border-t border-white/5">
        <div className="container-padding mx-auto max-w-7xl text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Looking for customized team training?
          </h3>
          <Link to="/technology/enterprise">
            <Button
              size="lg"
              className="group h-14 px-10 rounded-xl font-bold text-base"
            >
              Request Enterprise Training
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Programs;
