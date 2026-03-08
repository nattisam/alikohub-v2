import { Users, Code, Briefcase, Award, Target, BookOpen } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Mentor-Guided Learning',
    description: 'Weekly 1-on-1 sessions with industry professionals who guide your learning and career development.',
    gradient: 'from-secondary to-secondary/70',
    bgGradient: 'from-secondary/10 to-secondary/5',
  },
  {
    icon: Code,
    title: 'Real-World Projects',
    description: 'Build portfolio-ready projects that demonstrate your skills to potential employers.',
    gradient: 'from-accent to-accent/70',
    bgGradient: 'from-accent/10 to-accent/5',
  },
  {
    icon: Briefcase,
    title: 'Career Services',
    description: 'Resume reviews, mock interviews, and networking opportunities to accelerate your job search.',
    gradient: 'from-accent to-accent/70',
    bgGradient: 'from-accent/10 to-accent/5',
  },
  {
    icon: Award,
    title: 'Industry Credentials',
    description: 'Earn professional certificates and prepare for industry-recognized certifications.',
    gradient: 'from-secondary to-secondary/70',
    bgGradient: 'from-secondary/10 to-secondary/5',
  },
  {
    icon: Target,
    title: 'Outcome-Focused',
    description: 'Programs designed around specific career outcomes and job roles in demand.',
    gradient: 'from-accent to-accent/70',
    bgGradient: 'from-accent/10 to-accent/5',
  },
  {
    icon: BookOpen,
    title: 'Cohort-Based',
    description: 'Learn alongside peers in structured cohorts with dedicated start dates.',
    gradient: 'from-secondary to-secondary/70',
    bgGradient: 'from-secondary/10 to-secondary/5',
  },
];

const FeaturesSection = () => {
  return (
    <section className="section-padding bg-gradient-to-b from-[hsl(207,50%,14%)] via-[hsl(207,45%,12%)] to-[hsl(207,40%,10%)] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-accent/10 via-accent/5 to-transparent rounded-full blur-3xl" />
      
      <div className="relative container-padding mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-sm font-bold text-secondary uppercase tracking-widest mb-4">Why Choose Us</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Why Aliko Academy
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Our approach combines mentorship, hands-on projects, and career support to help you succeed in tech.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-secondary/30 hover:bg-white/10 transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-secondary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
