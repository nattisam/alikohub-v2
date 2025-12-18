import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import type { NavbarProps } from "./Navbar";
import { useEffect, useState } from "react";
import Button from "../../../../../libraries/ui-libraries/components/Button";
// import { useUser } from "../contexts/UserContext";

type NavLink = {
  label: string;
  scrollTo?: string;
  link?: string;
};

type HeaderProps = {
  currentSection: string | null;
  navLinks?: NavLink[];
  logoSrc?: string;
  showTopBar?: boolean;
  topBarBg?: string;
  stickyBgDefault?: string;
  stickyBgScrolled?: string;
  textColor?: string;
  linkPosition?: string;
  homeHeaderButtonsClassName?: string;
  headerClassName?: string;
  navbarProps?: Partial<NavbarProps>;
  navBarClassName?: string;
  navLinksClassName?: string;
  logoClassName?: string;
  mobileButtonClassName?: string;
  navLinksContainerClassName?: string;
};

const Header = ({
  currentSection,
  navLinks = [
    { label: "Home", scrollTo: "home" },
    { label: "About", scrollTo: "about" },
    { label: "Contact", scrollTo: "contact-us" },
    { label: "Careers", link: "/careers" },
  ],
  logoSrc = "/AlikoLogo.svg",
  showTopBar = true,
  topBarBg = "bg-[#333333]",
  stickyBgDefault = "bg-[#C9E4FA]",
  stickyBgScrolled = "bg-white",
  textColor = "text-black",
  linkPosition = "justify-between",
  headerClassName = "",
  homeHeaderButtonsClassName = " hidden lg:block md:block",
  navbarProps,
  navBarClassName = "flex md:hidden lg:hidden",
  logoClassName = "",
  navLinksClassName = "",
  mobileButtonClassName = "",
  navLinksContainerClassName = "gap-x-28",
}: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // UI-only state (auth removed)
  const isLoggedIn = false;
  const isAdmin = false;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignUpClick = () => navigate("/auth/signup");
  const handleLoginClick = () => navigate("/auth/login");
  const handleLogout = () => navigate("/");
  const handleAdminClick = () => navigate("/admin/careers");

  return (
    <>
      {showTopBar && (
        <header className={`${topBarBg} hidden text-white lg:flex justify-between items-center px-4 py-2`}>
          <nav className="flex gap-10 items-center">
            <Link to="/" className="flex items-center text-sm">
              <MdEmail className="mr-2" /> info@alikohub.com
            </Link>
            <Link to="/" className="flex items-center text-sm">
              <FaPhone className="mr-2" /> +251 123 456 789
            </Link>
          </nav>

          <select className="bg-white text-[#444] px-4 py-2 text-xs h-8 rounded-full">
            <option>English</option>
            <option>French</option>
            <option>Swahili</option>
          </select>
        </header>
      )}

      <header
        className={`${headerClassName} sticky top-0 z-50 transition-all ${
          isScrolled ? `${stickyBgScrolled} shadow-2xl` : stickyBgDefault
        }`}
      >
        <div className={`max-w-[1300px] mx-auto flex items-center px-4 py-4 ${linkPosition}`}>
          <img src={logoSrc} className={logoClassName || "h-12 lg:h-14"} />

          <div className={`hidden md:flex ${navLinksContainerClassName}`}>
            {navLinks.map(({ label, scrollTo, link }) => (
              <Link
                key={label}
                to={link || "/"}
                className={`text-2xl font-semibold ${navLinksClassName}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop buttons (UI only) */}
          <div className="hidden md:flex gap-4">
            <Button label="Login" onClick={handleLoginClick} variant="secondary" />
            <Button label="Sign Up" onClick={handleSignUpClick} variant="primary" />
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <Button label="Login" onClick={handleLoginClick} variant="secondary" />
            <Navbar
              navLinks={[
                ...navLinks.map(({ label, scrollTo }) => ({
                  label,
                  onClick: () => {
                    if (!scrollTo) return;
                    document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth" });
                  },
                })),
                { label: "Sign Up", onClick: handleSignUpClick, isButton: true },
              ]}
              logoSrc="/AlikoLogo.svg"
              {...navbarProps}
            />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
