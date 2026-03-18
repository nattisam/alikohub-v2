import { Link } from 'react-router-dom';
import { FileText, Users, MessageSquare, Briefcase, AlertTriangle, ArrowRight, Sparkles, Target } from 'lucide-react';
import Layout from '@/components/categories/technology/layout/Layout';
import { Button } from '@/components/categories/technology/ui/button';

const services = [
  {
    icon: FileText,
    title: 'Resume & Portfolio Review',
    description: 'Get personalized feedback on your resume and portfolio from industry professionals. Learn how to highlight your projects and skills effectively.',
    color: 'from-secondary to-secondary/80',
  },
  {
    icon: MessageSquare,
    title: 'Mock Interviews',
    description: 'Practice technical and behavioral interviews with experienced interviewers. Receive detailed feedback to improve your performance.',
    color: 'from-accent to-accent/80',
  },
  {
    icon: Users,
    title: 'Career Coaching',
    description: 'One-on-one sessions with career coaches to help you define your career goals, create action plans, and navigate your job search.',
    color: 'from-accent to-accent/70',
  },
  {
    icon: Briefcase,
    title: 'Employer Networking',
    description: 'Connect with hiring partners through exclusive networking events, company presentations, and career fairs.',
    color: 'from-secondary to-secondary/70',
  },
];

const CareerServices = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[hsl(210,30%,16%)] via-[hsl(215,28%,14%)] to-[hsl(220,25%,11%)]">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px]" />
        <div className="container-padding mx-auto max-w-7xl relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-1 bg-secondary rounded-full" />
              <span className="text-secondary font-semibold text-sm">Launch Your Tech Career</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-accent mb-6">
              Career Services
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              Comprehensive career support to help you succeed in your tech job search. From resume reviews to employer connections.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">What We Offer</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Comprehensive support at every stage of your career journey</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-card rounded-2xl p-8 border border-border hover:border-secondary/30 hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-gradient-to-br from-[hsl(207,40%,14%)] to-[hsl(220,25%,17%)]">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">How It Works</h2>
            <p className="text-lg text-white/70">Four steps to career success</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Complete Your Program', desc: 'Finish your career track or short course' },
              { step: 2, title: 'Access Resources', desc: 'Unlock resume templates, interview guides' },
              { step: 3, title: 'Book Sessions', desc: 'Schedule 1-on-1 coaching and reviews' },
              { step: 4, title: 'Connect & Apply', desc: 'Network with employers and apply to jobs' },
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

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-[hsl(var(--secondary-dark))] to-[hsl(18,80%,32%)] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="container-padding mx-auto max-w-7xl text-center relative">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Start Your Career Journey?</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Enroll in a program today and get access to our full suite of career services.
          </p>
          <Link to="/programs">
            <Button size="lg" className="bg-white text-secondary hover:bg-white/90 font-bold h-14 px-8 rounded-xl shadow-lg">
              Explore Programs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Career Outcomes Disclaimer - Softer, at bottom */}
      <section className="py-8 bg-muted/30">
        <div className="container-padding mx-auto max-w-4xl">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            <span className="font-medium">Career Outcomes Disclaimer:</span> Aliko Academy – Tech provides career support services but does not guarantee employment or specific salary outcomes. Success depends on individual effort, skills development, and market conditions. Our services are designed to support your job search journey.
          </p>
        </div>
      </section>

    </Layout>
  );
};

export default CareerServices;
