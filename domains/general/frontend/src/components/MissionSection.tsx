import { motion } from "framer-motion";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const cards = [
  {
    title: "Transforming Workforce & Innovation Systems",
    text: "Advancing Digital Health, One Health, STEM, and entrepreneurship through integrated training, applied innovation, and scalable workforce pathways across Africa.",
    bg: "bg-[hsl(45,18%,96%)] dark:bg-[hsl(220,30%,12%)]",
    textColor: "text-[hsl(20,60%,20%)] dark:text-white",
    span: "col-span-1",
    rowSpan: "",
  },
  {
    title: "Inclusive & Sustainable Growth",
    text: "Designing youth-centered ecosystems that align skills development with public health resilience, climate responsibility, and long-term economic opportunity.",
    bg: "bg-[hsl(45,18%,96%)] dark:bg-[hsl(220,30%,12%)]",
    textColor: "text-[hsl(20,60%,20%)] dark:text-white",
    span: "col-span-1",
    rowSpan: "",
  },
  {
    title: "Vision",
    text: "To build Africa's leading youth resourcefulness ecosystem, a continental network of innovation hubs, digital platforms, and global partnerships that transform demographic momentum into measurable prosperity.",
    bg: "bg-[hsl(45,18%,96%)] dark:bg-[hsl(220,30%,12%)]",
    textColor: "text-[hsl(20,60%,20%)] dark:text-white",
    span: "col-span-1",
    rowSpan: "row-span-2",
  },
  {
    title: "Mission",
    text: "AlikoHub exists to honor youth potential by building structured pathways from learning to livelihood. Through Digital Health, One Health, STEM, and innovation, we equip young people to lead, create, and contribute with dignity across Africa and beyond.",
    bg: "bg-[hsl(45,18%,96%)] dark:bg-[hsl(220,30%,12%)]",
    textColor: "text-[hsl(20,60%,20%)] dark:text-white",
    span: "col-span-2",
    rowSpan: "row-span-1",
  },
  {
    title: "Empowerment Through Structured Opportunity",
    text: "We move beyond isolated training programs by integrating mentorship, applied labs, enterprise incubation, and employer pipelines into a single coordinated ecosystem.",
    bg: "bg-[hsl(45,18%,96%)] dark:bg-[hsl(220,30%,12%)]",
    textColor: "text-[hsl(20,60%,20%)] dark:text-white",
    span: "col-span-1",
    rowSpan: "",
  },
  {
    title: "Global Pathways & Cross-Continental Collaboration",
    text: "Through partnerships spanning Africa, the United States, and Canada, AlikoHub creates global exposure, mentorship exchange, and workforce integration that strengthens Africa's role in the global innovation economy.",
    bg: "bg-[hsl(45,18%,96%)] dark:bg-[hsl(220,30%,12%)]",
    textColor: "text-[hsl(20,60%,20%)] dark:text-white",
    span: "col-span-1",
    rowSpan: "",
  },
];

export function MissionSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section id="about" className="relative py-24 lg:py-32 bg-card/50">
      <div className="container mx-auto px-6">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
            Mission & Vision
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            What Drives <span className="text-gradient-amber">Us</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A human-centered development model that links skills to opportunity, learning to livelihoods, and innovation to public value.
          </p>
        </motion.div>

        {/* Horizontal scroll list with navigation buttons */}
        <div className="relative group">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-1/2 rounded-full border border-primary/20 bg-background/80 p-3 text-foreground shadow-sm backdrop-blur-md transition-all hover:bg-[#E58E3C] hover:text-white hover:border-[#E58E3C] focus:outline-none focus:ring-2 focus:ring-[#E58E3C] focus:ring-offset-2 disabled:opacity-50"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="overflow-hidden rounded-2xl">
            <div 
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {cards.map((card, i) => (
                <motion.div
                  key={card.title}
                  className={`${card.bg} shrink-0 w-[300px] md:w-[350px] snap-center rounded-2xl p-8 flex flex-col justify-start relative transition-all duration-300`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="relative z-10">
                    <h3 className={`font-heading text-xl md:text-2xl font-extrabold ${card.textColor} mb-3 leading-tight`}>
                      {card.title}
                    </h3>
                    <p className={`text-sm md:text-base leading-relaxed ${card.textColor} opacity-80`}>
                      {card.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1/2 rounded-full border border-primary/20 bg-background/80 p-3 text-foreground shadow-sm backdrop-blur-md transition-all hover:bg-[#E58E3C] hover:text-white hover:border-[#E58E3C] focus:outline-none focus:ring-2 focus:ring-[#E58E3C] focus:ring-offset-2 disabled:opacity-50"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
