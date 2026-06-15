import { Link } from "react-router-dom";
import { Course } from "@/types/academy";
import { Badge } from "@/components/categories/stem/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/categories/stem/ui/card";
import { Button } from "@/components/categories/stem/ui/button";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/categories/stem/utils";
import {
  getSoftwareIcon,
  iconColorStyles,
} from "@/data/categories/stem/softwareIcons";
import { getProgramThumbnail } from "@/data/categories/stem/programThumbnails";

interface ProgramCardProps {
  program: Course;
  variant?: "default" | "compact" | "visual" | "thumbnail";
}

export function ProgramCard({
  program,
  variant = "default",
}: ProgramCardProps) {
  const levelClasses: Record<string, string> = {
    BEGINNER:
      "bg-accent-green/15 text-accent-green border-accent-green/40 font-bold",
    INTERMEDIATE: "bg-primary/15 text-primary border-primary/40 font-bold",
    ADVANCED: "bg-accent/15 text-accent border-accent/40 font-bold",
  };

  const deliveryClasses = {
    Online: "bg-accent/15 text-accent border-accent/40 font-bold",
    Hybrid:
      "bg-accent-green/15 text-accent-green border-accent-green/40 font-bold",
  };

  const programLevel = program.difficulty || "BEGINNER";

  const softwareIcon = getSoftwareIcon(program.slug);
  const colorStyle =
    iconColorStyles[softwareIcon.color] || iconColorStyles["primary"];
  const fallbackThumbnail = getProgramThumbnail(program.slug);
  const thumbnail = program.thumbnail
    ? program.thumbnail.startsWith("http")
      ? program.thumbnail
      : `https://api.consultancy.alikohub.com${program.thumbnail.startsWith("/") ? "" : "/"}${program.thumbnail}`
    : fallbackThumbnail;

  // Thumbnail variant - image-focused card
  if (variant === "thumbnail") {
    return (
      <Link to={`/stem/programs/${program.id}`} className="group">
        <Card className="border border-divider overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card">
          <div className="aspect-square overflow-hidden">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={program.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div
                className={cn(
                  "w-full h-full flex items-center justify-center text-3xl font-extrabold",
                  colorStyle.bg,
                  colorStyle.text,
                )}
              >
                {softwareIcon.initials}
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {program.title}
            </h3>
            <span className={cn("text-xs font-semibold", colorStyle.text)}>
              {softwareIcon.vendor}
            </span>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="outline"
                className={cn("text-[10px]", levelClasses[programLevel])}
              >
                {programLevel}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Visual variant - icon-focused with minimal text
  if (variant === "visual") {
    return (
      <Link to={`/stem/programs/${program.id}`} className="group">
        <Card
          className={cn(
            "border transition-all duration-200 overflow-hidden h-full",
            "hover:shadow-xl hover:-translate-y-1",
            colorStyle.border,
            "bg-card hover:bg-surface-elevated",
          )}
        >
          <CardContent className="p-5 flex flex-col items-center text-center">
            <div
              className={cn(
                "w-16 h-16 rounded-xl flex items-center justify-center text-lg font-extrabold mb-3 transition-all",
                "border-2 group-hover:scale-105 shadow-md",
                colorStyle.bg,
                colorStyle.text,
                colorStyle.border,
              )}
            >
              {softwareIcon.initials}
            </div>
            <h3 className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {program.title}
            </h3>
            <span className={cn("text-xs font-semibold mt-1", colorStyle.text)}>
              {softwareIcon.vendor}
            </span>
            <Badge
              variant="outline"
              className={cn("text-[10px] mt-2", levelClasses[programLevel])}
            >
              {programLevel}
            </Badge>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Card className="card-hover border-divider bg-card group h-full flex flex-col">
        <CardContent className="p-5 flex-1">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 border-2 shadow-md",
                colorStyle.bg,
                colorStyle.text,
                colorStyle.border,
              )}
            >
              {softwareIcon.initials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-foreground truncate text-base">
                {program.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                {program.shortDescription || "Software Training Course"}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn("text-xs", levelClasses[programLevel])}
            >
              {programLevel}
            </Badge>
            <Badge
              variant="outline"
              className={cn("text-xs", deliveryClasses.Online)}
            >
              Online
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="p-5 pt-0">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="w-full justify-between font-bold"
          >
            <Link to={`/stem/programs/${program.id}`}>
              View Program
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Default variant - clean card with bullet highlights
  const highlights = program.description
    ? ["Software certification", "Online paced curriculum"]
    : ["Interactive learning", "Skill credential"];

  return (
    <Card className="card-hover border-divider bg-card overflow-hidden group h-full flex flex-col">
      <CardContent className="p-7 flex-1">
        <div className="flex items-start gap-4 mb-4">
          <div
            className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center text-base font-extrabold flex-shrink-0 border-2 transition-all group-hover:scale-105 shadow-lg",
              colorStyle.bg,
              colorStyle.text,
              colorStyle.border,
            )}
          >
            {softwareIcon.initials}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <Badge
                variant="outline"
                className={cn("text-xs", levelClasses[programLevel])}
              >
                {programLevel}
              </Badge>
              <Badge
                variant="outline"
                className={cn("text-xs", deliveryClasses.Online)}
              >
                Online
              </Badge>
            </div>
            <span className={cn("text-xs font-bold", colorStyle.text)}>
              {softwareIcon.vendor}
            </span>
          </div>
        </div>
        <h3 className="font-display text-xl font-bold text-foreground">
          {program.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-1 leading-relaxed">
          {program.shortDescription || "Software Training Course"}
        </p>

        <ul className="mt-4 space-y-1.5">
          {highlights.map((skill, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green flex-shrink-0" />
              <span className="line-clamp-1">{skill}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center gap-5 text-xs text-muted-foreground font-medium">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            Self-paced
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-accent" />
            Flexible
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-7 pt-0">
        <Button asChild variant="outline" className="w-full group font-bold">
          <Link to={`/stem/programs/${program.id}`}>
            View Program
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
