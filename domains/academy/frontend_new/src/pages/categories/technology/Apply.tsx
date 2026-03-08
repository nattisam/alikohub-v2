import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Mail, User, Phone, GraduationCap, FileText, Send } from 'lucide-react';
import Layout from '@/components/categories/technology/layout/Layout';
import { Button } from '@/components/categories/technology/ui/button';
import { Input } from '@/components/categories/technology/ui/input';
import { Label } from '@/components/categories/technology/ui/label';
import { Textarea } from '@/components/categories/technology/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/categories/technology/ui/select';
import { useToast } from '@/hooks/categories/technology/use-toast';
// import { supabase } from '@/integrations/supabase/client';

const Apply = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [programs, setPrograms] = useState<{ id: string; title: string; type: string }[]>([]);
  const [cohorts, setCohorts] = useState<{ id: string; name: string; start_date: string }[]>([]);
  const [selectedProgram, setSelectedProgram] = useState('');

  useEffect(() => {
    const fetchPrograms = async () => {
      const { data } = await supabase
        .from('programs')
        .select('id, title, type')
        .eq('status', 'published')
        .order('title');
      setPrograms(data || []);
    };
    const fetchCohorts = async () => {
      const { data } = await supabase
        .from('cohorts')
        .select('id, name, start_date')
        .in('status', ['upcoming', 'active'])
        .order('start_date');
      setCohorts(data || []);
    };
    fetchPrograms();
    fetchCohorts();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const firstName = (formData.get('firstName') as string || '').trim();
    const lastName = (formData.get('lastName') as string || '').trim();
    const email = (formData.get('email') as string || '').trim();
    const phone = (formData.get('phone') as string || '').trim();

    if (!firstName || !lastName || !email) {
      toast({ title: 'Missing fields', description: 'Please fill in all required fields.', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from('applications').insert({
      full_name: `${firstName} ${lastName}`,
      email,
      phone: phone || null,
      program_id: selectedProgram || null,
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Application Submitted!', description: "We'll review your application and contact you within 3-5 business days." });
      (e.target as HTMLFormElement).reset();
      setSelectedProgram('');
    }
    setIsSubmitting(false);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[hsl(210,30%,16%)] via-[hsl(215,28%,14%)] to-[hsl(220,25%,11%)]">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px]" />
        <div className="container-padding mx-auto max-w-7xl relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center gap-3 mb-6 justify-center">
              <div className="w-10 h-1 bg-secondary rounded-full" />
              <span className="text-secondary font-semibold text-sm">Start Your Tech Journey</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-accent mb-6">Apply Now</h1>
            <p className="text-xl text-foreground/70 leading-relaxed">Take the first step toward your new tech career.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-padding mx-auto max-w-4xl">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-3xl border border-border p-8 md:p-10 shadow-lg">
                <h2 className="text-2xl font-bold text-foreground mb-8">Application Form</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2"><User className="h-4 w-4 text-secondary" /> Personal Information</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label htmlFor="firstName">First Name *</Label><Input id="firstName" name="firstName" placeholder="John" required className="h-12 rounded-xl" maxLength={100} /></div>
                      <div className="space-y-2"><Label htmlFor="lastName">Last Name *</Label><Input id="lastName" name="lastName" placeholder="Doe" required className="h-12 rounded-xl" maxLength={100} /></div>
                    </div>
                    <div className="space-y-2"><Label htmlFor="email">Email *</Label>
                      <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="email" name="email" type="email" placeholder="john@example.com" required className="h-12 pl-11 rounded-xl" maxLength={255} /></div>
                    </div>
                    <div className="space-y-2"><Label htmlFor="phone">Phone</Label>
                      <div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" className="h-12 pl-11 rounded-xl" maxLength={20} /></div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border">
                    <h3 className="font-semibold text-foreground flex items-center gap-2"><GraduationCap className="h-4 w-4 text-secondary" /> Program Selection</h3>
                    <div className="space-y-2"><Label>Preferred Program</Label>
                      <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                        <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select a program" /></SelectTrigger>
                        <SelectContent className="bg-popover border border-border shadow-xl z-50">
                          {programs.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" size="lg" disabled={isSubmitting} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold h-14 rounded-xl">
                    {isSubmitting ? <><div className="h-5 w-5 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" /> Submitting...</>
                    : <><Send className="mr-2 h-5 w-5" /> Submit Application</>}
                  </Button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-bold text-foreground mb-4">What Happens Next?</h3>
                <div className="space-y-4">
                  {[{ step: 1, text: 'We review your application (3-5 days)' }, { step: 2, text: 'Brief admissions call to discuss goals' }, { step: 3, text: 'Receive your acceptance decision' }, { step: 4, text: 'Secure your spot and start learning!' }].map(item => (
                    <div key={item.step} className="flex gap-3"><div className="w-7 h-7 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0 text-sm font-bold">{item.step}</div><p className="text-sm text-muted-foreground">{item.text}</p></div>
                  ))}
                </div>
              </div>
              {cohorts.length > 0 && (
                <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4"><Calendar className="h-5 w-5 text-accent" /><h3 className="font-bold text-foreground">Upcoming Cohorts</h3></div>
                  <div className="space-y-3">
                    {cohorts.slice(0, 4).map(c => (
                      <div key={c.id} className="flex justify-between items-center text-sm"><span className="text-foreground font-medium">{c.name}</span><span className="text-muted-foreground">{new Date(c.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-muted/50 rounded-2xl p-6"><h3 className="font-bold text-foreground mb-2">Have Questions?</h3><p className="text-sm text-muted-foreground mb-4">Our admissions team is here to help.</p><Link to="/contact"><Button variant="outline" size="sm" className="w-full rounded-xl">Contact Admissions</Button></Link></div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Apply;
