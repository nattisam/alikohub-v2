import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MessageCircle, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/categories/technology/ui/button';

const CTASection = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-[hsl(207,50%,14%)] via-[hsl(207,45%,11%)] to-[hsl(210,40%,9%)] text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-secondary/20 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[140px]" />
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="relative container-padding mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-sm font-medium mb-8 shadow-lg">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span>Start Your Journey</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Ready to Start Your
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[hsl(35,100%,55%)]">Tech Career?</span>
            </h2>
            <p className="text-lg text-white/70 mb-10 leading-relaxed max-w-lg">
              Take the first step today. Explore our programs, book an advising call, or apply to an upcoming cohort.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/technology/programs">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-secondary hover:bg-secondary/90 text-white font-semibold shadow-orange hover:shadow-orange-lg transition-all duration-300 group rounded-xl">
                  Explore Programs
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/technology/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-sm rounded-xl">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Advising Call
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="group bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-secondary/40 transition-all duration-500 hover:shadow-2xl">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-orange transition-all duration-300">
                <MessageCircle className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Have Questions?</h3>
              <p className="text-white/60 mb-6 leading-relaxed">
                Our admissions team is here to help you find the right program.
              </p>
              <Link to="/technology/contact" className="inline-flex items-center text-sm font-bold text-secondary hover:text-secondary/80 transition-colors group/link">
                Contact Us 
                <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="group bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-accent/40 transition-all duration-500 hover:shadow-2xl">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-blue transition-all duration-300">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Upcoming Cohorts</h3>
              <p className="text-white/60 mb-6 leading-relaxed">
                New cohorts starting every month. Apply early to secure your spot.
              </p>
              <Link to="/technology/admissions" className="inline-flex items-center text-sm font-bold text-accent hover:text-accent/80 transition-colors group/link">
                View Schedule 
                <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
