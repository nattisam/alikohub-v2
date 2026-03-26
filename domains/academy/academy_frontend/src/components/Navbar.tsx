import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoAcademy from "@/assets/logo-aliko-academy.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const dynamicLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Streams", to: "/#streams" },
    { label: "Contact", to: "/contact" },
  ];

  const handleAccessLms = () => {
    window.location.href = "https://lms.alikohub.com";
  };

  return (
    <nav className="sticky top-0 z-50 nav-solid border-b border-border shadow-sm">
      <div className="section-container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center">
          <img
            src={logoAcademy}
            alt="Aliko Academy"
            className="h-10 md:h-12 w-auto"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {dynamicLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button size="sm" onClick={handleAccessLms}>
            Access LMS
          </Button>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t px-4 pb-4 space-y-3">
          {dynamicLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Button size="sm" className="w-full" onClick={handleAccessLms}>
              Access LMS
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
