import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/categories/technology/ui/button';
import DomainSection from '@/components/categories/technology/programs/DomainSection';
import { getProgramsByCategory, getCategories, Category } from '@/data/categories/technology/programs';

const ProgramsPreview = () => {
  const categories = getCategories();

  return (
    <section className="section-padding bg-gradient-to-b from-[hsl(207,35%,14%)] to-[hsl(220,25%,17%)] relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--accent)/0.06),transparent_50%),radial-gradient(circle_at_80%_70%,hsl(var(--secondary)/0.06),transparent_50%)]" />

      <div className="relative container-padding mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-bold text-secondary uppercase tracking-widest mb-4">Our Programs</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Explore by Domain
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Choose a Career Track for job-ready mastery or stack Short Courses to level up fast.
          </p>
        </div>

        {/* Domain Sections — career tracks only on homepage */}
        {categories.map((category) => {
          const careerTracks = getProgramsByCategory(category).filter(p => p.type === 'career-track');
          if (careerTracks.length === 0) return null;
          return (
            <DomainSection
              key={category}
              category={category}
              programs={careerTracks}
              limit={3}
              showViewAll={true}
            />
          );
        })}

        {/* View All Programs */}
        <div className="text-center mt-8 pt-8 border-t border-white/10">
          <Link to="/programs">
            <Button size="lg" className="group h-14 px-10 rounded-xl font-bold text-base">
              View All Programs
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProgramsPreview;
