import { Link } from "react-router-dom";
import { Layout } from "@/components/categories/stem/layout/Layout";
import { ProgramCard } from "@/components/categories/stem/programs/ProgramCard";
import { Button } from "@/components/categories/stem/ui/button";
import { ArrowRight, Building2, Layers } from "lucide-react";
import { useCoursesByCategory } from "@/hooks/useAcademy";

const Programs = () => {
  const { data, isLoading } = useCoursesByCategory("STEM");
  const courses = data?.courses || [];

  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero py-20 lg:py-28">
        <div className="container-content">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-5">
              <div className="h-14 w-14 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Layers className="h-7 w-7 text-primary" />
              </div>
              <span className="text-sm font-bold text-primary uppercase tracking-widest">
                Program Catalog
              </span>
            </div>
            <h1 className="font-display text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
              Engineering{" "}
              <span className="text-primary">Software Training</span>
            </h1>
            <p className="mt-5 text-xl text-muted-foreground leading-relaxed">
              Browse our comprehensive software training programs by domain.
              Click each domain to explore available courses.
            </p>
          </div>
        </div>
      </section>

      {/* Program Catalog */}
      <section className="section-padding">
        <div className="container-content">
          <div className="mb-14">
            <h2 className="font-display text-3xl font-bold text-foreground mb-8 flex items-center gap-4">
              <Building2 className="h-7 w-7 text-primary" />
              <span>
                STEM <span className="text-primary">Programs</span>
              </span>
            </h2>

            {isLoading ? (
              <div className="text-center py-20 text-muted-foreground font-bold">
                Loading programs...
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground font-bold">
                No programs currently available.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <ProgramCard key={course.id} program={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-16 bg-surface-elevated border-t border-divider">
        <div className="container-content text-center">
          <h3 className="font-display text-2xl font-bold text-foreground mb-4">
            Looking for customized training?
          </h3>
          <Button asChild variant="hero" size="lg">
            <Link to="/stem/enterprise">
              Request Enterprise Training
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Programs;
