import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GraduationCap, Heart, Cpu, Briefcase, Droplets } from "lucide-react";

const pillars = [
  {
    icon: GraduationCap,
    title: "Aliko Academy",
    description: "The primary implementation arm for workforce development, delivering market-aligned training programs that evolve with labor market needs.",
    bullets: [
      "AI, Machine Learning, Data Analytics, Cloud Computing",
      "Software Development, Databases, Testing",
      "Finance, Accounting, Design, Marketing",
      "Academic Preparation and Language Learning",
    ],
  },
  {
    icon: Heart,
    title: "Digital Health & One Health",
    description: "Strengthening public health systems and climate resilience by preparing youth for emerging roles in health technology and surveillance.",
    bullets: [
      "Public health workforce pipelines",
      "Mobile health for prevention and behavior change",
      "Health data analytics and population health",
      "Climate-linked and zoonotic disease monitoring",
    ],
  },
  {
    icon: Cpu,
    title: "STEM & Engineering",
    description: "Preparing youth for roles in infrastructure, energy, construction technology, and sustainable development with industry-standard tools.",
    bullets: [
      "Engineering fundamentals and digital design",
      "Modeling, simulation, and GIS",
      "Civil, electrical, mechanical, and architectural fields",
      "Applied problem-solving aligned with employer expectations",
    ],
  },
  {
    icon: Briefcase,
    title: "Consultancy & Events",
    description: "Guiding youth through personalized career pathways and connecting them to employers, investors, and public sector partners.",
    bullets: [
      "Career advice, skill assessment, resume building",
      "Employer and talent matchmaking",
      "Investor forums and innovation challenges",
      "Government and private sector partnership spaces",
    ],
  },
  {
    icon: Droplets,
    title: "Aliko WASH",
    description: "Water, sanitation, and hygiene solutions driving public health impact and community resilience across Africa.",
    bullets: [
      "Clean water access and infrastructure",
      "Sanitation systems and hygiene education",
      "Community health and disease prevention",
      "Sustainable WASH technology solutions",
    ],
    link: "https://alikowash.lovable.app/",
  },
];

const Programs = () => {
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
              AlikoHub Ventures
            </span>
            <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
              Five Pillars of <span className="text-gradient-amber">Youth Empowerment</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Integrated pathways in Digital Health, One Health, STEM, and entrepreneurship, designed to reach 50,000 youth across Africa.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                className="group rounded-2xl border border-border/50 p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)] hover:scale-[1.02]"
                style={{ background: "var(--gradient-card)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <pillar.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
                <ul className="mt-5 space-y-2">
                  {pillar.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {b}
                    </li>
                  ))}
                </ul>
                <a
                  href={(pillar as any).link || "#"}
                  target={(pillar as any).link ? "_blank" : undefined}
                  rel={(pillar as any).link ? "noopener noreferrer" : undefined}
                  className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
                >
                  {(pillar as any).link ? "View Website →" : "Learn More →"}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Programs;
