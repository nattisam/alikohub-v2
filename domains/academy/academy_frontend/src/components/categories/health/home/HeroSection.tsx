import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Play,
  GraduationCap,
  Clock,
  HeartHandshake,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import heroPoster from "@/assets/categories/health/hero-poster.jpg";
import heroVideo from "@/assets/categories/health/hero-video.mp4";

export function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.src = heroVideo;
        videoRef.current.load();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleVideoCanPlay = () => {
    setVideoLoaded(true);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
      videoRef.current.play();
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Poster Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroPoster}
          alt=""
          className={`w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? "opacity-0" : "opacity-100"}`}
        />
      </div>

      {/* Video Background */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-700 ${videoLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          onCanPlayThrough={handleVideoCanPlay}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient Overlay — lighter, medical-grade */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[hsl(216,50%,16%)]/85 via-[hsl(216,50%,16%)]/60 to-[hsl(180,73%,39%)]/20" />

      {/* Content */}
      <div className="container-academy relative z-10 py-16 lg:py-24">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal/20 border border-teal/30 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal"></span>
            </span>
            <span className="text-sm font-medium text-teal-foreground">
              Enrolling Now for Spring 2026
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
            Start Your Healthcare Career with{" "}
            <span className="text-teal">Confidence</span>
          </h1>

          <p className="mt-6 text-lg lg:text-xl text-white/80 max-w-xl">
            Industry-aligned healthcare training with clear cohort start dates.
            Join thousands of graduates building rewarding careers in
            healthcare.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="text-base shadow-lg hover:shadow-xl transition-shadow"
            >
              <Link to="/health/programs">
                View Programs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base bg-[hsl(0,72%,50%)] border-[hsl(0,72%,50%)] text-white hover:bg-[hsl(0,72%,42%)] shadow-lg hover:shadow-xl transition-all"
              onClick={() =>
                (window.location.href = "https://lms.alikohub.com")
              }
            >
              Access LMS
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <GraduationCap className="h-5 w-5 text-teal" />
                <span className="text-2xl lg:text-3xl font-extrabold text-white">
                  9+
                </span>
              </div>
              <span className="text-sm text-white/70">Healthcare Programs</span>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <Clock className="h-5 w-5 text-teal" />
                <span className="text-2xl lg:text-3xl font-extrabold text-white">
                  Flexible
                </span>
              </div>
              <span className="text-sm text-white/70">Schedules</span>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <HeartHandshake className="h-5 w-5 text-teal" />
                <span className="text-2xl lg:text-3xl font-extrabold text-white">
                  100%
                </span>
              </div>
              <span className="text-sm text-white/70">Career Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Control */}
      {videoLoaded && (
        <button
          onClick={togglePlay}
          className="absolute bottom-8 right-8 z-10 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <Play className="h-5 w-5" />
          )}
        </button>
      )}
    </section>
  );
}
