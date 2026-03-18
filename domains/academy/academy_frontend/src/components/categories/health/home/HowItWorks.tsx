import {
  ClipboardList,
  FileEdit,
  Monitor,
  Stethoscope,
  Award,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: ClipboardList,
    title: "Choose Program",
    description:
      "Explore our 9 healthcare programs and find the right fit for your career goals.",
  },
  {
    icon: FileEdit,
    title: "Enroll Online",
    description:
      "Complete your application and enrollment documents through our simple process.",
  },
  {
    icon: Monitor,
    title: "Access LMS",
    description:
      "Get immediate access to your learning materials and course schedule.",
  },
  {
    icon: Stethoscope,
    title: "Hands-On Training",
    description:
      "Complete theory, lab, and clinical hours with experienced instructors.",
  },
  {
    icon: Award,
    title: "Certification",
    description:
      "Prepare for and pass your state or national certification exam.",
  },
  {
    icon: Briefcase,
    title: "Career Support",
    description:
      "Access resume help, interview prep, and job search assistance.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 bg-secondary relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container-academy relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal/10 text-teal text-sm font-semibold mb-4">
            Your Journey
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Your path from enrollment to certification in six clear steps.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="group relative bg-card rounded-xl p-6 border border-border hover:border-teal/30 hover:shadow-lg transition-all duration-300"
            >
              {/* Step Number */}
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-teal text-teal-foreground text-sm font-bold flex items-center justify-center shadow-md">
                {index + 1}
              </div>

              <div className="flex flex-col items-start">
                <div className="w-14 h-14 rounded-xl bg-teal/10 flex items-center justify-center mb-4 group-hover:bg-teal/20 transition-colors">
                  <step.icon className="h-7 w-7 text-teal" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button asChild size="lg" variant="outline" className="group">
            <Link to="/health/apply">
              Start Your Journey Today
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
