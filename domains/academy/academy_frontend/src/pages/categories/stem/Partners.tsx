import { useState } from "react";
import { Layout } from "@/components/categories/stem/layout/Layout";
import { Button } from "@/components/categories/stem/ui/button";
import { Card, CardContent } from "@/components/categories/stem/ui/card";
import { Input } from "@/components/categories/stem/ui/input";
import { Textarea } from "@/components/categories/stem/ui/textarea";
import { Label } from "@/components/categories/stem/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/categories/stem/ui/select";
import { partners, partnerCategories, getPartnersByCategory } from "@/data/categories/stem/partners";
import { ArrowRight, Handshake, Users, Cog } from "lucide-react";
import { toast } from "sonner";

const categoryStyles: Record<string, { icon: typeof Users; iconBg: string; iconColor: string; titleColor: string }> = {
  "Academic & Institutional": { icon: Users, iconBg: "bg-primary/15 border border-primary/30", iconColor: "text-primary", titleColor: "text-primary" },
  "Enterprise & Workforce": { icon: Handshake, iconBg: "bg-accent-orange/15 border border-accent-orange/30", iconColor: "text-accent-orange", titleColor: "text-accent-orange" },
  "Technology Ecosystem": { icon: Cog, iconBg: "bg-accent-green/15 border border-accent-green/30", iconColor: "text-accent-green", titleColor: "text-accent-green" },
};

const Partners = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "", organization: "", email: "", partnershipInterest: "", notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Thank you for your interest!", { description: "Our partnerships team will review your inquiry." });
    setFormData({ name: "", organization: "", email: "", partnershipInterest: "", notes: "" });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <section className="gradient-hero py-20 lg:py-28">
        <div className="container-content">
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl font-extrabold text-foreground">
              Our <span className="text-accent">Partners</span>
            </h1>
            <p className="mt-5 text-xl text-[hsl(210_30%_82%)] leading-relaxed">
              Aliko Academy STEM collaborates with academic institutions, enterprises, 
              and technology ecosystems to deliver industry-aligned engineering training.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-content space-y-16">
          {partnerCategories.map((category) => {
            const style = categoryStyles[category];
            const Icon = style?.icon || Users;
            const categoryPartners = getPartnersByCategory(category);

            return (
              <div key={category}>
                <div className="flex items-center gap-4 mb-8">
                  <div className={`h-12 w-12 rounded-xl ${style?.iconBg || 'bg-primary/15'} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${style?.iconColor || 'text-primary'}`} />
                  </div>
                  <h2 className={`font-display text-3xl font-bold ${style?.titleColor || 'text-foreground'}`}>
                    {category}
                  </h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryPartners.map((partner) => (
                    <Card key={partner.id} className="border-divider card-hover bg-card">
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg text-foreground">
                          {partner.name}
                        </h3>
                        {partner.description && (
                          <p className="mt-2 text-base text-muted-foreground leading-relaxed">
                            {partner.description}
                          </p>
                        )}
                        {partner.website && (
                          <a href={partner.website} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center text-sm font-bold text-primary hover:underline">
                            Visit Website
                            <ArrowRight className="ml-1 h-3.5 w-3.5" />
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-10 bg-surface-elevated border-y border-divider">
        <div className="container-content">
          <p className="text-sm text-[hsl(210_30%_78%)] text-center max-w-3xl mx-auto leading-relaxed">
            The technology ecosystems listed represent platforms and tools covered in our curriculum. 
            Aliko Academy STEM provides industry-aligned training based on official vendor documentation 
            and best practices.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-content">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl font-bold text-foreground">
                Become a <span className="text-accent-green">Partner</span>
              </h2>
              <p className="mt-4 text-lg text-[hsl(210_30%_82%)]">
                Interested in partnering with Aliko Academy STEM?
              </p>
            </div>

            <Card className="border-divider bg-card shadow-2xl">
              <CardContent className="p-8 lg:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-bold">Your Name *</Label>
                      <Input id="name" required value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="Full name" className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organization" className="font-bold">Organization *</Label>
                      <Input id="organization" required value={formData.organization} onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))} placeholder="Organization name" className="h-12" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-bold">Email *</Label>
                      <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} placeholder="email@organization.com" className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="partnershipInterest" className="font-bold">Partnership Interest</Label>
                      <Select value={formData.partnershipInterest} onValueChange={(value) => setFormData(prev => ({ ...prev, partnershipInterest: value }))}>
                        <SelectTrigger id="partnershipInterest" className="bg-background h-12"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent className="bg-card border-divider">
                          <SelectItem value="academic">Academic Partnership</SelectItem>
                          <SelectItem value="enterprise">Enterprise Partnership</SelectItem>
                          <SelectItem value="technology">Technology Partnership</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="font-bold">Tell us more</Label>
                    <Textarea id="notes" rows={4} value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} placeholder="Describe how you'd like to partner..." />
                  </div>
                  <Button type="submit" size="lg" variant="hero" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Partners;
