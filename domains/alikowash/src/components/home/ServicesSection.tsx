import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Droplets, Building2, Shield, Wrench, ChevronRight } from "lucide-react";

const services = [
  {
    icon: Droplets,
    title: "Gravity Water Systems",
    description: "Sustainable gravity-fed water systems that harness natural water sources to deliver clean water to communities without electricity.",
    features: ["Spring-fed systems", "Natural pressure utilization", "Low maintenance"],
  },
  {
    icon: Building2,
    title: "Reservoir Construction",
    description: "Custom-built water storage reservoirs from 25m³ to 75m³+ capacity for hospitals, schools, and communities.",
    features: ["Underground & above-ground", "Reinforced concrete", "Long-lasting durability"],
  },
  {
    icon: Shield,
    title: "Spring Protection",
    description: "Professional spring capping and protection to preserve water quality and prevent contamination at the source.",
    features: ["Source preservation", "Water quality protection", "Community training"],
  },
  {
    icon: Wrench,
    title: "Public Water Points",
    description: "Design and installation of accessible public water points and distribution networks for communities.",
    features: ["Multiple tap stands", "Strategic placement", "Easy access design"],
  },
];

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding" ref={ref}>
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-primary text-sm font-medium mb-4">
            What We Do
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Delivering proven water systems and formalized WASH consulting built on generations of field experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-card rounded-2xl p-8 shadow-card card-hover border border-border/50"
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full bg-secondary/50 -z-10" />
              
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {service.title}
              </h3>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {service.description}
              </p>
              
              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link 
                to="/services" 
                className="inline-flex items-center gap-1 text-primary font-medium text-sm hover:gap-2 transition-all"
              >
                Learn more <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Button variant="default" size="lg" asChild>
            <Link to="/services">
              View All Services
              <ChevronRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
