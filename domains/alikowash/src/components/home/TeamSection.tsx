import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Linkedin, Mail, Loader2 } from "lucide-react";
import { useTeam } from "@/hooks/useWash";

// Keep static imports for fallback if needed, but we'll primarily use API data
import boniAliko from "@/assets/team/boni-aliko.png";
import birassaAliko from "@/assets/team/birassa-aliko.png";
import abdiBirassa from "@/assets/team/abdi-birassa.png";
import biniyamBirassa from "@/assets/team/biniyam-birassa.png";
import natnaelTariku from "@/assets/team/natnael-tariku.png";
import bonsaBirassa from "@/assets/team/bonsa-birassa.jpg";
import lensaAliko from "@/assets/team/lensa-aliko.png";
import baatiAliko from "@/assets/team/baati-aliko.png";

const staticTeam = [
  {
    name: "Boni Aliko, PMP",
    role: "Co-Founder & CEO",
    image: boniAliko,
    description:
      "Leading Aliko Wash with a vision for sustainable water access across Ethiopia.",
  },
  {
    name: "Birassa Aliko",
    role: "Co-Founder & COO",
    image: birassaAliko,
    description:
      "40+ years of water engineering expertise, continuing our father's legacy.",
  },
  {
    name: "Abdi Birassa",
    role: "CTO",
    image: abdiBirassa,
    description:
      "Driving technological innovation in water infrastructure solutions.",
  },
  {
    name: "Biniyam Birassa",
    role: "Program Director",
    image: biniyamBirassa,
    description:
      "Overseeing project implementation and community engagement programs.",
  },
  {
    name: "Natnael Tariku",
    role: "Senior Project Engineer",
    image: natnaelTariku,
    description:
      "Engineering excellence in reservoir and water system construction.",
  },
  {
    name: "Bonsa Birassa",
    role: "Marketing Manager",
    image: bonsaBirassa,
    description:
      "Building partnerships and expanding Aliko Wash's reach and impact.",
  },
  {
    name: "Lensa Aliko",
    role: "MPH Candidate, Johns Hopkins",
    image: lensaAliko,
    description:
      "Sanitation and Hygiene Advisor bringing public health expertise to our programs.",
  },
  {
    name: "Baati Aliko",
    role: "Director of Strategic Partnerships & Development",
    image: baatiAliko,
    description:
      "Driving strategic partnerships and development initiatives to expand our impact.",
  },
];

export function TeamSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: apiTeam, isLoading } = useTeam();

  // Use API data if available, otherwise use static data as fallback
  const team = apiTeam && apiTeam.length > 0 ? apiTeam : staticTeam;

  return (
    <section className="section-padding bg-secondary/50" ref={ref}>
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Leadership
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Meet the Team
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A dedicated team committed to bringing clean water to communities
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-card rounded-2xl overflow-hidden shadow-card card-hover"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={member.imageUrl || member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Social Links on Hover */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                      href={member.linkedin || "#"}
                      className="w-10 h-10 rounded-lg bg-background/90 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href={member.email ? `mailto:${member.email}` : "#"}
                      className="w-10 h-10 rounded-lg bg-background/90 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium text-sm mb-2">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {member.bio || member.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
