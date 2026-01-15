import { useEffect, useState } from "react";
import gathering from "../assets/gathering.png";
import mobileBG from "../assets/hero-mobile-bg.png";
const Hero = ({
  title = "Connecting Africa to Global Opportunities Through Impactful Events",
  buttonText = "View Upcoming Events",
}) => {
  const [winWidth, setWinWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resetWidthState = () => {
      setWinWidth(window.innerWidth);
    };
    window.addEventListener("resize", resetWidthState);
    return () => {
      window.removeEventListener("resize", resetWidthState);
    };
  });
  return (
    <section
      className="relative bg-cover bg-center h-[90vh] md:h-[100vh] w-full -top-25 flex items-center justify-center"
      style={{
        backgroundImage: `url(${winWidth > 768 ? gathering : mobileBG})`,
      }}
    >
      <div className="text-center px-4 md:px-18 flex flex-col items-start">
        <h1 className="text-4xl md:text-4xl text-left font-bold mb-4 md:w-3/5">
          {title}
        </h1>
        <button className="bg-gradient-to-r from-[#E6D600] to-[#F2F296] text-black px-3 md:px-6 py-2 md:py-3 rounded hover:scale-105 transition">
          {buttonText}
        </button>
      </div>
    </section>
  );
};

export default Hero;
