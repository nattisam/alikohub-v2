import AboutService from "../components/AboutService";
import Hero from "../components/Hero";
import WhyChooseUs from "../components/WhyChooseUs";

import bg from "../assets/heavy-machinery2.png";

const ConTechAboutUsPage = () => {
  return (
    <main>
      <Hero
        style={{ backgroundImage: `url(${bg})` }}
        className="relative h-[90vh] overflow-hidden bg-cover bg-center"
      >
        <div className="h-full w-full flex items-center justify-center relative z-5">
          <h1 className="text-white text-4xl md:text-9xl font-extrabold">
            About Us
          </h1>
        </div>
      </Hero>
      <AboutService />
      <WhyChooseUs />
    </main>
  );
};

export default ConTechAboutUsPage;
