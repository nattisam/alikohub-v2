import { UserPlus, BookOpen, FlaskConical, Award, Rocket, Crown } from "lucide-react";

const steps = [
  { icon: UserPlus, label: "Enroll", desc: "Register and choose your pathway.", color: "bg-blue-50 text-blue-600 border-blue-200" },
  { icon: BookOpen, label: "Learn", desc: "Engage with expert-led content.", color: "bg-amber-50 text-amber-600 border-amber-200" },
  { icon: FlaskConical, label: "Practice", desc: "Apply skills in real-world labs.", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { icon: Award, label: "Certify", desc: "Earn recognized credentials.", color: "bg-purple-50 text-purple-600 border-purple-200" },
  { icon: Rocket, label: "Launch", desc: "Enter the workforce with support.", color: "bg-rose-50 text-rose-600 border-rose-200" },
  { icon: Crown, label: "Lead", desc: "Grow into leadership roles.", color: "bg-teal-50 text-teal-600 border-teal-200" },
];

const LearnerJourney = () => (
  <section className="section-alt section-padding">
    <div className="section-container">
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground text-center mb-4">
        From Learning to Livelihood
      </h2>
      <p className="text-center text-muted-foreground mb-14 max-w-xl mx-auto">
        Every learner progresses through structured certification, applied practice, mentorship, and career pathways designed for real-world impact.
      </p>

      {/* Horizontal progression */}
      <div className="relative">
        {/* Line connector */}
        <div className="hidden lg:block absolute top-8 left-[8%] right-[8%] h-px bg-border" />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {steps.map((step) => (
            <div key={step.label} className="flex flex-col items-center text-center relative">
              <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center z-10 ${step.color}`}>
                <step.icon className="w-6 h-6" />
              </div>
              <span className="font-heading font-semibold text-sm mt-3 text-foreground">{step.label}</span>
              <span className="text-xs text-muted-foreground mt-1 leading-snug">{step.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default LearnerJourney;
