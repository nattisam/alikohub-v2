import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Landmark, Building2, GraduationCap, Globe, Users, Lightbulb, HeartHandshake } from "lucide-react";

import partnerGenshifter from "@/assets/partner-genshifter.jpg";
import partnerAlikore from "@/assets/partner-alikore.png";
import partnerConshifter from "@/assets/partner-conshifter.png";
import partnerWefta from "@/assets/partner-wefta.png";
import partnerKindred from "@/assets/partner-kindred.png";

const categories = [
  { icon: Landmark, title: "Government Ministries & Agencies" },
  { icon: Building2, title: "Private Sector Companies" },
  { icon: GraduationCap, title: "Academic & Training Institutions" },
  { icon: Globe, title: "Development Partners & Donors" },
  { icon: Users, title: "Community-Based Organizations" },
  { icon: HeartHandshake, title: "Global Health & One Health Networks" },
  { icon: Lightbulb, title: "Entrepreneurship & Innovation Ecosystem" },
];

const partners = [
  { name: "GenShifter Technologies", logo: partnerGenshifter },
  { name: "Alikore", logo: partnerAlikore },
  { name: "Conshifter Africa Alliance", logo: partnerConshifter },
  { name: "Kindred Hospitals", logo: partnerKindred },
];

const Partners = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Partnership Categories */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            className="mx-auto mb-16 max-w-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
              Partnership Strategy
            </span>
            <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
              Multi-Sector <span className="text-gradient-amber">Collaboration</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Strong partnerships with government, private sector, academia, and development partners to maximize youth impact across all hub countries.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border/50 p-6 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)] hover:scale-[1.02]"
                style={{ background: "var(--gradient-card)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <cat.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading text-sm font-semibold text-foreground leading-tight">{cat.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Partners */}
      <section className="border-t border-border/50 py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <motion.div
            className="mx-auto mb-14 max-w-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
              Who We Work With
            </span>
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Our <span className="text-gradient-amber">Partners</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              We collaborate with leading organizations committed to youth empowerment and sustainable development across Africa.
            </p>
          </motion.div>

          <div className="relative overflow-hidden">
            <div className="animate-marquee flex w-max items-center gap-16 lg:gap-24">
              {[...partners, ...partners].map((partner, i) => (
                <div
                  key={`${partner.name}-${i}`}
                  className="flex h-44 w-80 shrink-0 items-center justify-center px-4"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-40 max-w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Partners;
