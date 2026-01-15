import ServiceCard from "./Card";
import icon1 from "../assets/collaboration.png";
import icon2 from "../assets/trust.png";
import icon3 from "../assets/innovation.png";
import icon4 from "../assets/excellence.png";
import icon5 from "../assets/inclusivity.png";
import icon6 from "../assets/empowerment.png";
import bg1 from "../assets/bg1.png";
import mobileBg from "../assets/mobileWhyChooseUsBg.png"
export default function WhyChooseUs() {
  const services = [
    {
      icon: <img src={icon1} alt="Collaboration" className="transition-transform duration-500 group-hover:flip-y w-16 h-16 md:pt-2 md:w-20 md:h-20 md:top-3 md:mr-0 ml-auto " />,
      title: "Collaboration",
      description:
        "A drive to ensure no one is left behind, with solutions tailored to local needs while being aligned with global standards.",
        right: true,
        h3Class: "text-black md:pr-3 md:pl-0 md:text-white",
        pClass: "hidden md:block md:pr-3 md:pl-0 md:text-white font-thin font-[14px]"
    },
    {
      icon: <img src={icon3} alt="Building Construction" className="transition-transform duration-500 group-hover:flip-y w-16 h-16 md:pt-2 md:w-20 md:h-20 md:top-3 md:mr-0 ml-auto" />,
      title: "Innovation",
      description:
        "To establish a dynamic, seamless digital hub that bridges global opportunities with African talent, professionals, and communities.",
        right: true,
        h3Class: "text-black pr-3 pl-0 md:text-white",
        pClass: "hidden md:block md:pr-3 md:pl-0 text-white font-thin"
    },
    {
      icon: <img src={icon5} alt="Building Construction" className="transition-transform duration-500 group-hover:flip-y w-16 h-16 md:pt-2 md:w-20 md:h-20 md:top-3 md:mr-0 ml-auto" />,
      title: "Inclusivity",
      description:
        "A commitment to ensuring that everyone has access to the digital tools and resources they need to succeed.",
        right: true,
        h3Class: "text-black pr-3 pl-0 md:text-white",
        pClass: "hidden md:block md:pr-3 md:pl-0 text-white font-thin"
    },
    {
      icon: <img src={icon2} alt="Building Construction" className=" transition-transform duration-500 group-hover:flip-y w-16 h-16 md:pt-2 md:w-20 md:h-20 md:top-3   "  />,
      title: "Trust & Reliability",
      description:
        "Commitment to accessible digital innovation and cutting-edge technologies in education, construction, and consulting.",
        right: false,
        h3Class: "pr-0 pl-3 text-black",
        pClass: "hidden md:block md:pr-0 md:pl-3 text-black font-thin"
    },
    
    {
      icon: <img src={icon4} alt="Building Construction" className="transition-transform duration-500 group-hover:flip-y w-16 h-16 md:pt-2 md:w-20 md:h-20 md:top-3 " />,
      title: "Excellence",
      description:
        "To revolutionize construction processes through digitization, equip learners with cutting-edge technical skills tailored to industry demands, provide personalized ",
        right: false,
        h3Class: "pr-0 pl-3 text-black",
        pClass: "hidden md:block md:pr-0 md:pl-3 text-black font-thin"
    },
    
    {
      icon: <img src={icon6} alt="Building Construction" className="transition-transform duration-500 group-hover:flip-y w-16 h-16 md:pt-2 md:w-20 md:h-20 md:top-3 " />,
      title: "Empowerment",
      description:
        "To empower individuals and communities through access to digital tools, resources, and training.",
      right: false,
      h3Class: "pr-0 pl-3 text-black",
      pClass: "hidden md:block md:pr-0 md:pl-3 text-black font-thin"
    },
  ];
  const half = Math.ceil(services.length / 2);
  return (
    <section className="relative bg-cover bg-no-repeat bg-center pl-2 pr-2 py-8  lg:px-20 md:bg-cover md:bg-center md:pt-16 md:pb-16" style={{ backgroundImage: `url(${window.innerWidth <= 780 ? mobileBg : bg1})` }}>
      <h3 className="text-4xl text-center font-bold mb-6 md:hidden">Why Choose Us?</h3>
      <div className="flex flex-row  justify-center relative items-center gap-8 md:gap-48">
        {/* Grid */}
        <div className="group grid grid-cols-1 gap-8 w-[64rem] md:grid-cols-2 lg:grid-cols-1 md:gap-y-4 ">

          {services.slice(0, half).map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              className = "border-2 border-white text-right backdrop-blur-xl md:mr-0  md:max-w-72 md:mt-0 md:mb-0 md:pt-0"
              arrowButton="hidden md:hidden"
              right = {service.right}
             h3Class = {service.h3Class}
             pClass = {service.pClass}
             iconClass="md:pt-1"
            />
          ))}
          </div>
          <h3 className="hidden md:block md:w-full md:h-fit text-5xl font-bold text-center">Why Choose Us?</h3>
          <div className="group grid grid-cols-1 gap-8 w-[64rem] pr-0 md:grid-cols-2 lg:grid-cols-1 md:gap-y-4  ">
          {services.slice(3, 6).map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              className = "border-2 border-white text-right backdrop-blur-xl md:mr-0  md:max-w-72 md:mt-0 md:mb-0 md:pt-0"
              arrowButton="hidden md:hidden"
              right = {service.right}
             h3Class = {service.h3Class}
             pClass = {service.pClass}
             iconClass="md:pt-1"
            />
          ))}
          </div>
        
      </div>
    </section>
  );
}