import { Link } from "react-router-dom";
import { ArrowRight, Stethoscope, Clock, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/categories/technology/ui/button";
import heroVideo from "@/assets/categories/technology/hero-video.mp4";
import heroPoster from "@/assets/categories/technology/hero-poster.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={heroPoster}
          className="w-full h-full object-cover brightness-[0.25]"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[hsl(268,50%,3%)/0.88]" />
      </div>

      <div className="relative container-padding mx-auto max-w-7xl py-16 lg:py-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-accent/80 backdrop-blur-md border border-accent/40 text-white text-sm font-medium mb-8">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          <span>Enrolling Now for Spring 2026</span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 leading-[1.05] tracking-tight max-w-4xl">
          Build Your Future in <span className="text-secondary">Tech</span> with{" "}
          <span className="text-accent">Confidence</span>
        </h1>

        <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
          Industry-aligned tech training with clear cohort start dates. Join
          thousands of graduates building rewarding careers in technology.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/technology/programs">
            <Button
              size="lg"
              className="w-full sm:w-auto h-16 px-10 bg-accent hover:bg-accent/90 text-white font-bold text-lg shadow-blue hover:shadow-blue-lg transition-all duration-300 group rounded-xl"
            >
              View Programs
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button
            size="lg"
            className="w-full sm:w-auto h-16 px-10 bg-secondary hover:bg-secondary/90 text-white font-bold text-lg transition-all rounded-xl shadow-orange hover:shadow-orange-lg"
            onClick={() => (window.location.href = "https://lms.alikohub.com")}
          >
            Access LMS
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">12+</p>
              <p className="text-sm text-white/60">Tech Programs</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Clock className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">Flexible</p>
              <p className="text-sm text-white/60">Schedules</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Heart className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">100%</p>
              <p className="text-sm text-white/60">Career Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
