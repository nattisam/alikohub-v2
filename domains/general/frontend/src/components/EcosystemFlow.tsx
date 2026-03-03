import { motion } from "framer-motion";
import { GraduationCap, Compass, Plug, Rocket } from "lucide-react";
import ecoTrain from "@/assets/eco-train.jpg";
import ecoGuide from "@/assets/eco-guide.jpg";
import ecoConnect from "@/assets/eco-connect.jpg";
import ecoScale from "@/assets/eco-scale.jpg";

const steps = [
  {
    icon: GraduationCap,
    title: "TRAIN",
    description: "Market-aligned skills through Aliko Academy's certification programs and applied learning.",
    image: ecoTrain,
  },
  {
    icon: Compass,
    title: "GUIDE",
    description: "Mentorship, career advisory, and professional development through Aliko Consultancy.",
    image: ecoGuide,
  },
  {
    icon: Plug,
    title: "CONNECT",
    description: "Employer matchmaking, investor forums, and innovation challenges through Aliko Events.",
    image: ecoConnect,
  },
  {
    icon: Rocket,
    title: "SCALE",
    description: "Partnerships that enable youth-led enterprises and regional hubs to grow across borders.",
    image: ecoScale,
  },
];

export function EcosystemFlow() {
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
            Our Model
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            The Resourcefulness <span className="text-gradient-amber">Ecosystem</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A four-part journey from learning to leadership, integrated, human-centered, and designed for scale.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="group relative overflow-hidden rounded-2xl border border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)] hover:scale-[1.02]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <img src={step.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 text-center min-h-[260px] flex flex-col justify-end">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm group-hover:bg-white/25 transition-colors">
                  <step.icon className="h-7 w-7 text-white" />
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-primary/80 px-3 py-1 text-xs font-bold text-primary-foreground mb-3 mx-auto">
                  {`0${i + 1}`}
                </div>
                <h3 className="font-heading text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{step.description}</p>
              </div>

              {i < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden text-white/40 lg:block text-2xl z-20">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
