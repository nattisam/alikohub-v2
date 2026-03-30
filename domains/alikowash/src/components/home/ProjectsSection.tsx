import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ChevronRight, Droplets, Sparkles } from "lucide-react";

// Project images
import airaProject from "@/assets/projects/aira-hospital-reservoir.jpg";
import guriProject from "@/assets/projects/guri-mariam-reservoir.jpg";
import jarsoProject from "@/assets/projects/jarso-reservoir.jpg";
import dambiProject from "@/assets/projects/dambi-dollo-school.jpg";
import dankaProject from "@/assets/projects/danka-reservoir.jpg";
import wachuProject from "@/assets/projects/wachu-spring.jpg";
import taborSpring from "@/assets/projects/tabor-spring-1.jpg";

// Story images (higher quality for specific projects)
import galanoSchool from "@/assets/stories/galano-school.jpg";
import galano5 from "@/assets/stories/galano-5.jpg";
import airaHospital1 from "@/assets/stories/aira-hospital-1.jpg";
import gabaRobii1 from "@/assets/stories/gaba-robii-1.jpg";
import gabaRobii3 from "@/assets/stories/gaba-robii-3.jpg";
import danka1 from "@/assets/stories/danka-1.jpg";
import danka5 from "@/assets/stories/danka-5.jpg";

// All projects sorted by year (oldest to newest)
const projects = [
  {
    title: "Galano Water Project",
    location: "Galano, Ethiopia",
    year: "1995",
    capacity: "Historic",
    image: galanoSchool,
    description: "The foundational chapter of our WASH journey, starting with Galano Primary School.",
    impact: "Foundation Project",
  },
  {
    title: "Galano Public Water Points",
    location: "Galano, Ethiopia",
    year: "1995",
    capacity: "Community",
    image: galano5,
    description: "Extended community water access serving generations of the Galano community.",
    impact: "Multi-generational",
  },
  {
    title: "Aira General Hospital System",
    location: "Aira, Ethiopia",
    year: "2016",
    capacity: "75m³",
    image: airaProject,
    description: "Complete gravity-fed water system with underground reservoir and spring protection.",
    impact: "5,000+ beneficiaries",
  },
  {
    title: "Guri Mariam Gravity System",
    location: "Guri Mariam, Ethiopia",
    year: "2016",
    capacity: "50m³",
    image: guriProject,
    description: "Community water project featuring a 50m³ reservoir with public water points.",
    impact: "3,000+ beneficiaries",
  },
  {
    title: "Jarso Gravity Water System",
    location: "Jarso, Ethiopia",
    year: "2016",
    capacity: "30m³",
    image: jarsoProject,
    description: "Gravity water system with spring protection and multiple public water points.",
    impact: "2,500+ beneficiaries",
  },
  {
    title: "Wachu Protected Spring",
    location: "Wachu, Ethiopia",
    year: "2016",
    capacity: "Spring",
    image: wachuProject,
    description: "Professional spring protection preserving water quality for community access.",
    impact: "1,800+ beneficiaries",
  },
  {
    title: "Gaba Robii Project",
    location: "Gaba Robii, Ethiopia",
    year: "2019",
    capacity: "COVID Era",
    image: gabaRobii1,
    description: "Resilience during the pandemic, providing clean water in challenging times.",
    impact: "2,000+ beneficiaries",
  },
  {
    title: "Gaba Robii Community Access",
    location: "Gaba Robii, Ethiopia",
    year: "2019",
    capacity: "Community",
    image: gabaRobii3,
    description: "Extended water infrastructure serving the broader Gaba Robii community.",
    impact: "Community-wide",
  },
  {
    title: "Tabor Spring Protection",
    location: "Tabor, Ethiopia",
    year: "2023",
    capacity: "Spring",
    image: taborSpring,
    description: "Protected spring water source with concrete structure and multiple distribution points.",
    impact: "Community-wide",
  },
  {
    title: "Aira Hospital WASH Project",
    location: "Aira, Ethiopia",
    year: "2024",
    capacity: "Hospital",
    image: airaHospital1,
    description: "Healthcare WASH services for patient care, hygiene, and medical operations.",
    impact: "Healthcare facility",
  },
  {
    title: "Danka WASH Project",
    location: "Danka, Ethiopia",
    year: "2025",
    capacity: "25m³",
    image: danka1,
    description: "Partnership with Catholic Diocese Stockholm, Daughters of Charity & WEFTA.",
    impact: "4,000+ beneficiaries",
  },
  {
    title: "Danka Community Center",
    location: "Danka, Ethiopia",
    year: "2025",
    capacity: "Institutional",
    image: danka5,
    description: "Girls' hostel, women development center with reservoir and handwashing facilities.",
    impact: "Women & children",
  },
  {
    title: "Dambi Dollo Mako Bili School",
    location: "Dambi Dollo, Ethiopia",
    year: "2025",
    capacity: "School",
    image: dambiProject,
    description: "School water point installation by Daughters of Charity.",
    impact: "1,200+ students",
  },
];

// Sort projects by year ascending
const sortedProjects = [...projects].sort((a, b) => parseInt(a.year) - parseInt(b.year));

export function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-primary overflow-hidden relative" ref={ref}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl" />
        <Droplets className="absolute top-32 right-20 w-8 h-8 text-primary-foreground/10 animate-float" />
        <Sparkles className="absolute bottom-40 left-20 w-6 h-6 text-accent/20 animate-float delay-300" />
      </div>

      <div className="container-main relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium mb-4 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              Our Impact
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Featured Spotlights
            </h2>
            <p className="text-primary-foreground/80 max-w-xl text-lg">
              Real projects making real impact across Ethiopia
            </p>
          </div>
          <Button variant="hero-outline" size="lg" asChild className="group">
            <Link to="/projects">
              View All Projects
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>

        {/* Sliding Projects Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-primary to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-primary to-transparent z-10 pointer-events-none" />
          
          <div className="flex animate-slide-projects gap-6 w-max">
            {/* First set */}
            {sortedProjects.map((project) => (
              <div
                key={project.title}
                className="flex-shrink-0 w-80 group"
              >
                <div className="bg-card/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-elevated transition-all duration-500 hover:shadow-glow hover:-translate-y-2 border border-primary-foreground/10">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold shadow-lg">
                      {project.capacity}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-primary text-xs font-semibold">
                        <Droplets className="w-3 h-3" />
                        {project.impact}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-display text-base font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary" />
                        {project.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-accent" />
                        {project.year}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {sortedProjects.map((project) => (
              <div
                key={`${project.title}-dup`}
                className="flex-shrink-0 w-80 group"
              >
                <div className="bg-card/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-elevated transition-all duration-500 hover:shadow-glow hover:-translate-y-2 border border-primary-foreground/10">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold shadow-lg">
                      {project.capacity}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-primary text-xs font-semibold">
                        <Droplets className="w-3 h-3" />
                        {project.impact}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-display text-base font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary" />
                        {project.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-accent" />
                        {project.year}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
