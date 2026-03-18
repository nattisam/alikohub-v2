import { Link } from "react-router-dom";
import { Layout } from "@/components/categories/stem/layout/Layout";
import { Button } from "@/components/categories/stem/ui/button";
import { Card, CardContent } from "@/components/categories/stem/ui/card";
import { ArrowRight, Target, Users, Award, Globe } from "lucide-react";

const values = [
  { icon: Target, title: "Industry Alignment", description: "Training aligned with globally recognized engineering platforms and vendor ecosystems.", color: "primary", iconBg: "bg-primary/15 border border-primary/30", iconColor: "text-primary" },
  { icon: Users, title: "Structured Learning", description: "Progressive curriculum from foundational concepts to professional-level mastery.", color: "accent", iconBg: "bg-accent/15 border border-accent/30", iconColor: "text-accent" },
  { icon: Award, title: "Practical Focus", description: "Hands-on projects and real-world applications, not just theory.", color: "accent-green", iconBg: "bg-accent-green/15 border border-accent-green/30", iconColor: "text-accent-green" },
  { icon: Globe, title: "Global Standards", description: "Preparing professionals for international engineering practice.", color: "accent-orange", iconBg: "bg-accent-orange/15 border border-accent-orange/30", iconColor: "text-accent-orange" },
];

const About = () => {
  return (
    <Layout>
      <section className="gradient-hero py-20 lg:py-28">
        <div className="container-content">
          <div className="max-w-3xl">
            <h1 className="font-display text-5xl font-extrabold text-foreground">
              About <span className="text-primary">Aliko Academy</span> STEM
            </h1>
            <p className="mt-6 text-xl text-[hsl(210_30%_82%)] leading-relaxed">
              Aliko Academy STEM is an industry systems training academy focused on engineering software 
              and systems mastery. We provide structured, instructor-supported training in BIM, CAD/CAE, 
              power systems, infrastructure tools, and project controls.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding gradient-section">
        <div className="container-content">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="border-divider card-hover bg-card">
                  <CardContent className="p-8 text-center">
                    <div className={`h-16 w-16 rounded-xl ${item.iconBg} flex items-center justify-center mx-auto`}>
                      <Icon className={`h-8 w-8 ${item.iconColor}`} />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-bold text-foreground">{item.title}</h3>
                    <p className="mt-3 text-base text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-card border-t border-divider">
        <div className="container-content text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-6">
            Ready to get started?
          </h2>
          <Button asChild variant="hero" size="lg">
            <Link to="/programs">Explore Programs <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default About;
