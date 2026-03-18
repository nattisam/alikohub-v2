import { Layout } from "@/components/categories/stem/layout/Layout";
import { IndustryAlignmentBlock } from "@/components/categories/stem/shared/IndustryAlignmentBlock";
import { Button } from "@/components/categories/stem/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Curriculum = () => {
  return (
    <Layout>
      <section className="gradient-hero py-16 lg:py-20">
        <div className="container-content">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl font-bold text-foreground">Industry-Aligned Curriculum</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Our programs are structured around globally recognized engineering platforms and vendor ecosystems, 
              ensuring you learn tools and workflows used in professional practice worldwide.
            </p>
          </div>
        </div>
      </section>

      <IndustryAlignmentBlock />

      <section className="section-padding">
        <div className="container-content text-center">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="hero" size="lg">
              <Link to="/programs">Explore Programs <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="heroOutline" size="lg">
              <Link to="/enterprise">Request Enterprise Training</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Curriculum;