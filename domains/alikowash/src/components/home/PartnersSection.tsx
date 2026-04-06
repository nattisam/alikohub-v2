import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Handshake, Building2, Users } from "lucide-react";

// Partner logos
import glimmerOfHopeLogo from "@/assets/partners/glimmer-of-hope.png";
import weftaLogo from "@/assets/partners/wefta.jpg";
import daughtersOfCharityLogo from "@/assets/partners/daughters-of-charity.png";
import lafimDiakonieLogo from "@/assets/partners/lafim-diakonie.png";
import daughtersOfCharityGlobalLogo from "@/assets/partners/daughters-of-charity-global.png";
import alikoConstructionLogo from "@/assets/partners/aliko-construction.png";

const donorPartners = [
  {
    name: "WEFTA",
    fullName: "Water Engineers for the Americas and Africans",
    logo: weftaLogo,
    website: "https://wefta.net",
  },
  {
    name: "Daughters of Charity",
    fullName: "Province of St. Louise",
    logo: daughtersOfCharityLogo,
  },
  {
    name: "Daughters of Charity",
    fullName: "International - Caritas Christi",
    logo: daughtersOfCharityGlobalLogo,
  },
  {
    name: "Glimmer of Hope",
    fullName: "Eliminate Poverty. Illuminate Lives.",
    logo: glimmerOfHopeLogo,
  },
  {
    name: "Lafim-Diakonie",
    fullName: "Wir tun gut.",
    logo: lafimDiakonieLogo,
  },
];

const otherPartnerGroups = [
  {
    title: "Implementing & Technical Partners",
    icon: Building2,
    partners: [
      {
        name: "Aliko Construction",
        fullName: "Infrastructure & WASH Construction",
        logo: alikoConstructionLogo,
      },
      { name: "AID General Water Works", fullName: "Contractor Plc" },
      { name: "Western Wollega Bethel Synod", fullName: "WWBS" },
      { name: "Local Government Offices" },
    ],
  },
  {
    title: "Institutional & Community Partners",
    icon: Users,
    partners: [
      { name: "Community WASH Committees" },
      { name: "Local Health Offices" },
      { name: "Schools & Educational Institutions" },
    ],
  },
];

export function PartnersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      className="section-padding bg-secondary/30 overflow-hidden"
      ref={ref}
    >
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Collaboration
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Our Partners
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Working together to bring clean water to communities
          </p>
        </motion.div>

        {/* Donors & Funding Partners - Sliding Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-2xl p-8 shadow-card mb-12"
        >
          <h3 className="font-display text-xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Handshake className="w-6 h-6 text-primary" />
            Donors & Funding Partners
          </h3>

          {/* Sliding logos container */}
          <div className="relative overflow-hidden">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />

            <div className="flex animate-slide-logos gap-12 w-max">
              {/* First set */}
              {donorPartners.map((partner, idx) => (
                <div
                  key={`${partner.name}-${idx}`}
                  className="flex-shrink-0 w-48 group flex flex-col items-center text-center"
                >
                  <div className="w-full aspect-[3/2] rounded-xl bg-background flex items-center justify-center p-4 mb-3 transition-all group-hover:shadow-md group-hover:scale-105">
                    {partner.website ? (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </a>
                    ) : (
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="font-semibold text-foreground text-sm leading-tight">
                    {partner.name}
                  </div>
                  {partner.fullName && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {partner.fullName}
                    </div>
                  )}
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {donorPartners.map((partner, idx) => (
                <div
                  key={`${partner.name}-dup-${idx}`}
                  className="flex-shrink-0 w-48 group flex flex-col items-center text-center"
                >
                  <div className="w-full aspect-[3/2] rounded-xl bg-background flex items-center justify-center p-4 mb-3 transition-all group-hover:shadow-md group-hover:scale-105">
                    {partner.website ? (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </a>
                    ) : (
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="font-semibold text-foreground text-sm leading-tight">
                    {partner.name}
                  </div>
                  {partner.fullName && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {partner.fullName}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Other Partner Groups */}
        <div className="space-y-12">
          {otherPartnerGroups.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: (groupIndex + 1) * 0.1 }}
              className="bg-card rounded-2xl p-8 shadow-card"
            >
              <h3 className="font-display text-xl font-bold text-foreground mb-8 flex items-center gap-3">
                <group.icon className="w-6 h-6 text-primary" />
                {group.title}
              </h3>

              {/* Single horizontal line of partners */}
              <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
                {group.partners.map((partner, pIdx) => (
                  <div
                    key={`${partner.name}-${pIdx}`}
                    className="group flex items-center gap-3"
                  >
                    {partner.logo ? (
                      <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center p-2 transition-shadow group-hover:shadow-md">
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-display font-bold text-primary/50">
                          {partner.name
                            .split(" ")
                            .map((w) => w[0])
                            .join("")}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-foreground text-sm leading-tight">
                        {partner.name}
                      </div>
                      {partner.fullName && (
                        <div className="text-xs text-muted-foreground">
                          {partner.fullName}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button variant="accent" size="lg" asChild>
            <Link to="/partners">
              Become a Partner
              <ChevronRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
