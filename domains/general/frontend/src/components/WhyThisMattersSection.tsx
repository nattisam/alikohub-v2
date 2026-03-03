import { motion } from "framer-motion";
import { Users, Zap, TrendingUp } from "lucide-react";

const reasons = [
  {
    icon: Users,
    title: "Youth Demographics",
    text: "Africa's population exceeds 1.55 billion with 73% under age 35, while youth in North America face growing challenges navigating competitive job markets.",
    bg: "bg-[hsl(210,40%,88%)]",
    textColor: "text-[hsl(210,60%,25%)]",
    iconBg: "bg-[hsl(210,50%,78%)]",
  },
  {
    icon: Zap,
    title: "Systemic Gap, Not Talent Gap",
    text: "Young people are not held back by lack of ambition, but by systems that haven't kept pace. The education-to-employment pipeline needs structural transformation.",
    bg: "bg-[hsl(20,80%,75%)]",
    textColor: "text-[hsl(20,60%,20%)]",
    iconBg: "bg-[hsl(20,70%,65%)]",
  },
  {
    icon: TrendingUp,
    title: "The Opportunity Window",
    text: "With expanding digital connectivity, remote work trends, and growing investment in tech and health, the structural conditions now exist to unlock new trajectories.",
    bg: "bg-[hsl(40,85%,75%)]",
    textColor: "text-[hsl(30,70%,20%)]",
    iconBg: "bg-[hsl(40,75%,65%)]",
  },
];

export function WhyThisMattersSection() {
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
            Strategic Rationale
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Why This <span className="text-gradient-amber">Matters</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Africa stands at a defining moment with the world's youngest population, and the structural conditions now exist to turn that into a global advantage.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-3">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              className={`group rounded-2xl ${reason.bg} p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${reason.iconBg}`}>
                <reason.icon className={`h-7 w-7 ${reason.textColor}`} />
              </div>
              <h3 className={`font-heading text-xl font-bold ${reason.textColor}`}>{reason.title}</h3>
              <p className={`mt-3 text-sm leading-relaxed ${reason.textColor} opacity-75`}>{reason.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
