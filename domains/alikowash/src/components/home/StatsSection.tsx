import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Droplets, Building, Users, Award } from "lucide-react";

const stats = [
  {
    icon: Droplets,
    value: "1500+",
    label: "Water Points Installed",
    description: "Springs, Reservoirs & Systems",
  },
  {
    icon: Building,
    value: "300+",
    label: "Reservoirs Built",
    description: "25m³ to 75m³+ Capacity",
  },
  {
    icon: Users,
    value: "250,000+",
    label: "People Served",
    description: "With Clean Water Access",
  },
  {
    icon: Award,
    value: "40+",
    label: "Years Experience",
    description: "Engineering Excellence",
  },
];

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 bg-secondary water-pattern" ref={ref}>
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Stats of <span className="text-primary">Aliko</span>
            <span className="text-accent">Wash</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our impact in numbers - decades of building sustainable water infrastructure
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="stat-card group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="font-display text-4xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="font-semibold text-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
