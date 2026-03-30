import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Droplets, Heart, Building2, Globe, Sparkles } from "lucide-react";

interface TimelineProps {
  chapters: Array<{
    id: string;
    year: number;
    title: string;
  }>;
  activeChapter: string;
  onChapterClick: (id: string) => void;
}

const chapterIcons: Record<string, React.ElementType> = {
  "1995": Droplets,
  "2019": Heart,
  "2024": Building2,
  "2025": Globe,
};

const chapterColors: Record<string, { gradient: string; glow: string; text: string }> = {
  "1995": { 
    gradient: "from-[hsl(201,89%,48%)] to-[hsl(199,89%,60%)]", 
    glow: "shadow-[0_0_30px_hsl(201,89%,48%,0.4)]",
    text: "bg-gradient-to-r from-[hsl(201,89%,48%)] to-[hsl(24,95%,53%)] bg-clip-text text-transparent"
  },
  "2019": { 
    gradient: "from-[hsl(201,89%,48%)] to-[hsl(24,95%,53%)]", 
    glow: "shadow-[0_0_30px_hsl(24,95%,53%,0.4)]",
    text: "bg-gradient-to-r from-[hsl(201,89%,48%)] to-[hsl(24,95%,53%)] bg-clip-text text-transparent"
  },
  "2024": { 
    gradient: "from-[hsl(24,95%,53%)] to-[hsl(201,89%,48%)]", 
    glow: "shadow-[0_0_30px_hsl(201,89%,48%,0.4)]",
    text: "bg-gradient-to-r from-[hsl(24,95%,53%)] to-[hsl(201,89%,48%)] bg-clip-text text-transparent"
  },
  "2025": { 
    gradient: "from-[hsl(201,89%,55%)] to-[hsl(142,76%,36%)]", 
    glow: "shadow-[0_0_30px_hsl(142,76%,36%,0.4)]",
    text: "bg-gradient-to-r from-[hsl(201,89%,55%)] to-[hsl(142,76%,36%)] bg-clip-text text-transparent"
  },
};

export function StoryTimeline({ chapters, activeChapter, onChapterClick }: TimelineProps) {
  const activeIndex = chapters.findIndex((c) => c.id === activeChapter);

  return (
    <div
      id="story-timeline"
      className="sticky top-16 z-40 bg-background/95 backdrop-blur-lg border-b border-border py-6 overflow-hidden"
    >
      <div className="container-main">
        {/* Creative River Path Timeline */}
        <div className="relative">
          {/* Flowing Water Animation Background */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-3 bg-gradient-to-r from-primary/5 via-primary/15 to-primary/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                animate={{ x: ["-100%", "400%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>

          {/* Sparkle decorations */}
          <motion.div
            className="absolute -top-2 left-1/4"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-accent" />
          </motion.div>
          <motion.div
            className="absolute -top-2 right-1/4"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
          </motion.div>

          {/* Timeline Items */}
          <div className="relative flex items-center justify-between">
            {chapters.map((chapter, index) => {
              const Icon = chapterIcons[chapter.id] || Droplets;
              const isActive = activeChapter === chapter.id;
              const isPast = activeIndex > index;
              const colors = chapterColors[chapter.id] || chapterColors["1995"];

              return (
                <motion.button
                  key={chapter.id}
                  onClick={() => onChapterClick(chapter.id)}
                  className="relative flex flex-col items-center group z-10"
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Connector Line */}
                  {index > 0 && (
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-[calc(100%-2rem)] md:w-[calc(100%-3rem)] h-1.5 -mr-2">
                      <div className="w-full h-full bg-border/50 rounded-full" />
                      <motion.div
                        className={cn(
                          "absolute inset-0 rounded-full bg-gradient-to-r",
                          isPast || isActive ? colors.gradient : "from-transparent to-transparent"
                        )}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isPast || isActive ? 1 : 0 }}
                        transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                        style={{ transformOrigin: "left" }}
                      />
                    </div>
                  )}

                  {/* Icon Circle */}
                  <motion.div
                    className={cn(
                      "relative w-14 h-14 md:w-18 md:h-18 rounded-full flex items-center justify-center transition-all duration-500 border-2",
                      isActive
                        ? `bg-gradient-to-br ${colors.gradient} border-transparent ${colors.glow}`
                        : isPast
                        ? "bg-primary/20 border-primary/40 hover:border-primary"
                        : "bg-muted/50 border-border group-hover:border-primary/50 group-hover:bg-muted"
                    )}
                    animate={isActive ? {
                      scale: [1, 1.05, 1],
                    } : {}}
                    transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                  >
                    <Icon
                      className={cn(
                        "w-6 h-6 md:w-8 md:h-8 transition-all duration-300",
                        isActive
                          ? "text-white drop-shadow-lg"
                          : isPast
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />

                    {/* Ripple Effect for Active */}
                    {isActive && (
                      <>
                        <motion.div
                          className={cn("absolute inset-0 rounded-full bg-gradient-to-br opacity-60", colors.gradient)}
                          animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                          transition={{ duration: 1.8, repeat: Infinity }}
                        />
                        <motion.div
                          className={cn("absolute inset-0 rounded-full bg-gradient-to-br opacity-40", colors.gradient)}
                          animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                          transition={{ duration: 1.8, repeat: Infinity, delay: 0.4 }}
                        />
                        <motion.div
                          className={cn("absolute inset-0 rounded-full bg-gradient-to-br opacity-20", colors.gradient)}
                          animate={{ scale: [1, 2.4], opacity: [0.2, 0] }}
                          transition={{ duration: 1.8, repeat: Infinity, delay: 0.8 }}
                        />
                      </>
                    )}

                    {/* Hover glow */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </motion.div>

                  {/* Year & Title */}
                  <motion.div
                    className="mt-4 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 + 0.2 }}
                  >
                    <motion.span
                      className={cn(
                        "block text-xl md:text-3xl font-display font-bold transition-all duration-300 px-3 py-1 rounded-lg",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : isPast
                          ? "bg-primary/20 text-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-muted/80 group-hover:text-foreground"
                      )}
                      animate={isActive ? {
                        scale: [1, 1.05, 1],
                      } : {}}
                      transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                    >
                      {chapter.year}
                    </motion.span>
                    <span
                      className={cn(
                        "block text-xs md:text-sm font-medium max-w-[80px] md:max-w-[120px] truncate transition-colors mt-2",
                        isActive
                          ? "text-foreground font-bold"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      {chapter.title}
                    </span>
                  </motion.div>

                  {/* Floating particles for Active */}
                  {isActive && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent"
                          initial={{ y: 0, x: (i - 2) * 10, opacity: 1, scale: 1 }}
                          animate={{
                            y: [-8, -30],
                            opacity: [1, 0],
                            scale: [1, 0.5],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.25,
                            ease: "easeOut"
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Journey Progress Text */}
        <motion.div
          className="mt-6 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div 
            className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-border/50"
            whileHover={{ scale: 1.02, backgroundColor: "hsl(var(--muted))" }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Droplets className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="font-medium">Scroll to explore our <span className="text-gradient font-bold">30+ year</span> WASH journey</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
