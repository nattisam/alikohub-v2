import { useEffect, useState } from "react";

type SectionRefs = {
  [key: string]: React.RefObject<HTMLElement | null>;
};

export function useVisibleSection(sectionRefs: SectionRefs, offset = 0) {
  const [visibleSection, setVisibleSection] = useState<string | null>(null);

  useEffect(() => {
    const entries = Object.entries(sectionRefs);
    const observer = new window.IntersectionObserver(
      (observedEntries) => {
        // Find the first section that is intersecting
        const visible = observedEntries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          setVisibleSection(visible.target.getAttribute("data-section"));
        }
      },
      {
        root: null,
        rootMargin: `-${offset}px 0px 0px 0px`,
        threshold: 0.25, // At least 35% of the section is visible
      }
    );

    entries.forEach(([section, ref]) => {
      if (ref.current) {
        ref.current.setAttribute("data-section", section);
        observer.observe(ref.current);
      }
    });

    return () => {
      entries.forEach(([_, ref]) => {
        if (ref.current) observer.unobserve(ref.current);
      });
      observer.disconnect();
    };
  }, [sectionRefs, offset]);

  return visibleSection;
}
