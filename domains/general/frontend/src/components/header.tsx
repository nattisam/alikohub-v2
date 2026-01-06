import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
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
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignUpClick = () => {
    navigate("/auth/signup");
  };

  const handleLoginClick = () => {
    navigate("/auth/login");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Update navLinks based on user status
  const getNavLinks = () => {
    // Remove the automatic addition of "Admin Panel" link to navLinks
    // The admin panel button is already handled separately in the header buttons
    return navLinks;
  };

  const updatedNavLinks = getNavLinks();

  return (
    <>
      {showTopBar && (
        <header
          className={`${topBarBg} bg-[#333333] hidden text-white lg:flex flex-col md:flex-row justify-between items-center px-4 py-2 gap-2`}
        >
          <nav
            className="flex flex-col md:flex-row gap-4 md:gap-10 items-center"
            aria-label="Top bar navigation"
          >
            <Link to="/" className="flex items-center text-sm">
              <MdEmail className="text-lg mr-2" />
              info@alikohub.com
            </Link>
            <Link to="/" className="flex items-center text-sm">
              <FaPhone className="text-lg mr-2" />
              +251 123 456 789
            </Link>
            <Link to="/" className="flex items-center text-sm">
              <FaPhone className="text-lg mr-2" />
              +251 123 456 789
            </Link>
          </nav>
          <select
            name="language"
            id="lang"
            aria-label="Select language"
            className="bg-white rounded-4xl text-[#444444] px-4 py-2 text-xs h-8"
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="sw">Swahili</option>
          </select>
        </header>
      )}
      <header
        className={`${headerClassName}  sticky top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? `${stickyBgScrolled} backdrop-blur-3xl shadow-2xl`
            : stickyBgDefault
        }`}
      >
        <div
          className={`max-w-[1300px] mx-auto flex items-center justify-between px-4 py-4 flex-wrap gap-y-4 ${linkPosition}`}
        >
          <div className="flex items-center gap-4 ml-4">
            <img
              src={logoSrc}
              alt="AlikoHub logo"
              className={` ${logoClassName || "h-12 lg:h-14"}`}
            />
          </div>

          <div
            className={`flex ${textColor}  hidden md:block lg:block  ${navLinksContainerClassName} items-center`}
          >
            {updatedNavLinks.map(({ label, scrollTo, link }, i) => (
              <Link
                key={label + i}
                to={link ? link : "/"}
                state={scrollTo ? { scrollTo } : undefined}
                className={`text-2xl font-semibold ${navLinksClassName} mx-10 hover:underline hover:decoration-4 hover:decoration-neutral-700 ${
                  currentSection === scrollTo ||
                  currentSection === link?.slice(1)
                    ? "underline underline-offset-8 decoration-4 decoration-neutral-950"
                    : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
          <div>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.globalRole === "ADMIN" && (
                  <Button
                    label="Admin Panel"
                    onClick={handleAdminClick}
                    variant="primary"
                    className={`${homeHeaderButtonsClassName} w-32 items-end hidden lg:block md:block`}
                    ariaLabel="Admin Panel"
                  />
                )}
                <span className="hidden lg:block md:block text-sm font-medium">
                  Welcome, {user?.firstname || "User"}
                </span>
                <Button
                  label="Logout"
                  onClick={handleLogout}
                  variant="secondary"
                  className={`${homeHeaderButtonsClassName} w-24 items-end hidden lg:block md:block`}
                  ariaLabel="Logout"
                />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  label="Login"
                  onClick={handleLoginClick}
                  variant="secondary"
                  className={`${homeHeaderButtonsClassName} w-24 items-end hidden lg:block md:block`}
                  ariaLabel="Login"
                />
                <Button
                  label="Sign Up"
                  onClick={handleSignUpClick}
                  variant="primary"
                  className={`${homeHeaderButtonsClassName} w-32 items-end hidden lg:block md:block`}
                  ariaLabel="Sign Up"
                />
              </div>
            )}
          </div>
          <div
            className={`${navBarClassName} flex md:hidden  lg:hidden items-center gap-4 mr-4`}
          >
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {user?.globalRole === "ADMIN" && (
                  <Button
                    label="Admin"
                    onClick={handleAdminClick}
                    variant="primary"
                    className={`w-20 ${mobileButtonClassName}`}
                    ariaLabel="Admin Panel"
                  />
                )}
                <span className="text-sm font-medium md:hidden lg:hidden">
                  Welcome, {user?.firstname || "User"}
                </span>
                <Button
                  label="Logout"
                  onClick={handleLogout}
                  variant="secondary"
                  className={`w-20 ${mobileButtonClassName}`}
                  ariaLabel="Logout"
                />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  label="Login"
                  onClick={handleLoginClick}
                  variant="secondary"
                  className={`w-20 ${mobileButtonClassName}`}
                  ariaLabel="Login"
                />
                <Button
                  label="Sign Up"
                  onClick={handleSignUpClick}
                  variant="primary"
                  className={`w-24 ${mobileButtonClassName}`}
                  ariaLabel="Sign Up"
                />
              </div>
            )}
            <Navbar
              navLinks={[
                ...updatedNavLinks.map(({ label, scrollTo, link }) => ({
                  label,
                  onClick: () => {
                    if (scrollTo) {
                      const target = document.getElementById(scrollTo);
                      if (target) {
                        target.scrollIntoView({ behavior: "smooth" });
                      }
                    }
                  },
                })),
                ...(isAuthenticated
                  ? [
                      ...(user?.globalRole === "ADMIN"
                        ? [
                            {
                              label: "Admin Panel",
                              onClick: handleAdminClick,
                            },
                          ]
                        : []),
                      {
                        label: "Logout",
                        onClick: handleLogout,
                        isButton: true,
                      },
                    ]
                  : [
                      {
                        label: "Login",
                        onClick: handleLoginClick,
                        isButton: true,
                      },
                      {
                        label: "Sign Up",
                        onClick: handleSignUpClick,
                        isButton: true,
                      },
                    ]),
              ]}
              logoSrc="/AlikoLogo.svg"
              drawerClassName="fixed top-0 right-0 h-screen w-full max-w-sm bg-gray-100 text-gray-900 shadow-xl z-50"
              menuIconClassName="text-4xl text-black"
              closeIconClassName="text-3xl text-white"
              {...navbarProps}
            />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
