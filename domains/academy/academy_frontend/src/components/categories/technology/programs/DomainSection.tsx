import { Link } from 'react-router-dom';
import { ArrowRight, Code, BarChart3, Brain, Cloud, Shield, Blocks } from 'lucide-react';
import { Button } from '@/components/categories/technology/ui/button';
import ProgramCard from '@/components/categories/technology/programs/ProgramCard';
import { Program, Category } from '@/data/categories/technology/programs';

const domainConfig: Record<Category, { icon: React.ElementType; gradient: string; accent: string }> = {
  'Software Engineering': { icon: Code, gradient: 'from-accent to-accent/70', accent: 'text-accent' },
  'Data & Analytics': { icon: BarChart3, gradient: 'from-secondary to-secondary/70', accent: 'text-secondary' },
  'AI & Machine Learning': { icon: Brain, gradient: 'from-accent to-accent/70', accent: 'text-accent' },
  'Cloud & DevOps': { icon: Cloud, gradient: 'from-secondary to-secondary/70', accent: 'text-secondary' },
  'Cybersecurity': { icon: Shield, gradient: 'from-accent to-accent/70', accent: 'text-accent' },
  'Low-Code & Business Apps': { icon: Blocks, gradient: 'from-secondary to-secondary/70', accent: 'text-secondary' },
};

interface DomainSectionProps {
  category: Category;
  programs: Program[];
  limit?: number;
  showViewAll?: boolean;
  compact?: boolean;
}

const DomainSection = ({ category, programs, limit, showViewAll = true, compact = false }: DomainSectionProps) => {
  const config = domainConfig[category];
  const Icon = config.icon;
  const displayPrograms = limit ? programs.slice(0, limit) : programs;

  if (programs.length === 0) return null;

  return (
    <div className={compact ? 'mb-0' : 'mb-16 last:mb-0'}>
      {/* Domain Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-secondary">{category}</h3>
          <p className="text-sm text-white/60">
            {programs.length} program{programs.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Program Cards */}
      <div className={`grid gap-8 ${compact ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
        {displayPrograms.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>

      {/* View All */}
      {showViewAll && limit && programs.length > limit && (
        <div className="text-center mt-8">
          <Link to={`/programs?category=${encodeURIComponent(category)}`}>
            <Button variant="outline" size="lg" className="group border-white/15 text-white/80 hover:border-secondary hover:text-secondary h-12 px-8 rounded-xl font-semibold">
              View All {category}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DomainSection;
