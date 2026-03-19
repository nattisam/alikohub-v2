import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Globe2, HardHat, CalendarDays, Droplets, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import serviceAcademy from "@/assets/service-academy.jpg";
import serviceConsultancy from "@/assets/service-consultancy.png";
import serviceContech from "@/assets/service-contech.png";
import serviceEvents from "@/assets/service-events.jpg";
import serviceAlikowash from "@/assets/service-alikowash.png";

const services = [
  {
    title: "Aliko Academy",
    description:
      "Workforce development and certification pathways aligned with global labor markets.",
    icon: GraduationCap,
    image: serviceAcademy,
    link: "https://academy.alikohub.com/",
    external: true,
  },
  {
    title: "Aliko Consultancy",
    description:
      "Career advisory, professional development, and global mentorship services.",
    icon: Globe2,
    image: serviceConsultancy,
    link: "http://localhost:3007/",
    external: true,
  },
  {
    title: "Aliko Events",
    description:
      "Industry matchmaking, innovation forums, and ecosystem-building engagements.",
    icon: CalendarDays,
    image: serviceEvents,
    link: "https://event.alikohub.com/",
    external: true,
  },
  {
    title: "Aliko Engineering Technology",
    description:
      "Applied engineering, digital infrastructure, and technology-driven solutions.",
    icon: HardHat,
    image: serviceContech,
    link: "https://con-tech.alikohub.com/",
    external: true,
  },
  {
    title: "Aliko WASH",
    description:
      "Water, sanitation, and hygiene solutions driving public health impact and community resilience across Africa.",
    icon: Droplets,
    image: serviceAlikowash,
    link: "https://alikowash.lovable.app/",
    darkOverlay: true,
    external: true,
  },
];

export function ServicesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;
    let scrollSpeed = 1.2; // Increased speed as requested

    const animate = () => {
      if (!isPaused && container) {
        container.scrollLeft += scrollSpeed;
        // Reset scroll when we've scrolled through the duplicated set
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);



  // Duplicate services for infinite scroll effect
  const displayServices = [...services, ...services];

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      // 300px card width + 24px gap = 324px
      scrollRef.current.scrollBy({ left: dir === "left" ? -324 : 324, behavior: "smooth" });
    }
  };

  return (
    <section id="ventures" className="relative py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
            AlikoHub Ventures
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Our <span className="text-amber">Ventures</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Independent operating companies powering the AlikoHub ecosystem and driving sustainable impact across Digital Health, STEM, innovation, and enterprise.
          </p>
        </motion.div>

        <div className="relative group">
          <button onClick={() => { setIsPaused(true); scroll("left"); }} className="absolute -left-5 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-card shadow-md border border-border text-foreground hover:bg-[#E58E3C] hover:text-white hover:border-[#E58E3C] transition-all duration-300" aria-label="Scroll left">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button onClick={() => { setIsPaused(true); scroll("right"); }} className="absolute -right-5 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-card shadow-md border border-border text-foreground hover:bg-[#E58E3C] hover:text-white hover:border-[#E58E3C] transition-all duration-300" aria-label="Scroll right">
            <ChevronRight className="h-6 w-6" />
          </button>
          {/* overflow-hidden wrapper clips the scroll area visually */}
          <div className="overflow-hidden">
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex gap-6 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-none touch-none"
          >
            {displayServices.map((service, i) => (
              <div
                key={`${service.title}-${i}`}
                className="group relative w-[300px] shrink-0 overflow-hidden rounded-2xl border border-border/50 bg-[hsl(45,18%,96%)] dark:bg-card transition-all duration-500 hover:border-primary/30"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 ${(service as any).darkOverlay ? 'bg-gradient-to-t from-white/40 dark:from-card via-white/20 dark:via-card/70 to-transparent' : 'bg-gradient-to-t from-white/30 dark:from-card via-transparent to-transparent'}`} />
                  <div className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 backdrop-blur-sm">
                    <service.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {service.description}
                  </p>
                  {(service as any).external ? (
                    <a
                      href={service.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-110 hover:gap-2"
                    >
                      View Site
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <Link
                      to={service.link}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-110 hover:gap-2"
                    >
                      Learn More
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
