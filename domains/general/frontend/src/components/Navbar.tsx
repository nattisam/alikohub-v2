import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Globe, Menu, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import alikohubLogo from "@/assets/alikohub-logo.png";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Ventures", href: "/programs" },
  { label: "Partnership", href: "/partnership" },
  { label: "Career", href: "https://career.alikohub.com/", external: true },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Top bar */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-6">
            <a href="mailto:info@alikohub.com" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Mail className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">info@alikohub.com</span>
            </a>
            <a href="tel:+12063535373" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">+1 206 353 5373</span>
            </a>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            <span>English</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={alikohubLogo} alt="AlikoHub" className="h-16" />
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Login
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-amber-light shadow-[var(--shadow-amber)]">
              Sign Up
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border/50 lg:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-6">
                {navLinks.map((link) =>
                  link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.href}
                      className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:text-primary ${
                        location.pathname === link.href ? "text-primary bg-primary/10" : "text-muted-foreground"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )
                )}
                <div className="flex gap-3 pt-4 border-t border-border/50 mt-2">
                  <Button variant="ghost" size="sm" className="flex-1">Login</Button>
                  <Button size="sm" className="flex-1 bg-primary text-primary-foreground">Sign Up</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
