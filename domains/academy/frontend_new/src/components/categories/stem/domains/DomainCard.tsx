import { Link } from "react-router-dom";
import { Domain } from "../data/domains";
import { Card, CardContent } from "@/components/categories/stem/ui/card";
import {
  ArrowRight,
  Building2,
  Building,
  Home,
  Cog,
  Zap,
  Calendar,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/categories/stem/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Building,
  Home,
  Cog,
  Zap,
  Calendar,
  Globe,
};

interface DomainCardProps {
  domain: Domain;
  variant?: "default" | "compact" | "hero";
}

export function DomainCard({ domain, variant = "default" }: DomainCardProps) {
  const Icon = iconMap[domain.icon] || Building2;
  const programCount = "Multiple";

  if (variant === "hero") {
    return (
      <Link to="/programs">
        <Card className="card-hover border-divider bg-card h-full group">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div
              className={cn(
                "h-14 w-14 rounded-xl flex items-center justify-center mb-4",
                "bg-primary/10",
              )}
            >
              <Icon className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground">
              {domain.shortName}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {domain.description}
            </p>
            <span className="mt-4 inline-flex items-center text-sm font-medium text-primary group-hover:underline">
              Explore
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link to="/programs">
        <Card className="card-hover border-divider bg-card group">
          <CardContent className="p-4 flex items-center gap-4">
            <div
              className={cn(
                "h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0",
                "bg-primary/10",
              )}
            >
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-foreground truncate">
                {domain.shortName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {programCount} programs
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link to="/programs">
      <Card className="card-hover border-divider bg-card h-full group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div
              className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center",
                "bg-primary/10",
              )}
            >
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">
              {programCount} programs
            </span>
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
            {domain.name}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {domain.description}
          </p>
          <span className="mt-4 inline-flex items-center text-sm font-medium text-primary group-hover:underline">
            View Programs
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
