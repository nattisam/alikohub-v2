import Hero from "../components/Hero";
import ServicesList from "../components/ServicesList";
import ServicesProject from "../components/ServicesProject";

import bg from "../assets/heavy-machinery2.png"

const ConTechServicesPage = () => {
  return (
    <>
      <Hero style={{ backgroundImage:`url(${bg})` }} className="relative h-[90vh] overflow-hidden bg-cover bg-center">
        <div className="h-full w-full flex items-center justify-center relative z-5">
          <h1 className="text-white text-4xl md:text-9xl font-extrabold">
            Our Services
          </h1>
        </div>
      </Hero>
      <ServicesList />
      <ServicesProject />
    </>
  );
};

export default ConTechServicesPage;
