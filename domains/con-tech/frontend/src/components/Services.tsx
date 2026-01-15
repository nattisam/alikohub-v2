import Card from "../../../../../libraries/ui-libraries/components/Card";
import site from "../assets/con_site.png";
import cpms from "../assets/cpms.png";
import contract from "../assets/contracting.png";
import resourceTracker from "../assets/resource_tracker.png";
import communication from "../assets/client_communication.png";

const services = [
  {
    title: "Construction Site Management System(CPMS)",
    description:
      "Tracks schedules, deliverables, and workflows with real-time reporting and Gantt chart integration.",
    img: cpms,
  },
  {
    title: "Digital Contract Management System",
    description:
      "Manages contracts, change orders, and RFIs digitally with e-signatures and audit trails.",
    img: contract,
  },
  {
    title: "Resource & Inventory Tracker",
    description:
      "Monitors materials, deliveries, and supplier chains with predictive analytics",
    img: resourceTracker,
  },
  {
    title: "Site Quality Inspection App",
    description:
      " Enables digital inspections, issue logging, and photo uploads with GPS tagging",
    img: site,
  },
  {
    title: "Client Communication Portal",
    description:
      "Provides transparent dashboards with project milestones and financial overviews for clients.",
    img: communication,
  },
];
const Services = () => {
  return (
    <div className="flex flex-row flex-wrap justify-around items-center gap-4 py-5 px-10">
      {services.map((service, index) => (
        <Card
          key={index}
          className="flex flex-col items-center justify-between rounded-t-2xl my-4 md:min-w-[17rem] md:max-w-[30%] h-fit md:max-h-[25rem] md:border-1 md:border-gray-400"
          img={service.img}
          imgClassName={"w-full h-[50%] min-h-[50%] max-h-[50%] rounded-t-2xl object-cover"}
          title={service.title}
          content={service.description}
          titleClassName={"text-lg font-bold px-4"}
          contentClassName={"text-base my-4 px-4"}
        >
            <button className="w-[60%] md:w-full font-semibold text-lg py-3 bg-yellow-500">Learn More</button>
        </Card>
      ))}
    </div>
  );
};

export default Services;
