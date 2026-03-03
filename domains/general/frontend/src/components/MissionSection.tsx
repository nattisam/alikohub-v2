import { motion } from "framer-motion";

const cards = [
  {
    title: "Transforming Workforce & Innovation Systems",
    text: "Advancing Digital Health, One Health, STEM, and entrepreneurship through integrated training, applied innovation, and scalable workforce pathways across Africa.",
    bg: "bg-[hsl(210,40%,88%)]",
    textColor: "text-[hsl(210,60%,25%)]",
    span: "col-span-1",
    rowSpan: "",
  },
  {
    title: "Inclusive & Sustainable Growth",
    text: "Designing youth-centered ecosystems that align skills development with public health resilience, climate responsibility, and long-term economic opportunity.",
    bg: "bg-[hsl(190,60%,78%)]",
    textColor: "text-[hsl(190,70%,20%)]",
    span: "col-span-1",
    rowSpan: "",
  },
  {
    title: "Vision",
    text: "To build Africa's leading youth resourcefulness ecosystem, a continental network of innovation hubs, digital platforms, and global partnerships that transform demographic momentum into measurable prosperity.",
    bg: "bg-[hsl(40,85%,75%)]",
    textColor: "text-[hsl(30,70%,20%)]",
    span: "col-span-1",
    rowSpan: "row-span-2",
  },
  {
    title: "Mission",
    text: "AlikoHub exists to honor youth potential by building structured pathways from learning to livelihood. Through Digital Health, One Health, STEM, and innovation, we equip young people to lead, create, and contribute with dignity across Africa and beyond.",
    bg: "bg-[hsl(20,80%,75%)]",
    textColor: "text-[hsl(20,60%,20%)]",
    span: "col-span-2",
    rowSpan: "row-span-1",
  },
  {
    title: "Empowerment Through Structured Opportunity",
    text: "We move beyond isolated training programs by integrating mentorship, applied labs, enterprise incubation, and employer pipelines into a single coordinated ecosystem.",
    bg: "bg-[hsl(25,70%,82%)]",
    textColor: "text-[hsl(25,60%,22%)]",
    span: "col-span-1",
    rowSpan: "",
  },
  {
    title: "Global Pathways & Cross-Continental Collaboration",
    text: "Through partnerships spanning Africa, the United States, and Canada, AlikoHub creates global exposure, mentorship exchange, and workforce integration that strengthens Africa's role in the global innovation economy.",
    bg: "bg-[hsl(210,50%,82%)]",
    textColor: "text-[hsl(210,60%,22%)]",
    span: "col-span-1",
    rowSpan: "",
  },
];

export function MissionSection() {
  return (
    <section id="about" className="relative py-24 lg:py-32 bg-card/50">
      <div className="container mx-auto px-6">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
            Mission & Vision
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            What Drives <span className="text-gradient-amber">Us</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A human-centered development model that links skills to opportunity, learning to livelihoods, and innovation to public value.
          </p>
        </motion.div>

        {/* Bento grid matching the reference design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              className={`${card.bg} ${card.span} ${card.rowSpan} rounded-2xl p-8 flex flex-col justify-end relative overflow-hidden transition-transform duration-300 hover:scale-[1.02]`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Diagonal line texture */}
              <div
                className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    135deg,
                    currentColor 0px,
                    currentColor 1px,
                    transparent 1px,
                    transparent 12px
                  )`,
                }}
              />
              <div className="relative z-10">
                <h3 className={`font-heading text-xl md:text-2xl font-extrabold ${card.textColor} mb-3 leading-tight`}>
                  {card.title}
                </h3>
                <p className={`text-sm md:text-base leading-relaxed ${card.textColor} opacity-80`}>
                  {card.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
