import { motion } from "framer-motion";
import { GraduationCap, MapPin, Users, AlertTriangle, Leaf, Briefcase, TrendingUp, Globe, Target, Handshake, HeartPulse, Rocket } from "lucide-react";

const challenges = [
  { icon: GraduationCap, title: "Education to Labor Disconnect", summary: "Graduates lack practical experience for job markets.", bg: "bg-[#F6F5F2] dark:bg-primary/5" },
  { icon: MapPin, title: "Unequal Access", summary: "Quality education concentrated in urban centers.", bg: "bg-[#F6F5F2] dark:bg-primary/5" },
  { icon: Users, title: "Gender Gap in STEM", summary: "Women underrepresented in tech and innovation.", bg: "bg-[#F6F5F2] dark:bg-primary/5" },
  { icon: AlertTriangle, title: "Fragmented Ecosystems", summary: "Mentorship, financing, and scaling are disconnected.", bg: "bg-[#F6F5F2] dark:bg-primary/5" },
  { icon: Leaf, title: "Climate and Health Silos", summary: "Health and climate challenges addressed in isolation.", bg: "bg-[#F6F5F2] dark:bg-primary/5" },
  { icon: Briefcase, title: "Youth Unemployment", summary: "Effort doesn't translate into opportunity.", bg: "bg-[#F6F5F2] dark:bg-primary/5" },
];

const responses = [
  { icon: TrendingUp, value: "85%", label: "Employment Rate", desc: "Placement within 12 months", bg: "bg-[#F6F5F2] dark:bg-card" },
  { icon: Globe, value: "10", label: "Regional Hubs", desc: "Distributed innovation centers", bg: "bg-[#F6F5F2] dark:bg-card" },
  { icon: Target, value: "45%+", label: "Female Participation", desc: "Minimum across all programs", bg: "bg-[#F6F5F2] dark:bg-card" },
  { icon: Handshake, value: "15 to 25", label: "Partnerships/yr", desc: "Public-private partnerships", bg: "bg-[#F6F5F2] dark:bg-card" },
  { icon: HeartPulse, value: "100%", label: "SDG Aligned", desc: "Climate & One Health frameworks", bg: "bg-[#F6F5F2] dark:bg-card" },
  { icon: Rocket, value: "50K", label: "Youth Trained", desc: "Over 5 years with job pipelines", bg: "bg-[#F6F5F2] dark:bg-card" },
];

export function ChallengesResponseSection() {
  return (
    <section className="py-24 lg:py-32 bg-white dark:bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          className="mx-auto mb-14 max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            The Challenge &amp; <span className="text-amber">Our Response</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Young people aren't held back by ambition but by systems that haven't kept pace. Here's how we respond.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Challenges */}
          <div>
            <h3 className="mb-6 font-heading text-sm font-semibold uppercase tracking-widest text-primary">
              Systemic Challenges
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {challenges.map((c, i) => (
                <motion.div
                  key={c.title}
                  className={`flex items-start gap-3 rounded-xl border border-primary/10 ${c.bg} p-4`}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/40 dark:bg-primary/20 text-[#E58E3C] dark:text-primary">
                    <c.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-foreground">{c.title}</h4>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{c.summary}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Response */}
          <div>
            <h3 className="mb-6 font-heading text-sm font-semibold uppercase tracking-widest text-primary">
              Our Response
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {responses.map((r, i) => (
                <motion.div
                  key={r.label}
                  className={`group relative overflow-hidden rounded-xl border border-primary/20 dark:border-border ${r.bg} p-4 transition-all duration-300`}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/40 dark:bg-primary/15 text-[#E58E3C] dark:text-primary">
                      <r.icon className="h-4 w-4" />
                    </div>
                    <motion.span
                      className="font-heading text-2xl font-bold text-[#1a202c] dark:text-primary"
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 + 0.2, type: "spring" }}
                    >
                      {r.value}
                    </motion.span>
                  </div>
                  <h4 className="font-heading text-xs font-semibold uppercase tracking-wide text-foreground">{r.label}</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">{r.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}