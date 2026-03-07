import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import logoImg from "@/assets/categories/stem/aliko-stem-logo.png";

const footerLinks = {
  programs: [
    { name: "All Programs", href: "/programs" },
    { name: "Enterprise Training", href: "/enterprise" },
    { name: "Industry Curriculum", href: "/curriculum" },
    { name: "Licensure & Exams", href: "/certifications" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Partners", href: "/partners" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/policies#privacy" },
    { name: "Terms of Use", href: "/policies#terms" },
    { name: "Training Disclaimer", href: "/policies#disclaimer" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-divider bg-card">
      <div className="container-content py-14 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/stem">
              <img src={logoImg} alt="Aliko Academy STEM" className="h-14 w-auto" />
            </Link>
            <p className="mt-5 text-base text-[hsl(210_30%_78%)] max-w-xs leading-relaxed">
              Industry-aligned engineering and STEM training for students, professionals, and organizations.
            </p>
            <div className="mt-7 space-y-3">
              <a href="mailto:stem@alikogroup.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                <Mail className="h-4 w-4 text-primary" />
                stem@alikogroup.com
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                <MapPin className="h-4 w-4 text-accent" />
                Middle East & International
              </div>
            </div>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-display font-bold text-lg text-primary">Programs</h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.programs.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-base text-muted-foreground hover:text-primary transition-colors font-medium">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display font-bold text-lg text-accent-green">Company</h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-base text-muted-foreground hover:text-primary transition-colors font-medium">{link.name}</Link>
                </li>
              ))}
              <li>
                <Link to="/student-login" className="text-base text-muted-foreground hover:text-primary transition-colors font-medium">Student Login</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-display font-bold text-lg text-accent">Legal</h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-base text-muted-foreground hover:text-primary transition-colors font-medium">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-divider">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground font-medium">
              Â© {new Date().getFullYear()} Aliko Academy STEM. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Certification exams are administered by third-party vendors.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
