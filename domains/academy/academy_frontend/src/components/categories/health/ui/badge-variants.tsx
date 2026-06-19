import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/categories/health/utils';

const programBadgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        // Level badges — solid bg for visibility
        beginner: 'bg-accent text-white',
        intermediate: 'bg-accent text-white',
        advanced: 'bg-accent text-white',
        // Delivery mode badges
        online: 'bg-muted text-foreground',
        hybrid: 'bg-muted text-foreground',
        'in-person': 'bg-muted text-foreground',
        // Date badge
        date: 'bg-card text-foreground',
        // Category badges
        category: 'bg-muted text-muted-foreground',
        // Type badges
        'career-track': 'bg-accent text-white font-semibold',
        'short-course': 'bg-accent text-white font-semibold',
      },
    },
    defaultVariants: {
      variant: 'category',
    },
  }
);

export interface ProgramBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof programBadgeVariants> {}

function ProgramBadge({ className, variant, ...props }: ProgramBadgeProps) {
  return (
    <span className={cn(programBadgeVariants({ variant }), className)} {...props} />
  );
}

// Helper to get badge variant from level
function getLevelVariant(level: string): 'beginner' | 'intermediate' | 'advanced' {
  const normalized = level.toLowerCase();
  if (normalized === 'beginner') return 'beginner';
  if (normalized === 'intermediate') return 'intermediate';
  if (normalized === 'advanced') return 'advanced';
  return 'intermediate';
}

// Helper to get badge variant from delivery mode
function getDeliveryVariant(mode: string): 'online' | 'hybrid' | 'in-person' {
  const normalized = mode.toLowerCase();
  if (normalized === 'online') return 'online';
  if (normalized === 'hybrid') return 'hybrid';
  if (normalized === 'in-person') return 'in-person';
  return 'online';
}

export { ProgramBadge, programBadgeVariants, getLevelVariant, getDeliveryVariant };
