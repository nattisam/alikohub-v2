import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Heart, ShieldCheck, Home, Handshake } from "lucide-react";

const principles = [
  {
    icon: Heart,
    title: "Respect for Learners",
    description: "All participants are treated with dignity and fairness, with particular attention to the needs of young people from underserved communities. Equitable access to training, support services, and employment. No learner excluded based on gender, socioeconomic background, disability, or location.",
  },
  {
    icon: ShieldCheck,
    title: "Data Responsibility",
    description: "Learner information is collected and managed securely and transparently. Data systems protect privacy, limit access to sensitive information, and ensure data is used only for legitimate program purposes. Clear consent processes and responsible data-sharing across all hubs.",
  },
  {
    icon: Home,
    title: "Safe Learning Environments",
    description: "Strong safeguarding policies protect learners from harassment, discrimination, exploitation, and any form of harm. Staff and partners are trained on these policies, with clear reporting mechanisms to address concerns promptly and effectively.",
  },
  {
    icon: Handshake,
    title: "Ethical Partnerships",
    description: "All collaborations with governments, employers, academic organizations, and community groups are guided by transparency, accountability, and shared values. Partners uphold the same ethical standards and contribute to a safe, inclusive environment.",
  },
];

const Ethics = () => {
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
              Our Commitment
            </span>
            <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
              Ethics & <span className="text-gradient-amber">Safeguards</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Operating with integrity, transparency, and a strong commitment to safeguarding the rights and well-being of all participants.
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 mx-auto max-w-4xl">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                className="group rounded-2xl border border-border/50 p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)] hover:scale-[1.02]"
                style={{ background: "var(--gradient-card)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <p.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Ethics;
