import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Handshake, Award, Briefcase, BookOpen, Users, RefreshCw } from "lucide-react";

const revenueModels = [
  {
    icon: Handshake,
    title: "Public–Private Partnerships",
    description: "Co-financing of innovation hubs and training programs, ensuring continuous capacity building and reduced reliance on donor funding.",
  },
  {
    icon: Award,
    title: "Advanced Certifications",
    description: "Specialized, high-value professional development courses that generate income while expanding access to industry-recognized credentials.",
  },
  {
    icon: Briefcase,
    title: "Consulting Services",
    description: "Technical expertise to industry, government, and development partners, creating a sustainable revenue stream aligned with sectoral needs.",
  },
  {
    icon: BookOpen,
    title: "Advisory Services",
    description: "International placement support and global exposure for students, generating revenue through academic and career advisory services.",
  },
  {
    icon: Users,
    title: "Alumni Network",
    description: "Graduates contribute through mentorship, peer support, and financial contributions, strengthening community ownership and long-term continuity.",
  },
  {
    icon: RefreshCw,
    title: "Incubation Reinvestment",
    description: "Revenue from youth-founded ventures is reinvested into future cohorts, creating a self-reinforcing cycle of empowerment.",
  },
];

const Sustainability = () => {
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
              Long-Term Viability
            </span>
            <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
              Sustainability <span className="text-gradient-amber">Plan</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              A model designed to thrive beyond initial grant funding, ensuring long-term continuity, financial independence, and community-driven growth.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {revenueModels.map((model, i) => (
              <motion.div
                key={model.title}
                className="group rounded-2xl border border-border/50 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)] hover:scale-[1.02]"
                style={{ background: "var(--gradient-card)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <model.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">{model.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{model.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sustainability;
