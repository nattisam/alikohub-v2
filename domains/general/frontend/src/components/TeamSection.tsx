import { motion } from "framer-motion";
import team1 from "@/assets/team-1.png";
import team2 from "@/assets/team-2.png";
import team3 from "@/assets/team-3.png";
import team4 from "@/assets/team-4.png";

const team = [
  { name: "Team Member", role: "Leadership", image: team1 },
  { name: "Team Member", role: "Operations", image: team2 },
  { name: "Team Member", role: "Technology", image: team3 },
  { name: "Team Member", role: "Strategy", image: team4 },
];

export function TeamSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
            Our People
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Meet Our <span className="text-gradient-amber">Team</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            The passionate minds driving AlikoHub's mission forward.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, i) => (
            <motion.div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-primary">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
