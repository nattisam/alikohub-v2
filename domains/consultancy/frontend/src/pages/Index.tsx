import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  GraduationCap,
  Plane,
  ArrowRight,
  Phone,
  ClipboardCheck,
  Users,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import heroVideo from "@/assets/hero-video.mp4";
import pillarBusiness from "@/assets/pillar-business.jpg";
import pillarCareer from "@/assets/pillar-career.jpg";
import pillarTravel from "@/assets/hero.jpg";

const pillars = [
  {
    icon: Briefcase,
    title: "Business Consulting",
    description:
      "Strategic guidance for entrepreneurs and SMEs. From market entry to operational excellence.",
    href: "/business-consulting",
    cta: "Explore Business Services",
    image: pillarBusiness,
  },
  {
    icon: GraduationCap,
    title: "Career Guidance & Mentorship",
    description:
      "Expert career coaching and mentorship to help you navigate your professional journey with confidence.",
    href: "/career-guidance",
    cta: "Find Your Path",
    image: pillarCareer,
  },
  {
    icon: Plane,
    title: "Study Abroad & Travel Advisory",
    description:
      "Comprehensive travel consulting for students, families, and professionals. Visa, relocation, and study abroad.",
    href: "/travel-advisory",
    cta: "Start Your Journey",
    image: pillarTravel,
  },
];

const processSteps = [
  {
    icon: Phone,
    title: "Discovery Call",
    description:
      "We start with an in-depth conversation to understand your goals, challenges, and aspirations.",
  },
  {
    icon: ClipboardCheck,
    title: "Assessment & Strategy",
    description:
      "Our experts analyze your situation and craft a tailored roadmap aligned with your objectives.",
  },
  {
    icon: Users,
    title: "Implementation Support",
    description:
      "Hands-on guidance through every step of your journey with dedicated support.",
  },
  {
    icon: TrendingUp,
    title: "Follow-up & Guidance",
    description:
      "Ongoing mentorship and follow-up to ensure lasting success and continuous growth.",
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "Startup Founder",
    quote:
      "Aliko Consultancy transformed our business strategy. Their expertise helped us secure funding and scale operations within 6 months.",
    pillar: "Business",
  },
  {
    name: "James K.",
    role: "Graduate Student",
    quote:
      "The career mentorship program gave me clarity on my path. I landed my dream role at a Fortune 500 company.",
    pillar: "Career",
  },
  {
    name: "Amira R.",
    role: "International Student",
    quote:
      "From visa application to university enrollment, the travel advisory team made my study abroad journey seamless.",
    pillar: "Study Abroad",
  },
];

const stats = [
  { value: "500+", label: "Clients Served" },
  { value: "95%", label: "Success Rate" },
  { value: "30+", label: "Countries Covered" },
  { value: "10+", label: "Years Experience" },
];

const Index = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [trackCode, setTrackCode] = useState("");
  const [api, setApi] = useState<CarouselApi>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onCanPlay = () => setVideoLoaded(true);
    video.addEventListener("canplaythrough", onCanPlay);
    if (video.readyState >= 4) setVideoLoaded(true);
    return () => video.removeEventListener("canplaythrough", onCanPlay);
  }, []);

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (!api || isPaused) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [api, isPaused]);

  return (
    <div>
      {/* Hero Section Carousel */}
      <section
        className="relative overflow-hidden w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
          <CarouselContent className="ml-0">
            {/* Slide 1: Original Hero */}
            <CarouselItem className="pl-0">
              <div className="relative h-screen flex items-center">
                <img
                  src={heroBg}
                  alt=""
                  aria-hidden="true"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? "opacity-0" : "opacity-100"}`}
                />
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? "opacity-100" : "opacity-0"}`}
                >
                  <source src={heroVideo} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-[hsl(0,60%,15%)]/50 to-[hsl(43,76%,41%)]/30" />
                <div className="relative container-wide px-4 lg:px-8 py-24 md:py-32 lg:py-40">
                  <div className="max-w-3xl">
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
                      Your Next Chapter{" "}
                      <span className="text-gradient-gold">Starts Here</span>
                    </h1>
                    <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl leading-relaxed">
                      Premium consultancy in Business, Career, and Study Abroad
                      & Travel Advisory. We provide expert guidance tailored to
                      your unique goals, helping you succeed with confidence.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link to="/book">
                        <Button className="bg-gold text-navy hover:bg-gold/90 font-semibold text-base px-8 py-6">
                          Book Consultation
                        </Button>
                      </Link>
                      <Link to="/business-consulting">
                        <Button
                          variant="outline"
                          className="border-accent text-accent hover:text-accent hover:bg-accent/10 font-semibold text-base px-8 py-6"
                        >
                          Explore Services
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>

            {/* Slide 2: Application Search (FedEx Style) */}
            <CarouselItem className="pl-0">
              <div className="relative h-screen flex items-center">
                <img
                  src={pillarTravel}
                  alt="Track Application"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative container-wide px-4 lg:px-8 py-24 md:py-32 lg:py-40 text-center flex flex-col items-center">
                  <div className="max-w-2xl w-full">
                    <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
                      Track Your <span className="text-gold">Journey</span>
                    </h2>
                    <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 leading-relaxed mx-auto">
                      Check your travel process application status instantly
                      using your ID.
                    </p>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (trackCode.trim()) {
                          navigate(
                            `/application-status/${encodeURIComponent(trackCode.trim())}`,
                          );
                        }
                      }}
                      className="flex flex-col md:flex-row gap-3 max-w-xl mx-auto w-full"
                    >
                      <Input
                        placeholder="Enter Application ID..."
                        className="bg-white border-none h-14 text-navy text-lg px-6 rounded-xl"
                        value={trackCode}
                        onChange={(e) => setTrackCode(e.target.value)}
                        onFocus={() => setIsPaused(true)}
                        onBlur={() => setIsPaused(false)}
                      />
                      <Button
                        type="submit"
                        className="bg-gold text-navy hover:bg-gold/90 h-14 px-10 text-lg font-bold rounded-xl"
                      >
                        Check Status
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {[0, 1].map((i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  current === i
                    ? "bg-gold w-8"
                    : "bg-white/30 hover:bg-white/50",
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <div className="absolute bottom-8 right-8 md:right-16 flex gap-4 z-20">
            <CarouselPrevious className="static translate-y-0 h-12 w-12 bg-white/10 border-white/20 text-white hover:bg-gold hover:text-navy hover:border-gold transition-colors" />
            <CarouselNext className="static translate-y-0 h-12 w-12 bg-white/10 border-white/20 text-white hover:bg-gold hover:text-navy hover:border-gold transition-colors" />
          </div>
        </Carousel>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#081830] border-b border-white/10">
        <div className="container-wide py-10 md:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 md:p-7 text-center transition-all duration-300 hover:bg-white/10 hover:-translate-y-1"
              >
                <p className="font-serif text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                  {stat.value}
                </p>

                <div className="w-8 h-[2px] bg-gold/70 mx-auto mb-3 group-hover:bg-gold transition-all" />

                <p className="text-white/70 text-sm md:text-[15px] tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Pillars with Thumbnails */}
      <section className="section-padding bg-off-white">
        <div className="container-wide">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Expertise
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three pillars of consultancy designed to guide individuals and
              organizations toward their goals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {pillars.map((pillar) => (
              <Link
                key={pillar.title}
                to={pillar.href}
                className="group bg-card rounded-xl overflow-hidden border border-border card-hover"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 lg:p-8">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <pillar.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-primary mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    {pillar.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all">
                    {pillar.cta} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="section-padding bg-gradient-cool">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
              Who We Serve
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Entrepreneurs & SMEs",
                desc: "Strategic business consulting to help you launch, grow, and scale your ventures with confidence.",
                icon: Briefcase,
                cardClass: "card-navy",
                iconBg: "bg-gold/20",
              },
              {
                title: "Students & Job Seekers",
                desc: "Career guidance, mentorship programs, and study abroad support to unlock your full potential.",
                icon: GraduationCap,
                cardClass: "card-forest",
                iconBg: "bg-accent/20",
              },
              {
                title: "Travelers & Families",
                desc: "Comprehensive travel advisory for visas, relocation, and international transitions.",
                icon: Plane,
                cardClass: "card-teal",
                iconBg: "bg-primary-foreground/20",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`${item.cardClass} rounded-xl p-8 text-center card-hover`}
              >
                <div
                  className={`w-14 h-14 rounded-full ${item.iconBg} flex items-center justify-center mx-auto mb-5`}
                >
                  <item.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-lg font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed opacity-80">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="section-padding bg-warm-beige">
        <div className="container-wide">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Process
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A proven, straightforward approach to delivering results.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, i) => {
              const cardStyles = [
                "card-navy-subtle",
                "card-gold-subtle",
                "card-teal-subtle",
                "card-forest-subtle",
              ];
              return (
                <div
                  key={step.title}
                  className={`${cardStyles[i]} rounded-xl p-6 text-center card-hover`}
                >
                  <div className="w-14 h-14 rounded-full bg-navy flex items-center justify-center mx-auto mb-5">
                    <step.icon className="w-6 h-6 text-accent" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent mb-2 block">
                    Step {i + 1}
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
              What Our Clients Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-card border border-border rounded-xl p-8 relative"
              >
                <span className="absolute top-6 right-6 text-5xl font-serif text-accent/15 leading-none">
                  "
                </span>
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-accent mb-4">
                  {t.pillar}
                </span>
                <p className="text-foreground text-sm leading-relaxed mb-6 italic">
                  "{t.quote}"
                </p>
                <div>
                  <p className="font-semibold text-sm text-primary">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-navy" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(var(--gold)) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative container-narrow text-center section-padding">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Take the Next Step?
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
            Schedule a free discovery call and let us help you chart the path to
            your goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/book">
              <Button className="bg-gold text-navy hover:bg-gold/90 font-semibold text-base px-8 py-6">
                Book Consultation
              </Button>
            </Link>
            <Link to="/apply">
              <Button
                variant="outline"
                className="border-accent text-accent hover:text-accent hover:bg-accent/10 text-base px-8 py-6"
              >
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
