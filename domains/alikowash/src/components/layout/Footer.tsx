import { Link } from "react-router-dom";
import { Droplets, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = {
  about: [
    { name: "Our Story", href: "/our-story" },
    { name: "About Us", href: "/about" },
    { name: "Team", href: "/about#team" },
  ],
  services: [
    { name: "Water Supply", href: "/services" },
    { name: "Sanitation", href: "/services" },
    { name: "Hygiene", href: "/services" },
    { name: "Irrigation Systems", href: "/services" },
    { name: "Consulting & Advisory", href: "/services" },
    { name: "Institutional WASH", href: "/services" },
  ],
  community: [
    { name: "Projects", href: "/projects" },
    { name: "Partners", href: "/partners" },
    { name: "Contact Us", href: "/contact" },
    { name: "Donate", href: "/donate" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background/90">
      <div className="container-main py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Droplets className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold text-background">Aliko</span>
                <span className="text-xs font-semibold text-accent -mt-1">WASH</span>
              </div>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              Building sustainable water, sanitation, and hygiene infrastructure for communities. 
              40+ years of engineering excellence serving Ethiopia and beyond.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* About Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-background">About</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-background/70 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-background">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-background/70 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-background">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent mt-0.5" />
                <a 
                  href="mailto:alikowash@alikohub.com" 
                  className="text-background/70 hover:text-accent transition-colors text-sm"
                >
                  alikowash@alikohub.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent mt-0.5" />
                <div className="flex flex-col gap-1">
                  <a href="tel:+12063535373" className="text-background/70 hover:text-accent transition-colors text-sm">
                    +1 206-353-5373
                  </a>
                  <a href="tel:+251917840025" className="text-background/70 hover:text-accent transition-colors text-sm">
                    +251 917 840 025
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5" />
                <span className="text-background/70 text-sm">
                  Bole Dembel, Tigos building 12th floor, Addis Ababa, Ethiopia
                </span>
              </li>
            </ul>
            
            {/* Donate CTA */}
            <div className="mt-6">
              <Button 
                asChild 
                variant="accent" 
                size="sm"
                className="w-full"
              >
                <Link to="/donate">
                  <Heart className="w-4 h-4 mr-2" />
                  Donate Now
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Community Links Row */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {footerLinks.community.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-background/70 hover:text-accent transition-colors text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/50 text-sm">
            © {new Date().getFullYear()} Aliko Wash. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-background/50 hover:text-accent transition-colors text-sm">
              Privacy & Policy
            </Link>
            <Link to="/terms" className="text-background/50 hover:text-accent transition-colors text-sm">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
