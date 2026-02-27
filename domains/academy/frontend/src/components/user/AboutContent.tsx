import React from "react";
import { FaPlay, FaPhoneAlt } from "react-icons/fa";
import heroBg from "../../assets/coursehero1.jpg";

const AboutContent: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white w-full">
      <div className="container mx-auto px-6">
        <div className="overflow-hidden rounded-2xl relative bg-gradient-to-br from-[#17469E] to-[#0d3470] shadow-2xl">
          <div className="flex flex-col md:flex-row items-stretch min-h-[450px]">
            {/* Left Side: Image container with overlay */}
            <div className="w-full md:w-[45%] relative min-h-[350px] md:min-h-full overflow-hidden">
              <img
                src={heroBg}
                alt="Providing Online Courses"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              {/* Subtle gradient overlay for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#17469E]/20 to-transparent"></div>
            </div>

            {/* Right Side: Content */}
            <div className="w-full md:w-[55%] flex flex-col justify-center p-8 md:p-12 lg:p-16 text-left">
              <div className="inline-block px-3 py-1 bg-white/10 text-white/90 text-xs font-semibold rounded-full uppercase tracking-wider mb-4 w-fit">
                Our Mission
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                Providing Amazing <br />
                <span className="text-[#F0802D]">Online Courses</span>
              </h2>

              <p className="text-gray-200 text-base md:text-lg max-w-md leading-relaxed mb-8">
                At AlikoHub Academy, we are committed to empowering learners
                worldwide by providing a curated selection of courses that
                enhance both personal and professional growth.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button className="flex items-center gap-3 px-6 py-3 bg-[#F0802D] text-white font-semibold rounded-lg hover:bg-[#d97326] transition-all transform hover:scale-105 shadow-lg">
                  <div className="bg-white/20 p-1.5 rounded-full">
                    <FaPlay className="text-[10px]" />
                  </div>
                  Watch Video
                </button>

                <button className="flex items-center gap-3 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm">
                  <FaPhoneAlt className="text-[#F0802D]" />
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContent;
