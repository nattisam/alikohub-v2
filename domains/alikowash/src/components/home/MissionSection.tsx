import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Target, Eye, Heart } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Mission",
    description: "To provide sustainable WASH infrastructure that communities can operate for generations, improving public health and quality of life.",
  },
  {
    icon: Eye,
    title: "Vision",
    description: "A world where every person has access to clean water, sanitation, and proper hygiene facilities.",
  },
  {
    icon: Heart,
    title: "Values",
    description: "Integrity • Safety • Community • Innovation • Reliability • Results",
  },
];

export function MissionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding" ref={ref}>
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-primary text-sm font-medium mb-4">
              Our Legacy
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              In honor of our father's
              <br />
              <span className="text-primary">40+ years of service</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              We build life-saving water, sanitation, and hygiene systems that 
              communities can operate for generations. Our work continues the 
              legacy of Birassa Aliko, who dedicated his life to bringing clean 
              water to Ethiopian communities.
            </p>
            <Link 
              to="/about"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Learn our story →
            </Link>
          </motion.div>

          {/* Values Cards */}
          <div className="space-y-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4 p-6 bg-card rounded-2xl shadow-card card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-1">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
