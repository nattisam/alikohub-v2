import { Link } from 'react-router-dom';
import { TrendingUp, Users, Award, AlertTriangle, ArrowRight, Sparkles, Star, CheckCircle } from 'lucide-react';
import Layout from '@/components/categories/technology/layout/Layout';
import { Button } from '@/components/categories/technology/ui/button';

const Outcomes = () => {
  const stats = [
    { value: '500+', label: 'Graduates', color: 'from-secondary to-secondary/80' },
    { value: '85%', label: 'Completion Rate', color: 'from-accent to-accent/80' },
    { value: '4.7/5', label: 'Student Satisfaction', color: 'from-accent to-accent/70' },
    { value: '50+', label: 'Hiring Partners', color: 'from-secondary to-secondary/70' },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[hsl(210,30%,16%)] via-[hsl(215,28%,14%)] to-[hsl(220,25%,11%)]">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px]" />
        <div className="container-padding mx-auto max-w-7xl relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-1 bg-secondary rounded-full" />
              <span className="text-secondary font-semibold text-sm">Measuring Success</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-accent mb-6">
              Outcomes & Impact
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              Measuring our success through student outcomes, completion rates, and community impact.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card rounded-2xl p-8 border border-border text-center hover:shadow-lg hover:border-secondary/30 transition-all">
                <div className={`text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Outcomes */}
      <section className="section-padding bg-gradient-to-br from-[hsl(207,40%,14%)] to-[hsl(220,25%,17%)]">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">What We Measure</h2>
            <p className="text-lg text-white/70">Transparent metrics that matter</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Award, title: 'Program Completion', desc: 'We track completion rates across all programs to ensure our curriculum and support systems help students succeed.', color: 'from-secondary to-secondary/80' },
              { icon: TrendingUp, title: 'Skills Gained', desc: 'Students demonstrate measurable skill improvements through projects, assessments, and portfolio work.', color: 'from-accent to-accent/80' },
              { icon: Users, title: 'Student Satisfaction', desc: 'Regular feedback surveys help us continuously improve our programs and student experience.', color: 'from-secondary to-secondary/70' },
            ].map((item) => (
              <div key={item.title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-colors">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6`}>
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">Graduate Stories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from graduates about their learning experience and career journeys.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Alex M.', program: 'Full-Stack Engineering', quote: 'The program gave me the skills and confidence to pursue my career goals. The mentorship was invaluable.' },
              { name: 'Jordan K.', program: 'Data Analytics', quote: 'I transitioned from marketing to data analytics. The hands-on projects made all the difference.' },
              { name: 'Sam R.', program: 'Cloud Engineering', quote: 'The curriculum was current and practical. I was job-ready by the time I graduated.' },
            ].map((story, i) => (
              <div key={i} className="bg-card rounded-2xl p-8 border border-border hover:border-secondary/30 transition-colors">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-6 leading-relaxed">"{story.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center text-secondary font-bold">
                    {story.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{story.name}</p>
                    <p className="text-sm text-muted-foreground">{story.program}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="container-padding mx-auto max-w-3xl pb-16">
        <div className="bg-secondary/10 border border-secondary/30 rounded-2xl p-8 flex gap-6">
          <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-7 w-7 text-secondary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg mb-2">Outcomes Disclaimer</h3>
            <p className="text-muted-foreground leading-relaxed">
              Outcomes vary by individual effort and market conditions. We only report metrics that can be verified. Completion rates, satisfaction scores, and skill assessments are tracked internally. We do not make claims about job placement rates or salary outcomes that cannot be independently verified.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-accent to-[hsl(207,90%,25%)] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="container-padding mx-auto max-w-7xl text-center relative">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Start Your Success Story</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join our community of learners building tech careers.
          </p>
          <Link to="/technology/programs">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-bold h-14 px-8 rounded-xl shadow-orange">
              Explore Programs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Outcomes;
