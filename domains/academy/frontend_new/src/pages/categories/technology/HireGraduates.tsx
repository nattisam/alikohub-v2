import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Send } from 'lucide-react';
import Layout from '@/components/categories/technology/layout/Layout';
import { Button } from '@/components/categories/technology/ui/button';
import { Input } from '@/components/categories/technology/ui/input';
import { Textarea } from '@/components/categories/technology/ui/textarea';
import { Label } from '@/components/categories/technology/ui/label';

const HireGraduates = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[hsl(210,30%,16%)] via-[hsl(215,28%,14%)] to-[hsl(220,25%,11%)]">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px]" />
        <div className="container-padding mx-auto max-w-7xl relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-1 bg-secondary rounded-full" />
              <span className="text-secondary font-semibold text-sm">Access Top Tech Talent</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-accent mb-6">
              Hire Our Graduates
            </h1>
            <p className="text-xl text-white/70 leading-relaxed mb-8">
              Access a pipeline of job-ready tech talent. Our graduates have completed rigorous, project-based programs with industry mentorship.
            </p>
            <a href="#inquiry-form">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-bold h-14 px-8 rounded-xl shadow-orange">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Graduate Skills */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">Graduate Skill Areas</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our graduates are trained in high-demand tech skills through hands-on, project-based programs.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Software Engineering', skills: ['JavaScript/TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'], color: 'secondary' },
              { title: 'Data & Analytics', skills: ['Python', 'SQL', 'Tableau', 'Statistics', 'Machine Learning', 'Data Visualization'], color: 'accent' },
              { title: 'AI & Machine Learning', skills: ['Python', 'PyTorch', 'LLMs', 'NLP', 'Computer Vision', 'MLOps'], color: 'accent' },
              { title: 'UX/UI Design', skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Usability Testing'], color: 'secondary' },
              { title: 'Cloud & DevOps', skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux'], color: 'accent' },
              { title: 'Cybersecurity', skills: ['SIEM', 'Threat Analysis', 'Incident Response', 'Network Security', 'Compliance'], color: 'secondary' },
            ].map((track) => (
              <div key={track.title} className="bg-card rounded-2xl p-6 border border-border hover:border-secondary/30 hover:shadow-lg transition-all">
                <h3 className="font-bold text-lg text-foreground mb-4">{track.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {track.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-3 py-1.5 bg-secondary/10 text-secondary rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring Process */}
      <section className="section-padding bg-gradient-to-br from-[hsl(207,40%,14%)] to-[hsl(220,25%,17%)]">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Hiring Process</h2>
            <p className="text-lg text-white/70">Simple steps to find your next hire</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: 1, title: 'Submit Inquiry', desc: 'Tell us about your hiring needs' },
              { step: 2, title: 'Profile Matching', desc: 'We match candidates to your requirements' },
              { step: 3, title: 'Interview', desc: 'Meet pre-vetted candidates' },
              { step: 4, title: 'Hire', desc: 'Extend offers to your top choices' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-colors h-full">
                  <div className="w-14 h-14 rounded-2xl bg-secondary text-white flex items-center justify-center font-black text-2xl mx-auto mb-6">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/70">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry-form" className="section-padding bg-background">
        <div className="container-padding mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">Employer Inquiry</h2>
            <p className="text-lg text-muted-foreground">
              Tell us about your hiring needs and we'll connect you with qualified candidates.
            </p>
          </div>
          <form className="space-y-6 bg-card rounded-3xl p-8 md:p-10 border border-border shadow-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-semibold">Your Name</Label>
                <Input id="name" placeholder="John Smith" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="font-semibold">Company</Label>
                <Input id="company" placeholder="Acme Corp" className="h-12 rounded-xl" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold">Email</Label>
                <Input id="email" type="email" placeholder="john@acme.com" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-semibold">Phone (optional)</Label>
                <Input id="phone" placeholder="+1 234 567 890" className="h-12 rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roles" className="font-semibold">Roles You're Hiring For</Label>
              <Input id="roles" placeholder="e.g., Frontend Developer, Data Analyst" className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="font-semibold">Additional Details</Label>
              <Textarea
                id="message"
                placeholder="Tell us more about your hiring needs, team size, timeline, etc."
                rows={4}
                className="rounded-xl resize-none"
              />
            </div>
            <Button type="submit" size="lg" className="w-full h-14 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-xl shadow-orange">
              <Send className="mr-2 h-5 w-5" />
              Submit Inquiry
            </Button>
          </form>
        </div>
      </section>

      {/* Note */}
      <section className="container-padding mx-auto max-w-2xl pb-16">
        <p className="text-sm text-center text-muted-foreground">
          Note: Aliko Academy – Tech facilitates introductions between employers and graduates. We do not guarantee hiring outcomes or act as an employment agency.
        </p>
      </section>
    </Layout>
  );
};

export default HireGraduates;
