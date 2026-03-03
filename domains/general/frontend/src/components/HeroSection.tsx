import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-student.png";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* Glow effect */}
      <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />

      <div className="container relative mx-auto flex flex-col-reverse items-center gap-12 px-6 py-20 lg:flex-row lg:gap-16 lg:py-28">
        {/* Text */}
        <motion.div
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Sparkles className="h-4 w-4" />
            Youth Empowerment Ecosystem
          </motion.div>

          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
            Honoring Youth Potential Where Opportunity Meets{" "}
            <span className="text-gradient-amber">Dignity</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
            Building Africa's largest youth resourcefulness ecosystem in Digital
            Health, One Health, STEM, and Innovation, reaching 50,000 youth
            across 10 regional hubs.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <Button
              size="lg"
              className="group bg-primary px-8 text-primary-foreground shadow-[var(--shadow-amber)] hover:bg-amber-light"
            >
              Partner With Us
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-secondary"
              onClick={() => {
                document.getElementById("ventures")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Our Ventures
            </Button>
          </div>
        </motion.div>

        {/* Hero image */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative mx-auto max-w-lg">
            {/* Ambient glow behind image */}
            <div className="absolute -inset-8 rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />
            <img
              src={heroImg}
              alt="Happy student representing AlikoHub's mission"
              className="relative z-10 w-full drop-shadow-2xl"
              loading="eager"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
