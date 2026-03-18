import { Link } from "react-router-dom";
import { Course } from "@/types/academy";
import { Badge } from "@/components/categories/stem/ui/badge";
import { ArrowRight } from "lucide-react";

// Program-specific thumbnail imports
import autocadThumb from "@/assets/categories/stem/programs/autocad-thumb.jpg";
import civil3dThumb from "@/assets/categories/stem/programs/civil3d-thumb.jpg";
import etabsThumb from "@/assets/categories/stem/programs/etabs-thumb.jpg";
import revitStructureThumb from "@/assets/categories/stem/programs/revit-structure-thumb.jpg";
import solidworksThumb from "@/assets/categories/stem/programs/solidworks-thumb.jpg";
import fusion360Thumb from "@/assets/categories/stem/programs/fusion360-thumb.jpg";
import ansysThumb from "@/assets/categories/stem/programs/ansys-thumb.jpg";
import aspenPlusThumb from "@/assets/categories/stem/programs/aspen-plus-thumb.jpg";
import aspenHysysThumb from "@/assets/categories/stem/programs/aspen-hysys-thumb.jpg";
import etapThumb from "@/assets/categories/stem/programs/etap-thumb.jpg";
import revitArchThumb from "@/assets/categories/stem/programs/revit-arch-thumb.jpg";
import sketchupThumb from "@/assets/categories/stem/programs/sketchup-thumb.jpg";
import primaveraThumb from "@/assets/categories/stem/programs/primavera-thumb.jpg";
import arcgisThumb from "@/assets/categories/stem/programs/arcgis-thumb.jpg";
import catiaThumb from "@/assets/categories/stem/programs/catia-thumb.jpg";
import ansysFluentThumb from "@/assets/categories/stem/programs/ansys-fluent-thumb.jpg";
import civilEngThumb from "@/assets/categories/stem/programs/civil-engineering-thumb.jpg";

const programThumbnails: Record<string, string> = {
  autocad: autocadThumb,
  "civil-3d": civil3dThumb,
  etabs: etabsThumb,
  "revit-structure": revitStructureThumb,
  solidworks: solidworksThumb,
  "fusion-360": fusion360Thumb,
  "ansys-mechanical": ansysThumb,
  "aspen-plus": aspenPlusThumb,
  "aspen-hysys": aspenHysysThumb,
  etap: etapThumb,
  "revit-architecture": revitArchThumb,
  sketchup: sketchupThumb,
  "primavera-p6": primaveraThumb,
  arcgis: arcgisThumb,
  "catia-v5": catiaThumb,
  "ansys-fluent-aerospace": ansysFluentThumb,
};

interface FeaturedProgramCardProps {
  program: Course;
}

export function FeaturedProgramCard({ program }: FeaturedProgramCardProps) {
  const thumbnail = programThumbnails[program.slug] || civilEngThumb;
  const highlights = program.description
    ? ["Software certification", "Online paced curriculum"]
    : ["Interactive learning", "Skill credential"];

  return (
    <Link
      to={`/programs/${program.slug}`}
      className="group block rounded-2xl overflow-hidden border border-divider bg-card h-full flex flex-col transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={thumbnail}
          alt={program.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge
          variant="outline"
          className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground border-divider text-xs font-semibold uppercase"
        >
          {program.difficulty || "BEGINNER"}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-lg font-bold text-foreground leading-snug line-clamp-2">
          {program.title}
        </h3>

        <ul className="mt-3 space-y-1.5 flex-1">
          {highlights.map((skill, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span className="line-clamp-1">{skill}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 pt-3 border-t border-divider flex items-center justify-between text-sm">
          <span className="text-muted-foreground font-medium">Self-paced</span>
          <span className="text-primary font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
            View Program
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
