import Layout from "@/components/categories/technology/layout/Layout";
import HeroSection from "@/components/categories/technology/home/HeroSection";
import FeaturedPrograms from "@/components/categories/technology/home/FeaturedPrograms";
import DomainCards from "@/components/categories/technology/home/DomainCards";
import ProgramsPreview from "@/components/categories/technology/home/ProgramsPreview";
import FeaturesSection from "@/components/categories/technology/home/FeaturesSection";
import CTASection from "@/components/categories/technology/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedPrograms />
      <DomainCards />
      <ProgramsPreview />
      <FeaturesSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
