import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X, ZoomIn, Calendar, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChapterImage {
  src: string;
  caption: string;
}

interface ChapterProps {
  chapter: {
    id: string;
    year: number;
    title: string;
    subtitle: string;
    badge?: string;
    description: string;
    tags: string[];
    images: ChapterImage[];
    theme: string;
  };
  index: number;
}

const yearGradients: Record<number, string> = {
  1995: "bg-gradient-to-r from-[hsl(201,89%,48%)] to-[hsl(24,95%,53%)] bg-clip-text text-transparent",
  2019: "bg-gradient-to-r from-[hsl(24,95%,53%)] to-[hsl(201,89%,48%)] bg-clip-text text-transparent",
  2024: "bg-gradient-to-r from-[hsl(201,89%,55%)] to-[hsl(142,76%,36%)] bg-clip-text text-transparent",
  2025: "bg-gradient-to-r from-[hsl(142,76%,36%)] to-[hsl(201,89%,48%)] bg-clip-text text-transparent",
};

export function StoryChapter({ chapter, index }: ChapterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const themeStyles = {
    sepia: "bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10",
    urgent: "bg-gradient-to-br from-red-50/30 to-orange-50/30 dark:from-red-950/20 dark:to-orange-950/10",
    clinical: "bg-gradient-to-br from-cyan-50/30 to-blue-50/30 dark:from-cyan-950/20 dark:to-blue-950/10",
    hopeful: "bg-gradient-to-br from-green-50/30 to-cyan-50/30 dark:from-green-950/20 dark:to-cyan-950/10",
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % chapter.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + chapter.images.length) % chapter.images.length
    );
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <section
        id={`chapter-${chapter.id}`}
        ref={ref}
        className={cn(
          "min-h-screen py-20 scroll-mt-32",
          themeStyles[chapter.theme as keyof typeof themeStyles]
        )}
      >
        <div className="container-main">
          <div
            className={cn(
              "grid lg:grid-cols-2 gap-12 lg:gap-20 items-center",
              index % 2 === 1 && "lg:grid-flow-dense"
            )}
          >
            {/* Content Side */}
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={cn(index % 2 === 1 && "lg:col-start-2")}
            >
              {/* Year Badge with Logo Colors */}
              <div className="mb-6 relative">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                  animate={isInView ? { scale: 1, opacity: 1, rotate: 0 } : {}}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                  className="relative inline-block"
                >
                  <motion.span
                    className={cn(
                      "inline-block text-7xl md:text-9xl font-display font-bold",
                      yearGradients[chapter.year] || "text-primary/20"
                    )}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {chapter.year}
                  </motion.span>
                  
                  {/* Decorative sparkles */}
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ 
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="w-6 h-6 text-accent" />
                  </motion.div>
                  
                  {/* Calendar icon */}
                  <motion.div
                    className="absolute -bottom-1 -left-4 bg-primary/10 rounded-full p-2"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.4 }}
                  >
                    <Calendar className="w-4 h-4 text-primary" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Title & Badge */}
              <motion.div 
                className="flex flex-wrap items-center gap-3 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  {chapter.title}
                </h2>
                {chapter.badge && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    <Badge variant="destructive" className="text-xs animate-pulse">
                      {chapter.badge}
                    </Badge>
                  </motion.div>
                )}
              </motion.div>

              <motion.p 
                className="text-xl md:text-2xl text-primary font-semibold mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 }}
              >
                {chapter.subtitle}
              </motion.p>

              <motion.p 
                className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.4 }}
              >
                {chapter.description}
              </motion.p>

              {/* Tags with staggered animation */}
              <motion.div 
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
              >
                {chapter.tags.map((tag, tagIndex) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 + tagIndex * 0.1 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 text-primary text-sm font-medium border border-primary/20 cursor-default"
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>

            {/* Image Gallery Side */}
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={cn(index % 2 === 1 && "lg:col-start-1 lg:row-start-1")}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Main Image Carousel */}
              <motion.div 
                className="relative rounded-2xl overflow-hidden shadow-2xl group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={chapter.images[currentImageIndex].src}
                      alt={chapter.images[currentImageIndex].caption}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                    />
                  </AnimatePresence>
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Zoom button */}
                  <motion.button
                    onClick={() => openLightbox(currentImageIndex)}
                    className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full text-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ZoomIn className="w-5 h-5" />
                  </motion.button>

                  {/* Image counter */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {currentImageIndex + 1} / {chapter.images.length}
                  </div>

                  {/* Caption */}
                  <motion.div 
                    className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-white text-lg font-medium">
                      {chapter.images[currentImageIndex].caption}
                    </p>
                  </motion.div>
                </div>

                {/* Navigation Arrows */}
                {chapter.images.length > 1 && (
                  <>
                    <motion.button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                      whileHover={{ scale: 1.1, x: -2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                      whileHover={{ scale: 1.1, x: 2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </>
                )}
              </motion.div>

              {/* Thumbnail Strip with enhanced styling */}
              {chapter.images.length > 1 && (
                <motion.div 
                  className="mt-4 flex gap-3 overflow-x-auto scrollbar-hide pb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 }}
                >
                  {chapter.images.map((img, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={cn(
                        "flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 border-2",
                        currentImageIndex === i
                          ? "ring-2 ring-primary ring-offset-2 border-primary scale-105"
                          : "opacity-60 hover:opacity-100 border-transparent hover:border-primary/30"
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={img.src}
                        alt={img.caption}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="mt-20">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-12 text-background"
          >
            <path
              d="M0 60V30C240 10 480 0 720 10C960 20 1200 40 1440 30V60H0Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 text-white hover:text-white/80 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(
                (prev) => (prev - 1 + chapter.images.length) % chapter.images.length
              );
            }}
            className="absolute left-4 p-2 text-white hover:text-white/80 transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <img
            src={chapter.images[lightboxIndex].src}
            alt={chapter.images[lightboxIndex].caption}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev + 1) % chapter.images.length);
            }}
            className="absolute right-4 p-2 text-white hover:text-white/80 transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <p className="absolute bottom-8 text-white text-center">
            {chapter.images[lightboxIndex].caption}
          </p>
        </div>
      )}
    </>
  );
}
