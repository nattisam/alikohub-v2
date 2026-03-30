import alikoLogo from "@/assets/Aliko Academy - LMS 1.png";
import { BookOpen, Award, Users, Zap } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  heading: string;
  subheading?: string;
}

const features = [
  { icon: BookOpen, label: "Expert-led Courses" },
  { icon: Award, label: "Earn Certificates" },
  { icon: Users, label: "1,200+ Learners" },
  { icon: Zap, label: "Learn at Your Pace" },
];

const stats = [
  { value: "1,200+", label: "Learners" },
  { value: "50+", label: "Courses" },
  { value: "4.8★", label: "Rating" },
];

const AuthLayout = ({ children, heading, subheading }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      {/* ── Left branding panel ── */}
      <div
        className="hidden lg:flex lg:w-[48%] relative overflow-hidden items-center justify-center p-4"
        style={{
          background:
            "linear-gradient(135deg, #15284a 0%, #223d6b 45%, #2f5591 100%)",
        }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center space-y-10 max-w-sm w-full">
          <div className="flex flex-col items-center">
            {/* LOGO AREA (reserves space properly) */}
            <div className="relative w-full h-32 flex items-center justify-center mb-4">
              {/* Glow */}
              <div className="absolute flex items-center justify-center">
                <div className="w-72 h-36 bg-white/30 blur-[80px] rounded-full" />
              </div>

              {/* Logo */}
              <img
                src={alikoLogo}
                alt="Aliko Academy"
                className="relative z-10 h-32 w-auto object-contain
                 drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]"
              />
            </div>

            {/* Tagline (now safe, no overlap) */}
            <div className="mt-2">
              <p
                className="text-sm font-medium tracking-widest uppercase"
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  letterSpacing: "0.25em",
                }}
              >
                Learn · Grow · Succeed
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-base leading-relaxed text-white/70">
            Expert-led courses designed for real-world impact. Start learning
            today and transform your career.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 bg-white/10 border border-white/10 backdrop-blur-md"
              >
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: "rgba(243, 126, 40, 0.2)" }}
                >
                  <Icon size={14} style={{ color: "#F37E28" }} />
                </div>
                <span className="text-xs font-medium text-white/90">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/20" />

          {/* Stats */}
          <div className="flex items-center justify-center gap-6">
            {stats.map(({ value, label }, i) => (
              <div key={label} className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{value}</p>
                  <p className="text-xs text-white/60">{label}</p>
                </div>
                {i < stats.length - 1 && (
                  <div className="w-px h-8 bg-white/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-20 bg-background/50 backdrop-blur-sm">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center gap-4 mb-8">
            <div className="relative w-full h-20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-20 bg-white/30 blur-2xl rounded-full" />
              </div>
              <img
                src={alikoLogo}
                alt="Aliko Academy"
                className="absolute top-1/2 left-1/2 h-20 w-auto object-contain
                           -translate-x-1/2 -translate-y-1/2"
              />
            </div>

            <div className="text-center">
              <span className="text-2xl font-bold tracking-tight">
                <span style={{ color: "#0095DA" }}>Aliko</span>{" "}
                <span style={{ color: "#F37E28" }}>Academy</span>
              </span>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/60 mt-1">
                Learn · Grow · Succeed
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              {heading}
            </h2>
            {subheading && (
              <p className="text-base text-muted-foreground leading-relaxed">
                {subheading}
              </p>
            )}
          </div>

          {/* Form */}
          <div className="bg-card/50 backdrop-blur-md sm:bg-card sm:p-8 sm:rounded-3xl sm:border sm:border-border/50 sm:shadow-2xl sm:shadow-primary/5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
