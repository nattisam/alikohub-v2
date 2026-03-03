import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Progress } from "@/components/ui/progress";
import { Users, Briefcase, Building2, Target, TrendingUp } from "lucide-react";

const outcomeKPIs = [
  { label: "Youth Reached (cumulative)", values: [8000, 18000, 30000, 40000, 50000], endline: "50,000", icon: Users },
  { label: "Employment Outcome Rate", values: [65, 70, 75, 80, 85], endline: "75–85%", icon: Briefcase },
  { label: "Female Participation Rate", values: [45, 45, 45, 45, 45], endline: "≥45%", icon: Target },
  { label: "Youth-Led Enterprises", values: [5, 10, 18, 25, 30], endline: "25–40", icon: TrendingUp },
  { label: "Innovation Hubs Operational", values: [1, 4, 7, 10, 10], endline: "10+", icon: Building2 },
];

const outputKPIs = [
  { label: "Training Programs Delivered", target: "12–20 per year" },
  { label: "Mentors & Experts Engaged", target: "100+ annually" },
  { label: "Internships & Placements", target: "1,500–8,000 per year" },
  { label: "Matchmaking Events", target: "8+ per year" },
  { label: "PPPs Formalized", target: "8–15 per year" },
  { label: "Programs Aligned with SDGs", target: "100% annually" },
];

const Impact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Outcome KPIs */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            className="mx-auto mb-16 max-w-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
              Measurable Impact
            </span>
            <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
              Five-Year <span className="text-gradient-amber">Outcome Targets</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Performance framework designed to measure reach, quality, equity, and long-term impact across Africa.
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            {outcomeKPIs.map((kpi, i) => (
              <motion.div
                key={kpi.label}
                className="rounded-2xl border border-border/50 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)]"
                style={{ background: "var(--gradient-card)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <kpi.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-semibold text-foreground">{kpi.label}</h3>
                    <p className="text-2xl font-heading font-bold text-primary">{kpi.endline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {kpi.values.map((v, j) => (
                    <div key={j} className="flex-1 text-center">
                      <div className="text-xs text-muted-foreground mb-1">Y{j + 1}</div>
                      <Progress value={(v / (kpi.values[kpi.values.length - 1] || 1)) * 100} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-1">{typeof v === 'number' && v > 100 ? `${(v / 1000).toFixed(0)}K` : `${v}%`}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Output KPIs */}
      <section className="py-24 lg:py-32 bg-card/50">
        <div className="container mx-auto px-6">
          <motion.div
            className="mx-auto mb-16 max-w-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Annual <span className="text-gradient-amber">Output Targets</span>
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {outputKPIs.map((kpi, i) => (
              <motion.div
                key={kpi.label}
                className="group rounded-2xl border border-border/50 p-6 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)] hover:scale-[1.02]"
                style={{ background: "var(--gradient-card)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="text-2xl font-heading font-bold text-primary mb-2">{kpi.target}</div>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Impact;
