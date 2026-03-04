import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="nav-solid">
    <div className="section-container py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Link to="/" className="font-heading font-bold text-lg text-white">
            Aliko Academy
          </Link>
          <p className="mt-3 text-sm text-white/60 leading-relaxed">
            Building Africa's workforce ecosystem, connecting learning, mentorship, and opportunity.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-sm mb-4 text-white/80">Pathways</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li>Aliko Academy Health</li>
            <li>Aliko Academy Tech</li>
            <li>Aliko Academy STEM</li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-sm mb-4 text-white/80">Company</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-sm mb-4 text-white/80">Connect</h4>
          <p className="text-sm text-white/60">Hybrid learning, mentorship, career support, employer alignment</p>
        </div>
      </div>

      <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} AlikoHub Academy. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
