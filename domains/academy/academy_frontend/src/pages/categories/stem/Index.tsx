import { Link } from "react-router-dom";
import { Button } from "@/components/categories/stem/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Layout } from "@/components/categories/stem/layout/Layout";
import { AudienceStrip } from "@/components/categories/stem/shared/AudienceStrip";
import { IndustryAlignmentBlock } from "@/components/categories/stem/shared/IndustryAlignmentBlock";
import { FeaturedProgramCard } from "@/components/categories/stem/programs/FeaturedProgramCard";
import { EnhancedDomainCard } from "@/components/categories/stem/domains/EnhancedDomainCard";
import { useCoursesByCategory } from "@/hooks/useAcademy";
import { domains } from "@/data/categories/stem/domains";
import heroBg from "@/assets/categories/stem/hero-bg.jpg";

const enterpriseBenefits = [
  "Custom cohort training for your workforce",
  "Faculty enablement and train-the-trainer",
  "Onsite, hybrid, or fully online delivery",
];

const Index = () => {
  const { data, isLoading } = useCoursesByCategory("STEM", { pageSize: 4 });
  const featuredPrograms = data?.courses?.slice(0, 4) || [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/40" />
        <div className="container-content py-24 lg:py-36 relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-display text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-tight">
              From Student to{" "}
              <span className="text-accent-green">Engineer</span>
            </h1>
            <p className="mt-8 text-xl text-muted-foreground sm:text-2xl max-w-2xl leading-relaxed">
              Master real-world STEM skills and build your professional future
              through structured, instructor-supported training.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <Button asChild size="xl" variant="hero">
                <Link to="/stem/programs">
                  Explore Programs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="heroOutline">
                <Link to="/stem/enterprise">Request Enterprise Training</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Audience Strip */}
      <AudienceStrip />

      {/* Featured Programs */}
      <section className="section-padding bg-blue-section">
        <div className="container-content">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="font-display text-4xl font-bold text-white">
                Featured <span className="text-primary">Programs</span>
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                Popular training programs across engineering disciplines
              </p>
            </div>
            <Button asChild variant="outline" size="lg">
              <Link to="/stem/programs">
                Explore All Programs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {isLoading ? (
            <div className="text-center py-10 text-muted-foreground">
              Loading featured courses...
            </div>
          ) : featuredPrograms.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No featured programs available.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredPrograms.map((program) => (
                <FeaturedProgramCard key={program.id} program={program} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Engineering Domains */}
      <section className="section-padding bg-teal-section">
        <div className="container-content">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-4xl font-bold text-white">
              <span className="text-accent-green">Engineering</span> Domains
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Explore programs organized by engineering discipline and industry
              systems
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {domains.map((domain) => (
              <EnhancedDomainCard key={domain.id} domain={domain} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/stem/programs">
                View All Programs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Industry Alignment */}
      <IndustryAlignmentBlock />

      {/* Enterprise Training Preview */}
      <section className="section-padding bg-blue-section">
        <div className="container-content">
          <div className="bg-card rounded-2xl border border-divider p-10 lg:p-14 shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-4xl font-bold text-foreground">
                  <span className="text-accent-green">Enterprise</span> &
                  Institutional Training
                </h2>
                <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                  Customized engineering and STEM training solutions for
                  organizations, universities, and government agencies.
                </p>
                <ul className="mt-8 space-y-4">
                  {enterpriseBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-accent-green mt-0.5 flex-shrink-0" />
                      <span className="text-foreground text-lg">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <Button asChild size="lg" variant="hero">
                    <Link to="/stem/enterprise">
                      Request Training Proposal
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 via-accent/15 to-accent-green/15 border border-divider flex items-center justify-center relative overflow-hidden shadow-2xl">
                  <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-primary/25 blur-2xl" />
                  <div className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-accent-green/25 blur-2xl" />
                  <div className="text-center p-8 relative z-10">
                    <div className="text-7xl font-display font-extrabold text-primary">
                      500+
                    </div>
                    <p className="mt-3 text-lg text-muted-foreground font-medium">
                      Professionals trained annually
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
