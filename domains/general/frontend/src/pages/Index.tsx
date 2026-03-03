import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { EcosystemFlow } from "@/components/EcosystemFlow";
import { ChallengesResponseSection } from "@/components/ChallengesResponseSection";
import { StatsSection } from "@/components/StatsSection";
import { WhyThisMattersSection } from "@/components/WhyThisMattersSection";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <WhyThisMattersSection />
      <ChallengesResponseSection />
      <ServicesSection />
      <EcosystemFlow />
      <StatsSection />

      {/* Simple bold CTA */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Ready to <span className="text-gradient-amber">Partner?</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Join us in building Africa's largest youth empowerment ecosystem.
          </p>
          <Button size="lg" className="mt-6 group bg-primary px-8 text-primary-foreground shadow-[var(--shadow-amber)] hover:brightness-110" asChild>
            <a href="/partnership">
              Become a Partner
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
