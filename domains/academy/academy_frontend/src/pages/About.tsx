import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import CTASection from "@/components/CTASection";
import bgAboutHero from "@/assets/bg-about-hero.jpg";
import heroAbout from "@/assets/hero-about.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero with background image */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={bgAboutHero}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/60" />
        </div>
        <div className="section-container py-20 md:py-28 relative z-10">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-blue-300 mb-4 block">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight text-white">
              A Workforce Ecosystem Rooted in Dignity and Opportunity
            </h1>
            <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-2xl">
              Aliko Academy is the education engine of AlikoHub's
              Resourcefulness Ecosystem, integrating learning, mentorship,
              applied innovation, and career pathways across Africa and global
              markets.
            </p>
            <div className="mt-10">
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-white/90"
                onClick={() =>
                  (window.location.href = "https://lms.alikohub.com")
                }
              >
                Access LMS
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Exist */}
      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Left */}
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                Why We Exist
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Talent is universal, but opportunity is not.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Aliko Academy exists to close this gap by aligning in-demand
                skills with real labor market needs across public health
                systems, infrastructure development, and emerging digital
                industries.
              </p>
            </div>

            {/* Right */}
            <div className="space-y-6">
              {/* Card 1 */}
              <div className="flex gap-4 items-start p-5 rounded-lg border bg-background/50 hover:shadow-sm transition">
                <div className="w-2 h-10 bg-blue-500 rounded-full mt-1" />
                <p className="text-muted-foreground leading-relaxed">
                  We connect learning directly to workforce demand, ensuring
                  skills translate into real economic opportunity.
                </p>
              </div>

              {/* Card 2 */}
              <div className="flex gap-4 items-start p-5 rounded-lg border bg-background/50 hover:shadow-sm transition">
                <div className="w-2 h-10 bg-emerald-500 rounded-full mt-1" />
                <p className="text-muted-foreground leading-relaxed">
                  We support critical sectors including healthcare,
                  infrastructure, and digital ecosystems shaping future
                  economies.
                </p>
              </div>

              {/* Card 3 */}
              <div className="flex gap-4 items-start p-5 rounded-lg border bg-background/50 hover:shadow-sm transition">
                <div className="w-2 h-10 bg-amber-500 rounded-full mt-1" />
                <p className="text-muted-foreground leading-relaxed">
                  We prepare individuals for leadership, enabling them to
                  contribute meaningfully within systems—not just participate in
                  them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Deliver - with colored cards */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              How We Deliver
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Hybrid Learning Infrastructure",
                content:
                  "Scalable LMS combined with in-person hubs to deliver flexible, high-quality education at scale.",
                bg: "bg-gradient-to-br from-blue-50 to-blue-100/60",
                iconBg: "bg-blue-100",
                accent: "border-l-4 border-l-blue-500",
              },
              {
                title: "Applied & Experiential",
                content:
                  "Labs, case studies, and field deployment ensure learners gain hands-on, practical experience.",
                bg: "bg-gradient-to-br from-amber-50 to-orange-100/60",
                iconBg: "bg-amber-100",
                accent: "border-l-4 border-l-amber-500",
              },
              {
                title: "Integrated Career Support",
                content:
                  "Advisory services, resume preparation, and job matching connect graduates to real opportunities.",
                bg: "bg-gradient-to-br from-emerald-50 to-green-100/60",
                iconBg: "bg-emerald-100",
                accent: "border-l-4 border-l-emerald-500",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`${item.bg} ${item.accent} rounded-lg p-6 hover:shadow-md transition-shadow duration-200`}
              >
                <h3 className="font-heading font-semibold text-lg text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different - with image */}
      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                What Makes Us Different
              </h2>
              <div className="space-y-4">
                {[
                  {
                    text: "We design for outcomes, not enrollment.",
                    color: "bg-blue-500",
                  },
                  {
                    text: "We integrate Health, Technology, and Engineering pathways under one structured model.",
                    color: "bg-amber-500",
                  },
                  {
                    text: "We align with workforce demand and continental development priorities.",
                    color: "bg-emerald-500",
                  },
                  {
                    text: "We build confidence, competence, and career readiness together.",
                    color: "bg-purple-500",
                  },
                ].map((point) => (
                  <div key={point.text} className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${point.color} mt-2.5 shrink-0`}
                    />
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {point.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg overflow-hidden">
              <img
                src={heroAbout}
                alt="Students collaborating"
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Commitment - colored background */}
      <section className="section-padding bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                Our Commitment
              </h2>
            </div>
            <div>
              <p className="text-white/70 leading-relaxed text-lg">
                Aliko Academy prioritizes inclusive access, gender equity, and
                hybrid delivery models to ensure learners from diverse
                backgrounds can participate and thrive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Strip */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-14">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "75-85%", label: "Employment Outcomes" },
              { value: "45%", label: "Female Participation Target" },
              { value: "1000+", label: "Learners Trained" },
              { value: "4", label: "Specialized Pathways" },
            ].map((kpi) => (
              <div key={kpi.label}>
                <p className="text-3xl md:text-4xl font-heading font-bold text-white">
                  {kpi.value}
                </p>
                <p className="text-sm text-white/60 mt-1">{kpi.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </div>
  );
};

export default About;
