import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-navy text-primary-foreground">
      <div className="container-wide px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">
              Aliko <span className="text-gold">Consultancy</span>
            </h3>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Premium consultancy services in Business, Study Abroad & Travel Advisory, and Career Guidance & Mentorship.
              Guiding your next chapter with expertise and care.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider mb-4 text-gold">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/business-consulting" className="text-primary-foreground/70 hover:text-gold transition-colors">Business Consulting</Link></li>
              <li><Link to="/career-guidance" className="text-primary-foreground/70 hover:text-gold transition-colors">Career Guidance & Mentorship</Link></li>
              <li><Link to="/travel-advisory" className="text-primary-foreground/70 hover:text-gold transition-colors">Study Abroad & Travel Advisory</Link></li>
              <li><Link to="/resources" className="text-primary-foreground/70 hover:text-gold transition-colors">Resources</Link></li>
              <li><Link to="/webinars" className="text-primary-foreground/70 hover:text-gold transition-colors">Webinars</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider mb-4 text-gold">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="text-primary-foreground/70 hover:text-gold transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-primary-foreground/70 hover:text-gold transition-colors">Contact</Link></li>
              <li><Link to="/book" className="text-primary-foreground/70 hover:text-gold transition-colors">Book a Consultation</Link></li>
              <li><Link to="/apply" className="text-primary-foreground/70 hover:text-gold transition-colors">Apply</Link></li>
              <li><Link to="/faq" className="text-primary-foreground/70 hover:text-gold transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider mb-4 text-gold">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/privacy" className="text-primary-foreground/70 hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-primary-foreground/70 hover:text-gold transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refund" className="text-primary-foreground/70 hover:text-gold transition-colors">Refund Policy</Link></li>
              <li><Link to="/cookies" className="text-primary-foreground/70 hover:text-gold transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
          &copy; {new Date().getFullYear()} Aliko Consultancy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
