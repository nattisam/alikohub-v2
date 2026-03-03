import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Building2, Users2, Globe, Briefcase, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import partnerGenshifter from "@/assets/partner-genshifter.jpg";
import partnerAlikore from "@/assets/partner-alikore.png";
import partnerConshifter from "@/assets/partner-conshifter.png";
import partnerWefta from "@/assets/partner-wefta.png";
import partnerKindred from "@/assets/partner-kindred.png";

import partnerInvestorBg from "@/assets/partner-investor.jpg";
import partnerImplementerBg from "@/assets/partner-implementer.jpg";
import partnerGovernmentBg from "@/assets/partner-government.jpg";
import partnerVentureBg from "@/assets/partner-venture.jpg";

const ourPartners = [
  { name: "GenShifter Technologies", logo: partnerGenshifter },
  { name: "Alikore", logo: partnerAlikore },
  { name: "Conshifter Africa Alliance", logo: partnerConshifter },
  { name: "Kindred Hospitals", logo: partnerKindred },
];

const options = [
  {
    icon: Building2,
    title: "Partner as Investor",
    image: partnerInvestorBg,
  },
  {
    icon: Users2,
    title: "Partner as Implementer",
    image: partnerImplementerBg,
  },
  {
    icon: Globe,
    title: "Partner as Government",
    image: partnerGovernmentBg,
  },
  {
    icon: Briefcase,
    title: "Partner as Our Next Venture",
    image: partnerVentureBg,
  },
];

const partnershipTypes = [
  "Investor",
  "Implementer",
  "Government",
  "Next Venture Partner",
  "Other",
];

const Partnership = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organization: "",
    role: "",
    partnershipInterest: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.organization || !formData.partnershipInterest) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    toast({ title: "Inquiry submitted!", description: "Our partnerships team will respond within 2 business days." });
    setFormData({ fullName: "", email: "", organization: "", role: "", partnershipInterest: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-card to-background py-20 lg:py-28">
        <div className="container mx-auto px-6 text-center">
          <motion.span
            className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            How to Engage
          </motion.span>
          <motion.h1
            className="font-heading text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Partnership{" "}
            <span className="text-gradient-amber">Options</span>
          </motion.h1>
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Multiple pathways to support and collaborate with AlikoHub.
          </motion.p>
        </div>
      </section>

      {/* Cards */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {options.map((opt, i) => (
              <motion.div
                key={opt.title}
                className="group relative overflow-hidden rounded-2xl border border-border/60 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:scale-[1.01] h-56"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <img
                  src={opt.image}
                  alt={opt.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="relative flex h-full flex-col items-start justify-end p-6">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/90 text-primary-foreground">
                    <opt.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-white">
                    {opt.title}
                  </h3>
                </div>
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
              {[...ourPartners, ...ourPartners].map((partner, i) => (
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

      {/* Partnership Form */}
      <section className="bg-muted/30 py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <motion.div
            className="mx-auto max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
              Get in Touch
            </span>
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Contact Our Team
            </h2>
            <p className="mt-3 text-muted-foreground">
              Complete the form below and a member of our partnerships team will respond within 2 business days.
            </p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    maxLength={100}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@organization.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    maxLength={255}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="organization">
                    Organization <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="organization"
                    placeholder="Organization name"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    maxLength={200}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Your Role</Label>
                  <Input
                    id="role"
                    placeholder="Your position"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    maxLength={100}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Partnership Interest <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.partnershipInterest}
                  onValueChange={(value) => setFormData({ ...formData, partnershipInterest: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select partnership type" />
                  </SelectTrigger>
                  <SelectContent>
                    {partnershipTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your interest and how you would like to engage..."
                  className="min-h-[140px]"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  maxLength={1000}
                />
              </div>

              <Button type="submit" size="lg" className="bg-primary text-primary-foreground hover:bg-amber-light shadow-[var(--shadow-amber)]">
                Submit Inquiry <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Partnership;
