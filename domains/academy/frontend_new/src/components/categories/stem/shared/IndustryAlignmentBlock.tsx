import { useRef, useEffect, useCallback } from "react";
import autodeskLogo from "@/assets/categories/stem/vendors/autodesk.jpg";
import bentleyLogo from "@/assets/categories/stem/vendors/bentley.jpg";
import esriLogo from "@/assets/categories/stem/vendors/esri.jpg";
import mathworksLogo from "@/assets/categories/stem/vendors/mathworks.jpg";
import siemensLogo from "@/assets/categories/stem/vendors/siemens.jpg";
import oracleLogo from "@/assets/categories/stem/vendors/oracle.jpg";
import ansysLogo from "@/assets/categories/stem/vendors/ansys.jpg";
import trimbleLogo from "@/assets/categories/stem/vendors/trimble.jpg";
import dassaultLogo from "@/assets/categories/stem/vendors/dassault.jpg";

interface IndustryAlignmentBlockProps {
  variant?: "default" | "compact";
}

const ecosystems = [
  { name: "Autodesk", logo: autodeskLogo },
  { name: "Bentley Systems", logo: bentleyLogo },
  { name: "Esri", logo: esriLogo },
  { name: "MathWorks", logo: mathworksLogo },
  { name: "Siemens", logo: siemensLogo },
  { name: "Oracle", logo: oracleLogo },
  { name: "ANSYS", logo: ansysLogo },
  { name: "Trimble", logo: trimbleLogo },
  { name: "Dassault SystÃ¨mes", logo: dassaultLogo },
];

// Double the items for seamless infinite loop
const loopItems = [...ecosystems, ...ecosystems];

export function IndustryAlignmentBlock({ variant = "default" }: IndustryAlignmentBlockProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>();
  const pausedRef = useRef(false);

  const step = useCallback(() => {
    const el = scrollRef.current;
    if (!el || pausedRef.current) {
      animRef.current = requestAnimationFrame(step);
      return;
    }
    el.scrollLeft += 0.5;
    // Reset seamlessly when first set scrolls out
    const halfWidth = el.scrollWidth / 2;
    if (el.scrollLeft >= halfWidth) {
      el.scrollLeft = 0;
    }
    animRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(step);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [step]);

  if (variant === "compact") {
    return (
      <div className="bg-secondary/50 rounded-lg p-4 border border-divider">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">Industry-Aligned:</span>{" "}
          Our curriculum is based on globally recognized vendor ecosystems including{" "}
          {ecosystems.slice(0, 5).map(e => e.name).join(", ")}, and others.
        </p>
      </div>
    );
  }

  return (
    <section className="section-padding gradient-hero">
      <div className="container-content">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display text-4xl font-bold text-foreground">
            Industry-Aligned <span className="text-primary">STEM</span> Curriculum
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Aliko Academy STEM designs its programs based on globally recognized 
            engineering platforms and vendor ecosystems.
          </p>
        </div>

        <div
          className="overflow-hidden"
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
        >
          <div
            ref={scrollRef}
            className="flex gap-10 overflow-x-hidden py-4"
          >
            {loopItems.map((eco, i) => (
              <div
                key={`${eco.name}-${i}`}
                className="flex-shrink-0 flex flex-col items-center gap-3 group/item cursor-default"
              >
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden transition-transform duration-300 group-hover/item:scale-110">
                  <img
                    src={eco.logo}
                    alt={eco.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                  {eco.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-10 text-sm text-muted-foreground text-center max-w-3xl mx-auto">
          Certification exams and credentials are administered by third-party vendors. 
          Aliko Academy STEM provides training and preparation only.
        </p>
      </div>
    </section>
  );
}
