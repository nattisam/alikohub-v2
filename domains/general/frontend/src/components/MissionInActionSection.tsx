import { motion } from "framer-motion";
import { Brain, Heart, Rocket, Handshake, BookOpen, BarChart3 } from "lucide-react";

const cardColors = [
  { bg: "bg-[hsl(210,40%,88%)]", text: "text-[hsl(210,60%,25%)]", iconBg: "bg-[hsl(210,50%,78%)]" },
  { bg: "bg-[hsl(20,80%,75%)]", text: "text-[hsl(20,60%,20%)]", iconBg: "bg-[hsl(20,70%,65%)]" },
  { bg: "bg-[hsl(190,60%,78%)]", text: "text-[hsl(190,70%,20%)]", iconBg: "bg-[hsl(190,50%,68%)]" },
  { bg: "bg-[hsl(40,85%,75%)]", text: "text-[hsl(30,70%,20%)]", iconBg: "bg-[hsl(40,75%,65%)]" },
  { bg: "bg-[hsl(25,70%,82%)]", text: "text-[hsl(25,60%,22%)]", iconBg: "bg-[hsl(25,60%,72%)]" },
  { bg: "bg-[hsl(210,50%,82%)]", text: "text-[hsl(210,60%,22%)]", iconBg: "bg-[hsl(210,45%,72%)]" },
];

const actions = [
  {
    icon: Brain,
    title: "Skills for the Future Workforce",
    text: "In-demand digital, health, STEM, and business skills aligned with global job markets.",
  },
  {
    icon: Heart,
    title: "Health & One Health Solutions",
    text: "Strengthening community health through healthcare training, One Health education, and workforce development.",
  },
  {
    icon: BookOpen,
    title: "Innovation & Digital Inclusion",
    text: "Access to digital tools, learning platforms, and innovation pathways for underserved communities.",
  },
  {
    icon: Rocket,
    title: "Entrepreneurship & Jobs",
    text: "Supporting youth-led startups, freelancers, and small businesses with skills, mentorship, and ecosystem access.",
  },
  {
    icon: Handshake,
    title: "Partnerships for Impact",
    text: "Working with governments, NGOs, donors, universities, and private sector partners to scale youth impact.",
  },
  {
    icon: BarChart3,
    title: "30+ Industry-Ready Courses",
    text: "Through Aliko Academy and partners, delivering practical training, certifications, and workforce pathways.",
  },
];

export function MissionInActionSection() {
  return (
    <section className="py-24 lg:py-32 bg-card/30">
      <div className="container mx-auto px-6">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
            What AlikoHub Does
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Our Mission <span className="text-gradient-amber">in Action</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A youth empowerment and resource platform that uses education as one pillar, alongside innovation, partnerships, access, and impact.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action, i) => {
            const color = cardColors[i % cardColors.length];
            return (
              <motion.div
                key={action.title}
                className={`group rounded-2xl ${color.bg} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${color.iconBg}`}>
                  <action.icon className={`h-6 w-6 ${color.text}`} />
                </div>
                <h3 className={`font-heading text-lg font-semibold ${color.text}`}>{action.title}</h3>
                <p className={`mt-2 text-sm leading-relaxed ${color.text} opacity-75`}>{action.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
