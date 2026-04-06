import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { MapPin, Calendar, Droplets, Loader2 } from "lucide-react";
import { useProjects } from "@/hooks/useWash";

const Projects = () => {
  const { data: projects, isLoading, error } = useProjects();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary via-primary to-water-dark overflow-hidden">
        <div className="container-main relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium mb-6">
              Our Work
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Our <span className="text-accent">Projects</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              Real infrastructure making real impact. Explore our portfolio of
              completed WASH projects across Ethiopia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding min-h-[400px]">
        <div className="container-main">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive font-semibold">
                Failed to load projects
              </p>
              <p className="text-muted-foreground mt-2">
                Please try again later.
              </p>
            </div>
          ) : !projects || projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No projects found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects
                .filter((p: any) => p.is_published !== false)
                .map((project: any, index: number) => (
                  <motion.div
                    key={project.id || project.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-card rounded-2xl overflow-hidden shadow-card card-hover"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {project.photos && project.photos[0] ? (
                        <img
                          src={project.photos[0]}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-primary/5">
                          <Droplets className="w-12 h-12 opacity-20" />
                        </div>
                      )}

                      {project.capacity_m3 && (
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                          {project.capacity_m3}m³
                        </div>
                      )}

                      {project.partner_names && project.partner_names[0] && (
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                          {project.partner_names[0]}
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                        {project.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {project.location}
                          </span>
                        )}
                        {project.year_gc && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {project.year_gc}
                          </span>
                        )}
                        {project.system_type && (
                          <span className="flex items-center gap-1">
                            <Droplets className="w-3 h-3" />
                            {project.system_type}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-lg font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>

                      {project.summary && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {project.summary}
                        </p>
                      )}

                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {project.tags.slice(0, 3).map((tag: string) => (
                            <span
                              key={tag}
                              className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-[10px] font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="px-2 py-1 rounded-md bg-secondary text-muted-foreground text-[10px]">
                              +{project.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
