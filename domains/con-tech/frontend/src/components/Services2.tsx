import ServiceCard from "./Card";
import servicesBg from "../assets/services2Bg.png";
import mobileServicesBg from "../assets/mobileServices2Bg.png";
import icon1 from "../assets/1.png";
import icon2 from "../assets/2.png";
import icon3 from "../assets/3.png";
import icon4 from "../assets/4.png";
import icon5 from "../assets/5.png";
import icon6 from "../assets/6.png";
export default function ServicesSection() {
  const services = [
    {
      icon: (
        <img
          src={icon1}
          alt="Building Construction"
          className="w-20 h-20 md:p-2  md:w-28 md:h-28 md:top-3 md:left-2 backdrop-blur-xl border-1 border-white transition-transform duration-500 group-hover:flip-y"
        />
      ),
      title: "Building Construction",
      description:
        "Tracks schedules, deliverables, and workflows with real-time reporting and Gantt chart integration.",
    },
    {
      icon: (
        <img
          src={icon2}
          alt="Building Construction"
          className="w-20 h-20 md:p-2  md:w-28 md:h-28 md:top-3 md:left-2 backdrop-blur-xl border-1 border-white transition-transform duration-500 group-hover:flip-y"
        />
      ),
      title: "Construction Project Management System (CPMS)",
      description:
        "Tracks schedules, deliverables, and workflows with real-time reporting and Gantt chart integration.",
    },
    {
      icon: (
        <img
          src={icon3}
          alt="Building Construction"
          className="w-20 h-20 md:p-2  md:w-28 md:h-28 md:top-3 md:left-2 backdrop-blur-xl border-1 border-white transition-transform duration-500 group-hover:flip-y"
        />
      ),
      title: "Resource & Inventory Tracker",
      description:
        "Tracks schedules, deliverables, and workflows with real-time reporting and Gantt chart integration.",
    },
    {
      icon: (
        <img
          src={icon4}
          alt="Building Construction"
          className="w-20 h-20 md:p-2  md:w-28 md:h-28 md:top-3 md:left-2 backdrop-blur-xl border-1 border-white transition-transform duration-500 group-hover:flip-y"
        />
      ),
      title: "Client Communication Portal",
      description:
        "Tracks schedules, deliverables, and workflows with real-time reporting and Gantt chart integration.",
    },
    {
      icon: (
        <img
          src={icon5}
          alt="Building Construction"
          className="w-20 h-20 md:p-2  md:w-28 md:h-28 md:top-3 md:left-2 backdrop-blur-xl border-1 border-white transition-transform duration-500 group-hover:flip-y"
        />
      ),
      title: "Site Quality Inspection App",
      description:
        "Tracks schedules, deliverables, and workflows with real-time reporting and Gantt chart integration.",
    },
    {
      icon: (
        <img
          src={icon6}
          alt="Building Construction"
          className="w-20 h-20 md:p-2  md:w-28 md:h-28 md:top-3 md:left-2 backdrop-blur-xl border-1 border-white transition-transform duration-500 group-hover:flip-y"
        />
      ),
      title: "Digital Contract Management System",
      description:
        "Tracks schedules, deliverables, and workflows with real-time reporting and Gantt chart integration.",
    },
  ];

  return (
    <section
      className="relative bg-cover bg-center py-8 pl-4 md:py-16 md:px-6 lg:px-20 md:bg-cover bg-no-repeat md:bg-center "
      style={{
        backgroundImage: `url(${
          window.innerWidth <= 780 ? mobileServicesBg : servicesBg
        })`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 "></div>

      <div className="relative z-10">
        {/* Heading */}
        <h2 className="text-white text-4xl md:text-5xl font-bold  md:mb-12">
          Our Services that we provide
        </h2>

        {/* Grid */}
        <div className="group grid grid-cols-1 gap-8 mt-4 md:gap-8 md:grid-cols-2 lg:grid-cols-3 md:mt-32 ">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              className=""
              arrowButton=""
              right=""
              h3Class="text-white pl-2 md:pl-6 "
              pClass="text-white pl-2 font-s md:pl-6 md:text-gray-400"
              iconClass=""
            />
          ))}
        </div>
      </div>
    </section>
  );
}