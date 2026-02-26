import React from "react";
import { ChevronRight, Play } from "lucide-react";

import stemHero from "/stemHero.jpg";
import techHero from "/techLogo.jpg";
import healthHero from "/healthLogo.jpg";

interface CategoryHeroProps {
  category: "STEM" | "Technology" | "Health";
  title?: string;
  description?: string;
  image?: string;
}

const CategoryHero: React.FC<CategoryHeroProps> = ({
  category,
  title,
  description,
  image,
}) => {
  const defaultImages = {
    STEM: stemHero,
    Technology: techHero,
    Health: healthHero,
  };

  const heroImage = image || defaultImages[category];

  const brandColors = {
    STEM: {
      accent: "text-[#3B82F6]",
      btn: "bg-[#3B82F6] hover:bg-[#2563EB]",
    },
    Technology: {
      accent: "text-[#F0802D]",
      btn: "bg-[#F0802D] hover:bg-[#d97328]",
    },
    Health: {
      accent: "text-[#00A89E]",
      btn: "bg-[#00A89E] hover:bg-[#008c83]",
    },
  };

  const currentBrand = brandColors[category] || brandColors.STEM;

  return (
    <div className="flex flex-col w-full font-sans overflow-x-hidden">
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />

        <div className="absolute inset-0 bg-black/70" />

        <div className="container mx-auto px-4 md:px-8 relative z-20">
          <div className="max-w-4xl space-y-6">
            <div className="inline-block px-4 py-2 bg-white/5 text-white text-xs font-semibold rounded-full uppercase tracking-wider border border-white/10 backdrop-blur-md">
              Cohort-Based Learning · Now Enrolling
            </div>

            <h1 className="text-3xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              {title || `Master ${category} with`} <br />
              <span className={currentBrand.accent}>Industry-Standard</span>
              <br />
              Certification
            </h1>

            <p className="text-gray-200 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
              {description ||
                `Join a cohort-based learning experience designed for high-stakes career paths. Build portfolio-ready projects validated by industry experts.`}
            </p>

            <div className="flex flex-wrap gap-4 pt-6">
              <button
                className={`flex items-center gap-3 px-8 py-4 rounded-lg ${currentBrand.btn} text-white font-bold text-sm uppercase tracking-wider transition-all active:scale-95 shadow-xl`}
              >
                Explore Programs
                <ChevronRight size={18} />
              </button>

              <button className="flex items-center gap-3 px-8 py-4 rounded-lg bg-white/10 text-white font-bold text-sm uppercase tracking-wider border border-white/20 hover:bg-white/20 transition-all backdrop-blur-md">
                <Play size={16} fill="currentColor" />
                Watch Preview
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryHero;
