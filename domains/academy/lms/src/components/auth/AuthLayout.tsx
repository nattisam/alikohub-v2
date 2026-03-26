import alikoLogo from "@/assets/logo-lms.png";
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
            "linear-gradient(135deg, #0f1c33 0%, #1a2e52 45%, #1e3a6e 100%)",
        }}
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center space-y-10 max-w-sm w-full">
          <div className="flex flex-col items-center gap-6">
            <img
              src={alikoLogo}
              alt="Aliko Academy"
              width={240}
              height={240}
              className="block h-auto w-auto drop-shadow-2xl"
            />

            <div className="space-y-1.5">
              <h1 className="text-4xl font-bold tracking-tight text-white">
                Aliko Academy
              </h1>
              <p
                className="text-sm font-medium tracking-widest uppercase"
                style={{
                  color: "rgba(147,197,253,0.8)",
                  letterSpacing: "0.2em",
                }}
              >
                Learn · Grow · Succeed
              </p>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-base leading-relaxed text-white/60">
            Expert-led courses designed for real-world impact. Start learning
            today and transform your career.
          </p>

          {/* Feature pills */}
          <div className="grid grid-cols-2 gap-3">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 bg-white/5 border border-white/10 backdrop-blur-md"
              >
                <div className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 bg-blue-500/20">
                  <Icon size={14} className="text-blue-300" />
                </div>
                <span className="text-xs font-medium text-white/80">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6">
            {stats.map(({ value, label }, i) => (
              <div key={label} className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{value}</p>
                  <p className="text-xs text-white/50">{label}</p>
                </div>
                {i < stats.length - 1 && (
                  <div className="w-px h-8 bg-white/15" />
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
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <img
                src={alikoLogo}
                alt="Aliko Academy"
                width={120}
                height={120}
                className="relative block h-auto w-auto drop-shadow-xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent tracking-tight">
                Aliko Academy
              </span>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/60 mt-1">
                Learn · Grow · Succeed
              </p>
            </div>
          </div>

          <div className="space-y-2 transition-all duration-300 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              {heading}
            </h2>
            {subheading && (
              <p className="text-base text-muted-foreground leading-relaxed">
                {subheading}
              </p>
            )}
          </div>

          <div className="bg-card/50 backdrop-blur-md sm:bg-card sm:p-8 sm:rounded-3xl sm:border sm:border-border/50 sm:shadow-2xl sm:shadow-primary/5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
