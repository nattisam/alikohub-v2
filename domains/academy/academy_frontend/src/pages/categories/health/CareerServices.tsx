import { Link } from "react-router-dom";
import { Layout } from "@/components/categories/health/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Users,
  Search,
  Handshake,
  ArrowRight,
  CheckCircle,
  Rocket,
  Target,
  Briefcase,
} from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "Resume Assistance",
    description:
      "Get professional guidance on crafting a healthcare-focused resume that highlights your training, certifications, and clinical experience.",
    features: [
      "Resume review and feedback",
      "Healthcare-specific formatting",
      "Skills and certification highlighting",
      "Cover letter guidance",
    ],
    color: "primary" as const,
  },
  {
    icon: Users,
    title: "Interview Preparation",
    description:
      "Practice common healthcare interview questions and learn strategies to present yourself confidently to potential employers.",
    features: [
      "Mock interview sessions",
      "Common question preparation",
      "Professional presentation tips",
      "Salary negotiation basics",
    ],
    color: "accent" as const,
  },
  {
    icon: Search,
    title: "Job Search Guidance",
    description:
      "Learn effective job search strategies and get access to resources specifically for healthcare career seekers.",
    features: [
      "Job board navigation",
      "Application best practices",
      "Networking strategies",
      "Follow-up techniques",
    ],
    color: "primary" as const,
  },
  {
    icon: Handshake,
    title: "Employer Connections",
    description:
      "Benefit from our relationships with healthcare employers throughout the region who actively recruit our graduates.",
    features: [
      "Career fairs and events",
      "Employer presentations",
      "Job opportunity notifications",
      "Industry networking",
    ],
    color: "accent" as const,
  },
];

const CareerServices = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-card to-accent/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

        <div className="container-academy relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-12 bg-accent rounded-full" />
            <span className="text-sm font-medium text-accent">
              Your Success Partner
            </span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary">
            Career Services
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Your success doesn't end at graduation. Our career services team is
            dedicated to helping you transition from student to employed
            healthcare professional.
          </p>

          {/* Quick visual stats */}
          <div className="mt-8 flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">50+</p>
                <p className="text-xs">Employer Partners</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground">1-on-1</p>
                <p className="text-xs">Career Coaching</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-academy">
          {/* Services Grid */}
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-16">
            {services.map((service) => (
              <Card
                key={service.title}
                className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 ${
                  service.color === "primary"
                    ? "border-t-primary"
                    : "border-t-accent"
                }`}
              >
                <CardHeader>
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                      service.color === "primary"
                        ? "bg-primary/10 group-hover:bg-primary/20"
                        : "bg-accent/10 group-hover:bg-accent/20"
                    } transition-colors`}
                  >
                    <service.icon
                      className={`h-7 w-7 ${service.color === "primary" ? "text-primary" : "text-accent"}`}
                    />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle
                          className={`h-4 w-4 shrink-0 ${
                            service.color === "primary"
                              ? "text-primary"
                              : "text-accent"
                          }`}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Career Network Link */}
          <Card className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground mb-16 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <CardContent className="pt-6 relative">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Handshake className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Career Network Partners
                    </h3>
                    <p className="opacity-90">
                      Explore our network of healthcare employers who actively
                      recruit Aliko Academy graduates.
                    </p>
                  </div>
                </div>
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="shrink-0 shadow-lg"
                >
                  <Link to="/health/partners">
                    View Partners
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-8 bg-accent rounded-full" />
              <span className="text-sm font-medium text-accent">
                Your Journey
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-8">
              How Career Services Works
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                {
                  step: 1,
                  title: "Complete Training",
                  desc: "Focus on your studies and certification. Career services support begins in the final weeks of your program.",
                  icon: Rocket,
                  color: "primary" as const,
                },
                {
                  step: 2,
                  title: "Meet Your Advisor",
                  desc: "Schedule a one-on-one session to discuss your career goals, review your resume, and create a job search plan.",
                  icon: Users,
                  color: "accent" as const,
                },
                {
                  step: 3,
                  title: "Launch Your Career",
                  desc: "Apply to positions, attend interviews, and leverage our employer network to find the right opportunity.",
                  icon: Target,
                  color: "primary" as const,
                },
              ].map((item) => (
                <Card
                  key={item.step}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                >
                  <div
                    className={`absolute top-0 left-0 w-1 h-full ${item.color === "primary" ? "bg-primary" : "bg-accent"}`}
                  />
                  <CardContent className="pt-6 text-center">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                        item.color === "primary"
                          ? "bg-primary/10"
                          : "bg-accent/10"
                      }`}
                    >
                      <item.icon
                        className={`h-8 w-8 ${item.color === "primary" ? "text-primary" : "text-accent"}`}
                      />
                    </div>
                    <div
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mb-3 ${
                        item.color === "primary"
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-accent-foreground"
                      }`}
                    >
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Job Listing CTA */}
          <div className="relative bg-[hsl(216,50%,16%)] rounded-2xl p-8 lg:p-10 overflow-hidden mb-16 border border-border/20">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/10 rounded-2xl" />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                  Check Our Job Listings
                </h2>
                <p className="mt-2 text-white/70">
                  Explore open healthcare positions and take the first step
                  towards a rewarding career.
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="shrink-0 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg text-base font-bold px-8"
              >
                <a
                  href="https://career.alikohub.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Career Hub
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Disclaimer & CTA */}
          <div className="relative bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-8 lg:p-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            <p className="text-sm text-muted-foreground mb-6 relative">
              <strong>Note:</strong> While Aliko Academy provides comprehensive
              career services and maintains strong employer relationships, we do
              not guarantee employment. Career outcomes depend on individual
              effort, market conditions, and employer hiring decisions.
            </p>
            <div className="flex flex-wrap gap-4 relative">
              <Button asChild size="lg" className="shadow-lg">
                <Link to="/health/contact">Contact Career Services</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/health/programs">Explore Programs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CareerServices;
