import { Link } from "react-router-dom";
import { Layout } from "@/components/categories/health/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  CheckCircle,
  BookOpen,
  Scale,
  Award,
  GraduationCap,
  Building2,
  Users,
} from "lucide-react";
import { useStateConfig } from "@/hooks/categories/health/useStateConfig";

const Accreditation = () => {
  const { currentState } = useStateConfig();

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
              Quality Standards
            </span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary">
            Accreditation & Compliance
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Aliko Academy maintains rigorous quality standards and is committed
            to meeting all regulatory requirements for healthcare education in{" "}
            {currentState.name} State.
          </p>

          {/* Quick visual */}
          <div className="mt-8 flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">State Aligned</p>
                <p className="text-xs">
                  {currentState.regulatory.departmentAbbr} Approved
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {currentState.regulatory.certifications.length}+
                </p>
                <p className="text-xs">Certifications</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-academy space-y-12">
          {/* Accreditation Status */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-primary">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Accreditation-Ready Framework</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Aliko Academy operates under a governance framework designed
                  to align with accreditation standards set by recognized
                  healthcare education accrediting bodies.
                </p>
                <p className="text-muted-foreground">
                  Our curriculum, facilities, and administrative processes are
                  structured to meet the rigorous requirements of organizations
                  such as ACHC (Accreditation Commission for Health Care).
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-accent">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Scale className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>State Alignment</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our programs are designed to align with {currentState.name}{" "}
                  State training requirements for healthcare professionals.
                </p>
                <p className="text-muted-foreground">
                  Graduates are prepared to meet certification and licensing
                  requirements established by state regulatory agencies,
                  including the {currentState.regulatory.department}.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quality Framework */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-8 bg-primary rounded-full" />
              <span className="text-sm font-medium text-primary">
                Excellence in Education
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-8">
              Our Quality Framework
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Qualified Instructors",
                  desc: "All instructors meet or exceed state requirements for healthcare educator qualifications, with relevant certifications and clinical experience.",
                  icon: Users,
                  color: "primary" as const,
                },
                {
                  title: "Current Curriculum",
                  desc: "Program content is regularly reviewed and updated to reflect current industry standards, best practices, and certification requirements.",
                  icon: BookOpen,
                  color: "accent" as const,
                },
                {
                  title: "Equipped Facilities",
                  desc: "Our lab facilities are equipped with industry-standard equipment and supplies to provide realistic hands-on training experiences.",
                  icon: Building2,
                  color: "primary" as const,
                },
                {
                  title: "Clinical Partnerships",
                  desc: "Formal agreements with healthcare facilities ensure quality clinical training experiences supervised by qualified professionals.",
                  icon: Award,
                  color: "accent" as const,
                },
                {
                  title: "Student Support",
                  desc: "Comprehensive student services including academic advising, tutoring, and career support to promote student success.",
                  icon: Users,
                  color: "primary" as const,
                },
                {
                  title: "Continuous Improvement",
                  desc: "Regular program evaluation, student feedback, and outcome tracking drive ongoing improvements to our educational offerings.",
                  icon: GraduationCap,
                  color: "accent" as const,
                },
              ].map((item) => (
                <Card
                  key={item.title}
                  className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 ${
                    item.color === "primary"
                      ? "border-l-primary"
                      : "border-l-accent"
                  }`}
                >
                  <CardContent className="pt-6">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                        item.color === "primary"
                          ? "bg-primary/10"
                          : "bg-accent/10"
                      }`}
                    >
                      <item.icon
                        className={`h-6 w-6 ${item.color === "primary" ? "text-primary" : "text-accent"}`}
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5" />
                <CardTitle className="text-lg text-primary-foreground">
                  Certification Preparation
                </CardTitle>
              </div>
            </div>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-6">
                Our programs prepare students for nationally recognized
                certifications and state-required credentials. Upon successful
                completion, graduates are eligible to sit for the following
                exams:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-3">
                  {currentState.regulatory.certifications
                    .slice(0, 4)
                    .map((cert) => (
                      <li key={cert} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{cert}</span>
                      </li>
                    ))}
                </ul>
                <ul className="space-y-3">
                  {currentState.regulatory.certifications
                    .slice(4)
                    .map((cert) => (
                      <li key={cert} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                          <CheckCircle className="h-4 w-4 text-accent" />
                        </div>
                        <span className="text-sm font-medium">{cert}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <div className="relative text-center bg-gradient-to-br from-primary/10 via-card to-accent/10 rounded-2xl p-8 lg:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            <div className="relative">
              <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-4">
                Have Questions About Our Accreditation?
              </h2>
              <p className="text-muted-foreground mb-6">
                Our administration team is happy to discuss our accreditation
                status and compliance.
              </p>
              <Link
                to="/health/contact"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-lg"
              >
                Contact our administration team
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Accreditation;
