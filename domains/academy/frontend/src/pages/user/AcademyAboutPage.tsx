import About from "../../components/user/About.tsx";
import AboutHero from "../../components/user/AboutHero.tsx";
import AboutContent from "../../components/user/AboutContent.tsx";

const AcademyAboutPage = () => {
  return (
    <div className="pt-16">
      <AboutHero />
      <AboutContent />
      <About />
    </div>
  );
};

export default AcademyAboutPage;
