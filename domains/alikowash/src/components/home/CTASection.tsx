import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Droplets } from "lucide-react";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20" ref={ref}>
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-water-dark p-12 md:p-16 text-center"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border-4 border-primary-foreground rounded-full" />
            <div className="absolute bottom-10 right-10 w-48 h-48 border-4 border-primary-foreground rounded-full" />
            <div className="absolute top-1/2 left-1/4 w-24 h-24 border-4 border-primary-foreground rounded-full" />
          </div>

          {/* Water Drop Animation */}
          <motion.div
            className="absolute top-4 right-8"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Droplets className="w-16 h-16 text-primary-foreground/20" />
          </motion.div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Make an Impact?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
              Partner with us to bring clean water to communities in need. 
              Every contribution helps build sustainable infrastructure that 
              lasts for generations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="accent" size="xl" asChild>
                <Link to="/partners">
                  Partner With Us
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
