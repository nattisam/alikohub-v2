import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, User } from "lucide-react";
import logoImg from "@/assets/categories/stem/aliko-stem-logo.png";
import { Button } from "@/components/categories/stem/ui/button";
import { cn } from "@/lib/categories/stem/utils";

const navigation = [
  { name: "Home", href: "/stem" },
  { name: "Programs", href: "/stem/programs" },
  { name: "Licensure & Exams", href: "/stem/certifications" },
  { name: "Enterprise Training", href: "/stem/enterprise" },
  { name: "Partners", href: "/stem/partners" },
  { name: "About", href: "/stem/about" },
  { name: "Contact", href: "/stem/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/stem")
      return location.pathname === "/stem" || location.pathname === "/stem/";
    return location.pathname.startsWith(path);
  };

  const handleAccessLms = () => {
    window.location.href = "https://lms.alikohub.com";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-navbar border-b border-border/50 shadow-xl shadow-black/30 backdrop-blur-xl">
      <nav className="container-content flex h-18 items-center justify-between lg:h-20">
        {/* Logo */}
        <Link to="/stem" className="flex items-center">
          <img
            src={logoImg}
            alt="Aliko Academy STEM"
            className="h-12 lg:h-14 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-0.5">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "px-4 py-2.5 text-[15px] font-bold transition-all duration-300 rounded-lg",
                isActive(item.href)
                  ? "text-accent-green bg-white/10"
                  : "text-white/70 hover:text-white",
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          <Button
            onClick={handleAccessLms}
            size="sm"
            className="font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 px-5"
          >
            Access LMS
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center rounded-lg p-2.5 text-white hover:bg-white/10 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Toggle menu</span>
          {mobileMenuOpen ? (
            <X className="h-7 w-7" aria-hidden="true" />
          ) : (
            <Menu className="h-7 w-7" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border/50 bg-navbar">
          <div className="container-content py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-5 py-3.5 text-base font-bold rounded-xl transition-all duration-200",
                  isActive(item.href)
                    ? "text-accent-green bg-white/10"
                    : "text-white/70 hover:text-white",
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 px-4">
              <Button
                onClick={() => {
                  handleAccessLms();
                  setMobileMenuOpen(false);
                }}
                className="w-full font-bold bg-primary text-white"
              >
                Access LMS
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
