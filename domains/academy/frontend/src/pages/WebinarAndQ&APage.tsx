import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import LiveWebinars from "../components/LiveWebinars";
import UpcomingWebinars from "../components/UpcomingWebinars";
import QandASection from "../components/QandASection";
import CertificationsSection from "../components/CertificationsSection";

const WebinarPage = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Hero>
        <div className="flex flex-col md:pl-10 lg:pl-20 translate-x-8">
          <h1
            className="text-xl sm:text-2xl md:text-5xl font-bold text-center text-white  lg:text-[#1C1800]"
            style={{ textShadow: "2px 2px 4px gray", letterSpacing: "1px" }}
          >
            Advance your career with expert-led trainings
          </h1>
          <p className="text-[#757575] text-lg text-center font-semibold font-sans">
            Master AWS, Azure, and cloud technologies through interactive
            courses, hands-on labs, and live webinars with industry experts.
          </p>
        </div>
      </Hero>
     <div className="bg-[#f5f8f2] -mt-20 pt-15">
      <LiveWebinars />
      <UpcomingWebinars />
      <QandASection />
      <CertificationsSection />
      </div>
    </>
  );
};
export default WebinarPage;