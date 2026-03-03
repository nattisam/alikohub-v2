import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapPin, Globe } from "lucide-react";

const hubs = [
  { country: "Ethiopia", city: "Addis Ababa", target: "10,000", focus: "Digital Health, One Health, STEM, FinTech, AgriTech", status: "Active", timeline: "Year 1", region: "Africa" },
  { country: "Kenya", city: "Nairobi", target: "7,000", focus: "FinTech, Digital Skills, Entrepreneurship", status: "Planned", timeline: "Years 2–3", region: "Africa" },
  { country: "Nigeria", city: "Lagos", target: "8,000", focus: "Creative Economy, FinTech", status: "Planned", timeline: "Years 2–3", region: "Africa" },
  { country: "Rwanda", city: "Kigali", target: "5,000", focus: "Smart Tech, AI", status: "Planned", timeline: "Years 2–3", region: "Africa" },
  { country: "Ghana", city: "Accra", target: "5,000", focus: "Pan-African Digital Skills", status: "Planned", timeline: "Years 2–3", region: "Africa" },
  { country: "South Africa", city: "Johannesburg", target: "5,000", focus: "Advanced Digital Skills", status: "Future", timeline: "Years 4–5", region: "Africa" },
  { country: "Tanzania", city: "Dar es Salaam", target: "3,000", focus: "Blue Economy", status: "Future", timeline: "Years 4–5", region: "Africa" },
  { country: "Senegal", city: "Dakar", target: "3,000", focus: "Francophone Digital Skills", status: "Future", timeline: "Years 4–5", region: "Africa" },
  { country: "Uganda", city: "Kampala", target: "2,000", focus: "AgriTech", status: "Future", timeline: "Years 4–5", region: "Africa" },
  { country: "Morocco", city: "Casablanca", target: "2,000", focus: "North Africa Digital Skills", status: "Future", timeline: "Years 4–5", region: "Africa" },
  { country: "UAE", city: "Dubai", target: "1,500", focus: "FinTech, Innovation Partnerships, Diaspora Engagement", status: "Planned", timeline: "Years 3–4", region: "Middle East" },
  { country: "Germany", city: "Berlin", target: "1,000", focus: "Tech Transfer, Diaspora Skills Bridge", status: "Planned", timeline: "Years 3–4", region: "Europe" },
  { country: "United Kingdom", city: "London", target: "1,000", focus: "Impact Investment, Policy & Advocacy", status: "Future", timeline: "Years 4–5", region: "Europe" },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-500/20 text-green-400",
  Planned: "bg-primary/20 text-primary",
  Future: "bg-muted text-muted-foreground",
};

const Hubs = () => {
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
              Regional Presence
            </span>
            <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
              Innovation Hubs Across <span className="text-gradient-amber">Africa</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              10+ regional hubs across Africa, Europe, and the Middle East — with 90% of our footprint rooted in Africa — where youth learn, practice, innovate, and connect with real opportunity.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hubs.map((hub, i) => (
              <motion.div
                key={hub.country}
                className="group rounded-2xl border border-border/50 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)] hover:scale-[1.02]"
                style={{ background: "var(--gradient-card)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-xl font-bold text-foreground">{hub.country}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[hub.status]}`}>
                    {hub.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  {hub.city} · {hub.timeline}
                  <span className="ml-auto flex items-center gap-1 text-xs opacity-70">
                    <Globe className="h-3 w-3" />
                    {hub.region}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{hub.focus}</p>
                <div className="text-2xl font-heading font-bold text-primary">{hub.target}</div>
                <p className="text-xs text-muted-foreground">Youth Target</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Hubs;
