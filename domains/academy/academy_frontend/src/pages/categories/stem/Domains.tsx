import { Link } from "react-router-dom";
import { Layout } from "@/components/categories/stem/layout/Layout";
import { ProgramCard } from "@/components/categories/stem/programs/ProgramCard";
import { Button } from "@/components/categories/stem/ui/button";
import { Card, CardContent } from "@/components/categories/stem/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/categories/stem/ui/accordion";
import {
  ArrowRight,
  Building2,
  Building,
  Home,
  Cog,
  FlaskConical,
  Zap,
  Calendar,
  Globe,
  Layers,
} from "lucide-react";
import { domains } from "@/data/categories/stem/domains";
import { useCoursesByCategory } from "@/hooks/useAcademy";
import { domainSoftware } from "@/data/categories/stem/domainSoftware";
import { SoftwareGrid } from "@/components/categories/stem/domains/SoftwareGrid";
import { cn } from "@/lib/categories/stem/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Building,
  Home,
  Cog,
  FlaskConical,
  Zap,
  Calendar,
  Globe,
};

// Enhanced contrast - brighter text for dark backgrounds
const colorStyles: Record<
  string,
  {
    bg: string;
    border: string;
    text: string;
    glow: string;
    headerBg: string;
  }
> = {
  primary: {
    bg: "bg-primary/10",
    border: "border-primary/30",
    text: "text-[hsl(207_90%_72%)]",
    glow: "shadow-primary/15",
    headerBg: "bg-gradient-to-r from-primary/15 to-transparent",
  },
  accent: {
    bg: "bg-accent/10",
    border: "border-accent/30",
    text: "text-[hsl(195_100%_75%)]",
    glow: "shadow-accent/15",
    headerBg: "bg-gradient-to-r from-accent/15 to-transparent",
  },
  "accent-green": {
    bg: "bg-accent-green/10",
    border: "border-accent-green/30",
    text: "text-[hsl(80_70%_70%)]",
    glow: "shadow-accent-green/15",
    headerBg: "bg-gradient-to-r from-accent-green/15 to-transparent",
  },
  "accent-orange": {
    bg: "bg-accent-orange/10",
    border: "border-accent-orange/30",
    text: "text-[hsl(155_55%_68%)]",
    glow: "shadow-accent-orange/15",
    headerBg: "bg-gradient-to-r from-accent-orange/15 to-transparent",
  },
  electrical: {
    bg: "bg-[hsl(280_68%_55%)]/10",
    border: "border-[hsl(280_68%_55%)]/30",
    text: "text-[hsl(280_68%_78%)]",
    glow: "shadow-[hsl(280_68%_55%)]/15",
    headerBg: "bg-gradient-to-r from-[hsl(280_68%_55%)]/15 to-transparent",
  },
};

const Domains = () => {
  const { data } = useCoursesByCategory("STEM");
  const courses = data?.courses || [];

  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero py-16 lg:py-20">
        <div className="container-content">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Engineering Domains
              </span>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground">
              Domain-Specific{" "}
              <span className="text-primary">Engineering Software</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Explore our comprehensive training programs organized by
              engineering discipline. Click each domain to discover the software
              tools we cover.
            </p>
          </div>
        </div>
      </section>

      {/* Software Domains Accordion */}
      <section className="section-padding">
        <div className="container-content">
          <Accordion type="single" collapsible className="space-y-4">
            {domainSoftware.map((domain) => {
              const Icon = iconMap[domain.icon] || Building2;
              const styles =
                colorStyles[domain.accentColor] || colorStyles["primary"];

              return (
                <AccordionItem
                  key={domain.id}
                  value={domain.id}
                  className={cn(
                    "border rounded-2xl overflow-hidden transition-all duration-300",
                    styles.border,
                    "data-[state=open]:shadow-xl",
                    styles.glow,
                  )}
                >
                  <AccordionTrigger
                    className={cn(
                      "px-6 py-5 hover:no-underline transition-all",
                      styles.headerBg,
                      "data-[state=open]:border-b",
                      styles.border,
                    )}
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div
                        className={cn(
                          "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0",
                          styles.bg,
                          "border",
                          styles.border,
                        )}
                      >
                        <Icon className={cn("h-6 w-6", styles.text)} />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-foreground">
                          {domain.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {domain.subtitle}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "ml-auto hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
                          styles.bg,
                          styles.text,
                        )}
                      >
                        <span>{domain.software.length} Tools</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-6 bg-card/50">
                    <SoftwareGrid
                      software={domain.software}
                      accentColor={domain.accentColor}
                    />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </section>

      {/* Domain Programs Section */}
      <section className="py-12 bg-secondary/30 border-t border-divider">
        <div className="container-content">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-foreground">
              Explore by <span className="text-accent">Engineering Domain</span>
            </h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              Browse our training programs organized by discipline with
              suggested progression paths.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.slice(0, 6).map((domain) => {
              const Icon = iconMap[domain.icon] || Building2;
              // Filter by matching the category or mapping
              const domainPrograms = courses
                .filter(
                  (c: any) =>
                    c.category?.name === domain.name ||
                    c.categoryId === domain.id ||
                    c.title
                      .toLowerCase()
                      .includes(domain.shortName.toLowerCase()),
                )
                .slice(0, 2);

              return (
                <Card
                  key={domain.id}
                  className="border-divider bg-card/80 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {domain.shortName}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {domain.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground mb-4 p-2 bg-secondary/50 rounded-lg">
                      <span className="font-medium text-foreground">
                        Progression:{" "}
                      </span>
                      {domain.progressionPath}
                    </div>

                    {domainPrograms.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {domainPrograms.map((program) => (
                          <Link
                            key={program.id}
                            to={`/programs/${program.slug}`}
                            className="block text-sm text-primary hover:underline"
                          >
                            â†’ {program.title}
                          </Link>
                        ))}
                      </div>
                    )}

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Link
                        to={`/programs?domain=${encodeURIComponent(domain.name)}`}
                      >
                        View All Programs
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-card border-t border-divider">
        <div className="container-content text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">
            Need a Customized Training Program?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            We design custom training solutions for organizations and
            institutions based on your specific technology and workforce needs.
          </p>
          <Button asChild variant="hero" size="lg">
            <Link to="/enterprise">
              Request Enterprise Training
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Domains;
