import { Sparkles, Handshake, Building2, Users2, Cpu, ArrowRight } from 'lucide-react';
import Layout from '@/components/categories/technology/layout/Layout';
import { Button } from '@/components/categories/technology/ui/button';

interface Partner {
  id: string;
  name: string;
  type: 'hiring' | 'community' | 'technology';
  logo: string;
}

const partners: Partner[] = [
  { id: '1', name: 'TechCorp Global', type: 'hiring', logo: '🏢' },
  { id: '2', name: 'StartupHub Inc', type: 'hiring', logo: '🚀' },
  { id: '3', name: 'DataDriven Co', type: 'hiring', logo: '📊' },
  { id: '4', name: 'CloudScale Systems', type: 'hiring', logo: '☁️' },
  { id: '5', name: 'SecureNet Solutions', type: 'hiring', logo: '🔒' },
  { id: '6', name: 'DesignFirst Agency', type: 'hiring', logo: '🎨' },
  { id: '7', name: 'State University', type: 'community', logo: '🎓' },
  { id: '8', name: 'Tech For Good NGO', type: 'community', logo: '💚' },
  { id: '9', name: 'Developer Community', type: 'community', logo: '👥' },
  { id: '10', name: 'Women in Tech', type: 'community', logo: '👩‍💻' },
  { id: '11', name: 'AWS', type: 'technology', logo: '⚡' },
  { id: '12', name: 'GitHub', type: 'technology', logo: '🐙' },
  { id: '13', name: 'Figma', type: 'technology', logo: '🎯' },
  { id: '14', name: 'Notion', type: 'technology', logo: '📝' },
];

const Partners = () => {
  const hiringPartners = partners.filter(p => p.type === 'hiring');
  const communityPartners = partners.filter(p => p.type === 'community');
  const techPartners = partners.filter(p => p.type === 'technology');

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[hsl(210,30%,16%)] via-[hsl(215,28%,14%)] to-[hsl(220,25%,11%)]">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px]" />
        <div className="container-padding mx-auto max-w-7xl relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-1 bg-secondary rounded-full" />
              <span className="text-secondary font-semibold text-sm">Building Together</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-accent mb-6">
              Our Partners
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              We collaborate with industry leaders, community organizations, and technology partners to deliver the best learning experience.
            </p>
          </div>
        </div>
      </section>

      {/* Hiring Partners */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">Hiring & Career Network Partners</h2>
              <p className="text-muted-foreground">Companies that engage with our graduates for career opportunities.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {hiringPartners.map((partner) => (
              <div
                key={partner.id}
                className="h-32 bg-card rounded-2xl flex flex-col items-center justify-center p-6 border border-border hover:border-secondary/30 hover:shadow-lg transition-all group"
              >
                <span className="text-4xl mb-2 group-hover:scale-110 transition-transform grayscale group-hover:grayscale-0">{partner.logo}</span>
                <p className="text-xs text-center text-muted-foreground font-medium">{partner.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Partners */}
      <section className="section-padding bg-gradient-to-br from-[hsl(207,40%,14%)] to-[hsl(220,25%,17%)]">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Users2 className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Community & University Partners</h2>
              <p className="text-white/70">Organizations we work with to expand access to tech education.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {communityPartners.map((partner) => (
              <div
                key={partner.id}
                className="h-32 bg-white/10 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 border border-white/20 hover:bg-white/15 transition-colors group"
              >
                <span className="text-4xl mb-2 group-hover:scale-110 transition-transform grayscale group-hover:grayscale-0">{partner.logo}</span>
                <p className="text-xs text-center font-semibold text-white">{partner.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Partners */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Cpu className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">Technology Partners</h2>
              <p className="text-muted-foreground">Tools and platforms we use to deliver our programs.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {techPartners.map((partner) => (
              <div
                key={partner.id}
                className="h-32 bg-card rounded-2xl flex flex-col items-center justify-center p-6 border border-border hover:border-accent/30 hover:shadow-lg transition-all group"
              >
                <span className="text-4xl mb-2 group-hover:scale-110 transition-transform grayscale group-hover:grayscale-0">{partner.logo}</span>
                <p className="text-xs text-center font-semibold text-foreground">{partner.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Partner */}
      <section className="relative bg-gradient-to-r from-[hsl(var(--secondary-dark))] to-[hsl(18,80%,32%)] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="container-padding mx-auto max-w-7xl text-center relative">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Become a Partner</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Interested in partnering with Aliko Academy – Tech? We're always looking for organizations that share our mission.
          </p>
          <a href="mailto:partners@alikoacademy.tech">
            <Button size="lg" className="bg-white text-secondary hover:bg-white/90 font-bold h-14 px-8 rounded-xl shadow-lg">
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Partners;
