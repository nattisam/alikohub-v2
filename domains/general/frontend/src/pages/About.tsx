import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MissionSection } from "@/components/MissionSection";
import { TeamSection } from "@/components/TeamSection";
import { PolicyAlignmentSection } from "@/components/PolicyAlignmentSection";
import { Target, Sparkles, Globe, Users, BookOpen, Lightbulb, Landmark, Heart, Brain, Briefcase, GraduationCap, ArrowRight, Layers, Building2, CheckCircle2, Shield, Users2, Eye, MapPinned, Star, ChevronLeft, ChevronRight, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import aboutHeroBg from "@/assets/about-hero-bg.jpg";

const cardColors = [
  { bg: "bg-[hsl(210,40%,88%)]", text: "text-[hsl(210,60%,25%)]", iconBg: "bg-[hsl(210,50%,78%)]" },
  { bg: "bg-[hsl(20,80%,75%)]", text: "text-[hsl(20,60%,20%)]", iconBg: "bg-[hsl(20,70%,65%)]" },
  { bg: "bg-[hsl(190,60%,78%)]", text: "text-[hsl(190,70%,20%)]", iconBg: "bg-[hsl(190,50%,68%)]" },
  { bg: "bg-[hsl(40,85%,75%)]", text: "text-[hsl(30,70%,20%)]", iconBg: "bg-[hsl(40,75%,65%)]" },
  { bg: "bg-[hsl(25,70%,82%)]", text: "text-[hsl(25,60%,22%)]", iconBg: "bg-[hsl(25,60%,72%)]" },
  { bg: "bg-[hsl(210,50%,82%)]", text: "text-[hsl(210,60%,22%)]", iconBg: "bg-[hsl(210,45%,72%)]" },
];

const differentiators = [
  { icon: BookOpen, text: "Learning and application linked directly to employment and enterprise" },
  { icon: Users, text: "People and systems: youth, institutions, markets, and policy actors connected" },
  { icon: Globe, text: "Local relevance with continental vision through regionally grounded hubs" },
  { icon: Target, text: "Human values paired with measurable results: dignity with data and accountability" },
  { icon: Lightbulb, text: "Aliko LMS hosting 30+ market-aligned courses designed with employer expectations" },
  { icon: Sparkles, text: "Global mentorship network spanning Africa, the United States, and Canada" },
];

const timeline = [
  {
    phase: "Phase 1", years: "Years 1 to 2", title: "Ecosystem Establishment",
    items: ["Launch Regional Innovation Hubs", "Deploy Aliko LMS and hybrid learning system", "Build partnerships with universities, ministries, and private sector", "Establish MEL systems"],
  },
  {
    phase: "Phase 2", years: "Years 3 to 4", title: "Consolidation & Evidence",
    items: ["Identify high-performing hubs based on outcomes", "Strengthen applied research and innovation incubation", "Publish policy briefs and workforce impact reports", "Deepen public and private partnerships"],
  },
  {
    phase: "Phase 3", years: "Year 5+", title: "Centers of Excellence",
    items: ["Designate selected hubs as regional Centers of Excellence", "Support governments with advisory and replication models", "Serve as knowledge and innovation anchors", "Strengthen global pathways across continents"],
  },
];

const pillars = [
  {
    icon: GraduationCap, title: "Aliko Academy",
    description: "Career-driven courses powered by our purpose-built LMS, delivering market-aligned training across Technology, Health, and STEM.",
    bullets: ["Custom-designed LMS with 30+ structured courses", "AI, Machine Learning, Data Analytics, Cloud Computing", "Software Development, Databases, Testing", "Finance, Accounting, Design, Marketing"],
    link: "https://academy.alikohub.com/",
  },
  {
    icon: Heart, title: "Digital Health & One Health",
    description: "Strengthening public health systems and climate resilience through health technology.",
    bullets: ["Public health workforce pipelines", "Mobile health for prevention and behavior change", "Health data analytics and population health", "Climate-linked and zoonotic disease monitoring"],
  },
  {
    icon: Brain, title: "STEM & Engineering",
    description: "Preparing youth for infrastructure, energy, and sustainable development.",
    bullets: ["Engineering fundamentals and digital design", "Modeling, simulation, and GIS", "Civil, electrical, mechanical, and architectural fields", "Applied problem-solving aligned with employer expectations"],
  },
  {
    icon: Briefcase, title: "Consultancy & Events",
    description: "Guiding youth through career pathways and connecting them to employers and investors.",
    bullets: ["Career advice, skill assessment, resume building", "Employer and talent matchmaking", "Investor forums and innovation challenges", "Government and private sector partnership spaces"],
  },
  {
    icon: Droplets, title: "Aliko WASH",
    description: "Advancing water, sanitation, and hygiene solutions through technology-driven community impact programs.",
    bullets: ["Community WASH infrastructure assessment", "Hygiene behavior change and education", "Water quality monitoring and data systems", "Sustainable sanitation technology deployment"],
    link: "https://alikowash.lovable.app/",
  },
];

const partnerCategories = [
  { icon: Landmark, title: "Government", text: "Ministries of Education, Health, ICT, and Youth providing policy alignment, co-financing, and institutional support." },
  { icon: Briefcase, title: "Private Sector", text: "Technology companies and industry leaders providing internships, apprenticeships, and employment pathways." },
  { icon: GraduationCap, title: "Academic", text: "Universities and research institutions co-developing curricula and hosting applied research programs." },
  { icon: Globe, title: "Development Partners", text: "International organizations and foundations providing funding, technical assistance, and global networks." },
];

const revenueModels = [
  "Public and Private Partnership Co-Financing",
  "Advanced Certifications & Premium Training",
  "Consulting Services for Government & NGOs",
  "Advisory Services for Enterprise Development",
  "Alumni Network & Continuing Education",
  "Incubation Reinvestment from Youth Enterprises",
];

const governanceItems = [
  { icon: Users2, title: "Multi-Stakeholder Governance", text: "Board includes government, development partners, private sector, academia, and youth representatives." },
  { icon: Eye, title: "Transparency & Accountability", text: "Annual audited financials, public impact reports, and independent evaluations published openly." },
  { icon: MapPinned, title: "Local Ownership", text: "Regional hubs governed by local advisory committees with contextual adaptation authority." },
  { icon: Star, title: "Youth Voice", text: "Youth representatives serve on governance bodies at all levels, from hub committees to the central board." },
];

function HorizontalScroller({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    ref.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };
  return (
    <div className="relative">
      <button onClick={() => scroll("left")} className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-card/80 border border-border/50 text-foreground backdrop-blur-sm hover:bg-primary/20" aria-label="Scroll left">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={() => scroll("right")} className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-card/80 border border-border/50 text-foreground backdrop-blur-sm hover:bg-primary/20" aria-label="Scroll right">
        <ChevronRight className="h-5 w-5" />
      </button>
      <div ref={ref} className="flex gap-5 overflow-x-auto scroll-smooth pb-4 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        {children}
      </div>
    </div>
  );
}

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* 1. Who We Are - Hero with background */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={aboutHeroBg} alt="" className="h-full w-full object-cover scale-105" />
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
        <div className="container relative mx-auto px-6 py-32 lg:py-40">
          <motion.div className="mx-auto max-w-3xl text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="mb-4 inline-block rounded-full border border-white/30 bg-white/10 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-white backdrop-blur-md shadow-lg">Who We Are</span>
            <h1 className="font-heading text-5xl font-extrabold text-white sm:text-6xl lg:text-7xl drop-shadow-lg">
              Youth <span className="text-gradient-amber">Resourcefulness Ecosystem</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/85">
              We <strong className="text-white">Train</strong> through Aliko Academy, <strong className="text-white">Guide</strong> through Aliko Consultancy, <strong className="text-white">Connect</strong> through Aliko Events, and <strong className="text-white">Scale</strong> through our partners' support.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-white/75">
              Rooted in dignity, compassion, and systems thinking, AlikoHub brings together education, innovation, employment pathways, and partnerships to enable young people to thrive as contributors, leaders, and problem solvers. Established in 2025 as a sister company to Genshifter Technologies, we operate at the intersection of Digital Health, One Health, STEM, and entrepreneurship.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Mission & Vision Bento Grid */}
      <MissionSection />

      {/* 3. What Makes Us Different - Horizontal scroll */}
      <section className="py-20 lg:py-28 bg-card/50">
        <div className="container mx-auto px-6">
          <motion.div className="mx-auto mb-12 max-w-2xl text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">Our Approach</span>
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              What Makes AlikoHub <span className="text-gradient-amber">Different</span>
            </h2>
          </motion.div>

          <HorizontalScroller>
            {differentiators.map((item, i) => {
              const color = cardColors[i % cardColors.length];
              return (
                <motion.div key={i} className={`w-[280px] shrink-0 rounded-2xl ${color.bg} p-6 hover:scale-[1.02] transition-all duration-300`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${color.iconBg}`}>
                    <item.icon className={`h-6 w-6 ${color.text}`} />
                  </div>
                  <p className={`text-sm leading-relaxed ${color.text} opacity-80`}>{item.text}</p>
                </motion.div>
              );
            })}
          </HorizontalScroller>
        </div>
      </section>

      {/* 4. Structural Differentiation - Horizontal */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <motion.div className="mx-auto mb-12 max-w-2xl text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">Structural Differentiation</span>
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Why AlikoHub <span className="text-gradient-amber">Works</span>
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Layers, title: "One-Window Ecosystem", description: "Single point of access to training, mentorship, incubation, and market linkages.", color: cardColors[0] },
              { icon: Building2, title: "Physical + Digital", description: "10 regional hubs provide physical presence while digital platforms enable continental scale.", color: cardColors[3] },
              { icon: CheckCircle2, title: "Outcome-Linked Design", description: "Every component designed backward from employment and enterprise outcomes.", color: cardColors[2] },
            ].map((item, i) => (
              <motion.div key={item.title} className={`rounded-2xl ${item.color.bg} p-8 hover:scale-[1.02] transition-all duration-300`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${item.color.iconBg}`}>
                  <item.icon className={`h-7 w-7 ${item.color.text}`} />
                </div>
                <h3 className={`font-heading text-xl font-bold ${item.color.text} mb-2`}>{item.title}</h3>
                <p className={`text-sm leading-relaxed ${item.color.text} opacity-75`}>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Programs / 4 Pillars - Horizontal scroll */}
      <section className="py-20 lg:py-28 bg-card/50">
        <div className="container mx-auto px-6">
          <motion.div className="mx-auto mb-12 max-w-2xl text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">Our Main Pillars</span>
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Programs Through Our <span className="text-gradient-amber">Ventures</span>
            </h2>
          </motion.div>

          <HorizontalScroller>
            {pillars.map((pillar, i) => {
              const color = cardColors[i % cardColors.length];
              return (
                <motion.div key={pillar.title} className={`w-[320px] shrink-0 rounded-2xl ${color.bg} p-7 hover:scale-[1.02] transition-all duration-300`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${color.iconBg}`}>
                    <pillar.icon className={`h-6 w-6 ${color.text}`} />
                  </div>
                  <h3 className={`font-heading text-xl font-bold ${color.text}`}>{pillar.title}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${color.text} opacity-75`}>{pillar.description}</p>
                  <ul className="mt-4 space-y-1.5">
                    {pillar.bullets.map((b, j) => (
                      <li key={j} className={`flex items-start gap-2 text-xs ${color.text} opacity-70`}>
                        <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${color.iconBg}`} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  {pillar.link && (
                    <a href={pillar.link} target="_blank" rel="noopener noreferrer" className={`mt-4 inline-flex items-center gap-1.5 text-xs font-semibold ${color.text} opacity-80 hover:opacity-100 transition-opacity`}>
                      Visit {pillar.title} <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                </motion.div>
              );
            })}
          </HorizontalScroller>

          <motion.div className="mt-8 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Button variant="outline" className="group" asChild>
              <a href="/programs">View All Ventures <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 6. Journey Timeline - Horizontal */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <motion.div className="mx-auto mb-12 max-w-2xl text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">Our Journey</span>
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Pathway to <span className="text-gradient-amber">Excellence</span>
            </h2>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {timeline.map((phase, i) => {
              const color = cardColors[i % cardColors.length];
              return (
                <motion.div key={phase.phase} className={`rounded-2xl ${color.bg} p-7 hover:scale-[1.02] transition-all duration-300`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                  <div className={`mb-2 inline-flex rounded-full ${color.iconBg} px-3 py-1 text-xs font-semibold ${color.text}`}>
                    {phase.phase} · {phase.years}
                  </div>
                  <h3 className={`font-heading text-lg font-bold ${color.text} mb-3`}>{phase.title}</h3>
                  <ul className="space-y-1.5">
                    {phase.items.map((item, j) => (
                      <li key={j} className={`flex items-start gap-2 text-sm ${color.text} opacity-75`}>
                        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${color.iconBg}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Team */}
      <TeamSection />

      {/* 8. Partners & Governance - Side by side */}
      <section className="py-20 lg:py-28 bg-card/50">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Partners */}
            <div>
              <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-widest text-primary">Partnership Strategy</span>
                <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                  Building Impact <span className="text-gradient-amber">Together</span>
                </h2>
              </motion.div>
              <div className="grid gap-4 sm:grid-cols-2">
                {partnerCategories.map((cat, i) => {
                  const color = cardColors[i % cardColors.length];
                  return (
                    <motion.div key={cat.title} className={`rounded-xl ${color.bg} p-5 hover:scale-[1.02] transition-all duration-300`} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${color.iconBg}`}>
                        <cat.icon className={`h-5 w-5 ${color.text}`} />
                      </div>
                      <h3 className={`font-heading text-sm font-semibold ${color.text}`}>{cat.title}</h3>
                      <p className={`mt-1 text-xs leading-relaxed ${color.text} opacity-75`}>{cat.text}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Governance */}
            <div>
              <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="mb-2 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold uppercase tracking-widest text-primary">Governance</span>
                </div>
                <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                  Our <span className="text-gradient-amber">Philosophy</span>
                </h2>
              </motion.div>
              <div className="space-y-4">
                {governanceItems.map((item, i) => {
                  const color = cardColors[i % cardColors.length];
                  return (
                    <motion.div key={item.title} className="flex items-start gap-3" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color.iconBg}`}>
                        <item.icon className={`h-4 w-4 ${color.text}`} />
                      </div>
                      <div>
                        <h3 className="font-heading text-sm font-bold text-foreground">{item.title}</h3>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.text}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Policy Alignment */}
      <PolicyAlignmentSection />

      {/* 10. Sustainability & Revenue */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <motion.div className="mx-auto mb-10 max-w-2xl text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">Sustainability</span>
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Revenue <span className="text-gradient-amber">Model</span>
            </h2>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {revenueModels.map((model, i) => {
              const color = cardColors[i % cardColors.length];
              return (
                <motion.div key={model} className={`flex items-center gap-3 rounded-xl ${color.bg} p-4 hover:scale-[1.02] transition-all duration-300`} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color.iconBg} text-sm font-bold ${color.text}`}>{i + 1}</div>
                  <span className={`text-sm font-medium ${color.text}`}>{model}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. CTA */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <motion.div className="rounded-3xl bg-[hsl(40,85%,75%)] p-12 lg:p-16 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl font-bold text-[hsl(30,70%,20%)] sm:text-4xl">Ready to Partner?</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-[hsl(30,70%,20%)] opacity-80">Join us in building Africa's largest youth empowerment ecosystem.</p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="group bg-primary px-8 text-primary-foreground shadow-[var(--shadow-amber)] hover:bg-amber-light" asChild>
                <a href="mailto:info@alikohub.com">Contact Us <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></a>
              </Button>
              <Button size="lg" variant="outline" className="border-[hsl(30,70%,20%)]/30 text-[hsl(30,70%,20%)] hover:bg-[hsl(40,85%,70%)]" asChild>
                <a href="https://alikohub-pitch.lovable.app/" target="_blank" rel="noopener noreferrer">View Full Pitch</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
