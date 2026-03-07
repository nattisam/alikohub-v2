import { useState } from "react";
import { Layout } from "@/components/categories/stem/layout/Layout";
import { Button } from "@/components/categories/stem/ui/button";
import { Card, CardContent } from "@/components/categories/stem/ui/card";
import { Input } from "@/components/categories/stem/ui/input";
import { Textarea } from "@/components/categories/stem/ui/textarea";
import { Label } from "@/components/categories/stem/ui/label";
import { Checkbox } from "@/components/categories/stem/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/categories/stem/ui/select";
import { 
  Building2, 
  Factory, 
  GraduationCap, 
  Landmark, 
  Globe, 
  CheckCircle2,
  ArrowRight,
  Users,
  BookOpen,
  Settings,
  MonitorPlay
} from "lucide-react";
import { toast } from "sonner";

const whoWeServe = [
  { icon: Factory, title: "Engineering & Construction Firms", description: "EPC contractors and engineering consultancies", iconBg: "bg-primary/15 border border-primary/30", iconColor: "text-primary" },
  { icon: Building2, title: "Infrastructure & Utilities", description: "Power, water, and transportation authorities", iconBg: "bg-accent/15 border border-accent/30", iconColor: "text-accent" },
  { icon: GraduationCap, title: "Universities & TVETs", description: "Engineering faculties and technical institutes", iconBg: "bg-accent-green/15 border border-accent-green/30", iconColor: "text-accent-green" },
  { icon: Landmark, title: "Government Agencies", description: "Infrastructure and development ministries", iconBg: "bg-primary/15 border border-primary/30", iconColor: "text-primary" },
  { icon: Globe, title: "NGOs & Development Partners", description: "International development organizations", iconBg: "bg-primary/15 border border-primary/30", iconColor: "text-primary" },
];

const trainingModels = [
  { icon: BookOpen, title: "Custom Curriculum Design", description: "Tailored content aligned to your technology stack and workflows", iconBg: "bg-primary/15", iconColor: "text-primary" },
  { icon: Users, title: "Cohort-Based Training", description: "Structured programs for groups of 10-100+ participants", iconBg: "bg-accent/15", iconColor: "text-accent" },
  { icon: GraduationCap, title: "Faculty & Trainer Enablement", description: "Train-the-trainer programs for internal capacity building", iconBg: "bg-accent-green/15", iconColor: "text-accent-green" },
  { icon: Settings, title: "Software Transformation Support", description: "Implementation support during technology transitions", iconBg: "bg-primary/15", iconColor: "text-primary" },
  { icon: MonitorPlay, title: "Flexible Delivery", description: "Online, hybrid, or fully onsite options", iconBg: "bg-primary/15", iconColor: "text-primary" },
];

const programAreas = [
  "Civil & Structural Engineering Systems",
  "BIM & Digital Construction",
  "Mechanical CAD / CAE / FEA",
  "Electrical & Power Systems",
  "Project Controls & Planning",
];

const organizationTypes = [
  "Engineering/Construction Firm",
  "Infrastructure/Utilities",
  "University/Academic Institution",
  "Government Agency",
  "NGO/Development Partner",
  "Other",
];

const Enterprise = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: "",
    contactName: "",
    email: "",
    phone: "",
    organizationType: "",
    trainingAreas: [] as string[],
    participantCount: "",
    deliveryPreference: "",
    location: "",
    timeframe: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Mock submission - replace with real API call when backend is available
      console.log('Enterprise inquiry submitted:', formData);
      toast.success("Thank you for your inquiry!", {
        description: "Our enterprise training team will contact you within 2 business days.",
      });
      setFormData({
        organizationName: "", contactName: "", email: "", phone: "",
        organizationType: "", trainingAreas: [], participantCount: "",
        deliveryPreference: "", location: "", timeframe: "", notes: "",
      });
    } catch (err: any) {
      toast.error("Failed to submit", { description: err.message || "Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTrainingArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      trainingAreas: prev.trainingAreas.includes(area)
        ? prev.trainingAreas.filter(a => a !== area)
        : [...prev.trainingAreas, area]
    }));
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero py-20 lg:py-28">
        <div className="container-content">
          <div className="max-w-3xl">
            <h1 className="font-display text-5xl font-extrabold text-foreground sm:text-6xl leading-tight">
              Customized <span className="text-accent-green">Engineering</span> & STEM Training
            </h1>
            <p className="mt-6 text-xl text-[hsl(210_30%_82%)] leading-relaxed">
              Cohort-based upskilling, curriculum customization, and faculty enablement 
              aligned to industry tools and infrastructure workflows.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="section-padding bg-surface-elevated border-y border-divider">
        <div className="container-content">
          <h2 className="font-display text-4xl font-bold text-foreground text-center mb-14">
            Who We <span className="text-primary">Serve</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {whoWeServe.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="border-divider text-center card-hover bg-card">
                  <CardContent className="p-7">
                    <div className={`h-14 w-14 rounded-xl ${item.iconBg} flex items-center justify-center mx-auto`}>
                      <Icon className={`h-7 w-7 ${item.iconColor}`} />
                    </div>
                    <h3 className="mt-5 font-display font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Training Models */}
      <section className="section-padding">
        <div className="container-content">
          <h2 className="font-display text-4xl font-bold text-foreground text-center mb-5">
            Training <span className="text-accent">Models</span>
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-14">
            Flexible training solutions designed to meet your organization's unique requirements
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {trainingModels.map((model) => {
              const Icon = model.icon;
              return (
                <Card key={model.title} className="border-divider card-hover bg-card w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]">
                  <CardContent className="p-7 flex items-start gap-5">
                    <div className={`h-12 w-12 rounded-xl ${model.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-6 w-6 ${model.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-foreground">
                        {model.title}
                      </h3>
                      <p className="mt-2 text-base text-muted-foreground leading-relaxed">
                        {model.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Program Areas */}
      <section className="section-padding bg-surface-elevated border-y border-divider">
        <div className="container-content">
          <h2 className="font-display text-4xl font-bold text-foreground text-center mb-14">
            Program <span className="text-accent-green">Areas</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {programAreas.map((area) => (
              <div
                key={area}
                className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-card border border-primary/25 shadow-lg hover:shadow-primary/15 transition-all duration-300"
              >
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <span className="font-bold text-foreground text-lg">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section className="section-padding" id="request-form">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl font-bold text-foreground">
                Request a <span className="text-primary">Training Proposal</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Tell us about your training needs and our team will prepare a customized proposal.
              </p>
            </div>

            <Card className="border-divider bg-card shadow-2xl">
              <CardContent className="p-8 lg:p-10">
                <form onSubmit={handleSubmit} className="space-y-7">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="organizationName" className="font-bold">Organization Name *</Label>
                      <Input id="organizationName" required value={formData.organizationName} onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))} placeholder="Your organization" className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organizationType" className="font-bold">Organization Type *</Label>
                      <Select value={formData.organizationType} onValueChange={(value) => setFormData(prev => ({ ...prev, organizationType: value }))}>
                        <SelectTrigger id="organizationType" className="bg-background h-12"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent className="bg-card border-divider">
                          {organizationTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="contactName" className="font-bold">Contact Person *</Label>
                      <Input id="contactName" required value={formData.contactName} onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))} placeholder="Full name" className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-bold">Email Address *</Label>
                      <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} placeholder="email@organization.com" className="h-12" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-bold">Phone Number</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} placeholder="+1 234 567 8900" className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="font-bold">Country / City *</Label>
                      <Input id="location" required value={formData.location} onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))} placeholder="e.g., Dubai, UAE" className="h-12" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-bold">Training Areas of Interest *</Label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {programAreas.map((area) => (
                        <div key={area} className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 border border-divider">
                          <Checkbox id={area} checked={formData.trainingAreas.includes(area)} onCheckedChange={() => toggleTrainingArea(area)} />
                          <label htmlFor={area} className="text-sm font-semibold leading-none cursor-pointer text-foreground">{area}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="participantCount" className="font-bold">Participants</Label>
                      <Input id="participantCount" type="number" min="1" value={formData.participantCount} onChange={(e) => setFormData(prev => ({ ...prev, participantCount: e.target.value }))} placeholder="e.g., 25" className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryPreference" className="font-bold">Delivery</Label>
                      <Select value={formData.deliveryPreference} onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryPreference: value }))}>
                        <SelectTrigger id="deliveryPreference" className="bg-background h-12"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent className="bg-card border-divider">
                          <SelectItem value="Online">Online</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                          <SelectItem value="Onsite">Onsite</SelectItem>
                          <SelectItem value="Flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeframe" className="font-bold">Timeframe</Label>
                      <Input id="timeframe" value={formData.timeframe} onChange={(e) => setFormData(prev => ({ ...prev, timeframe: e.target.value }))} placeholder="e.g., Q2 2026" className="h-12" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="font-bold">Additional Notes</Label>
                    <Textarea id="notes" rows={4} value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} placeholder="Tell us more about your training needs..." />
                  </div>

                  <Button type="submit" size="lg" variant="hero" className="w-full sm:w-auto" disabled={isSubmitting || formData.trainingAreas.length === 0}>
                    {isSubmitting ? "Submitting..." : "Submit Training Request"}
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

export default Enterprise;
