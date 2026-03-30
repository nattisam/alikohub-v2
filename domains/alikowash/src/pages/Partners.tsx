import { forwardRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Handshake, Heart, Building, Users, ChevronRight } from "lucide-react";

// Partner logos
import glimmerOfHopeLogo from "@/assets/partners/glimmer-of-hope.png";
import weftaLogo from "@/assets/partners/wefta.jpg";
import daughtersOfCharityLogo from "@/assets/partners/daughters-of-charity.png";
import lafimDiakonieLogo from "@/assets/partners/lafim-diakonie.png";

interface Partner {
  name: string;
  fullName?: string;
  description?: string;
  logo?: string;
  website?: string;
}

const partnerTypes = [
  {
    icon: Heart,
    title: "Donors & Funding Partners",
    description: "Provide financial support to bring clean water to communities in need.",
    partners: [
      { 
        name: "WEFTA", 
        fullName: "Water Engineers for the Americans and Africans",
        description: "International organization supporting water infrastructure projects",
        logo: weftaLogo,
        website: "https://wefta.net"
      },
      { 
        name: "Daughters of Charity", 
        fullName: "Province of St. Louise",
        description: "Catholic organization supporting schools and community development",
        logo: daughtersOfCharityLogo,
      },
      { 
        name: "Glimmer of Hope", 
        fullName: "Eliminate Poverty. Illuminate Lives.",
        description: "Foundation supporting sustainable development initiatives",
        logo: glimmerOfHopeLogo,
      },
      { 
        name: "Lafim-Diakonie", 
        fullName: "Wir tun gut.",
        description: "German diaconal organization supporting development projects",
        logo: lafimDiakonieLogo,
      },
      { 
        name: "Catholic Diocese of Stockholm", 
        fullName: "Sweden",
        description: "Faith-based donor organization",
      },
    ] as Partner[],
  },
  {
    icon: Building,
    title: "Implementing & Technical Partners",
    description: "Work with us on the ground to design, build, and maintain infrastructure.",
    partners: [
      { name: "Western Wollega Bethel Synod", fullName: "WWBS", description: "Regional church organization" },
      { name: "Local Government Water Offices", description: "Coordination and permits" },
      { name: "Regional Health Bureaus", description: "Health impact assessment" },
    ] as Partner[],
  },
  {
    icon: Users,
    title: "Institutional & Community Partners",
    description: "Communities and institutions we serve and collaborate with.",
    partners: [
      { name: "Community WASH Committees", description: "Local ownership and maintenance" },
      { name: "Local Health Offices", description: "Health coordination" },
      { name: "Schools & Educational Institutions", description: "Institutional beneficiaries" },
    ] as Partner[],
  },
];

const impactStats = [
  { value: "250,000+", label: "People Served" },
  { value: "1,500+", label: "Water Points" },
  { value: "300+", label: "Reservoirs Built" },
  { value: "40+", label: "Years Experience" },
];

const Partners = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <Layout>
      <div ref={ref}>
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary via-primary to-water-dark overflow-hidden">
          <div className="container-main relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium mb-6">
                Join Our Mission
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Partner With <span className="text-accent">Us</span>
              </h1>
              <p className="text-xl text-primary-foreground/80 leading-relaxed">
                Together, we can bring clean water to more communities. Join our 
                network of partners making a lasting impact.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-16 bg-secondary">
          <div className="container-main">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {impactStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Types */}
        <section className="section-padding">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Partners
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                We work with diverse partners to maximize our impact
              </p>
            </motion.div>

            <div className="space-y-12">
              {partnerTypes.map((type, index) => (
                <motion.div
                  key={type.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    delay: index * 0.15, 
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="bg-card rounded-2xl p-8 shadow-card"
                >
                  <motion.div 
                    className="flex items-center gap-4 mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.2 }}
                  >
                    <motion.div 
                      className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <type.icon className="w-7 h-7 text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground">
                        {type.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {type.description}
                      </p>
                    </div>
                  </motion.div>

                  <div className="overflow-hidden">
                    <motion.div 
                      className="flex gap-6"
                      animate={{ x: ["0%", "-50%"] }}
                      transition={{
                        x: {
                          duration: 20 + index * 5,
                          repeat: Infinity,
                          ease: "linear",
                        }
                      }}
                    >
                      {/* Duplicate partners for seamless loop */}
                      {[...type.partners, ...type.partners].map((partner, partnerIndex) => (
                        <motion.div
                          key={`${partner.name}-${partnerIndex}`}
                          whileHover={{ scale: 1.08, y: -8 }}
                          className="group flex-shrink-0 flex flex-col items-center text-center"
                        >
                          <div className="rounded-xl bg-background flex items-center justify-center shadow-md hover:shadow-xl w-48 h-36 p-5 transition-all">
                            {partner.logo ? (
                              partner.website ? (
                                <a 
                                  href={partner.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="w-full h-full flex items-center justify-center"
                                >
                                  <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="max-w-full max-h-full object-contain object-center"
                                  />
                                </a>
                              ) : (
                                <img
                                  src={partner.logo}
                                  alt={partner.name}
                                  className="max-w-full max-h-full object-contain object-center"
                                />
                              )
                            ) : (
                              <span className="text-base font-semibold text-foreground text-center leading-tight px-2">
                                {partner.name}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Become a Partner CTA */}
        <section className="py-20 bg-accent">
          <div className="container-main text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Handshake className="w-16 h-16 text-accent-foreground/80 mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-4xl font-bold text-accent-foreground mb-4">
                Become a Partner
              </h2>
              <p className="text-accent-foreground/80 text-lg max-w-2xl mx-auto mb-8">
                Whether you're an individual donor, organization, or institution, 
                there's a way for you to contribute to bringing clean water to 
                communities in need.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-accent-foreground text-accent hover:bg-accent-foreground/90"
                  asChild
                >
                  <Link to="/contact">
                    Get In Touch
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10"
                  asChild
                >
                  <Link to="/donate">
                    <Heart className="w-5 h-5 mr-2" />
                    Donate Now
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
});

Partners.displayName = "Partners";

export default Partners;
