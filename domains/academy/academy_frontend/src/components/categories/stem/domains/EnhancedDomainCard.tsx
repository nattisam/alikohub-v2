import { Link } from "react-router-dom";
import { Domain } from "@/data/categories/stem/domains";
import { cn } from "@/lib/categories/stem/utils";

import civilImg from "@/assets/categories/stem/domains/civil-engineering.jpg";
import electricalImg from "@/assets/categories/stem/domains/electrical-engineering.jpg";
import mechanicalImg from "@/assets/categories/stem/domains/mechanical-engineering.jpg";
import architecturalImg from "@/assets/categories/stem/domains/architectural-engineering.jpg";
import structuralImg from "@/assets/categories/stem/domains/structural-bim.jpg";
import projectImg from "@/assets/categories/stem/domains/project-controls.jpg";
import gisImg from "@/assets/categories/stem/domains/gis-infrastructure.jpg";
import aviationImg from "@/assets/categories/stem/domains/aviation-aerospace.jpg";
import chemicalImg from "@/assets/categories/stem/domains/chemical-engineering.jpg";

const domainImages: Record<string, string> = {
  "civil-structural": civilImg,
  electrical: electricalImg,
  mechanical: mechanicalImg,
  chemical: chemicalImg,
  architectural: architecturalImg,
  "structural-bim": structuralImg,
  "project-controls": projectImg,
  "gis-international": gisImg,
  aviation: aviationImg,
};

const domainAccents: Record<
  string,
  { label: string; labelBg: string; border: string; glow: string }
> = {
  "civil-structural": {
    label: "text-accent-green",
    labelBg: "bg-accent-green/20",
    border: "group-hover:border-accent-green/60",
    glow: "group-hover:shadow-accent-green/30",
  },
  electrical: {
    label: "text-[hsl(280_68%_75%)]",
    labelBg: "bg-[hsl(280_68%_60%)]/20",
    border: "group-hover:border-[hsl(280_68%_60%)]/60",
    glow: "group-hover:shadow-[hsl(280_68%_60%)]/30",
  },
  mechanical: {
    label: "text-accent-green",
    labelBg: "bg-accent-green/20",
    border: "group-hover:border-accent-green/60",
    glow: "group-hover:shadow-accent-green/30",
  },
  chemical: {
    label: "text-accent",
    labelBg: "bg-accent/20",
    border: "group-hover:border-accent/60",
    glow: "group-hover:shadow-accent/30",
  },
  architectural: {
    label: "text-accent",
    labelBg: "bg-accent/20",
    border: "group-hover:border-accent/60",
    glow: "group-hover:shadow-accent/30",
  },
  "structural-bim": {
    label: "text-primary",
    labelBg: "bg-primary/20",
    border: "group-hover:border-primary/60",
    glow: "group-hover:shadow-primary/30",
  },
  "project-controls": {
    label: "text-primary",
    labelBg: "bg-primary/20",
    border: "group-hover:border-primary/60",
    glow: "group-hover:shadow-primary/30",
  },
  "gis-international": {
    label: "text-accent-green",
    labelBg: "bg-accent-green/20",
    border: "group-hover:border-accent-green/60",
    glow: "group-hover:shadow-accent-green/30",
  },
  aviation: {
    label: "text-accent",
    labelBg: "bg-accent/20",
    border: "group-hover:border-accent/60",
    glow: "group-hover:shadow-accent/30",
  },
};

interface EnhancedDomainCardProps {
  domain: Domain;
  className?: string;
}

export function EnhancedDomainCard({
  domain,
  className,
}: EnhancedDomainCardProps) {
  const programCount = "Multiple";
  const image = domainImages[domain.id] || civilImg;
  const accent = domainAccents[domain.id] || domainAccents["civil-structural"];

  return (
    <Link
      to="/stem/programs"
      className={cn(
        "group relative block overflow-hidden rounded-2xl aspect-[4/3]",
        "transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl",
        accent.glow,
        className,
      )}
    >
      <img
        src={image}
        alt={domain.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/15 group-hover:from-black/95 transition-opacity duration-300" />
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <span
          className={cn(
            "text-xs font-extrabold uppercase tracking-widest mb-2 px-3 py-1 rounded-full w-fit",
            accent.label,
            accent.labelBg,
          )}
        >
          Engineering Domain
        </span>
        <h3 className="font-display text-xl font-extrabold text-white leading-tight">
          {domain.shortName}
        </h3>
        <p className="mt-2 text-sm text-white/85 font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-green" />
          {programCount} programs available
        </p>
      </div>
      <div
        className={cn(
          "absolute inset-0 rounded-2xl border-2 border-transparent transition-all duration-500",
          accent.border,
        )}
      />
    </Link>
  );
}
