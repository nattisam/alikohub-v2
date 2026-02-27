import ServiceBlock from "./ServicesBlock";
import academy from "../assets/Academy.jpg";
import consultancy from "../assets/consultancy.png";
import tech from "../assets/Tech.png";

interface Props {
  academyRef: React.RefObject<HTMLDivElement | null>;
  consultancyRef: React.RefObject<HTMLDivElement | null>;
  techRef: React.RefObject<HTMLDivElement | null>;
  eventsRef: React.RefObject<HTMLDivElement | null>;
}

const Services = ({
  academyRef,
  consultancyRef,
  techRef,
  eventsRef,
}: Props) => {
  const getSubdomainUrl = (subdomain: string) => {
    return `https://${subdomain}.alikohub.com`;
  };

  const navigateToSubdomain = (subdomain: string) => {
    window.open(getSubdomainUrl(subdomain), "_blank");
  };

  return (
    <section className="p-6 bg-[#F5F8F3] font-sans h-fit">
      <div className="flex justify-center">
        <h1 className="text-4xl font-extrabold m-4 md:text-5xl text-center">
          OUR SERVICES INCLUDE
        </h1>
      </div>
      <p className="text-center max-w-[670px] text-[#090914]/45 mx-auto md:text-sm">
        AlikoHub is building Africa’s digital future—uniting education, global
        consultancy, and smart construction tools under one seamless platform.
      </p>

      <div className="px-4 py-8 overflow-hidden space-y-20">
        <ServiceBlock
          title="Aliko Academy"
          description="Aliko Academy offers career-driven courses across Technology, Health, and Engineering/STEM, combining practical skills with industry-relevant tools. From data analytics, cloud computing, and AI to certified healthcare training and hands-on engineering software, the academy prepares learners for real-world success. Inspired by platforms like Udemy and Coursera, Aliko Academy blends structured learning with impact-driven education."
          img={academy}
          reverse
          align="left"
          refProp={academyRef}
          onClick={() => navigateToSubdomain("academy")}
        />

        <ServiceBlock
          title="Aliko Consultancy"
          description="Aliko Consultancy offers personalized, end-to-end support for international students navigating the complexities of university admissions and visa applications. Services include eligibility checks, document preparation, and tailored educational pathways for destinations like Canada, Germany, the USA, Australia, and the UK. AlikoHub also provides document verification, multilingual translation (e.g., Amharic, French), immigration interview prep with mock sessions, and assistance with scholarships and pre-departure orientation."
          img={consultancy}
          align="right"
          refProp={consultancyRef}
          onClick={() => navigateToSubdomain("consultancy")}
        />

        <ServiceBlock
          title="Aliko Construction"
          description="AlikoHub aims to transform the African construction industry through digital innovation that boosts efficiency and sustainability. Tackling issues like manual tracking, contract delays, and poor resource management, it offers tools such as a real-time project management system, digital contract handling, inventory tracking, digital site inspections, and a client portal for transparent updates—streamlining operations and cutting costs across the board."
          img={tech}
          reverse
          align="left"
          refProp={techRef}
          onClick={() => navigateToSubdomain("tech")}
        />

        <ServiceBlock
          title="Aliko Events"
          description="Aliko Consultancy offers personalized, end-to-end support for international students navigating the complexities of university admissions and visa applications. Services include eligibility checks, document preparation, and tailored educational pathways for destinations like Canada, Germany, the USA, Australia, and the UK. AlikoHub also provides document verification, multilingual translation (e.g., Amharic, French), immigration interview prep with mock sessions, and assistance with scholarships and pre-departure orientation—ensuring a smooth transition into global academic environments."
          img={consultancy}
          align="right"
          refProp={eventsRef}
          onClick={() => navigateToSubdomain("events")}
        />
      </div>
    </section>
  );
};

export default Services;
