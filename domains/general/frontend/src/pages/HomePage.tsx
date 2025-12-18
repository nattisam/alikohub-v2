import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import SocialImpact from "../components/SocialImpact.tsx";
import About from "../components/About.tsx";
import Meet from "../components/Meet.tsx";
import Footer from "../components/Footer.tsx";
import Header from "../components/header.tsx";
import Services from "../components/services.tsx";
import { useVisibleSection } from "../hooks/useVisibleSection.tsx";
import { footerConfig } from "../components/FooterConfig.tsx";
import Consultancy from "../assets/Consultancy.jpg";
import Tech from "../assets/Tech.png";
import Academy from "../assets/Academy.jpg";
import HappyStudent from "../assets/happy-student.png";
import consu from "../assets/consultancy.png";
import blur from "../assets/Blur.png";
import blur2 from "../assets/blur1.png";
import blur3 from "../assets/blur2.png";
import Hero from "../components/hero.tsx";
const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const academyRef = useRef<HTMLDivElement>(null);
  const consultancyRef = useRef<HTMLDivElement>(null);
  const techRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);
  // tracking visible section to highlight navBar
  const visbleSection = useVisibleSection(
    {
      home: homeRef,
      about: aboutRef,
      "contact-us": contactRef,
    },
    10
  );

  useEffect(() => {
    const scrollTargets = {
      academy: academyRef,
      consultancy: consultancyRef,
      tech: techRef,
      about: aboutRef,
      "contact-us": contactRef,
    };

    const scrollKey = location.state?.scrollTo as keyof typeof scrollTargets;

    const offset = 80;

    if (scrollKey && scrollTargets[scrollKey]?.current) {
      const elementTop =
        scrollTargets[scrollKey]!.current!.getBoundingClientRect().top;
      const scrollY = window.scrollY + elementTop - offset;

      window.scrollTo({ top: scrollY, behavior: "smooth" });
      navigate(location.pathname, { replace: true, state: null });
    }

    if (location.pathname === "/contact-us" && contactRef.current) {
      const elementTop = contactRef.current.getBoundingClientRect().top;
      const scrollY = window.scrollY + elementTop - offset;
      window.scrollTo({ top: scrollY, behavior: "smooth" });
    }
    if (location.state?.scrollTo === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (location.pathname === "/careers") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.state, location.pathname, navigate]);
  return (
    <>
      <Header currentSection={visbleSection} />
      <div ref={homeRef}>
        <Hero
          heading="Empowering Africa's Next Generation of Innovators."
          subheading="AlikoHub is building Africa’s digital future—uniting education, global consultancy, and smart construction tools under one seamless platform."
          showButtons={true}
          showImage={true}
          imageSrc={HappyStudent}
          cards={[
            {
              img: Consultancy,
              title: "Aliko Events",
              scrollTo: "events",
              position: "absolute rotate-6 left-0 not-lg:left-8 -bottom-5 z-10",
            },
            {
              img: Academy,
              title: "Aliko Academy",
              scrollTo: "academy",
              position:
                "absolute rotate-3 left-12 not-lg:left-18 bottom-4 z-20",
            },
            {
              img: Tech,
              title: "Aliko Con-Tech",
              scrollTo: "tech",
              position: "absolute rotate-3 left-32 bottom-8 z-30",
            },
            {
              img: consu,
              title: "Aliko Consultancy",
              scrollTo: "consultancy",
              position:
                "absolute rotate-3 left-48 not-lg:left-40 bottom-15 z-30",
            },
          ]}
          floatingImages={[
            {
              src: blur2,
              className: "lg:hidden absolute right-0 top-0 w-24 h-auto",
              style: {
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              },
            },
            {
              src: blur,
              className: "absolute left-0 top-40 z-10 w-24 h-auto",
              style: {
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              },
            },
            {
              src: blur3,
              className:
                "hidden lg:block absolute -top-24 right-0 rounded-full z-10",
              style: {
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              },
            },
          ]}
          sectionClassName="px-6 sm:px-10 md:px-16 pt-20 md:pt-32"
          contentClassName="-mt-12 lg:-mt-24"
          imageWrapperClassName="mt-10 lg:-mt-30"
          onGetStartedClick={() => console.log("Get Started clicked")}
          onLoginClick={() => console.log("Log In clicked")}
        />
      </div>
      <Services
        academyRef={academyRef}
        consultancyRef={consultancyRef}
        techRef={techRef}
        eventsRef={eventsRef}
      />
      <SocialImpact />
      <div ref={aboutRef}>
        <About />
      </div>
      <Meet />
      <div ref={contactRef}>
        <Footer {...footerConfig} />
      </div>
    </>
  );
};

export default HomePage;
