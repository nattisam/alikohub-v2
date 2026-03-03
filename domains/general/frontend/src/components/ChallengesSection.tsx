import { motion } from "framer-motion";
import { GraduationCap, MapPin, Users, AlertTriangle, Leaf, Briefcase } from "lucide-react";

const challenges = [
  {
    icon: GraduationCap,
    title: "Education–Labor Market Disconnect",
    summary: "Young people often graduate with credentials but without practical experience.",
  },
  {
    icon: MapPin,
    title: "Unequal Access to Quality Education",
    summary: "Opportunity is concentrated in urban centers, excluding rural youth.",
  },
  {
    icon: Users,
    title: "Gender Inequality in STEM & Innovation",
    summary: "Young women remain underrepresented in technology and innovation leadership.",
  },
  {
    icon: AlertTriangle,
    title: "Fragmented Innovation Ecosystems",
    summary: "Support systems for mentorship, financing, research, and scaling are disconnected.",
  },
  {
    icon: Leaf,
    title: "Limited One Health & Climate Integration",
    summary: "Health and climate challenges are addressed in isolation.",
  },
  {
    icon: Briefcase,
    title: "Youth Unemployment & Underemployment",
    summary: "Effort does not translate into opportunity for many young people.",
  },
];

function ChallengeCard({ challenge, index }: { challenge: typeof challenges[0]; index: number }) {
  return (
    <motion.div
      className="rounded-2xl border border-primary/20 bg-primary/5 p-6 min-h-[180px] flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
        <challenge.icon className="h-6 w-6" />
      </div>
      <h3 className="font-heading text-lg font-bold text-foreground">
        {challenge.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{challenge.summary}</p>
    </motion.div>
  );
}

export function ChallengesSection() {
  return (
    <section className="py-24 lg:py-32 bg-card/30">
      <div className="container mx-auto px-6">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
            The Challenge
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Systemic Challenges Require{" "}
            <span className="text-gradient-amber">Systemic Solutions</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Young people are not held back by a lack of ambition or talent, but by systems that have not kept pace with their realities.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge, i) => (
            <ChallengeCard key={challenge.title} challenge={challenge} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
