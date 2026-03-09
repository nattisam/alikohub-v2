import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const RequestProposal = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    event_type: "",
    estimated_attendees: "",
    preferred_date: "",
    location: "",
    message: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // For now we just show success — leads table can be added later
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
    toast.success("Proposal request submitted!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar portal="professional" />
        <div className="container mx-auto px-4 py-32 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Thank you for your request.</h1>
            <p className="text-muted-foreground font-body max-w-md mx-auto">
              Our team will review your details and contact you shortly to discuss next steps.
            </p>
          </motion.div>
        </div>
        <Footer portal="professional" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar portal="professional" />

      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">Let's build your event together.</h1>
            <p className="text-lg text-primary-foreground/80 font-body max-w-2xl mx-auto">
              Tell us about your upcoming event. Our team will review your request and respond within 48 hours.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-muted-foreground font-body mb-8">
            Please provide as much detail as possible to help us understand your event objectives and scope.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body">Full Name *</Label>
                <Input required value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="font-body">Email *</Label>
                <Input type="email" required value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body">Phone</Label>
                <Input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="font-body">Organization</Label>
                <Input value={form.organization} onChange={(e) => handleChange("organization", e.target.value)} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body">Event Type *</Label>
                <Select required value={form.event_type} onValueChange={(v) => handleChange("event_type", v)}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conference">Conference & Summit</SelectItem>
                    <SelectItem value="corporate">Corporate Event</SelectItem>
                    <SelectItem value="hybrid">Hybrid / Virtual</SelectItem>
                    <SelectItem value="launch">Product / Media Launch</SelectItem>
                    <SelectItem value="ceremony">Ceremony / Inauguration</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-body">Estimated Attendees</Label>
                <Input value={form.estimated_attendees} onChange={(e) => handleChange("estimated_attendees", e.target.value)} placeholder="e.g. 200" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body">Preferred Date</Label>
                <Input type="date" value={form.preferred_date} onChange={(e) => handleChange("preferred_date", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="font-body">Location / City</Label>
                <Input value={form.location} onChange={(e) => handleChange("location", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-body">Tell us about your event *</Label>
              <Textarea required rows={5} value={form.message} onChange={(e) => handleChange("message", e.target.value)} placeholder="Describe your event goals, audience, and any specific requirements..." />
            </div>
            <Button type="submit" size="lg" disabled={loading} className="w-full font-body bg-primary text-primary-foreground hover:bg-primary/90">
              {loading ? "Submitting..." : "Submit Request"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        </div>
      </section>

      <Footer portal="professional" />
    </div>
  );
};

export default RequestProposal;
