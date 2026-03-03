import { Mail, Globe, MapPin } from "lucide-react";
import alikohubLogo from "@/assets/alikohub-logo.png";

const footerLinks = {
  Ecosystem: ["Aliko Academy", "Aliko Consultancy", "Aliko Events", "Innovation Hubs"],
  Company: ["About", "Impact", "Partners", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service"],
};

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border/50 bg-card/50 py-16">
      <div className="container mx-auto px-6">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <img src={alikohubLogo} alt="AlikoHub" className="h-14" />
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Honoring youth potential where opportunity meets dignity, transforming Africa's future through Digital Health, STEM, and innovation pathways.
            </p>
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <a href="mailto:info@alikohub.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="h-4 w-4" /> info@alikohub.com
              </a>
              <a href="https://www.alikohub.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Globe className="h-4 w-4" /> www.alikohub.com
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" /> Seattle, Washington, USA
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" /> Addis Ababa, Ethiopia (Regional)
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AlikoHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
