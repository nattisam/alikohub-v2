import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/categories/stem/ui/card";
import { GraduationCap, Briefcase, Building2, ArrowRight } from "lucide-react";

const audiences = [
  {
    id: "students",
    icon: GraduationCap,
    title: "Students & Graduates",
    description: "Start your engineering career with practical software skills",
    link: "/programs",
    linkText: "Explore Programs",
    accent: "primary",
    iconBg: "bg-primary/15 border border-primary/30",
    iconColor: "text-primary",
    hoverBorder: "hover:border-primary/50",
    hoverShadow: "hover:shadow-primary/15",
  },
  {
    id: "professionals",
    icon: Briefcase,
    title: "Professionals",
    description: "Upskill or transition to advanced engineering tools",
    link: "/programs",
    linkText: "Find Your Path",
    accent: "accent",
    iconBg: "bg-accent/15 border border-accent/30",
    iconColor: "text-accent",
    hoverBorder: "hover:border-accent/50",
    hoverShadow: "hover:shadow-accent/15",
  },
  {
    id: "organizations",
    icon: Building2,
    title: "Organizations & Universities",
    description: "Custom training and workforce development solutions",
    link: "/enterprise",
    linkText: "Enterprise Training",
    accent: "accent-green",
    iconBg: "bg-accent-green/15 border border-accent-green/30",
    iconColor: "text-accent-green",
    hoverBorder: "hover:border-accent-green/50",
    hoverShadow: "hover:shadow-accent-green/15",
  },
];

export function AudienceStrip() {
  return (
    <section className="section-padding bg-gradient-to-r from-[hsl(207_85%_28%)] via-[hsl(195_60%_22%)] to-[hsl(170_50%_20%)] border-y border-primary/20">
      <div className="container-content">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {audiences.map((audience) => {
            const Icon = audience.icon;
            return (
              <Link key={audience.id} to={audience.link}>
                <Card className={`card-hover border-divider h-full group ${audience.hoverBorder} ${audience.hoverShadow} hover:shadow-2xl`}>
                  <CardContent className="p-8">
                    <div className={`h-14 w-14 rounded-xl ${audience.iconBg} flex items-center justify-center`}>
                      <Icon className={`h-7 w-7 ${audience.iconColor}`} />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold text-foreground">
                      {audience.title}
                    </h3>
                    <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                      {audience.description}
                    </p>
                    <span className={`mt-5 inline-flex items-center text-sm font-bold ${audience.iconColor} group-hover:underline`}>
                      {audience.linkText}
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
