import { Layout } from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  Droplets, 
  Building2,
  Sprout,
  ChevronRight,
  CheckCircle,
  GraduationCap,
  FileText,
  Users,
  AlertTriangle,
  Settings,
  Globe,
  BarChart3,
  Lock,
  Zap,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Waves,
  HandMetal
} from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "now" | "short-term" | "long-term";

const phases = [
  { 
    id: "now" as Phase, 
    label: "Now", 
    description: "Active & Proven",
    gradient: "from-success to-success/80",
    glow: "shadow-[0_0_40px_hsl(142_76%_36%/0.3)]",
    bg: "bg-success",
    text: "text-success"
  },
  { 
    id: "short-term" as Phase, 
    label: "Short-Term", 
    description: "12–36 Months",
    gradient: "from-accent to-accent/80",
    glow: "shadow-[0_0_40px_hsl(24_95%_53%/0.3)]",
    bg: "bg-accent",
    text: "text-accent"
  },
  { 
    id: "long-term" as Phase, 
    label: "Long-Term", 
    description: "3–10 Years",
    gradient: "from-primary to-water-dark",
    glow: "shadow-[0_0_40px_hsl(201_89%_48%/0.3)]",
    bg: "bg-primary",
    text: "text-primary"
  },
];

const nowServices = {
  positioning: "Delivering proven water systems and formalized WASH consulting built on generations of field experience.",
  categories: [
    {
      title: "Water Supply",
      status: "Active & Proven",
      icon: Droplets,
      featured: true,
      services: [
        "Gravity water system design and construction",
        "Spring protection systems",
        "Public water points and standpipes",
        "Institutional water supply (schools, hospitals, hostels)",
        "Reservoir construction (underground and surface, 25m³–75m³+)",
        "Transmission and distribution pipelines (small to medium scale)",
      ],
    },
    {
      title: "Consulting & Technical Advisory",
      status: "Formalized – Active",
      icon: FileText,
      featured: true,
      services: [
        "WASH feasibility studies and site assessments",
        "Technical advisory for gravity systems and water supply planning",
        "Engineering input, layouts, and system sizing",
        "Bill of Quantities (BoQs) preparation",
        "Construction supervision and quality assurance",
        "Community engagement and implementation planning",
        "Advisory support for NGOs, faith-based organizations, and institutions",
      ],
    },
    {
      title: "Sanitation",
      status: "Project-Based",
      icon: Building2,
      services: [
        "Institutional sanitation facilities (schools, clinics, hostels)",
        "Basic latrine and toilet blocks integrated with water projects",
        "Septic tanks for institutions and community facilities",
      ],
    },
    {
      title: "Hygiene",
      status: "Active",
      icon: HandMetal,
      services: [
        "Handwashing basins and stations",
        "Hygiene facilities for schools, hospitals, and women's centers",
        "Hygiene promotion linked to project implementation",
      ],
    },
    {
      title: "Institutional & Community WASH",
      status: "Active",
      icon: GraduationCap,
      services: [
        "School WASH systems",
        "Healthcare facility WASH systems",
        "Community-managed water schemes",
      ],
    },
    {
      title: "Irrigation Systems",
      status: "Active",
      icon: Sprout,
      services: [
        "Irrigation canal design and construction",
        "Agricultural water supply systems",
        "Community farmland irrigation",
        "Water distribution for crop production",
      ],
    },
  ],
};

const shortTermServices = {
  positioning: "Scaling impact through partnerships, training, and resilient system design.",
  categories: [
    {
      title: "Water Supply",
      status: "Scaling",
      icon: Droplets,
      featured: true,
      services: [
        "Solar-powered pumping systems",
        "Motorized borehole systems (with partners)",
        "Rainwater harvesting systems",
        "Small-scale water treatment (chlorination and filtration)",
        "Household and institutional water connections",
      ],
    },
    {
      title: "Emergency / Humanitarian WASH",
      status: "Partner-Led",
      icon: AlertTriangle,
      featured: true,
      services: [
        "Emergency water points",
        "Temporary sanitation facilities",
        "Hygiene kit distribution",
        "Outbreak response WASH support",
      ],
    },
    {
      title: "Sanitation",
      status: "Scaling",
      icon: Building2,
      services: [
        "Improved sanitation facilities (gender-segregated and inclusive)",
        "Small-scale wastewater and greywater management",
        "Fecal sludge management (FSM) through partnerships",
      ],
    },
    {
      title: "Hygiene",
      status: "Scaling",
      icon: HandMetal,
      services: [
        "Structured hygiene promotion programs",
        "School hygiene clubs and education programs",
        "Menstrual hygiene management (MHM) facilities and education",
        "Infection prevention and control (IPC) support for healthcare facilities",
      ],
    },
    {
      title: "Consulting & Capacity Building",
      status: "Expanding",
      icon: Users,
      services: [
        "Operation and maintenance (O&M) planning",
        "Training for local water committees and operators",
        "Asset management planning",
        "Donor reporting and technical documentation",
      ],
    },
  ],
};

const longTermServices = {
  positioning: "Building future-ready WASH systems for resilient communities.",
  categories: [
    {
      title: "Advanced Water Systems",
      status: "Future",
      icon: Waves,
      featured: true,
      services: [
        "Large-scale water treatment plants",
        "Urban and peri-urban water networks",
        "Climate-resilient water supply systems",
        "Regional and national water supply master planning",
      ],
    },
    {
      title: "Digital & Smart WASH",
      status: "Future",
      icon: BarChart3,
      featured: true,
      services: [
        "GIS-based WASH planning",
        "Smart water monitoring systems",
        "Digital dashboards for utilities and donors",
        "Predictive maintenance and data-driven planning",
      ],
    },
    {
      title: "Advanced Sanitation",
      status: "Future",
      icon: Settings,
      services: [
        "Sewer networks and decentralized wastewater treatment (DEWATS)",
        "Full fecal sludge treatment facilities",
        "Circular sanitation and water reuse systems",
      ],
    },
    {
      title: "Policy, Advisory & Research",
      status: "Future",
      icon: FileText,
      services: [
        "National WASH strategy support",
        "SDG-6 monitoring and reporting",
        "Public-private partnership (PPP) advisory",
        "Regional WASH policy and planning support",
      ],
    },
    {
      title: "Regional & International Expansion",
      status: "Future",
      icon: Globe,
      services: [
        "Multi-country WASH project delivery",
        "Donor-led consortium projects",
        "Cross-border WASH programs",
      ],
    },
  ],
};

const StatusBadge = ({ status, phase }: { status: string; phase: Phase }) => {
  const styles = {
    now: "bg-success/15 text-success border-success/30 shadow-[0_0_20px_hsl(142_76%_36%/0.15)]",
    "short-term": "bg-accent/15 text-accent border-accent/30 shadow-[0_0_20px_hsl(24_95%_53%/0.15)]",
    "long-term": "bg-primary/15 text-primary border-primary/30 shadow-[0_0_20px_hsl(201_89%_48%/0.15)]",
  };

  const icons = {
    now: <CheckCircle className="w-3.5 h-3.5" />,
    "short-term": <TrendingUp className="w-3.5 h-3.5" />,
    "long-term": <Lock className="w-3.5 h-3.5" />,
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm",
      styles[phase]
    )}>
      {icons[phase]}
      {status}
    </span>
  );
};

const ServiceCard = ({ 
  category, 
  phase, 
  index 
}: { 
  category: { title: string; status: string; icon: any; services: string[]; featured?: boolean }; 
  phase: Phase;
  index: number;
}) => {
  const Icon = category.icon;
  const phaseData = phases.find(p => p.id === phase)!;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "service-bento group",
        category.featured && "md:col-span-2"
      )}
    >
      {/* Gradient accent line */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r",
        phaseData.gradient
      )} />
      
      {/* Floating orb decoration - reduced opacity */}
      <div className={cn(
        "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-2xl opacity-10 transition-opacity duration-500 group-hover:opacity-20",
        phase === "now" && "bg-success",
        phase === "short-term" && "bg-accent",
        phase === "long-term" && "bg-primary"
      )} />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
              phase === "now" && "bg-gradient-to-br from-success/20 to-success/5 shadow-[0_0_30px_hsl(142_76%_36%/0.2)]",
              phase === "short-term" && "bg-gradient-to-br from-accent/20 to-accent/5 shadow-[0_0_30px_hsl(24_95%_53%/0.2)]",
              phase === "long-term" && "bg-gradient-to-br from-primary/20 to-primary/5 shadow-[0_0_30px_hsl(201_89%_48%/0.2)]"
            )}>
              <Icon className={cn(
                "w-7 h-7 transition-transform duration-300 group-hover:scale-110",
                phaseData.text
              )} />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {category.title}
              </h3>
              {category.featured && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Sparkles className="w-3 h-3" />
                  Core Service
                </span>
              )}
            </div>
          </div>
          <StatusBadge status={category.status} phase={phase} />
        </div>
        
        <ul className="space-y-3">
          {category.services.map((service, idx) => (
            <motion.li 
              key={idx} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index * 0.08) + (idx * 0.03) }}
              className="flex items-start gap-3 text-sm text-muted-foreground group/item hover:text-foreground transition-colors"
            >
              <div className={cn(
                "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300",
                phase === "now" && "bg-success/10 group-hover/item:bg-success/20",
                phase === "short-term" && "bg-accent/10 group-hover/item:bg-accent/20",
                phase === "long-term" && "bg-primary/10 group-hover/item:bg-primary/20"
              )}>
                <ArrowRight className={cn(
                  "w-3.5 h-3.5 transition-transform group-hover/item:translate-x-0.5",
                  phaseData.text
                )} />
              </div>
              {service}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const Services = () => {
  const [activePhase, setActivePhase] = useState<Phase>("now");

  const currentData = {
    now: nowServices,
    "short-term": shortTermServices,
    "long-term": longTermServices,
  }[activePhase];

  const activePhaseData = phases.find(p => p.id === activePhase)!;

  return (
    <Layout>
      {/* Hero Section - Immersive Mesh Gradient */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        {/* Mesh gradient background */}
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        
        {/* Animated orbs - reduced opacity and blur */}
        <div className="floating-orb w-96 h-96 bg-primary top-0 left-1/4 opacity-10 blur-2xl" style={{ animationDelay: '0s' }} />
        <div className="floating-orb w-72 h-72 bg-accent bottom-0 right-1/4 opacity-10 blur-2xl" style={{ animationDelay: '-5s' }} />
        <div className="floating-orb w-64 h-64 bg-success top-1/2 right-10 opacity-10 blur-2xl" style={{ animationDelay: '-10s' }} />
        
        <div className="container-main relative z-10 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-4xl"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
            >
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground">Services & Growth Roadmap</span>
            </motion.div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-[1.1]">
              WASH Solutions for{" "}
              <span className="text-gradient">Every Phase</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Aliko Wash delivers proven WASH infrastructure and formalized consulting—built on 
              generations of field expertise—while responsibly scaling through partnerships 
              and innovation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Phase Navigation - Floating Pills */}
      <section className="sticky top-16 z-40 py-4">
        <div className="container-main">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-2 inline-flex gap-2 mx-auto w-full md:w-auto justify-center"
          >
            {phases.map((phase) => (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={cn(
                  "phase-indicator",
                  activePhase === phase.id 
                    ? cn("text-primary-foreground", phase.bg, phase.glow, "active")
                    : "text-foreground hover:bg-secondary/80"
                )}
              >
                <span className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all",
                  activePhase === phase.id ? "bg-primary-foreground scale-125" : phase.bg
                )} />
                <span className="font-semibold">{phase.label}</span>
                <span className={cn(
                  "text-xs hidden sm:inline",
                  activePhase === phase.id ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  {phase.description}
                </span>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Grid - Bento Layout */}
      <section className="section-padding relative overflow-hidden">
        {/* Background mesh - reduced opacity */}
        <div className="absolute inset-0 mesh-gradient opacity-20" />
        
        <div className="container-main relative z-10">
          {/* Positioning Statement */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
              className="text-center mb-16"
            >
              <div className="glass-card inline-block px-8 py-6 max-w-3xl">
                <p className={cn(
                  "text-xl md:text-2xl font-medium leading-relaxed",
                  activePhaseData.text
                )}>
                  "{currentData.positioning}"
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bento Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {currentData.categories.map((category, index) => (
                <ServiceCard 
                  key={`${activePhase}-${category.title}`}
                  category={category} 
                  phase={activePhase}
                  index={index}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Legend */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 flex flex-wrap justify-center gap-8 text-sm"
          >
            {[
              { icon: CheckCircle, label: "Active / Delivered", color: "text-success" },
              { icon: TrendingUp, label: "Scaling", color: "text-accent" },
              { icon: Lock, label: "Future / Planned", color: "text-primary" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 glass-card px-4 py-2">
                <Icon className={cn("w-4 h-4", color)} />
                <span className="text-muted-foreground">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Glassmorphic */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        <div className="container-main relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-12 md:p-16 text-center gradient-border"
          >
            <Droplets className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Need WASH Infrastructure?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
              Contact us to discuss your project requirements. We provide custom 
              solutions for hospitals, schools, communities, and institutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="accent" size="lg" asChild className="text-lg px-8 py-6 rounded-2xl">
                <Link to="/contact">
                  Get In Touch
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 rounded-2xl border-2">
                <Link to="/projects">
                  View Projects
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
