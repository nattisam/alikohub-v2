import Layout from "@/components/categories/technology/layout/Layout";
import HeroSection from "@/components/categories/technology/home/HeroSection";
import CourseCategorySection from "@/components/categories/technology/home/CourseCategorySection";
import FeaturesSection from "@/components/categories/technology/home/FeaturesSection";
import CTASection from "@/components/categories/technology/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <CourseCategorySection />
      <FeaturesSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
