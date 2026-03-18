import { useState } from 'react';
import { Building2, Users, GraduationCap, Target, CheckCircle, ArrowRight, Sparkles, Send } from 'lucide-react';
import Layout from '@/components/categories/technology/layout/Layout';
import { Button } from '@/components/categories/technology/ui/button';
import { Input } from '@/components/categories/technology/ui/input';
import { Textarea } from '@/components/categories/technology/ui/textarea';
import { Label } from '@/components/categories/technology/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/categories/technology/ui/select';
import { useToast } from '@/hooks/categories/technology/use-toast';

const benefits = [
  {
    icon: Target,
    title: 'Customized Curriculum',
    description: 'Training programs tailored to your organization\'s specific technology stack and business objectives.',
  },
  {
    icon: Users,
    title: 'Team-Based Learning',
    description: 'Cohort-style training that builds team collaboration while developing technical skills.',
  },
  {
    icon: GraduationCap,
    title: 'Expert Instructors',
    description: 'Industry professionals with real-world experience in enterprise environments.',
  },
  {
    icon: Building2,
    title: 'Flexible Delivery',
    description: 'On-site, virtual, or hybrid training options to fit your organization\'s schedule.',
  },
];

const trainingAreas = [
  'Software Engineering & Development',
  'Data Analytics & Business Intelligence',
  'AI & Machine Learning Implementation',
  'Cybersecurity & Compliance',
  'Cloud Architecture & DevOps',
  'Digital Transformation Strategy',
  'Leadership & Tech Management',
  'Custom Training Program',
];

const EnterpriseTraining = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    organizationType: '',
    teamSize: '',
    trainingArea: '',
    additionalDetails: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Request Submitted Successfully!",
      description: "Our enterprise team will contact you within 2 business days to discuss your training needs.",
    });

    setFormData({
      organizationName: '',
      contactName: '',
      email: '',
      phone: '',
      organizationType: '',
      teamSize: '',
      trainingArea: '',
      additionalDetails: '',
    });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[hsl(210,30%,16%)] via-[hsl(215,28%,14%)] to-[hsl(220,25%,11%)]">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px]" />
        <div className="container-padding mx-auto max-w-7xl relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-1 bg-secondary rounded-full" />
              <span className="text-secondary font-semibold text-sm">Enterprise Solutions</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-accent mb-6">
              Training for Organizations
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              Upskill your workforce with customized tech training programs designed for enterprises, universities, and government organizations.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">Why Partner With Us?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We deliver results-driven training that transforms teams and accelerates digital transformation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-card rounded-2xl p-8 border border-border hover:border-secondary/50 hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <benefit.icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="section-padding bg-gradient-to-br from-[hsl(207,40%,14%)] to-[hsl(220,25%,17%)]">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Who We Serve</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              We partner with organizations of all sizes to build future-ready teams.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Enterprises', desc: 'Fortune 500 companies to growing startups looking to upskill their tech teams.', icon: '🏢' },
              { title: 'Universities', desc: 'Academic institutions seeking industry-aligned curriculum and faculty training.', icon: '🎓' },
              { title: 'Government & NGOs', desc: 'Public sector organizations driving digital transformation initiatives.', icon: '🏛️' },
            ].map((item) => (
              <div key={item.title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center hover:bg-white/15 transition-colors">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section className="section-padding bg-background" id="request-form">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Form Info */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                Get Started
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-6">
                Request a Training Consultation
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Tell us about your organization and training needs. Our enterprise team will reach out within 2 business days to discuss a customized solution.
              </p>

              <div className="space-y-4">
                {[
                  'Free consultation with our enterprise team',
                  'Customized curriculum proposal',
                  'Flexible pricing and payment options',
                  'Dedicated account manager',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                    </div>
                    <span className="text-foreground font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="bg-card rounded-3xl p-8 border border-border shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Organization Name *</Label>
                    <Input
                      id="organizationName"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      placeholder="Your organization"
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name *</Label>
                    <Input
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@company.com"
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizationType">Organization Type *</Label>
                    <Select
                      value={formData.organizationType}
                      onValueChange={(value) => handleSelectChange('organizationType', value)}
                    >
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enterprise">Enterprise / Corporation</SelectItem>
                        <SelectItem value="startup">Startup / SMB</SelectItem>
                        <SelectItem value="university">University / College</SelectItem>
                        <SelectItem value="government">Government Agency</SelectItem>
                        <SelectItem value="ngo">Non-Profit / NGO</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamSize">Team Size to Train *</Label>
                    <Select
                      value={formData.teamSize}
                      onValueChange={(value) => handleSelectChange('teamSize', value)}
                    >
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5-10">5-10 people</SelectItem>
                        <SelectItem value="11-25">11-25 people</SelectItem>
                        <SelectItem value="26-50">26-50 people</SelectItem>
                        <SelectItem value="51-100">51-100 people</SelectItem>
                        <SelectItem value="100+">100+ people</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trainingArea">Training Area of Interest *</Label>
                  <Select
                    value={formData.trainingArea}
                    onValueChange={(value) => handleSelectChange('trainingArea', value)}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select training area" />
                    </SelectTrigger>
                    <SelectContent>
                      {trainingAreas.map((area) => (
                        <SelectItem key={area} value={area.toLowerCase().replace(/\s+/g, '-')}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalDetails">Additional Details</Label>
                  <Textarea
                    id="additionalDetails"
                    name="additionalDetails"
                    value={formData.additionalDetails}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your training goals, timeline, or any specific requirements..."
                    rows={4}
                    className="rounded-xl resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-xl shadow-orange"
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      Submit Request
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  By submitting, you agree to our Privacy Policy and Terms of Service.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-accent to-[hsl(207,90%,25%)] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="container-padding mx-auto max-w-7xl text-center relative">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Have Questions?</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Our enterprise team is ready to help you build a training program that drives results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#request-form">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-bold h-14 px-8 rounded-xl shadow-orange">
                Request Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <a href="mailto:enterprise@aliko.academy">
              <Button size="lg" className="bg-accent text-white font-bold h-14 px-8 rounded-xl border-none">
                Email Us Directly
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EnterpriseTraining;
