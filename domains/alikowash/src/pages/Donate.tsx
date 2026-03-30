import { forwardRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Droplets, 
  Heart, 
  Users, 
  Building, 
  Sparkles,
  CheckCircle2,
  Mail,
  Globe,
  DollarSign,
  MessageSquare,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { z } from "zod";

const donationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address").max(255),
  country: z.string().min(2, "Country is required").max(100),
  amount: z.number().min(1, "Amount must be at least $1"),
  message: z.string().max(500).optional(),
});

const impactItems = [
  { 
    icon: Droplets, 
    title: "Safe Water Access",
    description: "Providing clean, safe drinking water to communities"
  },
  { 
    icon: Heart, 
    title: "Community Health",
    description: "Reducing waterborne diseases and improving lives"
  },
  { 
    icon: Building, 
    title: "Sustainable Infrastructure",
    description: "Building systems that last for generations"
  },
  { 
    icon: Users, 
    title: "Generational Impact",
    description: "Creating lasting change for future generations"
  },
];

const presetAmounts = [25, 50, 100, 250, 500, 1000];

const Donate = forwardRef<HTMLDivElement>((_, ref) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const getFinalAmount = () => {
    if (customAmount) return parseFloat(customAmount) || 0;
    return selectedAmount || 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const amount = getFinalAmount();
    
    const validation = donationSchema.safeParse({
      ...formData,
      amount,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("donations").insert({
        donor_name: formData.name,
        email: formData.email,
        country: formData.country,
        amount,
        message: formData.message || null,
      });

      if (error) throw error;
      
      setSubmitted(true);
      toast({
        title: "Thank you for your support!",
        description: "We will contact you shortly with next steps.",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <div ref={ref} className="min-h-[70vh] flex items-center justify-center section-padding">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-lg mx-auto"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Thank You for Supporting Aliko Wash
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              We will contact you shortly with next steps. Your contribution helps 
              bring clean water to communities in need.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <Link to="/projects">View Our Projects</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/our-story">Read Our Story</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div ref={ref}>
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary via-primary to-water-dark overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-64 h-64 border-4 border-primary-foreground rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 border-4 border-primary-foreground rounded-full" />
          </div>
          
          <div className="container-main relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium mb-6">
                Make a Difference
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Support Clean Water.
                <br />
                <span className="text-accent">Support Life.</span>
              </h1>
              <p className="text-xl text-primary-foreground/80 leading-relaxed">
                Your contribution helps build sustainable water, hygiene, and 
                sanitation systems for communities who need them most.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-16 bg-secondary/50">
          <div className="container-main">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {impactItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 bg-card rounded-2xl shadow-card"
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Donation Form Section */}
        <section className="section-padding">
          <div className="container-main">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-card rounded-2xl p-8 shadow-card">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Make Your Donation
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Amount Selection */}
                    <div>
                      <Label className="text-foreground font-medium mb-3 block">
                        Select Amount (USD)
                      </Label>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        {presetAmounts.map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => handleAmountSelect(amount)}
                            className={`p-3 rounded-xl border-2 font-semibold transition-all ${
                              selectedAmount === amount
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-background text-foreground hover:border-primary/50"
                            }`}
                          >
                            ${amount}
                          </button>
                        ))}
                      </div>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="Custom amount"
                          value={customAmount}
                          onChange={(e) => handleCustomAmountChange(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      {errors.amount && (
                        <p className="text-destructive text-sm mt-1">{errors.amount}</p>
                      )}
                    </div>

                    {/* Name */}
                    <div>
                      <Label htmlFor="name" className="text-foreground font-medium">
                        Your Name *
                      </Label>
                      <div className="relative mt-2">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-destructive text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="text-foreground font-medium">
                        Email Address *
                      </Label>
                      <div className="relative mt-2">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-destructive text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Country */}
                    <div>
                      <Label htmlFor="country" className="text-foreground font-medium">
                        Country *
                      </Label>
                      <div className="relative mt-2">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="country"
                          placeholder="Your country"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                      {errors.country && (
                        <p className="text-destructive text-sm mt-1">{errors.country}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <Label htmlFor="message" className="text-foreground font-medium">
                        Message (Optional)
                      </Label>
                      <div className="relative mt-2">
                        <Textarea
                          id="message"
                          placeholder="Share why you're supporting Aliko Wash..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={4}
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Heart className="w-5 h-5 mr-2" />
                          Donate ${getFinalAmount() || "..."}
                        </>
                      )}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      <Sparkles className="w-4 h-4 inline mr-1" />
                      Secure payment integration coming soon. We'll contact you with payment details.
                    </p>
                  </form>
                </div>
              </motion.div>

              {/* Trust Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                    How Your Donation Is Used
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Droplets className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Water Infrastructure</h3>
                        <p className="text-sm text-muted-foreground">
                          Building gravity-fed systems, reservoirs, and protected springs
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Building className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Sanitation Facilities</h3>
                        <p className="text-sm text-muted-foreground">
                          Institutional toilets, handwashing stations, and hygiene programs
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Community Training</h3>
                        <p className="text-sm text-muted-foreground">
                          Training local committees to maintain systems for generations
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-accent/10 p-6 rounded-2xl border border-accent/20">
                  <h3 className="font-display text-lg font-bold text-foreground mb-3">
                    Questions About Donating?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Contact us directly and we'll be happy to discuss how your 
                    contribution can make the biggest impact.
                  </p>
                  <Button variant="outline" asChild>
                    <a href="mailto:alikowash@alikohub.com">
                      <Mail className="w-4 h-4 mr-2" />
                      alikowash@alikohub.com
                    </a>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link 
                    to="/projects"
                    className="text-primary hover:underline font-medium text-sm"
                  >
                    View Our Projects →
                  </Link>
                  <Link 
                    to="/our-story"
                    className="text-primary hover:underline font-medium text-sm"
                  >
                    Read Our Story →
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
});

Donate.displayName = "Donate";

export default Donate;
