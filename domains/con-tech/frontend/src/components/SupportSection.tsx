import { Phone, Users, FileText, Link as LinkIcon } from "lucide-react";
import machineImg from "../assets/heavyMachinery.png";
import bg from "../assets/bg2.png"; // replace with your image path

const features = [
  {
    icon: <Phone className="w-12 h-12 text-yellow-500 md:w-16 md:h-16 " />,
    title: "24/7 Customer Support",
    description:
      "Provides transparent dashboards with project milestones and financial overviews for clients.",
  },
  {
    icon: <LinkIcon className="w-12 h-12 md:w-16 md:h-16 text-yellow-500" />,
    title: "Seamless Integration",
    description:
      "Provides transparent dashboards with project milestones and financial overviews for clients.",
  },
  {
    icon: <Users className="w-12 h-12 md:w-16 md:h-16 text-yellow-500" />,
    title: "Community of peers",
    description:
      "Provides transparent dashboards with project milestones and financial overviews for clients.",
  },
  {
    icon: <FileText className="w-12 h-12 md:w-16 md:h-16 text-yellow-500" />,
    title: "On - Demand trainings",
    description:
      "Provides transparent dashboards with project milestones and financial overviews for clients.",
  },
];

const SupportSection = () => {
  return (
    <section className="flex w-full min-h-screen bg-cover bg-start md:bg-contain  py-12 px-6 md:px-6 lg:px-20 justify-center " style={{ backgroundImage: `url(${bg})` }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Section */}
        <div className="space-y-8">
          <h2 className="md:hidden text-3xl md:text-5xl font-bold leading-none text-gray-900 text-left mb-6 w-full">
            Get support from construction experts
          </h2>
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 md:items-start md:gap-4">
              <div className="flex-shrink-0">{feature.icon}</div>
              <div>
                <h3 className="text-[1.4rem] md:text-2xl font-medium text-black w-full">{feature.title}</h3>
                <p className="text-gray-600 text-md md:text-base">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-start justify-start">
          <h2 className="hidden md:block text-2xl md:text-5xl font-bold leading-none text-gray-900 text-left mb-6 w-full">
            Get support from construction experts
          </h2>
          <img
            src={machineImg}
            alt="Construction Machine"
            className="hidden md:block md:w-full max-w-[40rem] object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
