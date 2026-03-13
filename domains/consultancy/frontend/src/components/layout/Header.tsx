import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Business Consulting", href: "/business-consulting" },
  { label: "Career Guidance", href: "/career-guidance" },
  {
    label: "Study Abroad & Travel Advisory",
    href: "/travel-advisory",
    children: [
      { label: "High School", href: "/travel-advisory/high-school" },
      { label: "Undergraduate", href: "/travel-advisory/undergraduate" },
      { label: "Graduate", href: "/travel-advisory/graduate" },
      { label: "PhD", href: "/travel-advisory/phd" },
    ],
  },
  { label: "Resources", href: "/resources" },
  { label: "Webinars", href: "/webinars" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [travelOpen, setTravelOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-navy backdrop-blur-md border-b border-border">
      <div className="container-wide flex items-center justify-between h-16 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-xl font-bold text-primary-foreground tracking-tight">
            Aliko <span className="text-gradient-gold">Consultancy</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.label} className="relative group">
                <Link
                  to={item.href}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors hover:text-accent ${
                    location.pathname.startsWith(item.href)
                      ? "text-accent"
                      : "text-primary-foreground/70"
                  }`}
                >
                  {item.label}
                  <ChevronDown className="w-3.5 h-3.5" />
                </Link>
                <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-card border border-border rounded-lg shadow-lg py-2 min-w-[180px]">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className="block px-4 py-2 text-sm text-muted-foreground hover:text-accent hover:bg-muted transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                to={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors hover:text-accent ${
                  location.pathname === item.href
                    ? "text-accent"
                    : "text-primary-foreground/70"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/book">
            <Button className="bg-gold text-navy hover:bg-gold/90 font-semibold text-sm hidden sm:inline-flex">
              Book Consultation
            </Button>
          </Link>
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5 text-primary-foreground" /> : <Menu className="w-5 h-5 text-primary-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-background border-t border-border">
          <nav className="container-wide px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  to={item.href}
                  onClick={() => {
                    if (!item.children) setMobileOpen(false);
                    else setTravelOpen(!travelOpen);
                  }}
                  className={`flex items-center justify-between px-3 py-3 text-sm font-medium rounded-md ${
                    location.pathname === item.href || location.pathname.startsWith(item.href + "/")
                      ? "text-accent bg-muted"
                      : "text-foreground"
                  }`}
                >
                  {item.label}
                  {item.children && <ChevronDown className={`w-4 h-4 transition-transform ${travelOpen ? "rotate-180" : ""}`} />}
                </Link>
                {item.children && travelOpen && (
                  <div className="pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-accent"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link to="/book" onClick={() => setMobileOpen(false)}>
              <Button className="w-full mt-2 bg-gold text-navy hover:bg-gold/90 font-semibold">
                Book Consultation
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
