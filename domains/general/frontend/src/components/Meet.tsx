import Card from "../../../../../libraries/ui-libraries/components/Card";

import image5 from "../assets/image.png";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";

import { useEffect, useRef, useState } from "react";

// Array of team member avatar objects. Placeholders (with empty image) are used for spacing and layout symmetry.
const TeamAvaters = [
  { image: "", role: "" },
  { image: image4, role: " Project Manager" },
  { image: image5, role: "COO" },
  { image: image1, role: "CEO" },
  { image: image3, role: "CMO" },
  { image: image2, role: "Project Manager" },
  { image: "", role: "" },
];

const Meet = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [winWidth, setWinWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => setWinWidth(window.innerWidth));
    if (scrollRef.current) {
      if (winWidth > 780) {
        const scrollWidth = scrollRef.current.scrollWidth;
        const clientWidth = scrollRef.current.clientWidth;
        const centerOffset = (scrollWidth - clientWidth) / 2;
        scrollRef.current.scrollTo({ left: centerOffset, behavior: "smooth" });
      } else {
        // Mobile: center the center visible card
        const cardWidth = 160; // px
        const gap = 20; // px
        const visibleCards = TeamAvaters.map((a, i) =>
          a.image ? i : null
        ).filter((i) => i !== null);
        const visibleCenterIndex = Math.floor(visibleCards.length / 2);
        let leftOffset = 0;
        for (let i = 0; i < visibleCenterIndex; i++) {
          leftOffset += cardWidth + gap;
        }
        const containerWidth = scrollRef.current.clientWidth;
        const scrollTo = leftOffset - (containerWidth - cardWidth) / 2;
        scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
      }
    }
  }, [winWidth]);

  return (
    <section className="h-[28.125rem] bg-[#F9FAFB] relative overflow-hidden w-full">
      <div className="flex flex-col text-center items-center justify-center py-5">
        <h1 className="font-extrabold text-4xl text-[#090914]">
          Meet Our Team
        </h1>
        <p className="mt-5 mb-8 text-[#52525B] max-w-[25rem]">
          Clarity gives you the blocks & components you need to create a truly
          professional website, landing page or admin panel for your SaaS.
        </p>
      </div>
      <div
        ref={scrollRef}
        className="overflow-y-hidden overflow-x-auto scroll-smooth min-w-full relative md:bottom-20 lg:overflow-hidden"
      >
        <div className="relative flex-nowrap flex flex-row gap-5 h-[25rem]">
          {(() => {
            const centerIndex = Math.floor(TeamAvaters.length / 2);
            const maxSize = winWidth / 4;
            const minSize = winWidth / 6;
            const baseOverlap = minSize * 1.3;
            const lefts: number[] = [];
            let accLeft = -0.3 * minSize;
            for (let i = 0; i < TeamAvaters.length; i++) {
              const dist = Math.abs(i - centerIndex);
              lefts[i] = accLeft;
              const nextOverlap =
                winWidth <= 500
                  ? baseOverlap
                  : baseOverlap - ((baseOverlap - 110) * dist) / centerIndex;
              accLeft += nextOverlap;
            }
            return TeamAvaters.map((avater, index) => {
              const isCenter = index === centerIndex;
              const isHovered = hoveredIndex === index;
              const someoneElseHovered = hoveredIndex !== null && !isHovered;
              const isPlaceholder = !avater.image;
              const dist = Math.abs(index - centerIndex);
              const size = maxSize - ((maxSize - minSize) * dist) / centerIndex;
              const sizeRem = size / 16 + "rem";
              const hoverSizeRem = maxSize / 16 + "rem";
              const hoverStyle = !isPlaceholder
                ? `hover:w-[${hoverSizeRem}] hover:h-[${hoverSizeRem}] hover:z-[110] hover:bg-orange-300 transition-all duration-300`
                : "";
              let dynamicClass = `bg-gray-200`;
              if (isCenter && !someoneElseHovered) {
                dynamicClass = `bg-orange-300 z-[100]`;
              }
              if (isHovered && !isPlaceholder) {
                dynamicClass = `bg-orange-300 z-[110]`;
              }
              if (winWidth <= 780) {
                if (avater.image) {
                  return (
                    <div
                      key={index}
                      className="felx flex-col text-center"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <Card
                        img={avater.image}
                        className={`rounded-full overflow-hidden border-[0.375rem] border-[#F0F0F0] ${
                          isCenter && !someoneElseHovered
                            ? "bg-orange-300"
                            : "bg-orange[#F9FAFB] hover:bg-orange-300"
                        } flex flex-col items-center w-40 h-40`}
                        imgClassName="w-full object-contain object-cover"
                        style={{
                          width: "10rem",
                          height: "10rem",
                          minWidth: "10rem",
                          minHeight: "10rem",
                          maxWidth: "10rem",
                          maxHeight: "10rem",
                        }}
                      />
                      {((isHovered && !isCenter) ||
                        (isCenter && !someoneElseHovered)) && (
                        <p className="mt-4 text-base font-semibold text-[#090914]">
                          {avater.role}
                        </p>
                      )}
                    </div>
                  );
                }
              }
              if (winWidth > 780) {
                return (
                  <Card
                    key={index}
                    img={avater.image}
                    onMouseEnter={
                      !isPlaceholder ? () => setHoveredIndex(index) : undefined
                    }
                    onMouseLeave={
                      !isPlaceholder ? () => setHoveredIndex(null) : undefined
                    }
                    className={`shrink-0 rounded-full overflow-hidden border-[0.375rem] border-[#F9FAFB] flex items-start justify-center ${dynamicClass} ${
                      !isCenter ? hoverStyle : ""
                    }`}
                    imgClassName="w-full h-[100%] object-contain"
                    style={{
                      position: "absolute",
                      left: lefts[index],
                      bottom: 0,
                      width: isPlaceholder
                        ? "14rem"
                        : isHovered
                        ? hoverSizeRem
                        : sizeRem,
                      height: isPlaceholder
                        ? "14rem"
                        : isHovered && !isPlaceholder
                        ? hoverSizeRem
                        : sizeRem,
                      zIndex: isHovered
                        ? 45
                        : isCenter && !someoneElseHovered
                        ? 40
                        : 20 - dist,
                    }}
                  />
                );
              }
            });
          })()}
        </div>
      </div>
    </section>
  );
};

export default Meet;
