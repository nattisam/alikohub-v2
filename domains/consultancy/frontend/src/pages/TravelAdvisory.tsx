import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Briefcase, Users, Globe, ArrowRight, Video, MessageSquare, Mail, CalendarDays, Shield, School, FileCheck, Eye, Plane, Stethoscope, PenTool } from "lucide-react";
import pillarTravel from "@/assets/pillar-travel.jpg";
import bgHighschool from "@/assets/bg-highschool.jpg";
import bgUndergraduate from "@/assets/bg-undergraduate.jpg";
import bgGraduate from "@/assets/bg-graduate.jpg";
import bgPhd from "@/assets/bg-phd.jpg";

const services = [
  { icon: School, title: "University Selection", desc: "Expert guidance to help you identify and shortlist universities that match your academic profile and career goals." },
  { icon: GraduationCap, title: "University Admission", desc: "End-to-end support through the admission process, including application preparation and submission." },
  { icon: FileCheck, title: "Student Visa Assistance", desc: "Step-by-step guidance through the student visa application process for multiple destinations." },
  { icon: Eye, title: "Visit Visa Services", desc: "Support for tourist, family visit, medical, and seminar visas across different countries." },
  { icon: PenTool, title: "Visa Application Form Filling", desc: "Professional assistance with completing visa application forms accurately and thoroughly." },
  { icon: Briefcase, title: "Work Visa Guidance", desc: "Advisory services for work permits, corporate relocation, and business visa applications." },
];

const categories = [
  { icon: GraduationCap, title: "Student Travel", desc: "Study abroad guidance for all academic levels. Visa, applications, and enrollment support.", href: "/travel-advisory/undergraduate", cardClass: "card-navy" },
  { icon: Users, title: "Visitor Travel", desc: "Tourist and family visit visa consulting, travel planning, and itinerary support.", href: "/contact", cardClass: "card-forest" },
  { icon: Briefcase, title: "Business Travel", desc: "Corporate relocation, work permits, and business visa advisory services.", href: "/contact", cardClass: "card-teal" },
  { icon: Globe, title: "Other Travel Consulting", desc: "Immigration consultations, medical travel, seminars, and custom advisory.", href: "/contact", cardClass: "card-navy" },
];

const levels = [
  { title: "High School", href: "/travel-advisory/high-school", desc: "Boarding school and exchange program support.", image: bgHighschool },
  { title: "Undergraduate", href: "/travel-advisory/undergraduate", desc: "University admissions and scholarship guidance.", image: bgUndergraduate },
  { title: "Graduate", href: "/travel-advisory/graduate", desc: "Master's programs, research opportunities, and funding.", image: bgGraduate },
  { title: "PhD", href: "/travel-advisory/phd", desc: "Doctoral advisory and research guidance.", image: bgPhd },
];

const communicationPlatforms = [
  { icon: Video, title: "Zoom", desc: "All guidance sessions and meetings are conducted via Zoom for interactive, face-to-face consultation." },
  { icon: MessageSquare, title: "Notion", desc: "Access program resources, materials, and structured templates through our organized Notion workspace." },
  { icon: CalendarDays, title: "Google Calendar", desc: "Sessions are scheduled via Google Calendar so you never miss an important meeting or deadline." },
  { icon: Mail, title: "Email & Google Drive", desc: "Regular communication, resource sharing, and document collaboration through email and Drive." },
];

const visaGuidance = [
  { country: "United States", items: ["F-1 Student Visa for academic programs", "J-1 Exchange Visitor Visa", "B1/B2 Travel & Business Visa for short-term visits, conferences, and business activities", "DS-160 form completion guidance", "Embassy interview preparation tips"] },
  { country: "United Kingdom", items: ["Student Visa (formerly Tier 4)", "CAS letter requirements", "Financial documentation guidance", "Immigration Health Surcharge (IHS)"] },
  { country: "Canada", items: ["Study Permit application process", "SDS (Student Direct Stream) for faster processing", "Provincial requirements", "Post-graduation work permit options"] },
  { country: "Europe (Schengen)", items: ["National D-Visa for long-stay studies", "Country-specific requirements (Germany, France, etc.)", "Blocked account setup guidance", "Residence permit procedures"] },
  { country: "United Arab Emirates", items: ["Student Visa for universities in Dubai, Abu Dhabi, and Sharjah", "Visit/Tourist Visa for short-term travel", "Employment & Business Visa requirements", "Medical fitness and Emirates ID process"] },
  { country: "Australia", items: ["Student Visa (Subclass 500) for study programs", "Genuine Temporary Entrant (GTE) requirement", "OSHC health insurance requirements", "Post-study work visa (Subclass 485) options"] },
];

const TravelAdvisory = () => (
  <div>
    {/* Hero with Image */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${pillarTravel})` }} />
      <div className="absolute inset-0 bg-navy/85" />
      <div className="relative container-wide px-4 lg:px-8 py-20 md:py-28 lg:py-36">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent mb-4 block">Study Abroad & Travel Advisory</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Your Global Journey, Simplified
          </h1>
          <p className="text-primary-foreground/70 text-lg mb-8 leading-relaxed">
            Guiding students through every step of their international education journey and supporting travelers moving abroad for work, visits, medical needs, or seminars.
          </p>
          <Link to="/apply?pillar=travel">
            <Button className="bg-gold text-navy hover:bg-gold/90 font-semibold px-8 py-6">
              Start Your Travel Process
            </Button>
          </Link>
        </div>
      </div>
    </section>

    {/* Our Services */}
    <section className="section-padding bg-off-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold text-primary mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Comprehensive support for every stage of your international journey.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => {
            const cardStyles = ["card-navy", "card-forest", "card-teal", "card-navy", "card-forest", "card-teal"];
            return (
              <div key={s.title} className={`${cardStyles[i]} rounded-xl p-7 card-hover`}>
                <div className="w-12 h-12 rounded-lg bg-primary-foreground/15 flex items-center justify-center mb-5">
                  <s.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-primary-foreground mb-2">{s.title}</h3>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    {/* Travel Categories */}
    <section className="section-padding bg-gradient-warm">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold text-primary mb-4">Travel Categories</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Specialized services for every type of international journey.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {categories.map((c) => (
            <Link key={c.title} to={c.href} className={`${c.cardClass} rounded-xl p-8 card-hover group`}>
              <div className="w-12 h-12 rounded-lg bg-primary-foreground/15 flex items-center justify-center mb-5">
                <c.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-primary-foreground mb-2">{c.title}</h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">{c.desc}</p>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all">
                Learn More <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* Student Levels with Image */}
    <section className="section-padding bg-off-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold text-primary mb-4">Student Academic Levels</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Tailored support for every stage of your academic journey.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {levels.map((l) => (
            <Link key={l.title} to={l.href} className="bg-card border border-border rounded-xl overflow-hidden card-hover group">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={l.image} alt={l.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-semibold text-primary mb-1">{l.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{l.desc}</p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all">
                  Explore <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* Visa Guidance Section */}
    <section className="section-padding bg-gradient-cool">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold text-primary mb-4">
            <Shield className="w-7 h-7 inline-block mr-2 text-accent -mt-1" />
            Visa Guidance by Country
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We provide step-by-step guidance through the visa application process for multiple destinations, including tips and country-specific requirements.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visaGuidance.map((v, i) => {
            const styles = ["card-navy", "card-forest", "card-teal", "card-navy", "card-forest", "card-teal"];
            return (
              <div key={v.country} className={`${styles[i]} rounded-xl p-8`}>
                <h3 className="font-serif text-lg font-semibold text-primary-foreground mb-4">{v.country}</h3>
                <ul className="space-y-2">
                  {v.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-primary-foreground/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    {/* How We Work With You - moved to bottom */}
    <section className="section-padding bg-warm-beige">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold text-primary mb-4">How We Work With You</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Our organized system ensures seamless communication and easy access to all resources throughout your journey.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {communicationPlatforms.map((p, i) => {
            const cardStyles = ["card-navy-subtle", "card-gold-subtle", "card-teal-subtle", "card-forest-subtle"];
            return (
              <div key={p.title} className={`${cardStyles[i]} rounded-xl p-6 text-center card-hover`}>
                <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-4">
                  <p.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-primary mb-2">{p.title}</h3>
                <p className="text-muted-foreground text-sm">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-navy" />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--gold)) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      <div className="relative container-narrow text-center section-padding">
        <h2 className="font-serif text-3xl font-bold text-primary-foreground mb-4">Start Your Travel Process</h2>
        <p className="text-primary-foreground/70 mb-8">Submit an application or send us a quick inquiry.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/apply?pillar=travel"><Button className="bg-gold text-navy hover:bg-gold/90 font-semibold px-8 py-6">Apply Now</Button></Link>
          <Link to="/contact"><Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-8 py-6">Contact Us</Button></Link>
        </div>
      </div>
    </section>
  </div>
);

export default TravelAdvisory;
