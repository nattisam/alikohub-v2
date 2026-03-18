import { GraduationCap, Users, Briefcase, Heart, FlaskConical } from "lucide-react";

const items = [
  { icon: GraduationCap, label: "Hybrid Learning", iconColor: "text-amber-500", ringColor: "ring-amber-500/30", bgColor: "bg-amber-500/10" },
  { icon: FlaskConical, label: "Applied Labs", iconColor: "text-emerald-400", ringColor: "ring-emerald-400/30", bgColor: "bg-emerald-400/10" },
  { icon: Users, label: "Mentorship", iconColor: "text-sky-400", ringColor: "ring-sky-400/30", bgColor: "bg-sky-400/10" },
  { icon: Briefcase, label: "Career Support", iconColor: "text-violet-400", ringColor: "ring-violet-400/30", bgColor: "bg-violet-400/10" },
  { icon: Heart, label: "Employer-Aligned Curriculum", iconColor: "text-rose-400", ringColor: "ring-rose-400/30", bgColor: "bg-rose-400/10" },
];

const TrustStrip = () => (
  <div className="journey-strip border-y border-white/10">
    <div className="section-container py-7">
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-10">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center text-center">
            <div className={`w-12 h-12 rounded-full ring-2 ${item.ringColor} ${item.bgColor} flex items-center justify-center`}>
              <item.icon className={`w-5 h-5 ${item.iconColor}`} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold text-white/90 mt-2.5 whitespace-nowrap tracking-wide">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TrustStrip;
