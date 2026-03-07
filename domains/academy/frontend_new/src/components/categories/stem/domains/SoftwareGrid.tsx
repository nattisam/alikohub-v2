import { Software } from "@/data/categories/stem/domainSoftware";
import { cn } from "@/lib/categories/stem/utils";

interface SoftwareGridProps {
  software: Software[];
  accentColor: string;
}

const colorStyles: Record<string, { bg: string; border: string; text: string; hoverBg: string; iconBg: string }> = {
  "primary": { bg: "bg-primary/8", border: "border-primary/25", text: "text-[hsl(207_90%_72%)]", hoverBg: "hover:bg-primary/15", iconBg: "bg-primary/20" },
  "accent": { bg: "bg-accent/8", border: "border-accent/25", text: "text-[hsl(195_100%_75%)]", hoverBg: "hover:bg-accent/15", iconBg: "bg-accent/20" },
  "accent-green": { bg: "bg-accent-green/8", border: "border-accent-green/25", text: "text-[hsl(80_70%_70%)]", hoverBg: "hover:bg-accent-green/15", iconBg: "bg-accent-green/20" },
  "electrical": { bg: "bg-[hsl(280_68%_55%)]/8", border: "border-[hsl(280_68%_55%)]/25", text: "text-[hsl(280_68%_78%)]", hoverBg: "hover:bg-[hsl(280_68%_55%)]/15", iconBg: "bg-[hsl(280_68%_55%)]/20" },
};

const getVendorInitials = (vendor?: string): string => {
  if (!vendor) return "SW";
  const words = vendor.split(" ");
  if (words.length === 1) return vendor.slice(0, 2).toUpperCase();
  return words.slice(0, 2).map(w => w[0]).join("").toUpperCase();
};

export const SoftwareGrid = ({ software, accentColor }: SoftwareGridProps) => {
  // Map legacy accent-orange to accent-green
  const mappedColor = accentColor === "accent-orange" ? "accent-green" : accentColor;
  const styles = colorStyles[mappedColor] || colorStyles["primary"];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {software.map((sw, idx) => (
        <div key={idx} className={cn("group relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 cursor-default", styles.bg, styles.border, styles.hoverBg, "hover:scale-105 hover:shadow-lg")}>
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold mb-2 transition-all", styles.iconBg, "border", styles.border, styles.text)}>
            {getVendorInitials(sw.vendor)}
          </div>
          <span className="text-xs font-medium text-foreground/90 text-center leading-tight group-hover:text-foreground transition-colors">{sw.name}</span>
          {sw.vendor && (
            <span className={cn("text-[10px] mt-1 font-medium opacity-60 group-hover:opacity-100 transition-opacity", styles.text)}>{sw.vendor}</span>
          )}
        </div>
      ))}
    </div>
  );
};
