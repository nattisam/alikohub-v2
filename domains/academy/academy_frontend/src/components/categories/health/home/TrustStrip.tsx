import { Shield, CheckCircle, Users, Award, BookOpen, Building2 } from "lucide-react";

const trustItems = [
  {
    icon: Shield,
    title: "Compliance Ready",
    description: "Aligned with Washington State training requirements and ACHC standards.",
  },
  {
    icon: CheckCircle,
    title: "Quality Assured",
    description: "Accreditation-ready governance with continuous improvement processes.",
  },
  {
    icon: Users,
    title: "Industry Connected",
    description: "Clinical partnerships and career network for your professional growth.",
  },
];

const stats = [
  { icon: Award, value: "9+", label: "Certified Programs" },
  { icon: BookOpen, value: "1000+", label: "Hours of Training" },
  { icon: Building2, value: "50+", label: "Clinical Partners" },
];

export function TrustStrip() {
  return (
    <section className="relative overflow-hidden">
      {/* Trust Features — Medical Teal */}
      <div className="py-16 bg-gradient-to-br from-teal via-teal to-teal/90">
        <div className="container-academy">
          <div className="grid md:grid-cols-3 gap-8">
            {trustItems.map((item) => (
              <div key={item.title} className="flex items-start gap-4 text-teal-foreground">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-teal-foreground/80 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Bar — Deep Blue */}
      <div className="py-12 bg-footer-bg">
        <div className="container-academy">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <stat.icon className="h-6 w-6 text-teal" />
                  <span className="text-3xl lg:text-4xl font-bold text-white">{stat.value}</span>
                </div>
                <span className="text-sm text-white/70">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
