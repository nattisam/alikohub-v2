import { useState, useEffect, useRef } from "react";
import logo from "../assets/AlikoLogo.svg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiLoader,
  FiMenu,
  FiX,
  FiUser,
  FiLayout,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { FaUser, FaCaretDown } from "react-icons/fa6";
import { useUser } from "../hooks";

const Header = ({
  navLinks,
  currentPage,
}: {
  navLinks: { label: string; link: string }[];
  currentPage: string;
}) => {
  const { currentUser, isLoading, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const getDashboardRoute = () => {
    if (!currentUser) return "/";
    const isGlobalAdmin = currentUser?.globalRole === "ADMIN";
    const userRole = currentUser?.role;
    const isAdmin = isGlobalAdmin || userRole === "ADMIN";

    if (isAdmin) return "/admin";
    if (userRole === "CLIENT") return "/client";
    if (userRole === "CONTRACTOR") return "/contractor";
    return "/";
  };

  const handleLogout = async () => {
    if (logout) {
      await logout();
      navigate("/login");
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setDropdownOpen(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* DESKTOP HEADER - Reduced height, removed text beside logo */}
      <header className="hidden md:flex items-center justify-around py-3 bg-white">
        <Link to="/">
          <img src={logo} alt="Alikohub Logo" className="h-10 md:h-12" />
        </Link>

        <div className="flex items-center">
          <nav>
            {navLinks.map(({ label, link }, index) => (
              <Link
                key={index}
                to={link}
                className={`text-2xl font-semibold mx-10 hover:underline hover:decoration-4 hover:decoration-neutral-700 ${
                  currentPage === link || location.pathname === link
                    ? "underline underline-offset-8 decoration-4 decoration-neutral-950"
                    : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          {isLoading ? (
            <button className="w-32 py-1 px-3 bg-[#FFC107]/70 text-black rounded-md hover:bg-[#FFC107]/90 transition duration-300">
              <FiLoader className="text-gray-600 animate-spin mx-auto text-3xl" />
            </button>
          ) : !currentUser ? (
            <Link to="/login">
              <button className="w-32 py-1 px-3 bg-[#FFC107]/70 text-black rounded-md hover:bg-[#FFC107]/90 transition duration-300 font-semibold">
                Login
              </button>
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                className="p-2 bg-[#FFC107]/70 text-black rounded-full hover:bg-[#FFC107]/90 transition duration-300 flex items-center"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {currentUser?.profilePicture ? (
                  <img
                    src={currentUser?.profilePicture}
                    alt="Profile"
                    className="rounded-full w-8 h-8 object-cover mr-2"
                  />
                ) : (
                  <FaUser size={20} className="mr-2" />
                )}
                <FaCaretDown size={12} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-neutral-50 mb-1">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Account
                    </p>
                    <p className="text-sm font-bold text-neutral-800 truncate">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                  </div>

                  <button
                    onClick={() => handleNavigate(getDashboardRoute())}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-amber-600 transition-colors"
                  >
                    <FiLayout size={18} />
                    <span>Dashboard</span>
                  </button>

                  <button
                    onClick={() => handleNavigate("/profile")}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-amber-600 transition-colors"
                  >
                    <FiSettings size={18} />
                    <span>Settings</span>
                  </button>

                  <div className="h-px bg-neutral-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* MOBILE HEADER - Removed logo text, login moved to menu */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/">
            <img src={logo} alt="Alikohub Logo" className="h-8" />
          </Link>

          <div className="flex items-center gap-3">
            {isLoading && (
              <FiLoader className="animate-spin text-amber-500" size={20} />
            )}

            {currentUser && (
              <Link
                to={getDashboardRoute()}
                className="w-8 h-8 rounded-full overflow-hidden border border-neutral-200"
              >
                {currentUser?.profilePicture ? (
                  <img
                    src={currentUser?.profilePicture}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                    <FiUser size={14} />
                  </div>
                )}
              </Link>
            )}

            <button
              className="p-1 text-neutral-800"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="fixed inset-0 top-[56px] bg-white z-40 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex flex-col p-6 gap-2">
              {navLinks.map(({ label, link }, index) => (
                <Link
                  key={index}
                  to={link}
                  className={`p-4 rounded-xl text-xl font-bold transition-all ${
                    currentPage === link || location.pathname === link
                      ? "bg-amber-50 text-amber-600"
                      : "text-neutral-700"
                  }`}
                >
                  {label}
                </Link>
              ))}

              <div className="h-px bg-neutral-100 my-4"></div>

              {!currentUser ? (
                <Link
                  to="/login"
                  className="w-full py-4 px-6 rounded-xl text-center font-bold bg-amber-400 text-neutral-900 transition-all shadow-sm active:scale-95"
                >
                  Login
                </Link>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to={getDashboardRoute()}
                    className="flex items-center gap-3 p-4 rounded-xl font-bold text-neutral-700"
                  >
                    <FiLayout size={20} /> Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 p-4 rounded-xl font-bold text-neutral-700"
                  >
                    <FiSettings size={20} /> Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-4 rounded-xl font-bold text-red-600 text-left"
                  >
                    <FiLogOut size={20} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed mobile header */}
      <div className="md:hidden h-[56px]"></div>
    </>
  );
};

export default Header;
