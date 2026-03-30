import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Droplets, Settings, Heart, Users, Zap } from "lucide-react";

const pillars = [
  {
    icon: Droplets,
    title: "Safe Sources",
    description: "Spring protection, water quality testing, and contamination prevention for clean & healthy water.",
  },
  {
    icon: Settings,
    title: "Resilient Systems",
    description: "Robust infrastructure built to last, using proven technologies and quality materials.",
  },
  {
    icon: Heart,
    title: "Sanitation & Hygiene",
    description: "Handwashing facilities, sanitation infrastructure, and hygiene education programs.",
  },
  {
    icon: Users,
    title: "Local Capacity & O&M",
    description: "Train operators, build local expertise, WASH Committees, capacity training.",
  },
  {
    icon: Zap,
    title: "Data & Durability",
    description: "Centralized M&E, Community data collection, dashboards for sustainability.",
  },
];

export function PillarsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding water-pattern" ref={ref}>
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-primary text-sm font-medium mb-4">
            Our Approach
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Program Pillars
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            The foundation of sustainable water infrastructure
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-soft">
                <pillar.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
