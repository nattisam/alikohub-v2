import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Target, MessageCircle, Code } from 'lucide-react';
import Layout from '@/components/categories/technology/layout/Layout';
import { Button } from '@/components/categories/technology/ui/button';

interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  expertise: string[];
  bio: string;
  image: string;
}

const mentors: Mentor[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'Senior Software Engineer',
    company: 'Fortune 500 Tech',
    expertise: ['Full-Stack', 'React', 'Node.js', 'System Design'],
    bio: '10+ years of experience building scalable web applications. Passionate about mentoring the next generation of engineers.',
    image: '👩‍💻',
  },
  {
    id: '2',
    name: 'Michael Thompson',
    title: 'Lead Data Scientist',
    company: 'AI Startup',
    expertise: ['Machine Learning', 'Python', 'Deep Learning', 'MLOps'],
    bio: 'Former researcher turned industry professional. Specializes in taking ML models from research to production.',
    image: '👨‍🔬',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    title: 'Principal UX Designer',
    company: 'Design Agency',
    expertise: ['UX Research', 'Design Systems', 'Figma', 'Product Design'],
    bio: '12 years of experience designing products for millions of users. Advocates for user-centered design.',
    image: '👩‍🎨',
  },
  {
    id: '4',
    name: 'James Wilson',
    title: 'Cloud Architect',
    company: 'Enterprise Tech',
    expertise: ['AWS', 'Terraform', 'Kubernetes', 'DevOps'],
    bio: 'Built and scaled infrastructure for multiple high-growth companies. Certified across major cloud platforms.',
    image: '👨‍💼',
  },
  {
    id: '5',
    name: 'Aisha Patel',
    title: 'Product Manager',
    company: 'Tech Unicorn',
    expertise: ['Product Strategy', 'Agile', 'User Research', 'Roadmapping'],
    bio: 'Led product for 0-to-1 launches and scaling products to millions of users. MBA from top business school.',
    image: '👩‍💼',
  },
  {
    id: '6',
    name: 'David Kim',
    title: 'Security Engineer',
    company: 'Cybersecurity Firm',
    expertise: ['Penetration Testing', 'SIEM', 'Incident Response', 'Compliance'],
    bio: 'Former government security analyst. Now helps companies build robust security programs.',
    image: '🔐',
  },
];

const Mentors = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[hsl(210,30%,16%)] via-[hsl(215,28%,14%)] to-[hsl(220,25%,11%)]">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px]" />
        <div className="container-padding mx-auto max-w-7xl relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-1 bg-secondary rounded-full" />
              <span className="text-secondary font-semibold text-sm">Learn from Industry Experts</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-accent mb-6">
              Mentors & Instructors
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              Learn from industry professionals with real-world experience. Our mentors are practitioners who are passionate about teaching.
            </p>
          </div>
        </div>
      </section>

      {/* Mentorship Model */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">Our Mentorship Model</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every student receives dedicated mentorship throughout their program.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Target, title: '1-on-1 Sessions', desc: 'Weekly or bi-weekly personal sessions with your mentor for guidance and feedback.', color: 'from-secondary to-secondary/80' },
              { icon: MessageCircle, title: 'Async Support', desc: 'Get answers to your questions through our learning platform between sessions.', color: 'from-accent to-accent/80' },
              { icon: Code, title: 'Code Reviews', desc: 'Detailed feedback on your projects from experienced professionals.', color: 'from-accent to-accent/70' },
            ].map((item) => (
              <div key={item.title} className="text-center p-8 bg-card rounded-2xl border border-border hover:border-secondary/30 hover:shadow-lg transition-all">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-6`}>
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors Grid */}
      <section className="section-padding bg-gradient-to-br from-[hsl(207,40%,14%)] to-[hsl(220,25%,17%)]">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Meet Our Mentors</h2>
            <p className="text-lg text-white/70">Industry professionals dedicated to your success</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/30 to-accent/30 flex items-center justify-center text-4xl">
                    {mentor.image}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{mentor.name}</h3>
                    <p className="text-sm text-white/70">{mentor.title}</p>
                    <p className="text-xs text-secondary font-semibold">{mentor.company}</p>
                  </div>
                </div>
                <p className="text-sm text-white/80 mb-4">{mentor.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-3 py-1 bg-white/10 rounded-full text-white/90 font-medium"
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

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-accent to-[hsl(207,90%,25%)] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="container-padding mx-auto max-w-7xl text-center relative">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Learn from the Best</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Our mentors are ready to guide you on your tech career journey.
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

export default Mentors;
