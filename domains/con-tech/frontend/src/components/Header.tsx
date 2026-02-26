import { useState, useEffect, useRef } from "react";
import logo from "../assets/AlikoLogo.svg";
import { Link, useNavigate } from "react-router-dom";
import { FiLoader, FiMenu } from "react-icons/fi";
import { FaUser, FaX, FaCaretDown } from "react-icons/fa6";
import { useUser } from "../hooks";

const Header = ({
  navLinks,
  currentPage,
}: {
  navLinks: { label: string; link: string }[];
  currentPage: string;
}) => {
  const { currentUser, verifyingUser } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [winWidth, setWinWidth] = useState(window.innerWidth);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target as Node)
      ) {
        setMobileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => setWinWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    setDropdownOpen(false);
    setMobileDropdownOpen(false);
    setIsOpen(false);
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white shadow-md relative z-50">
      <img src={logo} alt="Alikohub Logo" className="h-10" />

      {/* DESKTOP NAV */}
      {winWidth > 760 ? (
        <div className="flex items-center">
          <nav>
            {navLinks.map(({ label, link }, index) => (
              <Link
                key={index}
                to={link}
                className={`text-2xl font-semibold mx-8
                  hover:underline hover:decoration-4 hover:decoration-yellow-400 transition
                  ${currentPage === link ? "underline decoration-neutral-950" : ""}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {verifyingUser ? (
            <FiLoader className="text-3xl ml-4 animate-spin" />
          ) : !currentUser ? (
            <Link to="/signup">
              <button className="ml-4 px-4 py-2 bg-yellow-300/80 hover:bg-yellow-300 transition">
                Sign Up
              </button>
            </Link>
          ) : (
            <div className="relative ml-4" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-yellow-100 transition"
              >
                {currentUser.profilePicture ? (
                  <img
                    src={currentUser.profilePicture}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <FaUser />
                )}
                <FaCaretDown />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow">
                  <button
                    onClick={() => handleNavigate("/dashboard")}
                    className="w-full px-4 py-3 text-left hover:bg-yellow-100 transition"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleNavigate("/profile")}
                    className="w-full px-4 py-3 text-left hover:bg-yellow-100 transition"
                  >
                    Profile
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        // MOBILE MENU BUTTON
        <button onClick={() => setIsOpen(true)}>
          <FiMenu size={36} />
        </button>
      )}

      {/* MOBILE TOP DROPDOWN */}
      {isOpen && winWidth < 760 && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          {/* TOP NAVBAR CONTAINER */}
          <div className="w-full bg-white px-4 pt-4 shadow-md relative">
            {/* CLOSE BUTTON */}
            <button
              className="absolute right-4 top-4 p-2 hover:bg-yellow-100 transition"
              onClick={() => setIsOpen(false)}
            >
              <FaX size={26} />
            </button>

            {/* NAV LINKS DROPPED LOWER */}
            <nav className="flex flex-col gap-3 mt-10">
              {navLinks.map(({ label, link }, index) => (
                <Link
                  key={index}
                  to={link}
                  onClick={() => setIsOpen(false)}
                  className={`w-full px-4 py-3 text-lg font-semibold
                    hover:bg-yellow-100 active:bg-yellow-200 transition
                    ${currentPage === link ? "bg-amber-300" : ""}`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* SIGN UP / ACCOUNT SPACING */}
            {!currentUser ? (
              <Link to="/signup" onClick={() => setIsOpen(false)}>
                <button className="w-full mt-6 py-3 bg-yellow-300/80 hover:bg-yellow-300 transition">
                  Sign Up
                </button>
              </Link>
            ) : (
              <div className="mt-6 pb-4" ref={mobileDropdownRef}>
                <button
                  onClick={() =>
                    setMobileDropdownOpen(!mobileDropdownOpen)
                  }
                  className="w-full flex items-center gap-3 px-4 py-3
                             hover:bg-yellow-100 active:bg-yellow-200 transition"
                >
                  <FaUser />
                  Account
                  <FaCaretDown className="ml-auto" />
                </button>

                {mobileDropdownOpen && (
                  <div className="mt-2 bg-gray-50">
                    <button
                      onClick={() => handleNavigate("/dashboard")}
                      className="w-full px-4 py-3 text-left hover:bg-yellow-100 transition"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => handleNavigate("/profile")}
                      className="w-full px-4 py-3 text-left hover:bg-yellow-100 transition"
                    >
                      Profile
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
