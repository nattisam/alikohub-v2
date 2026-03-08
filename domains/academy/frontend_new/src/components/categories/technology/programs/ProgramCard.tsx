import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/categories/technology/ui/button';
import { ProgramBadge, getLevelVariant } from '@/components/categories/technology/ui/badge-variants';
import { Program } from '@/data/categories/technology/programs';
import { cn } from '@/lib/categories/technology/utils';

// Per-program thumbnails
import thumbFullstack from '@/assets/categories/technology/thumb-fullstack.jpg';
import thumbFrontend from '@/assets/categories/technology/thumb-frontend.jpg';
import thumbBackend from '@/assets/categories/technology/thumb-backend.jpg';
import thumbDataAnalytics from '@/assets/categories/technology/thumb-data-analytics.jpg';
import thumbDataEngineering from '@/assets/categories/technology/thumb-data-engineering.jpg';
import thumbDataScience from '@/assets/categories/technology/thumb-data-science.jpg';
import thumbAiEngineer from '@/assets/categories/technology/thumb-ai-engineer.jpg';
import thumbMlEngineer from '@/assets/categories/technology/thumb-ml-engineer.jpg';
import thumbCloudAzure from '@/assets/categories/technology/thumb-cloud-azure.jpg';
import thumbCloudAws from '@/assets/categories/technology/thumb-cloud-aws.jpg';
import thumbDevops from '@/assets/categories/technology/thumb-devops.jpg';
import thumbCybersecurity from '@/assets/categories/technology/thumb-cybersecurity.jpg';
import thumbLowcode from '@/assets/categories/technology/thumb-lowcode.jpg';

// Domain fallback images
import heroSoftwareEngineering from '@/assets/categories/technology/hero-software-engineering.jpg';
import heroDataAnalytics from '@/assets/categories/technology/hero-data-analytics.jpg';
import heroAiMl from '@/assets/categories/technology/hero-ai-ml.jpg';
import heroCloudEngineering from '@/assets/categories/technology/hero-cloud-engineering.jpg';
import heroCybersecurity from '@/assets/categories/technology/hero-cybersecurity.jpg';
import heroLowcode from '@/assets/categories/technology/hero-lowcode.jpg';

// Slug-specific thumbnails for distinct visuals per program
const slugThumbnails: Record<string, string> = {
  // Software Engineering
  'full-stack-software-engineering': thumbFullstack,
  'front-end-engineering': thumbFrontend,
  'back-end-engineering': thumbBackend,
  'programming-fundamentals': thumbFrontend,
  'html-css-responsive-design': thumbFrontend,
  'javascript-fundamentals': thumbFrontend,
  'typescript-fundamentals': thumbFrontend,
  'react-fundamentals': thumbFrontend,
  'nodejs-api-fundamentals': thumbBackend,
  'python-programming-fundamentals': thumbBackend,
  'sql-foundations-for-developers': thumbBackend,
  'system-design-basics': thumbFullstack,
  'testing-fundamentals': thumbFullstack,
  // Data & Analytics
  'data-analytics': thumbDataAnalytics,
  'data-engineering': thumbDataEngineering,
  'data-science': thumbDataScience,
  'sql-for-analytics': thumbDataAnalytics,
  'excel-data-analysis': thumbDataAnalytics,
  'power-bi-dashboards': thumbDataAnalytics,
  'python-for-data': thumbDataScience,
  'statistics-essentials': thumbDataScience,
  // AI & Machine Learning
  'ai-engineer-applied-genai': thumbAiEngineer,
  'machine-learning-engineer': thumbMlEngineer,
  'prompt-engineering': thumbAiEngineer,
  'intro-to-ml': thumbMlEngineer,
  'intro-to-machine-learning': thumbMlEngineer,
  // Cloud & DevOps
  'cloud-engineer-azure': thumbCloudAzure,
  'cloud-engineer-aws': thumbCloudAws,
  'devops-engineer': thumbDevops,
  'cloud-fundamentals': thumbCloudAzure,
  'docker-fundamentals': thumbDevops,
  'linux-fundamentals': thumbDevops,
  // Cybersecurity
  'cybersecurity-analyst': thumbCybersecurity,
  'cybersecurity-foundations': thumbCybersecurity,
  'security-operations': thumbCybersecurity,
  // Low-Code
  'power-platform-app-maker': thumbLowcode,
  'power-apps-fundamentals': thumbLowcode,
  'power-automate-fundamentals': thumbLowcode,
};

// Category fallback map
const categoryFallback: Record<string, string> = {
  'Software Engineering': heroSoftwareEngineering,
  'Data & Analytics': heroDataAnalytics,
  'AI & Machine Learning': heroAiMl,
  'Cloud & DevOps': heroCloudEngineering,
  'Cybersecurity': heroCybersecurity,
  'Low-Code & Business Apps': heroLowcode,
};

interface ProgramCardProps {
  program: Program;
  className?: string;
}

const ProgramCard = ({ program, className }: ProgramCardProps) => {
  const detailPath = program.type === 'career-track'
    ? `/programs/career-tracks/${program.slug}`
    : `/programs/short-courses/${program.slug}`;

  const thumbnail = slugThumbnails[program.slug] || categoryFallback[program.category] || heroSoftwareEngineering;

  return (
    <article
      className={cn(
        'group flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden hover:border-accent/40 transition-all duration-500',
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img
          src={thumbnail}
          alt={program.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        {/* Badges overlaid on image */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          <ProgramBadge variant={getLevelVariant(program.level)}>
            {program.level}
          </ProgramBadge>
          <ProgramBadge variant="date">
            <Calendar className="h-3 w-3 mr-1" />
            {program.startDate}
          </ProgramBadge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5">
        <h3 className="text-lg font-bold text-accent mb-2 group-hover:text-secondary transition-colors duration-300">
          {program.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
          {program.outcome}
        </p>

        {/* Duration & Hours */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-accent" />
            {program.duration}
          </span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>{program.weeklyHours}</span>
        </div>

        {/* Skills preview — white bold */}
        <div className="flex flex-wrap gap-1.5">
          {program.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-xs px-2.5 py-1 bg-accent/10 rounded-lg text-foreground font-bold"
            >
              {skill}
            </span>
          ))}
          {program.skills.length > 3 && (
            <span className="text-xs px-2.5 py-1 text-muted-foreground font-medium">
              +{program.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <Link to={detailPath}>
          <Button
            className="w-full h-10 bg-accent text-white rounded-xl font-semibold text-sm border-none"
          >
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </article>
  );
};

export default ProgramCard;
