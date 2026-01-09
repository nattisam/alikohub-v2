import bg from "../assets/Bg3.png";

import constructionIcon from "../assets/constructionIcon.png";
import cpmsIcon from "../assets/cpmsIcon.png";
import inventoryIcon from "../assets/inventoryIcon.png";
import portalIcon from "../assets/portalIcon.png";
import inspectionIcon from "../assets/inspectionIcon.png";
import communicationIcon from "../assets/communicationIcon.png";

const services = [
  { icon: constructionIcon, title: "Building Construction" },
  { icon: cpmsIcon, title: "Construction Project Management System (CPMS)" },
  { icon: inventoryIcon, title: "Resource & Inventory Tracker" },
  { icon: portalIcon, title: "Client Communication Portal" },
  { icon: inspectionIcon, title: "Site Quality Inspection App" },
  { icon: communicationIcon, title: "Digital Contract Management System" },
];

export default function ServicesList() {
  return (
    <section
      className="bg-cover bg-center bg-no-repeat py-12"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="max-w-6xl mx-auto space-y-12 px-6">
        {services.map((service, i) => (
          <div key={i} className="grid md:grid-cols-2 gap-8 items-start">
            <div className="relative pl-6">
              <div
                className="absolute top-0 left-0 h-0.5 bg-[#FEB15B] max-w-[250px]"
                style={{ width: "calc(100% - 1.5rem)" }}
              ></div>
              <div className="absolute top-0 left-0 w-0.5 bg-[#FEB15B] h-[120%]"></div>
              <div className="flex flex-col items-start mt-2 max-w-[250px]">
                <img
                  src={service.icon}
                  alt={service.title}
                  className="w-14 h-14 mb-3"
                />
                <h3 className="font-medium text-2xl">{service.title}</h3>
              </div>
            </div>
            <p className="font-normal text-xl">
              We build strong foundations and innovative spaces designed to last
              for generations. Our team combines modern technology with skilled
              craftsmanship to bring every project to life.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
