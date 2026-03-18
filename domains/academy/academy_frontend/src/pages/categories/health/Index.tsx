import { Layout } from "@/components/categories/health/layout/Layout";
import { HeroSection } from "@/components/categories/health/home/HeroSection";
import { ProgramsSnapshot } from "@/components/categories/health/home/ProgramsSnapshot";
import { HowItWorks } from "@/components/categories/health/home/HowItWorks";
import { TrustStrip } from "@/components/categories/health/home/TrustStrip";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ProgramsSnapshot />
      <HowItWorks />
      <TrustStrip />
    </Layout>
  );
};

export default Index;
