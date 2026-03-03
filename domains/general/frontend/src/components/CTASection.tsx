import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-border/50 p-12 lg:p-20 text-center"
          style={{ background: "var(--gradient-card)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Glow */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-primary/8 blur-[100px]" />

          <div className="relative">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
              The Ask
            </span>
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              $2M to Transform{" "}
              <span className="text-gradient-amber">50,000 Lives</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              By investing in this program, you contribute to the Africa We Want, one where opportunities find talent, and talent finds opportunities that transform lives.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="group bg-primary px-8 text-primary-foreground shadow-[var(--shadow-amber)] hover:bg-amber-light"
                asChild
              >
                <a href="mailto:info@alikohub.com">
                  Become a Partner
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary" asChild>
                <a href="https://alikohub-pitch.lovable.app/" target="_blank" rel="noopener noreferrer">
                  Review Our Pitch
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
