import { Link } from 'react-router-dom';
import { FileText, UserCheck, MessageSquare, CheckCircle, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import Layout from '@/components/categories/technology/layout/Layout';
import { Button } from '@/components/categories/technology/ui/button';

const steps = [
  {
    icon: FileText,
    step: 1,
    title: 'Submit Application',
    description: 'Complete our online application form with your background, goals, and program of interest.',
    color: 'from-secondary to-secondary/80',
  },
  {
    icon: UserCheck,
    step: 2,
    title: 'Application Review',
    description: 'Our admissions team reviews your application within 3-5 business days.',
    color: 'from-accent to-accent/80',
  },
  {
    icon: MessageSquare,
    step: 3,
    title: 'Admissions Interview',
    description: 'Brief call with our admissions team to discuss your goals and answer questions.',
    color: 'from-accent to-accent/70',
  },
  {
    icon: CheckCircle,
    step: 4,
    title: 'Acceptance & Enrollment',
    description: 'Receive your acceptance and secure your spot in your chosen cohort.',
    color: 'from-secondary to-secondary/70',
  },
];

const Admissions = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[hsl(210,30%,16%)] via-[hsl(215,28%,14%)] to-[hsl(220,25%,11%)]">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-accent/8 rounded-full blur-[80px]" />
        <div className="container-padding mx-auto max-w-7xl relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-1 bg-secondary rounded-full" />
              <span className="text-secondary font-semibold text-sm">Get Started</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-accent mb-6">
              How to Apply
            </h1>
            <p className="text-xl text-white/70 leading-relaxed mb-8">
              Start your tech career journey with a simple enrollment process. Our admissions team is here to guide you every step of the way.
            </p>
            <Link to="/technology/apply">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold h-14 px-8 rounded-xl shadow-orange">
                Start Your Application
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">Admissions Process</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Four simple steps to launch your tech career</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, index) => (
              <div key={item.step} className="relative group">
                <div className="bg-card rounded-2xl p-8 h-full border border-border hover:border-secondary/50 hover:shadow-xl transition-all duration-300">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center font-black text-xl mb-6 group-hover:scale-110 transition-transform`}>
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Cohorts */}
      <section className="section-padding bg-gradient-to-br from-[hsl(207,40%,14%)] to-[hsl(220,25%,17%)]">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Upcoming Cohorts</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              New cohorts start monthly. Apply early to secure your spot.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { date: 'March 15, 2026', status: 'Accepting Applications', spots: '8 spots left', highlight: true },
              { date: 'April 1, 2026', status: 'Accepting Applications', spots: '12 spots left', highlight: false },
              { date: 'April 15, 2026', status: 'Coming Soon', spots: 'Opens Feb 15', highlight: false },
            ].map((cohort) => (
              <div key={cohort.date} className={`rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 ${cohort.highlight ? 'bg-secondary text-white shadow-orange' : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white'}`}>
                <Calendar className={`h-10 w-10 mx-auto mb-4 ${cohort.highlight ? 'text-white' : 'text-secondary'}`} />
                <p className="font-black text-xl mb-2">{cohort.date}</p>
                <p className={`text-sm font-semibold mb-1 ${cohort.highlight ? 'text-white/90' : 'text-secondary'}`}>{cohort.status}</p>
                <p className={`text-sm ${cohort.highlight ? 'text-white/70' : 'text-white/60'}`}>{cohort.spots}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">What We Look For</h2>
            <p className="text-lg text-muted-foreground">We seek driven individuals ready to commit to their growth</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Commitment to Learning', desc: "You're ready to dedicate 15-30 hours per week to your program." },
              { title: 'Clear Career Goals', desc: 'You have a specific career outcome in mind and are motivated to achieve it.' },
              { title: 'Prerequisites Met', desc: 'You meet the prerequisites for your chosen program (varies by track).' },
              { title: 'Proficient in English', desc: 'All instruction is conducted in English.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-6 bg-card rounded-2xl border border-border hover:border-secondary/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-accent to-[hsl(207,90%,25%)] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="container-padding mx-auto max-w-7xl text-center relative">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Apply?</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Start your application today. Our admissions team is here to help you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/technology/apply">
              <Button size="lg" className="bg-white text-accent hover:bg-white/90 font-bold h-14 px-8 rounded-xl shadow-lg">
                Start Application
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/technology/programs">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-bold h-14 px-8 rounded-xl shadow-orange">
                Browse Programs First
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Admissions;
