import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { MissionSection } from "@/components/home/MissionSection";
import { StatsSection } from "@/components/home/StatsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TeamSection } from "@/components/home/TeamSection";
import { PillarsSection } from "@/components/home/PillarsSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { PartnersSection } from "@/components/home/PartnersSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <MissionSection />
      <StatsSection />
      <ServicesSection />
      <TeamSection />
      <PillarsSection />
      <ProjectsSection />
      <PartnersSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
