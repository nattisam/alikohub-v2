import { Link } from "react-router-dom";
import { ArrowRight, Loader2, Sparkles, GraduationCap } from "lucide-react";
import { useTechCourses } from "@/hooks/categories/technology/useTech";

const FeaturedPrograms = () => {
  const { data: courses = [], isLoading } = useTechCourses({ pageSize: 6 });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-gradient-to-b from-[hsl(207,45%,16%)] to-[hsl(207,50%,12%)] space-y-4">
        <Loader2 className="h-10 w-10 text-accent animate-spin" />
        <p className="text-white/60 font-medium animate-pulse">
          Loading tech programs...
        </p>
      </div>
    );
  }

  // Only show if there are courses from the backend
  if (courses.length === 0) return null;

  return (
    <section className="section-padding bg-gradient-to-b from-[hsl(207,45%,16%)] to-[hsl(207,50%,12%)] relative border-b border-white/5">
      <div className="container-padding mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <p className="text-sm font-bold text-secondary uppercase tracking-widest mb-4">
            Recent Technology Programs
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            New Academic Pathways
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Latest job-ready programs delivered through Aliko Academy – Tech.
            Choose your career track today.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {courses.map((course: any, index: number) => (
            <Link
              key={course.id}
              to={`/technology/programs/${course.slug || course.id}`}
              className={`group relative rounded-3xl overflow-hidden aspect-[4/3] ring-2 ring-transparent transition-all duration-500 shadow-2xl hover:scale-[1.02] ${
                index % 2 === 0
                  ? "hover:ring-aliko-blue/60"
                  : "hover:ring-aliko-orange/60"
              }`}
            >
              <div className="absolute inset-0">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center p-8">
                    <GraduationCap className="w-full h-full text-white/5" />
                  </div>
                )}
              </div>

              {/* Gradient Overlay using consistent brand colors */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${
                  index % 2 === 0
                    ? "from-aliko-blue/90 via-aliko-blue/20"
                    : "from-aliko-orange/90 via-aliko-orange/20"
                } to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-md border text-white ${
                      index % 2 === 0
                        ? "bg-aliko-blue/40 border-aliko-blue/20"
                        : "bg-aliko-orange/40 border-aliko-orange/20"
                    }`}
                  >
                    {course.category}
                  </span>
                  {course.status === "PUBLISHED" && (
                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full backdrop-blur-md">
                      <Sparkles className="h-3 w-3" />
                      Active
                    </span>
                  )}
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-white leading-tight mb-3 group-hover:text-white/90 transition-colors">
                  {course.title}
                </h3>

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center text-sm font-black text-white/90 group-hover:text-white transition-all">
                    Explore Program
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                  </span>

                  {course.price > 0 && (
                    <span className="text-sm font-black text-white bg-white/10 px-3 py-1 rounded-lg">
                      ${course.price}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/technology/programs"
            className="inline-flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white transition-colors uppercase tracking-widest"
          >
            View all technology programs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPrograms;
