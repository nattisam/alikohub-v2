import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Users, 
  ClipboardCheck, 
  Ruler, 
  Handshake, 
  HardHat, 
  ShieldCheck, 
  GraduationCap, 
  LineChart,
  Heart,
  Cog,
  Award,
  Leaf,
  Globe,
  Building2,
  Droplets,
  CloudSun,
  ChevronRight,
  Play,
  Sparkles
} from "lucide-react";

const stepColors = [
  { bg: "from-blue-500 to-cyan-400", light: "bg-blue-100", text: "text-blue-600", glow: "shadow-blue-500/30" },
  { bg: "from-cyan-500 to-teal-400", light: "bg-cyan-100", text: "text-cyan-600", glow: "shadow-cyan-500/30" },
  { bg: "from-teal-500 to-emerald-400", light: "bg-teal-100", text: "text-teal-600", glow: "shadow-teal-500/30" },
  { bg: "from-emerald-500 to-green-400", light: "bg-emerald-100", text: "text-emerald-600", glow: "shadow-emerald-500/30" },
  { bg: "from-amber-500 to-orange-400", light: "bg-amber-100", text: "text-amber-600", glow: "shadow-amber-500/30" },
  { bg: "from-orange-500 to-red-400", light: "bg-orange-100", text: "text-orange-600", glow: "shadow-orange-500/30" },
  { bg: "from-violet-500 to-purple-400", light: "bg-violet-100", text: "text-violet-600", glow: "shadow-violet-500/30" },
  { bg: "from-indigo-500 to-blue-400", light: "bg-indigo-100", text: "text-indigo-600", glow: "shadow-indigo-500/30" },
];

const workflowSteps = [
  {
    number: "01",
    title: "Needs Identification & Community Engagement",
    icon: Users,
    points: [
      "Engage communities and institutions",
      "Identify water, sanitation, and hygiene needs",
      "Understand local priorities and context"
    ]
  },
  {
    number: "02",
    title: "Technical Assessment & Feasibility",
    icon: ClipboardCheck,
    points: [
      "Conduct site assessments and surveys",
      "Identify water sources and system options",
      "Assess technical and environmental feasibility"
    ]
  },
  {
    number: "03",
    title: "Engineering Design & Planning",
    icon: Ruler,
    points: [
      "Design water, sanitation, and hygiene systems",
      "Prepare layouts and Bills of Quantities (BoQs)",
      "Develop implementation plans and cost estimates"
    ]
  },
  {
    number: "04",
    title: "Resource Mobilization & Partnerships",
    icon: Handshake,
    points: [
      "Coordinate with donors and partners",
      "Align materials, funding, and technical resources",
      "Define roles and responsibilities"
    ]
  },
  {
    number: "05",
    title: "Construction & Implementation",
    icon: HardHat,
    points: [
      "Construct water systems, reservoirs, sanitation, and hygiene facilities",
      "Supervise construction and ensure quality",
      "Engage local labor where possible"
    ]
  },
  {
    number: "06",
    title: "Quality Assurance & Testing",
    icon: ShieldCheck,
    points: [
      "Inspect completed works",
      "Test system functionality and safety",
      "Verify usability of sanitation and hygiene facilities"
    ]
  },
  {
    number: "07",
    title: "Handover & Capacity Building",
    icon: GraduationCap,
    points: [
      "Train local operators and user committees",
      "Provide basic operation and maintenance guidance",
      "Formally hand over systems"
    ]
  },
  {
    number: "08",
    title: "Monitoring, Support & Sustainability",
    icon: LineChart,
    points: [
      "Conduct follow-up visits and performance checks",
      "Provide advisory support and troubleshooting",
      "Capture lessons learned for future projects"
    ]
  }
];

const valueCards = [
  {
    title: "Community-Driven",
    icon: Heart,
    description: "Every project starts with listening. We prioritize local knowledge and community ownership.",
    gradient: "from-rose-500 to-pink-500",
    bgLight: "bg-rose-50"
  },
  {
    title: "Technically Sound",
    icon: Cog,
    description: "Our solutions are engineered for reliability, using proven methods and appropriate technology.",
    gradient: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-50"
  },
  {
    title: "Quality Assured",
    icon: Award,
    description: "Rigorous supervision and testing ensure every system meets safety and performance standards.",
    gradient: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-50"
  },
  {
    title: "Built for Sustainability",
    icon: Leaf,
    description: "We design for long-term impact through capacity building and ongoing support.",
    gradient: "from-emerald-500 to-green-500",
    bgLight: "bg-emerald-50"
  }
];

const alignmentCards = [
  {
    title: "UN SDG 6",
    fullTitle: "UN Sustainable Development Goal 6",
    icon: Globe,
    label: "Clean Water and Sanitation for All",
    gradient: "from-blue-600 to-sky-500",
    bgPattern: "bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]"
  },
  {
    title: "AU Agenda 2063",
    fullTitle: "African Union Agenda 2063",
    icon: Building2,
    label: "Sustainable Infrastructure & Healthy Communities",
    gradient: "from-emerald-600 to-teal-500",
    bgPattern: "bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.15),transparent_50%)]"
  },
  {
    title: "Global WASH",
    fullTitle: "Global WASH Standards",
    icon: Droplets,
    label: "Safe, Equitable, and Resilient WASH Services",
    gradient: "from-cyan-600 to-blue-500",
    bgPattern: "bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.15),transparent_50%)]"
  },
  {
    title: "Climate Resilience",
    fullTitle: "Climate & Resilience",
    icon: CloudSun,
    label: "Water Systems Built for Long-Term Resilience",
    gradient: "from-amber-500 to-orange-500",
    bgPattern: "bg-[radial-gradient(circle_at_20%_70%,rgba(245,158,11,0.15),transparent_50%)]"
  }
];

const HowWeDoIt = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  return (
    <Layout>
      {/* SECTION 1: HERO - Vibrant & Dynamic */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        </div>
        
        {/* Floating orbs */}
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 50, 0], 
            y: [0, 30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, -30, 0], 
            y: [0, -50, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Our Proven 8-Step Process
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
              How We Deliver{" "}
              <span className="relative">
                <span className="relative z-10">Sustainable WASH</span>
                <motion.span 
                  className="absolute inset-0 bg-white/20 rounded-lg -skew-y-1"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                />
              </span>{" "}
              Solutions
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              We follow a structured, community-centered process to design, build, and sustain water, hygiene, and sanitation systems—from assessment to long-term impact.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-white/90 shadow-xl shadow-black/20 text-base px-8">
                  <Link to="/projects" className="flex items-center gap-2">
                    <Play className="w-4 h-4" /> View Our Projects
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/20 text-base px-8">
                  <Link to="/partners">Partner With Us</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/80 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: INTERACTIVE WORKFLOW TIMELINE */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.08),transparent_40%)]" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              THE JOURNEY
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Our Project{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Workflow
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A proven 8-step process that ensures quality, community involvement, and lasting results.
            </p>
          </motion.div>

          {/* Interactive Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              const colors = stepColors[index];
              const isActive = activeStep === index;
              
              return (
                <motion.div
                  key={step.number}
                  className="relative group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  onClick={() => setActiveStep(isActive ? null : index)}
                  onMouseEnter={() => setActiveStep(index)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  {/* Connection line */}
                  {index < workflowSteps.length - 1 && index !== 3 && (
                    <div className="hidden lg:block absolute top-16 left-full w-6 h-0.5 bg-gradient-to-r from-gray-300 to-transparent z-0" />
                  )}
                  
                  <motion.div 
                    className={`relative h-full bg-white rounded-2xl p-6 border-2 transition-all duration-300 overflow-hidden ${
                      isActive ? `border-transparent shadow-2xl ${colors.glow}` : 'border-gray-100 shadow-lg hover:shadow-xl'
                    }`}
                    whileHover={{ y: -8 }}
                    layout
                  >
                    {/* Gradient overlay when active */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 transition-opacity duration-300`}
                      animate={{ opacity: isActive ? 0.05 : 0 }}
                    />
                    
                    {/* Step number badge */}
                    <motion.div 
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.bg} text-white font-bold text-lg mb-4 shadow-lg relative z-10`}
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.4 }}
                    >
                      {step.number}
                    </motion.div>
                    
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl ${colors.light} flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-bold text-foreground mb-3 leading-tight">
                      {step.title}
                    </h3>
                    
                    {/* Points with animation */}
                    <motion.ul 
                      className="space-y-2"
                      initial={false}
                      animate={{ height: isActive ? 'auto' : '0', opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      {step.points.map((point, i) => (
                        <motion.li 
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: isActive ? 0 : -10, opacity: isActive ? 1 : 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <ChevronRight className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0`} />
                          <span>{point}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                    
                    {/* Click hint when not active */}
                    {!isActive && (
                      <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center">
                          <ChevronRight className="w-3 h-3" />
                        </span>
                        Click to explore
                      </p>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Progress indicator */}
          <motion.div 
            className="flex justify-center gap-2 mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {workflowSteps.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeStep === index 
                    ? `w-8 bg-gradient-to-r ${stepColors[index].bg}` 
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: WHY THIS APPROACH WORKS - Vibrant Cards */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 relative overflow-hidden">
        {/* Animated pattern */}
        <div className="absolute inset-0 opacity-10">
          <motion.div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }}
            animate={{ x: [0, 100], y: [0, 100] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              OUR PRINCIPLES
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Why This Approach Works
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Our methodology is built on principles that ensure lasting impact.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {valueCards.map((card, index) => {
              const Icon = card.icon;
              const isHovered = hoveredValue === index;
              
              return (
                <motion.div
                  key={card.title}
                  className="relative group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredValue(index)}
                  onMouseLeave={() => setHoveredValue(null)}
                >
                  <motion.div 
                    className="relative h-full bg-white rounded-3xl p-8 text-center overflow-hidden"
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Animated gradient background */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 transition-opacity duration-500`}
                      animate={{ opacity: isHovered ? 0.1 : 0 }}
                    />
                    
                    {/* Icon with gradient */}
                    <motion.div 
                      className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-3">{card.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{card.description}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: LINK TO REAL WORK - Visual Impact */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.05),transparent_70%)]" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4" />
              Real Impact, Real Communities
            </motion.div>
            
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">
              See Our Workflow{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                in Action
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Our workflow is proven through real projects delivered across communities and institutions throughout Ethiopia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-xl shadow-blue-500/25 text-base px-8">
                  <Link to="/projects" className="flex items-center gap-2">
                    Explore Our Projects <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild variant="outline" size="lg" className="border-2 text-base px-8">
                  <Link to="/our-story">Read Our Story</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: GLOBAL & REGIONAL WASH ALIGNMENT - Colorful Grid */}
      <section className="py-20 md:py-28 pb-32 bg-gradient-to-b from-slate-50 to-white relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              GLOBAL ALIGNMENT
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Global & Regional{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                WASH Alignment
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our work aligns with global and regional frameworks for sustainable development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {alignmentCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  className="relative group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <motion.div 
                    className={`relative h-full bg-white rounded-3xl p-8 text-center border-2 border-gray-100 overflow-hidden ${card.bgPattern}`}
                    whileHover={{ y: -8, borderColor: 'transparent' }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Hover gradient border effect */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />
                    
                    {/* Icon */}
                    <motion.div 
                      className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mx-auto mb-6 shadow-xl`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-2">{card.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{card.label}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6: FINAL CTA - Bold & Impactful */}
      <section className="py-24 md:py-32 relative z-10 bg-gradient-to-br from-primary via-primary to-water-dark">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-primary-foreground rounded-full" />
          <div className="absolute bottom-10 right-10 w-48 h-48 border-4 border-primary-foreground rounded-full" />
        </div>
        
        {/* Floating shapes */}
        <motion.div 
          className="absolute top-10 left-10 w-32 h-32 border-2 border-white/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-48 h-48 border-2 border-white/10 rounded-2xl"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium mb-8"
            >
              <Heart className="w-4 h-4" />
              Join Our Mission
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-8 leading-tight">
              Ready to Build Sustainable<br />
              <span className="text-primary-foreground/80">WASH Systems Together?</span>
            </h2>
            
            <p className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto">
              Partner with us to bring clean water and sanitation to communities in need.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="xl" variant="accent">
                  <Link to="/partners" className="flex items-center gap-2">
                    <Handshake className="w-5 h-5" /> Partner With Us
                  </Link>
                </Button>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="xl" variant="hero-outline">
                  <Link to="/donate" className="flex items-center gap-2">
                    <Heart className="w-5 h-5" /> Donate Now
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default HowWeDoIt;
