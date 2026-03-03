import { motion } from "framer-motion";
import { Landmark, Globe2 } from "lucide-react";

const alignments = [
  {
    icon: Landmark,
    badge: "2063",
    title: "AU Agenda 2063",
    subtitle: "The Africa We Want",
    text: "Direct contribution to Aspirations 1, 2, and 6, focusing on prosperity, integration, and people-driven development with youth at the center.",
  },
  {
    icon: Globe2,
    badge: "SDGs",
    title: "UN Sustainable Development Goals",
    subtitle: "Global Framework Alignment",
    text: "Fully aligned with SDGs 3, 4, 5, 8, 9, 13, and 17, strengthening institutional capacity and building sustainable partnerships.",
    sdgs: [3, 4, 5, 8, 9, 13, 17],
  },
];

export function PolicyAlignmentSection() {
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
            Policy Alignment
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Aligned with Continental &amp; <span className="text-gradient-amber">Global Frameworks</span>
          </h2>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {alignments.map((item, i) => (
            <motion.div
              key={item.title}
              className="group rounded-2xl border border-border/50 p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)]"
              style={{ background: "var(--gradient-card)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
                  {item.badge}
                </div>
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground">{item.title}</h3>
              <p className="mt-1 text-sm font-medium text-primary">{item.subtitle}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              {item.sdgs && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.sdgs.map((sdg) => (
                    <span
                      key={sdg}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary"
                    >
                      {sdg}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
