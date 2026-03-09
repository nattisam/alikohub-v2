import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, ClipboardList, Globe, Mic, Award, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const whyChoose = [
  { text: "Detail-driven project management", color: "text-teal bg-teal/10" },
  { text: "Transparent budgeting and accountability", color: "text-indigo bg-indigo/10" },
  { text: "Technology-enabled registration and reporting", color: "text-coral bg-coral/10" },
  { text: "Experienced production team", color: "text-violet bg-violet/10" },
  { text: "Multicultural and international experience", color: "text-emerald bg-emerald/10" },
];

const coreServices = [
  { icon: ClipboardList, title: "Complete Event Management", desc: "We manage every aspect of your event — from concept development and vendor sourcing to onsite execution and final reporting.", image: "/images/conference-hall.jpg", accent: "border-t-4 border-t-teal" },
  { icon: Award, title: "Corporate & Government Events", desc: "We design professional events aligned with institutional standards, stakeholder expectations, and policy requirements.", image: "/images/corporate-event.jpg", accent: "border-t-4 border-t-indigo" },
  { icon: Globe, title: "Hybrid & Virtual Event Production", desc: "We combine production quality, digital engagement tools, and audience interaction to create dynamic hybrid experiences.", image: "/images/hybrid-event.jpg", accent: "border-t-4 border-t-sky" },
  { icon: Mic, title: "Launch & Media Events", desc: "We deliver launch events designed to amplify brand presence and engage press, partners, and clients.", image: "/images/media-launch.jpg", accent: "border-t-4 border-t-coral" },
  { icon: Users, title: "Conferences & Multi-Day Programs", desc: "We manage multi-session, multi-speaker, multi-day conferences with precision and structure.", image: "/images/summit-stage.jpg", accent: "border-t-4 border-t-violet" },
  { icon: BarChart3, title: "Ceremonies & Official Inaugurations", desc: "Protocol-conscious events with structured sequencing and seamless coordination.", image: "/images/vip-protocol.jpg", accent: "border-t-4 border-t-amber" },
];

const coverageGrid = [
  { text: "Event Strategy & Concept", color: "border-l-4 border-l-teal bg-teal/5" },
  { text: "Budget Development & Procurement", color: "border-l-4 border-l-indigo bg-indigo/5" },
  { text: "Registration & Ticketing", color: "border-l-4 border-l-coral bg-coral/5" },
  { text: "Agenda & Speaker Management", color: "border-l-4 border-l-sky bg-sky/5" },
  { text: "Vendor & Venue Coordination", color: "border-l-4 border-l-violet bg-violet/5" },
  { text: "VIP & Protocol Support", color: "border-l-4 border-l-amber bg-amber/5" },
  { text: "Onsite Operations & Staffing", color: "border-l-4 border-l-emerald bg-emerald/5" },
  { text: "Post-Event Reporting & Analytics", color: "border-l-4 border-l-rose bg-rose/5" },
];

const ProfessionalServices = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar portal="professional" />

      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">Our Services</h1>
            <p className="text-lg text-primary-foreground/80 font-body max-w-2xl mx-auto">
              Strategic event planning backed by operational excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-foreground text-center mb-12">Why Choose Aliko Events</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {whyChoose.map((item, i) => {
            const [textColor, bgColor] = item.color.split(" ");
            return (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border"
              >
                <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}>
                  <CheckCircle className={`w-4 h-4 ${textColor}`} />
                </div>
                <span className="font-body text-foreground">{item.text}</span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Core Services — with thumbnails */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Core Services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreServices.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-xl bg-card border border-border shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden group ${s.accent}`}
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <s.icon className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-display text-lg font-semibold text-foreground">{s.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Grid — colorful backgrounds */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-foreground text-center mb-4">All Bases Covered</h2>
        <p className="text-center text-muted-foreground font-body mb-12 max-w-xl mx-auto">
          Every element of your event, handled with care.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {coverageGrid.map((item, i) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 rounded-lg border border-border text-left shadow-card hover:shadow-elevated transition-all ${item.color}`}
            >
              <span className="text-sm font-semibold font-body text-foreground">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-primary py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">Ready to get started?</h2>
          <Link to="/professional/request-proposal">
            <Button size="lg" className="font-body bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
              Request Proposal
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer portal="professional" />
    </div>
  );
};

export default ProfessionalServices;
