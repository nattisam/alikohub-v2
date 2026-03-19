import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroSoftwareEngineering from "@/assets/categories/technology/hero-software-engineering.jpg";
import heroDataAnalytics from "@/assets/categories/technology/hero-data-analytics.jpg";
import heroAiMl from "@/assets/categories/technology/hero-ai-ml.jpg";
import heroCloudEngineering from "@/assets/categories/technology/hero-cloud-engineering.jpg";
import heroCybersecurity from "@/assets/categories/technology/hero-cybersecurity.jpg";
import heroLowcode from "@/assets/categories/technology/hero-lowcode.jpg";

const domains = [
  {
    title: "Software Engineering",
    image: heroSoftwareEngineering,
    href: "/technology/programs?category=Software+Engineering",
    accent: "from-aliko-orange/80 to-aliko-orange/40",
    hoverBorder: "hover:ring-aliko-orange/60",
  },
  {
    title: "Data & Analytics",
    image: heroDataAnalytics,
    href: "/technology/programs?category=Data+%26+Analytics",
    accent: "from-aliko-blue/80 to-aliko-blue/40",
    hoverBorder: "hover:ring-aliko-blue/60",
  },
  {
    title: "AI & Machine Learning",
    image: heroAiMl,
    href: "/technology/programs?category=AI+%26+Machine+Learning",
    accent: "from-aliko-blue/80 to-aliko-blue/40",
    hoverBorder: "hover:ring-aliko-blue/60",
  },
  {
    title: "Cloud & DevOps",
    image: heroCloudEngineering,
    href: "/technology/programs?category=Cloud+%26+DevOps",
    accent: "from-aliko-blue/80 to-aliko-orange/40",
    hoverBorder: "hover:ring-aliko-blue/60",
  },
  {
    title: "Low-Code & Business Apps",
    image: heroLowcode,
    href: "/technology/programs?category=Low-Code+%26+Business+Apps",
    accent: "from-aliko-orange/80 to-aliko-blue/40",
    hoverBorder: "hover:ring-aliko-orange/60",
  },
  {
    title: "Cybersecurity",
    image: heroCybersecurity,
    href: "/technology/programs?category=Cybersecurity",
    accent: "from-aliko-charcoal/80 to-aliko-orange/40",
    hoverBorder: "hover:ring-aliko-orange/60",
  },
];

const DomainCards = () => {
  return (
    <section className="section-padding bg-gradient-to-b from-[hsl(207,45%,16%)] to-[hsl(207,50%,12%)] relative">
      <div className="container-padding mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <p className="text-sm font-bold text-secondary uppercase tracking-widest mb-4">
            Explore Domains
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Choose Your Path
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Six in-demand tech domains — each with career tracks and short
            courses to get you job-ready.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {domains.map((domain) => (
            <Link
              key={domain.title}
              to={domain.href}
              className={`group relative rounded-2xl overflow-hidden aspect-[4/3] ring-2 ring-transparent ${domain.hoverBorder} transition-all duration-500`}
            >
              <img
                src={domain.image}
                alt={domain.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${domain.accent} via-black/50 to-black/20`}
              />
              <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white leading-tight mb-2">
                  {domain.title}
                </h3>
                <span className="inline-flex items-center text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                  Explore
                  <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DomainCards;
