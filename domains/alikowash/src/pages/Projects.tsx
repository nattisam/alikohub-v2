import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { MapPin, Calendar, Droplets, Ruler } from "lucide-react";

import airaProject from "@/assets/projects/aira-hospital-reservoir.jpg";
import guriProject from "@/assets/projects/guri-mariam-reservoir.jpg";
import jarsoProject from "@/assets/projects/jarso-reservoir.jpg";
import dankaProject from "@/assets/projects/danka-reservoir.jpg";
import dambiProject from "@/assets/projects/dambi-dollo-school.jpg";
import wachuProject from "@/assets/projects/wachu-spring.jpg";
import gulossoIrrigation from "@/assets/projects/gulosso-irrigation.jpg";
import daleSadiIrrigation from "@/assets/projects/dale-sadi-irrigation.jpg";
import ambalaIrrigation from "@/assets/projects/ambala-irrigation.jpg";
import botossoIrrigation from "@/assets/projects/botosso-irrigation.jpg";
import taborSpring from "@/assets/projects/tabor-spring-1.jpg";

const projects = [
  {
    title: "Aira General Hospital Gravity Water System",
    location: "Aira, Ethiopia",
    year: "2016",
    capacity: "75m³",
    systemType: "Gravity Water System",
    category: "WASH",
    image: airaProject,
    description: "Complete gravity-fed water system with underground reservoir, spring protection, hospital compound water points, and public water access. This project serves the entire hospital complex and surrounding community.",
    components: ["75m³ Underground Reservoir", "Spring Protection", "Hospital Water Points", "Public Water Points", "Main Line Connections"],
  },
  {
    title: "Guri Mariam Gravity Water System",
    location: "Guri Mariam, Ethiopia",
    year: "2016",
    capacity: "50m³",
    systemType: "Gravity Water System",
    category: "WASH",
    image: guriProject,
    description: "Community water project featuring a 50m³ reservoir with multiple public water points, pump stations, and spring protection. Serving the Guri Mariam community with reliable clean water access.",
    components: ["50m³ Reservoir", "Public Water Points", "Water Pump Points", "Spring Protection"],
  },
  {
    title: "Jarso Gravity Water System",
    location: "Jarso, Ethiopia",
    year: "2016",
    capacity: "30m³",
    systemType: "Gravity Water System",
    category: "WASH",
    image: jarsoProject,
    description: "Gravity water system with spring protection and multiple public water points designed for community access throughout the Jarso area.",
    components: ["30m³ Reservoir", "Spring Protection", "Public Water Points"],
  },
  {
    title: "Danka Daughters of Charity Complex",
    location: "Danka, Ethiopia",
    year: "2025",
    capacity: "25m³",
    systemType: "Institutional Water System",
    category: "WASH",
    image: dankaProject,
    partner: "Daughters of Charity",
    description: "Comprehensive water and sanitation system for the Daughters of Charity complex including girls' hostel, women development center, with reservoir, water points, and handwashing facilities.",
    components: ["25m³ Reservoir", "Girls Hostel Water Points", "Handwashing Basins", "Main Line Connections", "Women Development Center"],
  },
  {
    title: "Dambi Dollo Mako Bili School",
    location: "Dambi Dollo, Ethiopia",
    year: "2025",
    capacity: "School System",
    systemType: "School Water System",
    category: "WASH",
    image: dambiProject,
    partner: "Daughters of Charity",
    description: "School water point installation providing clean water access to students and staff at Mako Bili School in Dambi Dollo.",
    components: ["School Water Points", "Sanitation Facilities"],
  },
  {
    title: "Wachu Spring Protection",
    location: "Wachu, Ethiopia",
    year: "2016",
    capacity: "Spring System",
    systemType: "Spring Protection",
    category: "WASH",
    image: wachuProject,
    description: "Professional spring protection and capping project to preserve water quality and provide community access through protected water points.",
    components: ["Spring Protection", "Water Points"],
  },
  {
    title: "Gulosso Irrigation Water System",
    location: "Gulosso, Ethiopia",
    year: "2020",
    capacity: "10 km",
    systemType: "Irrigation System",
    category: "Irrigation",
    image: gulossoIrrigation,
    description: "Large-scale irrigation water system spanning 10 kilometers, providing agricultural water access to farmland in the Gulosso area for improved crop production.",
    components: ["10km Canal System", "Distribution Channels", "Water Control Structures"],
  },
  {
    title: "Dale Sadi Irrigation Water System",
    location: "Dale Sadi, Ethiopia",
    year: "2021",
    capacity: "5 km",
    systemType: "Irrigation System",
    category: "Irrigation",
    image: daleSadiIrrigation,
    description: "5-kilometer irrigation system serving the Dale Sadi farming community with reliable water distribution for agricultural use.",
    components: ["5km Canal System", "Farm Outlets", "Water Management"],
  },
  {
    title: "Ambala Irrigation Water System",
    location: "Ambala, Ethiopia",
    year: "2022",
    capacity: "7 km",
    systemType: "Irrigation System",
    category: "Irrigation",
    image: ambalaIrrigation,
    description: "7-kilometer irrigation infrastructure supporting agricultural development in the Ambala region with efficient water distribution to farmlands.",
    components: ["7km Canal System", "Distribution Network", "Irrigation Points"],
  },
  {
    title: "Botosso Irrigation Water System",
    location: "Botosso, Ethiopia",
    year: "2023",
    capacity: "6 km",
    systemType: "Irrigation System",
    category: "Irrigation",
    image: botossoIrrigation,
    description: "6-kilometer irrigation system providing water for agricultural production in the Botosso area, supporting local farmers with modern irrigation infrastructure.",
    components: ["6km Pipeline System", "Irrigation Channels", "Distribution Points"],
  },
  {
    title: "Tabor Spring Protection",
    location: "Tabor, Ethiopia",
    year: "2023",
    capacity: "Spring System",
    systemType: "Spring Protection",
    category: "WASH",
    image: taborSpring,
    description: "Protected spring water source providing clean and safe water access for the Tabor community with concrete structure and multiple distribution points.",
    components: ["Spring Protection", "Distribution Points", "Community Access"],
  },
];

const Projects = () => {
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
      <section className="section-padding">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card rounded-2xl overflow-hidden shadow-card card-hover"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                    {project.capacity}
                  </div>
                  {project.partner && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      {project.partner}
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {project.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {project.year}
                    </span>
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3 h-3" />
                      {project.systemType}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-foreground mb-3">
                    {project.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.components.slice(0, 3).map((component) => (
                      <span
                        key={component}
                        className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs"
                      >
                        {component}
                      </span>
                    ))}
                    {project.components.length > 3 && (
                      <span className="px-2 py-1 rounded-md bg-secondary text-muted-foreground text-xs">
                        +{project.components.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
