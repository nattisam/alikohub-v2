import { MdEmail, MdLanguage } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import type { NavbarProps } from "./Navbar";
import { useEffect, useState } from "react";
import Button from "../../../../../libraries/ui-libraries/components/Button";
import { useAuth } from "../contexts/AuthContext";

type NavLink = {
  label: string;
  scrollTo?: string;
  link?: string;
  subdomain?: string;
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
    { label: "Careers", subdomain: "careers" },
  ],
  logoSrc = "/AlikoLogo.svg",
  showTopBar = true,
  topBarBg = "bg-[#0F2544]",
  stickyBgDefault = "bg-[#0F2544]",
  stickyBgScrolled = "bg-[#0F2544]/90",
  textColor = "text-gray-100",
  linkPosition = "justify-between",
  headerClassName = "",
  homeHeaderButtonsClassName = "hidden md:flex items-center",
  navbarProps,
  navBarClassName = "flex md:hidden",
  logoClassName = "",
  navLinksClassName = "",
  mobileButtonClassName = "",
  navLinksContainerClassName = "gap-x-8",
}: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getSubdomainUrl = (subdomain: string) =>
    `https://${subdomain}.alikohub.com`;

  return (
    <>
      {/* --- TOP BAR --- */}
      {showTopBar && (
        <header
          className={`${topBarBg} hidden lg:flex h-10 text-gray-300 items-center border-b border-white/10`}
        >
          <div className="max-w-[1300px] mx-auto w-full px-6 flex justify-between items-center text-[13px] font-medium">
            <nav className="flex items-center gap-6">
              <a
                href="mailto:info@alikohub.com"
                className="flex items-center hover:text-white transition-colors"
              >
                <MdEmail className="mr-2 text-[#0D72BA]" /> info@alikohub.com
              </a>
              <a
                href="tel:+251123456789"
                className="flex items-center hover:text-white transition-colors"
              >
                <FaPhoneAlt className="mr-2 text-[#0D72BA] text-[11px]" /> +251
                11 123 4567
              </a>
            </nav>
            <div className="flex items-center gap-2">
              <MdLanguage className="text-[#0D72BA]" />
              <select className="bg-transparent border-none outline-none cursor-pointer hover:text-white">
                <option value="en" className="text-black">
                  English
                </option>
                <option value="fr" className="text-black">
                  French
                </option>
                <option value="sw" className="text-black">
                  Swahili
                </option>
              </select>
            </div>
          </div>
        </header>
      )}

      {/* --- MAIN HEADER --- */}
      <header
        className={`${headerClassName} sticky top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? `${stickyBgScrolled} backdrop-blur-md shadow-[0_4px_20px_-5px_rgba(0,0,0,0.3)] border-b border-white/10 py-3`
            : `${stickyBgDefault} py-5`
        }`}
      >
        <div
          className={`max-w-[1300px] mx-auto flex items-center px-6 ${linkPosition}`}
        >
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src={logoSrc}
              alt="AlikoHub logo"
              className={logoClassName || "h-10 lg:h-12 w-auto"}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className={`hidden md:flex items-center ${navLinksContainerClassName} ${textColor}`}
          >
            {navLinks.map(({ label, scrollTo, link, subdomain }, i) => {
              const commonClasses =
                "text-[15px] font-semibold tracking-wide transition-all duration-300 relative group";
              const activeIndicator =
                "after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#0D72BA] after:transition-all group-hover:after:w-full";
              const isActive =
                currentSection === scrollTo ||
                (link && currentSection === link.slice(1));

              if (subdomain) {
                return (
                  <a
                    key={label + i}
                    href={getSubdomainUrl(subdomain)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${commonClasses} bg-[#0D72BA] text-white px-4 py-1.5 rounded-md hover:bg-[#0B5FA0]`}
                  >
                    {label}
                  </a>
                );
              }

              return (
                <Link
                  key={label + i}
                  to={link || "/"}
                  state={scrollTo ? { scrollTo } : undefined}
                  className={`${commonClasses} ${navLinksClassName} hover:text-[#0D72BA] ${activeIndicator} ${
                    isActive ? "text-[#0D72BA] after:w-full" : ""
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="hidden lg:block text-sm font-semibold text-gray-300">
                  Hi,{" "}
                  <span className="text-[#0D72BA]">
                    {user?.firstname || "User"}
                  </span>
                </span>
                <Button
                  label="Logout"
                  onClick={handleLogout}
                  variant="secondary"
                  className="!py-2 !px-5 text-sm font-bold border-white/20 text-white hover:bg-white/10 hidden md:block"
                />
              </div>
            ) : (
              <div className={homeHeaderButtonsClassName + " gap-3"}>
                <Button
                  label="Login"
                  onClick={() => navigate("/auth/login")}
                  variant="secondary"
                  className="!py-2 !px-6 text-sm font-bold text-gray-300 hover:text-white"
                />
                <Button
                  label="Sign Up"
                  onClick={() => navigate("/auth/signup")}
                  variant="primary"
                  className="!py-2 !px-6 text-sm font-bold bg-[#0D72BA] hover:bg-[#0B5FA0]"
                />
              </div>
            )}

            {/* Mobile Menu */}
            <div className={navBarClassName}>
              <Navbar
                {...navbarProps}
                navLinks={navLinks.map((n) => ({
                  label: n.label,
                  onClick: () =>
                    n.subdomain
                      ? window.open(getSubdomainUrl(n.subdomain), "_blank")
                      : navigate(n.link || "/"),
                }))}
                menuIconClassName="text-3xl text-white"
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
