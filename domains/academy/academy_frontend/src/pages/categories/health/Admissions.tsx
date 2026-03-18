import { Link } from "react-router-dom";
import { Layout } from "@/components/categories/health/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ClipboardList,
  FileText,
  CreditCard,
  Mail,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Choose Your Program",
    description:
      "Browse our programs and select the one that aligns with your career goals. Review requirements, schedule, and tuition.",
    color: "primary" as const,
  },
  {
    icon: FileText,
    title: "Submit Application",
    description:
      "Complete the online application form with your personal information, education history, and program selection.",
    color: "accent" as const,
  },
  {
    icon: CheckCircle,
    title: "Provide Documents",
    description:
      "Submit required documents including ID, high school diploma/GED, and any program-specific requirements.",
    color: "primary" as const,
  },
  {
    icon: CreditCard,
    title: "Complete Payment",
    description:
      "Pay your tuition deposit or full amount through our secure payment process. Payment plans available.",
    color: "accent" as const,
  },
  {
    icon: Mail,
    title: "Receive Confirmation",
    description:
      "Get your enrollment confirmation with program details, start date, orientation information, and LMS access.",
    color: "primary" as const,
  },
];

const requiredDocuments = [
  "Government-issued photo ID (driver's license or passport)",
  "High school diploma or GED certificate",
  "Social Security card or number",
  "Immunization records (for clinical programs)",
  "Background check authorization",
  "Physical exam clearance (for clinical programs)",
];

const Admissions = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-card to-accent/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

        <div className="container-academy relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-12 bg-accent rounded-full" />
            <span className="text-sm font-medium text-accent">Get Started</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary">
            How to Apply
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Start your healthcare career journey with a simple enrollment
            process. Our admissions team is here to guide you every step of the
            way.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="shadow-lg bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link to="/health/apply">
                Start Your Application
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-academy">
          {/* Enrollment Steps - Timeline Style */}
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-8 bg-primary rounded-full" />
              <span className="text-sm font-medium text-primary">
                5 Simple Steps
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-8">
              Enrollment Process
            </h2>

            <div className="relative">
              {/* Timeline line - hidden on mobile */}
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary" />

              <div className="space-y-8 lg:space-y-0">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className={`relative lg:flex lg:items-center ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                  >
                    {/* Content */}
                    <div
                      className={`lg:w-1/2 ${index % 2 === 0 ? "lg:pr-12 lg:text-right" : "lg:pl-12"}`}
                    >
                      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="pb-3">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                              step.color === "primary"
                                ? "bg-primary/10"
                                : "bg-accent/10"
                            } ${index % 2 === 0 ? "lg:ml-auto" : ""}`}
                          >
                            <step.icon
                              className={`h-6 w-6 ${step.color === "primary" ? "text-primary" : "text-accent"}`}
                            />
                          </div>
                          <CardTitle className="text-lg">
                            {index + 1}. {step.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            {step.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Center dot */}
                    <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-background border-4 border-primary items-center justify-center z-10">
                      <span className="text-xs font-bold text-primary">
                        {index + 1}
                      </span>
                    </div>

                    {/* Spacer for other side */}
                    <div className="hidden lg:block lg:w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-8 bg-accent rounded-full" />
                <span className="text-sm font-medium text-accent">
                  Prepare Your Documents
                </span>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Required Documents
              </h2>
              <Card className="border-l-4 border-l-accent">
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {requiredDocuments.map((doc, index) => (
                      <li key={doc} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle className="h-4 w-4 text-accent" />
                        </div>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                    Additional documents may be required based on your selected
                    program. Our admissions team will provide a complete
                    checklist after you submit your initial application.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-8 bg-primary rounded-full" />
                <span className="text-sm font-medium text-primary">
                  What Happens Next
                </span>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                What to Expect
              </h2>
              <div className="space-y-4">
                <Card className="group hover:shadow-md transition-shadow border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">
                          Application Review
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Applications are typically reviewed within 2-3
                          business days. You'll receive an email confirming your
                          eligibility.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="group hover:shadow-md transition-shadow border-l-4 border-l-accent">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">
                          Enrollment Agreement
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Once approved, you'll receive an enrollment agreement
                          outlining program details, policies, and your
                          responsibilities as a student.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="group hover:shadow-md transition-shadow border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Orientation</h3>
                        <p className="text-sm text-muted-foreground">
                          Before your start date, you'll attend an orientation
                          session to meet instructors, tour facilities, and
                          access your LMS account.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 relative text-center bg-gradient-to-br from-primary/10 via-card to-accent/10 rounded-2xl p-8 lg:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            <div className="relative">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Contact our admissions team to begin your application or ask any
                questions about our programs and enrollment process.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="shadow-lg bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Link to="/health/apply">Start Your Application</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/health/contact">Contact Admissions</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Admissions;
