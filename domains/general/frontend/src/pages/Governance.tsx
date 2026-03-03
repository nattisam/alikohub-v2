import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Crown, Settings, MapPin, GraduationCap, BarChart3, DollarSign, Users } from "lucide-react";

const levels = [
  { icon: Crown, title: "AlikoHub Global Leadership (HQ)", role: "Strategic Oversight", description: "Vision, strategy, donor engagement, global partnerships, quality assurance" },
  { icon: Settings, title: "Program Management Unit (PMU)", role: "Central Coordination", description: "MEL oversight, curriculum management, financial controls, reporting" },
  { icon: MapPin, title: "Country Hub Leads", role: "National Implementation", description: "Local partnerships, hub operations, youth recruitment, government alignment" },
  { icon: GraduationCap, title: "Technical Experts & Trainers", role: "Program Delivery", description: "Training, mentorship, curriculum execution, innovation challenge facilitation" },
  { icon: BarChart3, title: "MEL Officers", role: "Data & Reporting", description: "Monitoring, evaluation, data quality assurance, tracer studies" },
  { icon: DollarSign, title: "Finance & Operations Teams", role: "Compliance & Administration", description: "Procurement, budgeting, HR, logistics, operational support" },
  { icon: Users, title: "Advisory Board (Regional & Global)", role: "Strategic Guidance", description: "Sector expertise, industry alignment, innovation direction, PPP support" },
];

const Governance = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            className="mx-auto mb-16 max-w-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
              Organizational Structure
            </span>
            <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
              Governance & <span className="text-gradient-amber">Implementation</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Accountability, transparency, and effective coordination across all ten hub countries, combining centralized leadership with strong local ownership.
            </p>
          </motion.div>

          {/* Flow chart */}
          <div className="mx-auto max-w-2xl space-y-4">
            {levels.map((level, i) => (
              <motion.div
                key={level.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="group flex items-start gap-4 rounded-2xl border border-border/50 p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)]" style={{ background: "var(--gradient-card)" }}>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <level.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-foreground">{level.title}</h3>
                    <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary mt-1 mb-2">
                      {level.role}
                    </span>
                    <p className="text-sm text-muted-foreground">{level.description}</p>
                  </div>
                </div>
                {i < levels.length - 1 && (
                  <div className="ml-[1.75rem] h-4 w-px bg-primary/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Governance;
