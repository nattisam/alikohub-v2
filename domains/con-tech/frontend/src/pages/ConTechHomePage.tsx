import BusinessStats from "../components/BusinessStats.tsx";
import CustomerStories from "../components/CustomerStories.tsx";
import Hero from "../components/Hero.tsx";
import Team from "../components/Team.tsx";
import ServicesSection from "../components/Services2.tsx";
import ConstructionSection from "../components/AboutConTech.tsx";
import SupportSection from "../components/SupportSection.tsx";
import WhyChooseUs from "../components/WhyChooseUs.tsx";
import bg from "../assets/machinery.png";
const ContechHomePage = () => {
  return (
    <main>
      <Hero
        style={{ backgroundImage: `url(${bg})` }}
        className="relative h-[90vh] overflow-hidden flex flex-col justify-center bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-gradient-to-r h-full w-full from-black/70 to-white/0"></div>
        <div className="bg-[#C2B58F]/20 backdrop-blur-xs p-6 sm:p-8 md:p-10 rounded-xl max-w-md sm:max-w-lg md:max-w-xl text-left md:text-right">
          <h1 className="text-white text-start text-2xl sm:text-3xl md:text-4xl font-semibold pb-6 leading-snug">
            Revolutionize the African construction industry through accessible
            digital innovation
          </h1>
          <div className="flex justify-end">
            <button className="bg-[#FFC107]/70 text-black py-2 px-6 rounded-md hover:bg-[#FFC107]/90 transition duration-300">
              Contact us
            </button>
          </div>
        </div>
      </Hero>
      <ConstructionSection />
      <ServicesSection />
      <SupportSection />
      <WhyChooseUs />
      <Team />
      <CustomerStories />
      <BusinessStats />      
    </main>
  );
};

export default ContechHomePage;
