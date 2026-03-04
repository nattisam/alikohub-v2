import { CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import LmsNavbar from "@/components/LmsNavbar";

const plans = [
  { name: "Free", price: "$0", period: "/month", features: ["Access to free courses", "Community forums", "Basic certifications"], current: true },
  { name: "Pro", price: "$19", period: "/month", features: ["All free features", "Unlimited courses", "Priority support", "Advanced certifications"], current: false },
  { name: "Enterprise", price: "Custom", period: "", features: ["Everything in Pro", "Team management", "Custom training", "Dedicated support"], current: false },
];

const LmsSubscriptions = () => (
  <div className="min-h-screen bg-background">
    <LmsNavbar />
    <div className="section-container max-w-4xl py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Subscriptions</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className={`bg-card rounded-xl border p-6 ${plan.current ? "ring-2 ring-primary" : ""}`}>
            {plan.current && <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">Current Plan</span>}
            <h3 className="text-xl font-heading font-bold text-foreground">{plan.name}</h3>
            <div className="mt-2 mb-4">
              <span className="text-3xl font-heading font-bold text-foreground">{plan.price}</span>
              <span className="text-sm text-muted-foreground">{plan.period}</span>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Button variant={plan.current ? "outline" : "default"} className="w-full" disabled={plan.current}>
              {plan.current ? "Current" : plan.price === "Custom" ? "Contact Sales" : "Upgrade"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default LmsSubscriptions;
