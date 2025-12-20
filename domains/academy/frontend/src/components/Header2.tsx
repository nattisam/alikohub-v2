import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
const Header = ({
  currentSection,
  className,
  stickyHeaderClassName,
  navClassName,
  linkGroupClassName,
  hideLogo = false,
}: {
  currentSection: string | null;
  className?: string;
  stickyHeaderClassName?: string;
  navClassName?: string;
  linkGroupClassName?: string;
  hideLogo?: boolean;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []); 
  return (
    <>
      <header
        className={`bg-[#333333] text-white flex justify-between h-12 items-center pt-0 px-4 max-md:hidden ${
          className ?? ""
        }`}
      >
        <nav
          className="gap-10 flex justify-between items-center"
          aria-label="Top bar navigation"
        >
          <Link to="/" className="flex items-center mr-4">
            <MdEmail style={{ fontSize: "20px", marginRight: "8px" }} />
            info@alikohub.com
          </Link>
          <Link to="/" className="flex items-center  mr-4 text-sm">
            <FaPhone style={{ fontSize: "20px", marginRight: "8px" }} />
            +251 123 456 789
          </Link>
          <Link to="/" className="flex items-center text-sm ">
            <FaPhone style={{ fontSize: "20px", marginRight: "8px" }} />
            +251 123 456 789
          </Link>
          <select
            name="language"
            id="lang"
            aria-label="Select language"
            className="bg-white rounded-4xl text-[#444444] px-4 py-2 w-18 text-xs h-8 ml-132"
          >
            <option value="en" className="">
              English
            </option>
            <option value="fr" className="">
              French
            </option>
            <option value="sw" className="">
              Swahili
            </option>
          </select>
        </nav>
      </header>
      <header
        className={`sticky top-0 w-auto h-20 z-50 flex justify-between px-2 items-center max-md:h-14 font-sans transition-all duration-300 backdrop-blur-3xl shadow-2xl ${
          isScrolled ? "bg-white" : "bg-[#C9E4FA]"
        } ${stickyHeaderClassName ?? ""}`}
      >
        <nav
          className={`flex items-center w-full gap-x-32 ${navClassName ?? ""}`}
          aria-label="Main navigation"
        >
          <div className="mr-6">
            {!hideLogo && (
              <div className="mr-6">
                <img
                  src="/AlikoLogo.svg"
                  className="h-full ml-20"
                  alt="AlikoHub logo"
                />
              </div>
            )}
          </div>

          <div
            className={`text-black max-md:hidden flex gap-x-28 items-center w-full ${
              linkGroupClassName ?? ""
            }`}
          >
            <img
              src="/AlikoLogo.svg"
              alt="AlikoHub logo"
              className="absolute -top-4 left-10 z-50 h-20 w-auto"
            />
            <Link
              to="/"
              state={{ scrollTo: "top" }}
              className={`text-xl font-semibold hover:underline hover:decoration-blue-500 ${
                currentSection === "home" ? "underline decoration-blue-800" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/"
              state={{ scrollTo: "about" }}
              className={`text-xl font-semibold hover:underline hover:decoration-blue-500 ${
                currentSection === "about"
                  ? "underline decoration-blue-800"
                  : ""
              }`}
            >
              About
            </Link>
            <Link
              to="/"
              state={{ scrollTo: "contact-us" }}
              className={`text-xl font-semibold hover:underline hover:decoration-blue-500 ${
                currentSection === "contactUs"
                  ? "underline decoration-blue-800"
                  : ""
              }`}
            >
              Contact
            </Link>
            <Link
              to="/"
              className={`text-xl font-semibold hover:underline hover:decoration-blue-500 ${
                currentSection === "" ? "underline decoration-blue-800" : ""
              }`}
            >
              Careers
            </Link>
            <button
              className="bg-gradient-to-r from-[#E6D600] to-[#F2F296] text-black px-4 py-2 rounded-4xl hover:bg-[#f6a731] w-28 text-sm cursor-pointer font-semibold"
              role="button"
              aria-label="sign Up"
            >
              Sign Up
            </button>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
