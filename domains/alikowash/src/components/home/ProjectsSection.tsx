import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  ChevronRight,
  Droplets,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useProjects } from "@/hooks/useWash";

export function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: projects, isLoading } = useProjects();

  // Get published projects and sort by year
  const sortedProjects = projects
    ? [...projects]
        .filter((p: any) => p.is_published !== false)
        .sort((a, b) => (parseInt(a.year_gc) || 0) - (parseInt(b.year_gc) || 0))
    : [];

  return (
    <section
      className="section-padding bg-primary overflow-hidden relative"
      ref={ref}
    >
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
          className="relative min-h-[350px]"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-primary-foreground">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="opacity-70">Loading featured projects...</p>
            </div>
          ) : sortedProjects.length === 0 ? (
            <div className="text-center py-20 text-primary-foreground opacity-60">
              <p>Coming soon: Project showcases are being prepared.</p>
            </div>
          ) : (
            <>
              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-primary to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-primary to-transparent z-10 pointer-events-none" />

              <div className="flex animate-slide-projects gap-6 w-max">
                {/* Render the set twice for seamless loop */}
                {[...sortedProjects, ...sortedProjects].map((project, idx) => (
                  <div
                    key={`${project.id}-${idx}`}
                    className="flex-shrink-0 w-80 group"
                  >
                    <div className="bg-card/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-elevated transition-all duration-500 hover:shadow-glow hover:-translate-y-2 border border-primary-foreground/10">
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        {project.photos && project.photos[0] ? (
                          <img
                            src={project.photos[0]}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary/10">
                            <Droplets className="w-12 h-12" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {project.capacity_m3 ? (
                          <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold shadow-lg">
                            {project.capacity_m3}m³
                          </div>
                        ) : (
                          project.year_gc && (
                            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold shadow-lg">
                              {project.year_gc}
                            </div>
                          )
                        )}

                        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-primary text-xs font-semibold">
                            <Droplets className="w-3 h-3" />
                            {project.system_type || "Water System"}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="font-display text-base font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>

                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                          {project.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-primary" />
                              {project.location}
                            </span>
                          )}
                          {project.year_gc && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-accent" />
                              {project.year_gc}
                            </span>
                          )}
                        </div>

                        {project.summary && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.summary}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
