import { Layout } from "@/components/layout/Layout";
import { motion, useScroll, useTransform } from "framer-motion";
import { Target, Eye, Heart, Users, Award, Droplets, Quote, ArrowDown } from "lucide-react";
import { useRef } from "react";

import birassaAliko from "@/assets/team/birassa-aliko.png";

const values = [
  { icon: Heart, title: "Integrity", description: "Honest and transparent in all our dealings" },
  { icon: Users, title: "Community", description: "Putting communities at the center of our work" },
  { icon: Award, title: "Excellence", description: "Delivering the highest quality infrastructure" },
  { icon: Droplets, title: "Sustainability", description: "Building systems that last for generations" },
];

const About = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <Layout>
      {/* Immersive Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ scale: heroScale }}
          className="absolute inset-0 bg-gradient-to-br from-primary via-water-dark to-primary"
        />
        
        {/* Floating water drops animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary-foreground/20 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight + 20 
              }}
              animate={{ 
                y: -20,
                x: Math.random() * window.innerWidth 
              }}
              transition={{ 
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
            />
          ))}
        </div>
        
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 container-main text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-6 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground text-sm font-medium mb-8 border border-primary-foreground/20">
              About Us
            </span>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-8 leading-tight">
              Our Father's Legacy.
              <br />
              <span className="text-accent">Our Life's Work.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
              AlikoWash is more than an organization — it is our legacy.
            </p>
          </motion.div>
          
        </motion.div>
      </section>

      {/* The Beginning - Story Block */}
      <section className="py-24 md:py-32 bg-background relative overflow-hidden">
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary/0 via-primary to-primary/0" />
        
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Image Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-elevated">
                  <img
                    src={birassaAliko}
                    alt="Birassa Aliko - Pioneering Water Engineer"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-primary-foreground font-display text-xl font-bold">Birassa Aliko</p>
                    <p className="text-primary-foreground/80 text-sm">Pioneering Water Engineer</p>
                  </div>
                </div>
              </div>
              
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -right-4 md:-right-8 top-1/4 bg-accent text-accent-foreground p-5 rounded-2xl shadow-elevated"
              >
                <div className="font-display text-5xl font-bold">40+</div>
                <div className="text-sm opacity-90">Years of Service</div>
              </motion.div>
            </motion.div>

            {/* Story Column */}
            <div className="lg:col-span-7 lg:pl-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <span className="text-primary font-medium text-sm uppercase tracking-widest">The Beginning</span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 leading-tight">
                  A Legacy Built on
                  <br />
                  <span className="text-primary">Dedication & Service</span>
                </h2>
              </motion.div>

              <div className="space-y-6">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-lg text-muted-foreground leading-relaxed"
                >
                  Our father, <span className="text-foreground font-medium">Birassa Aliko</span>, is a pioneering water engineer who dedicated over four decades of his life to delivering clean, reliable water systems to communities across Ethiopia.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-muted-foreground leading-relaxed"
                >
                  For the last three decades, he worked under the licensed firm <span className="text-foreground font-medium">Birassa Water Construction</span>, leading numerous life-saving water infrastructure projects that strengthened public health, dignity, and community resilience.
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Break */}
      <section className="py-20 bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container-main relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <Quote className="w-16 h-16 text-primary/30 mx-auto mb-6" />
            <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground leading-relaxed font-medium">
              What began as one engineer's mission has become our shared responsibility — to carry forward his vision with 
              <span className="text-primary"> integrity</span>, 
              <span className="text-accent"> innovation</span>, and 
              <span className="text-primary"> scale</span>.
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* Evolution Story */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <span className="text-accent font-medium text-sm uppercase tracking-widest">The Evolution</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-8 leading-tight">
                From Foundation
                <br />
                <span className="text-accent">To Future</span>
              </h2>

              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Today, that foundation has evolved. Birassa Water Construction has been formally merged into <span className="text-foreground font-medium">Aliko General Construction</span>, a Grade-5 General Contractor based in Ethiopia, ensuring that decades of technical expertise continue under a strengthened and compliant engineering framework.
                </p>
                <p>
                  As his children, inspired by our father's unwavering commitment to community welfare, we founded <span className="text-foreground font-medium">AlikoWash</span> to continue, expand, and modernize his life's work.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-primary/10 p-6 rounded-2xl"
                    >
                      <div className="font-display text-4xl font-bold text-primary">30+</div>
                      <div className="text-sm text-muted-foreground mt-1">Years of Licensed Work</div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-accent/10 p-6 rounded-2xl"
                    >
                      <div className="font-display text-4xl font-bold text-accent">Grade-5</div>
                      <div className="text-sm text-muted-foreground mt-1">General Contractor</div>
                    </motion.div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-secondary p-6 rounded-2xl"
                    >
                      <div className="font-display text-4xl font-bold text-foreground">2000+</div>
                      <div className="text-sm text-muted-foreground mt-1">Projects Completed</div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-primary p-6 rounded-2xl text-primary-foreground"
                    >
                      <div className="font-display text-4xl font-bold">∞</div>
                      <div className="text-sm opacity-90 mt-1">Lives Impacted</div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Approach - Full Width */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-primary via-water-dark to-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z" fill="currentColor" />
          </svg>
        </div>
        
        <div className="container-main relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <span className="text-accent font-medium text-sm uppercase tracking-widest">Our Approach</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-6">
              Beyond Construction
            </h2>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              We combine decades of hands-on engineering experience with modern technology, data-driven planning, and sustainable WASH practices. Our focus goes beyond construction; we design systems that communities can own, operate, and maintain for generations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Engineering Excellence", desc: "40+ years of hands-on water infrastructure expertise" },
              { title: "Modern Technology", desc: "Data-driven planning and innovative solutions" },
              { title: "Sustainable Design", desc: "Systems built for community ownership" },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-primary-foreground/10 backdrop-blur-sm p-8 rounded-2xl border border-primary-foreground/20"
              >
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                  <span className="font-display text-xl font-bold text-accent">{index + 1}</span>
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-primary-foreground/70">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Statement */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <span className="text-primary font-medium text-sm uppercase tracking-widest">Our Impact</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3">
                What We Deliver
              </h2>
            </div>

            <div className="bg-gradient-to-br from-secondary to-secondary/50 p-8 md:p-12 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              
              <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-8 relative">
                Today, AlikoWash delivers <span className="text-primary font-semibold">Water, Sanitation, and Hygiene (WASH) solutions</span> that save lives, protect public health, and empower communities. Every project we undertake honors where we come from and reflects where we are going.
              </p>
              
              <div className="border-l-4 border-primary pl-6 py-2 relative">
                <p className="font-display text-2xl md:text-3xl font-bold text-foreground italic">
                  "AlikoWash is not just a name — it is our father's legacy, and our life's work."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-secondary/30">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Mission & Vision
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-card p-10 rounded-3xl shadow-card h-full relative overflow-hidden transition-all duration-300 hover:shadow-elevated">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50" />
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                  Our Mission
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To provide sustainable water, sanitation, and hygiene infrastructure 
                  that communities can operate for generations, improving public health, 
                  education outcomes, and quality of life for underserved populations 
                  across Ethiopia and beyond.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-card p-10 rounded-3xl shadow-card h-full relative overflow-hidden transition-all duration-300 hover:shadow-elevated">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent/50" />
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Eye className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                  Our Vision
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  A world where every person has access to clean water, proper sanitation, 
                  and hygiene facilities. We envision communities empowered with the 
                  infrastructure and knowledge to maintain healthy, sustainable water 
                  systems for generations to come.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-widest">What Drives Us</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group text-center p-8 bg-card rounded-3xl shadow-card transition-all duration-300 hover:shadow-elevated"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
