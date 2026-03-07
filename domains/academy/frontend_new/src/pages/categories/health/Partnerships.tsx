import { useState } from "react";
import { Layout } from "@/components/categories/health/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Handshake,
  Building2,
  Stethoscope,
  GraduationCap,
  Users,
  Globe,
  CheckCircle2,
  ArrowRight,
  Send,
} from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const partnershipTypes = [
  { value: "clinical_site", label: "Clinical Training Site" },
  { value: "hiring_partner", label: "Hiring / Employment Partner" },
  { value: "sponsorship", label: "Workforce Sponsorship" },
  { value: "educational", label: "Educational Collaboration" },
  { value: "community", label: "Community Organization" },
  { value: "other", label: "Other" },
];

const organizationTypes = [
  { value: "hospital", label: "Hospital / Health System" },
  { value: "clinic", label: "Clinic / Medical Practice" },
  { value: "skilled_nursing", label: "Skilled Nursing / Long-Term Care" },
  { value: "home_health", label: "Home Health Agency" },
  { value: "government", label: "Government Agency" },
  { value: "nonprofit", label: "Nonprofit Organization" },
  { value: "corporation", label: "Corporation / Employer" },
  { value: "educational", label: "Educational Institution" },
  { value: "other", label: "Other" },
];

const benefits = [
  {
    icon: Stethoscope,
    title: "Clinical Training Sites",
    description:
      "Host students for supervised clinical rotations and practical skills training in your facility.",
  },
  {
    icon: Users,
    title: "Workforce Pipeline",
    description:
      "Access a steady pipeline of trained, job-ready healthcare professionals for your organization.",
  },
  {
    icon: GraduationCap,
    title: "Continuing Education",
    description:
      "Offer your staff access to our professional development and continuing education programs.",
  },
  {
    icon: Globe,
    title: "Community Impact",
    description:
      "Collaborate on community health initiatives and workforce development programs.",
  },
];

const Partnerships = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    organization_name: "",
    contact_name: "",
    email: "",
    phone: "",
    organization_type: "",
    partnership_type: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.organization_name ||
      !form.contact_name ||
      !form.email ||
      !form.organization_type ||
      !form.partnership_type
    ) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      // Mock API call for partnership inquiries
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitted(true);
      toast({
        title: "Partnership inquiry submitted!",
        description: "We'll be in touch soon.",
      });
    } catch (err: any) {
      toast({
        title: "Submission failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-card to-accent/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="container-academy relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-12 bg-accent rounded-full" />
            <span className="text-sm font-medium text-accent">
              Collaborate With Us
            </span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary">
            Partnership Opportunities
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Join our growing network of healthcare organizations dedicated to
            developing the next generation of healthcare professionals.
            Together, we can strengthen communities and transform lives.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 lg:py-16">
        <div className="container-academy">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-8">
            Why Partner With Aliko Academy?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((b) => (
              <Card
                key={b.title}
                className="group hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-transparent hover:border-primary/20"
              >
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <b.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {b.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {b.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Partnership Types */}
          <div className="bg-muted/30 rounded-2xl p-8 lg:p-10 mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Types of Partnerships
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partnershipTypes.map((pt) => (
                <div
                  key={pt.value}
                  className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border"
                >
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{pt.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg border-2 border-primary/10">
              <CardHeader className="text-center pb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Handshake className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">
                  Start a Partnership Conversation
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Tell us about your organization and how you'd like to
                  collaborate.
                </p>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      Thank You!
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Your partnership inquiry has been submitted. Our team will
                      review your information and reach out within 2–3 business
                      days.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Organization Name *</Label>
                        <Input
                          value={form.organization_name}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              organization_name: e.target.value,
                            })
                          }
                          placeholder="Your organization"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Name *</Label>
                        <Input
                          value={form.contact_name}
                          onChange={(e) =>
                            setForm({ ...form, contact_name: e.target.value })
                          }
                          placeholder="Full name"
                          className="h-11"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          placeholder="email@organization.com"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          type="tel"
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                          placeholder="(555) 000-0000"
                          className="h-11"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Organization Type *</Label>
                        <Select
                          value={form.organization_type}
                          onValueChange={(v) =>
                            setForm({ ...form, organization_type: v })
                          }
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {organizationTypes.map((ot) => (
                              <SelectItem key={ot.value} value={ot.value}>
                                {ot.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Partnership Interest *</Label>
                        <Select
                          value={form.partnership_type}
                          onValueChange={(v) =>
                            setForm({ ...form, partnership_type: v })
                          }
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select interest" />
                          </SelectTrigger>
                          <SelectContent>
                            {partnershipTypes.map((pt) => (
                              <SelectItem key={pt.value} value={pt.value}>
                                {pt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Textarea
                        value={form.message}
                        onChange={(e) =>
                          setForm({ ...form, message: e.target.value })
                        }
                        placeholder="Tell us more about your organization and partnership goals..."
                        rows={4}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 text-base"
                      disabled={submitting}
                    >
                      {submitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          Submit Partnership Inquiry
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Partnerships;
