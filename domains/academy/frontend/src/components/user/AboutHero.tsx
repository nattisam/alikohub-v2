import React from "react";
import { FaChartLine, FaUserTie } from "react-icons/fa";

const AboutHero: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen bg-white overflow-hidden pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-start">
        <div className="w-full md:w-1/2 z-10 text-left relative">
          {/* Decorative element for text */}
          <div
            className="absolute -top-10 -left-10 w-40 h-40 opacity-10 rounded-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, #000000 1px, transparent 1px)",
              backgroundSize: "12px 12px",
            }}
          ></div>
          <h1 className="relative z-10 text-4xl md:text-6xl font-extrabold text-black leading-tight mb-6">
            About Us
          </h1>
          <p className="text-gray-700 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
            Welcome to NavSkills, where your journey to knowledge begins!
            Explore a wide range of expertly curated courses designed to help
            you grow personally and professionally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-3 bg-[#0095DA] text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition-all">
              Get a Proposal
            </button>
            <button className="px-8 py-3 border-2 border-[#BF6622] text-[#BF6622] font-semibold rounded-lg hover:bg-[#BF6622]/10 transition-all">
              Try Now!
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 relative mt-16 md:mt-0 flex justify-center items-start">
          <div className="relative w-72 h-72 md:w-[450px] md:h-[450px] rounded-full bg-gradient-to-br from-[#0095DA]/20 via-[#BF6622]/30 to-[#0095DA]/40 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-dashed border-[#0095DA] rounded-full scale-110"></div>
            <img
              src="/student.png"
              alt="Student"
              className="absolute bottom-0 h-[120%] w-auto object-contain z-20 pointer-events-none"
            />
          </div>

          <div className="absolute top-20 left-0 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce-slow">
            <div className="p-2 bg-[#0095DA]/20 rounded-lg text-[#0095DA]">
              <FaChartLine size={24} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">1000+</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Students
              </p>
            </div>
          </div>

          <div className="absolute bottom-24 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-xl flex items-center gap-3 animate-float">
            <div className="p-2 bg-[#BF6622]/20 rounded-lg text-[#BF6622]">
              <FaUserTie size={24} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">100+</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Courses
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-8 p-6 rounded-lg bg-white/70 backdrop-blur-md shadow-lg">
          <img src="/healthLogo.jpg" alt="Health" className="h-10 md:h-12" />
          <img src="/stemLogo.jpg" alt="STEM" className="h-10 md:h-12" />
          <img src="/techLogo.jpg" alt="Technology" className="h-10 md:h-12" />
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
