import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const faqGroups = [
  {
    category: "General",
    items: [
      { q: "What services does Aliko Consultancy offer?", a: "We offer three core services: Business Consulting, Career Guidance & Mentorship, and Travel Advisory including student programs at all academic levels." },
      { q: "How do I get started?", a: "You can book a free discovery call through our booking page, submit an application through the application portal, or contact us directly." },
      { q: "What is your refund policy?", a: "Please refer to our refund policy page for detailed information on cancellations and refunds." },
    ],
  },
  {
    category: "Business",
    items: [
      { q: "What types of businesses do you work with?", a: "We work with startups, SMEs, and established businesses across technology, healthcare, finance, retail, and many other industries." },
    ],
  },
  {
    category: "Career",
    items: [
      { q: "How does the mentorship program work?", a: "You are matched with an experienced mentor in your field of interest. Sessions are tailored to your goals and can cover career strategy, skill development, and professional networking." },
    ],
  },
  {
    category: "Travel",
    items: [
      { q: "What student visa support do you provide?", a: "We provide end-to-end support including university selection, application preparation, visa documentation, and pre-departure orientation." },
      { q: "How long does the travel advisory process take?", a: "Timelines vary by destination and visa type. Typically, the process takes 4 to 12 weeks from initial consultation to visa decision." },
    ],
  },
];

const FAQ = () => (
  <div>
    <section className="bg-navy section-padding">
      <div className="container-wide">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent mb-4 block">FAQ</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-6">Frequently Asked Questions</h1>
          <p className="text-primary-foreground/70 text-lg">Find answers to common questions about our services.</p>
        </div>
      </div>
    </section>

    <section className="section-padding bg-gradient-warm">
      <div className="container-narrow">
        {faqGroups.map((group, gi) => {
          const headerStyles = ["card-navy", "card-gold-subtle", "card-teal-subtle", "card-forest-subtle"];
          return (
            <div key={group.category} className="mb-10 last:mb-0">
              <div className={`${headerStyles[gi]} rounded-xl px-5 py-3 flex items-center gap-3 mb-5`}>
                <div className={`w-8 h-8 rounded-lg ${gi === 0 ? 'bg-primary-foreground/15' : 'bg-accent/15'} flex items-center justify-center`}>
                  <HelpCircle className={`w-4 h-4 ${gi === 0 ? 'text-accent' : 'text-accent'}`} />
                </div>
                <h2 className={`font-serif text-xl font-bold ${gi === 0 ? 'text-primary-foreground' : 'text-primary'}`}>{group.category}</h2>
              </div>
              <Accordion type="single" collapsible className="space-y-3">
                {group.items.map((faq, i) => (
                  <AccordionItem key={i} value={`${group.category}-${i}`} className="border border-border rounded-xl px-6 bg-card">
                    <AccordionTrigger className="text-left font-serif text-base font-semibold text-primary hover:no-underline py-5">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          );
        })}
      </div>
    </section>

    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-navy" />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--gold)) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      <div className="relative container-narrow text-center section-padding">
        <h2 className="font-serif text-3xl font-bold text-primary-foreground mb-4">Still Have Questions?</h2>
        <p className="text-primary-foreground/70 mb-8">Our team is here to help.</p>
        <Link to="/contact"><Button className="bg-gold text-navy hover:bg-gold/90 font-semibold px-8 py-6">Contact Us</Button></Link>
      </div>
    </section>
  </div>
);

export default FAQ;
