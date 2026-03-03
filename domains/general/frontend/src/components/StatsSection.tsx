import { motion } from "framer-motion";
import { BookOpen, Globe, Building2, Users } from "lucide-react";

const stats = [
  { label: "Youth Targeted", value: "50,000", icon: Users },
  { label: "Employment Rate", value: "75 to 85%", icon: BookOpen },
  { label: "Female Participation", value: "45%+", icon: Globe },
  { label: "Regional Hubs", value: "10", icon: Building2 },
];

export function StatsSection() {
  return (
    <section id="impact" className="py-16 lg:py-20">
      <div className="container mx-auto px-6">
        <motion.div
          className="mx-auto mb-10 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Measurable <span className="text-gradient-amber">Impact</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-primary/30"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-heading text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
