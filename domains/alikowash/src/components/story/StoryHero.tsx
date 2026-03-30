import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const videos = [
  "/videos/danka-wash-1.mp4",
  "/videos/danka-wash-2.mp4",
  "/videos/danka-wash-3.mp4",
  "/videos/danka-wash-4.mp4",
  "/videos/danka-wash-5.mp4",
  "/videos/danka-wash-6.mp4",
  "/videos/danka-wash-7.mp4",
  "/videos/danka-wash-8.mp4",
  "/videos/danka-wash-9.mp4",
  "/videos/danka-wash-10.mp4",
  "/videos/aira-hospital-1.mp4",
  "/videos/aira-hospital-2.mp4",
];

const milestones = [
  { year: 1995, label: "First Project", icon: "💧" },
  { year: 2019, label: "COVID Response", icon: "🛡️" },
  { year: 2024, label: "Hospital WASH", icon: "🏥" },
  { year: 2025, label: "Today", icon: "🌍" },
];

export function StoryHero() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTimeline = () => {
    const timeline = document.getElementById("story-timeline");
    if (timeline) {
      timeline.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background with Crossfade */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="sync">
          <motion.video
            key={currentVideoIndex}
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
            style={{ minWidth: '100%', minHeight: '100%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <source src={videos[currentVideoIndex]} type="video/mp4" />
          </motion.video>
        </AnimatePresence>
        {/* Lighter Overlay for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/20 to-background/85" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-main text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium mb-6">
            Three Decades of Impact
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-8"
        >
          Our WASH Journey
        </motion.h1>

        {/* Enhanced Timeline Visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <p className="text-white/70 text-sm uppercase tracking-widest mb-4">Projects Completed Since</p>
          
          {/* Timeline Bar with Milestones */}
          <div className="relative max-w-2xl mx-auto">
            {/* Main Timeline Line */}
            <div className="relative h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent via-accent to-accent/50"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
              />
            </div>
            
            {/* Milestone Points */}
            <div className="flex justify-between mt-3">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.15 }}
                >
                  <motion.div
                    className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-sm border-2 border-accent/50 flex items-center justify-center -mt-7"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    animate={{
                      boxShadow: ["0 0 0px rgba(234, 179, 8, 0)", "0 0 25px rgba(234, 179, 8, 0.6)", "0 0 0px rgba(234, 179, 8, 0)"],
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    <span className="text-lg md:text-xl">{milestone.icon}</span>
                  </motion.div>
                  <motion.span 
                    className="text-lg md:text-2xl font-display font-bold mt-2 bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent"
                    whileHover={{ scale: 1.1 }}
                  >
                    {milestone.year}
                  </motion.span>
                  <span className="text-xs text-white/60 hidden md:block">
                    {milestone.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Stats Row */}
          <motion.div
            className="flex justify-center gap-8 md:gap-16 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="text-center">
              <span className="text-3xl md:text-4xl font-display font-bold text-accent">30+</span>
              <p className="text-white/60 text-sm">Years of Experience</p>
            </div>
            <div className="text-center">
              <span className="text-3xl md:text-4xl font-display font-bold text-accent">2K+</span>
              <p className="text-white/60 text-sm">Projects Completed</p>
            </div>
            <div className="text-center">
              <span className="text-3xl md:text-4xl font-display font-bold text-accent">250K+</span>
              <p className="text-white/60 text-sm">Community Served</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10"
        >
          From a single water project in Galano to transforming communities across Ethiopia — 
          discover our multi-generational commitment to clean water access.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            variant="hero"
            size="lg"
            onClick={scrollToTimeline}
            className="group"
          >
            Explore the Journey
            <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </Button>
          <Button variant="hero-outline" size="lg" asChild>
            <Link to="/partners">Partner With Us</Link>
          </Button>
        </motion.div>
      </div>

      {/* Video Indicator Dots */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentVideoIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentVideoIndex ? "bg-accent w-6" : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [1, 0, 1], y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-white/60 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
