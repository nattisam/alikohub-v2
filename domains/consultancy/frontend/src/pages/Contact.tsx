import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

const contactInfo = [
  { icon: Mail, title: "Email", detail: "hello@alikoconsultancy.com" },
  { icon: Phone, title: "Phone", detail: "+1 (555) 000-0000" },
  { icon: MapPin, title: "Office", detail: "123 Business Avenue, Suite 100" },
  { icon: Clock, title: "Hours", detail: "Mon-Fri, 9:00 AM - 5:00 PM" },
];

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/consultancy/contact", form);
      toast({ title: "Message Sent", description: "We'll get back to you within 24 hours." });
      setForm({ fullName: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.response?.data?.message || "Failed to send message.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="bg-navy section-padding">
        <div className="container-wide">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent mb-4 block">Contact</span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-6">Get in Touch</h1>
            <p className="text-primary-foreground/70 text-lg">We'd love to hear from you. Reach out and we'll respond within 24 hours.</p>
          </div>
        </div>
      </section>
      <section className="bg-gradient-warm">
        <div className="container-wide py-8 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contactInfo.map((c, i) => {
              const styles = ["card-navy-subtle", "card-gold-subtle", "card-teal-subtle", "card-forest-subtle"];
              return (
                <div key={c.title} className={`${styles[i]} rounded-xl p-5 text-center card-hover`}>
                  <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center mx-auto mb-3">
                    <c.icon className="w-5 h-5 text-accent" />
                  </div>
                  <p className="font-semibold text-sm text-primary mb-1">{c.title}</p>
                  <p className="text-muted-foreground text-xs">{c.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-narrow">
          <div className="bg-card border border-border rounded-xl p-8 md:p-12 max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-primary mb-6 text-center">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Full Name" required className="bg-background" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                <Input type="email" placeholder="Email Address" required className="bg-background" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <Input placeholder="Subject" required className="bg-background" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              <Textarea placeholder="Your message..." rows={5} required className="bg-background" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              <Button type="submit" disabled={loading} className="w-full bg-gold text-navy hover:bg-gold/90 font-semibold px-8 py-5">
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
