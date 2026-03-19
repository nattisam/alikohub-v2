import { ArrowRight, Shield, Monitor, Briefcase, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LearnerJourney from "@/components/LearnerJourney";
import TrustStrip from "@/components/TrustStrip";
import CategoryCarousel from "@/components/CategoryCarousel";
import CTASection from "@/components/CTASection";
import heroImage from "@/assets/hero-home.jpg";

const differentiators = [
  {
    icon: Shield,
    title: "Employer-Aligned Design",
    desc: "Programs are structured around real workforce demand and industry expectations.",
    bg: "bg-gradient-to-br from-blue-50 to-blue-100/50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Monitor,
    title: "Hybrid & Accessible Model",
    desc: "Blended LMS delivery combined with hands-on labs and mentorship.",
    bg: "bg-gradient-to-br from-amber-50 to-orange-100/50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    icon: Briefcase,
    title: "Career-Integrated Pathways",
    desc: "Internships, job matching, and enterprise development embedded in the learning journey.",
    bg: "bg-gradient-to-br from-emerald-50 to-green-100/50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    icon: Heart,
    title: "Dignity-Centered Approach",
    desc: "Inclusive design focused on measurable opportunity, not just enrollment.",
    bg: "bg-gradient-to-br from-rose-50 to-pink-100/50",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
];

const impactMetrics = [
  { value: "75–85%", label: "Targeted Employment & Income Outcomes" },
  { value: "45%", label: "Minimum Female Participation" },
  { value: "Multi-Country", label: "Scalable Workforce Model" },
];

const Index = () => {
  const scrollToStreams = () => {
    document.getElementById("streams")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-background">
        <div className="section-container py-20 md:py-28 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl lg:text-[3.75rem] font-heading font-bold leading-tight text-foreground">
                Build <span className="text-accent">In-Demand Skills</span> for{" "}
                <span className="text-primary">Real Opportunities</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg">
                Aliko Academy delivers market-aligned pathways across Health,
                Technology, and Engineering, designed to move learners from
                training to sustainable livelihoods.
              </p>
              <div className="flex flex-wrap gap-4 mt-10">
                <Button size="lg" className="gap-2" onClick={scrollToStreams}>
                  Explore Pathways <ArrowRight className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/register">Apply Now</Link>
                </Button>
              </div>
            </div>

            <div
              className="relative animate-fade-in-up"
              style={{ animationDelay: "0.15s" }}
            >
              <div className="rounded-lg overflow-hidden">
                <img
                  src={heroImage}
                  alt="Students learning in a modern classroom"
                  className="w-full h-auto object-cover min-h-[320px] md:min-h-[420px]"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card rounded-lg shadow-lg p-4 border">
                <p className="text-2xl font-heading font-bold text-foreground">
                  1000+
                </p>
                <p className="text-xs text-muted-foreground">
                  Learners Enrolled
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />
      <CategoryCarousel />
      <LearnerJourney />

      {/* Why Aliko Academy Is Different */}
      <section className="section-padding">
        <div className="section-container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              Why Aliko Academy Is Different
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              We design for outcomes, not just enrollment. Every element of our
              model is built to create lasting impact.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {differentiators.map((d) => (
              <div
                key={d.title}
                className={`${d.bg} rounded-lg border p-6 text-center hover:shadow-md transition-shadow duration-200`}
              >
                <div
                  className={`w-12 h-12 rounded-lg ${d.iconBg} flex items-center justify-center mx-auto mb-4`}
                >
                  <d.icon className={`w-5 h-5 ${d.iconColor}`} />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">
                  {d.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="journey-strip py-16 md:py-20">
        <div className="section-container">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
              Designed for Measurable Outcomes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {impactMetrics.map((m) => (
              <div key={m.label}>
                <p className="text-4xl md:text-5xl font-heading font-bold text-white">
                  {m.value}
                </p>
                <p className="text-sm text-white/70 mt-2">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academy Enterprise */}
      <section className="section-padding section-alt">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-wide uppercase mb-4">
                Academy Enterprise
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                Enterprise Solutions
              </h2>
              <h3 className="text-xl font-heading font-semibold text-accent mb-4">
                Training for Organizations
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                Upskill your workforce with customized training programs
                designed for enterprises, universities, and government
                organizations.
              </p>
              <div className="space-y-3">
                {[
                  "Custom curriculum aligned to your industry needs",
                  "Dedicated learning management & reporting dashboards",
                  "Scalable cohort-based or self-paced delivery",
                  "Certification & compliance tracking",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 shrink-0" />
                    <p className="text-muted-foreground">{point}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Button size="lg" className="gap-2" asChild>
                  <Link to="/contact?subject=Enterprise%20Training">
                    Request a Demo <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: Shield,
                  title: "Enterprise Training",
                  desc: "Tailored programs for teams of any size",
                  bg: "bg-gradient-to-br from-blue-50 to-blue-100/40",
                  iconBg: "bg-blue-100",
                  iconColor: "text-blue-600",
                },
                {
                  icon: Monitor,
                  title: "University Partnerships",
                  desc: "Accredited pathways for institutions",
                  bg: "bg-gradient-to-br from-amber-50 to-orange-100/40",
                  iconBg: "bg-amber-100",
                  iconColor: "text-amber-600",
                },
                {
                  icon: Briefcase,
                  title: "Government Programs",
                  desc: "Workforce development at national scale",
                  bg: "bg-gradient-to-br from-emerald-50 to-green-100/40",
                  iconBg: "bg-emerald-100",
                  iconColor: "text-emerald-600",
                },
                {
                  icon: Heart,
                  title: "Impact Reporting",
                  desc: "Measurable outcomes & ROI tracking",
                  bg: "bg-gradient-to-br from-purple-50 to-purple-100/40",
                  iconBg: "bg-purple-100",
                  iconColor: "text-purple-600",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className={`${card.bg} rounded-lg border p-5 hover:shadow-md transition-shadow duration-200`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center mb-3`}
                  >
                    <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  <h4 className="font-heading font-semibold text-sm text-foreground mb-1">
                    {card.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection onSecondaryClick={scrollToStreams} />

      <Footer />
    </div>
  );
};

export default Index;
