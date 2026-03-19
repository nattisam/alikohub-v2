import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import logo from "../../assets/logo.svg";
import { COURSE_LOGOS } from "../../constants/course";

interface AcademyHeaderProps {
  currentTab: string;
  currentUser?: any;
  onSignUpClick?: () => void;
  onLogout?: () => void;
  onLogoutComplete?: () => void;
  customLinks?: { to: string; label: string }[];
}

const AcademyHeader: React.FC<AcademyHeaderProps> = ({
  currentTab,
  currentUser,
  onSignUpClick,
  onLogout,
  onLogoutComplete,
  customLinks,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (onLogout) onLogout();
    else logout();
    if (onLogoutComplete) onLogoutComplete();
  };

  // Logic: Role-based Dashboard Path
  const academyRole =
    currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole;
  const dashboardPath =
    currentUser?.globalRole === "ADMIN"
      ? "/admin"
      : academyRole === "INSTRUCTOR"
        ? "/instructor"
        : "/student-dashboard";

  const navItems = customLinks || [
    { to: "/", label: "Home" },
    { to: "/partnership", label: "Partnership" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  // Logic to determine logo based on category route
  const getLogo = () => {
    const path = location.pathname;
    // Extract category from path /category/:name
    const categoryMatch = path.match(/\/category\/([^/]+)/);
    const category = categoryMatch ? categoryMatch[1] : null;

    if (category && COURSE_LOGOS[category]) {
      return COURSE_LOGOS[category];
    }
    return logo;
  };

  const currentLogo = getLogo();

  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-sm font-sans transition-all duration-300">
      {/* --- Top Banner --- */}
      <div className="bg-[#17469E] py-2.5 text-center">
        <p className="text-white text-xs md:text-[13px] font-normal tracking-wide">
          Are you Ready to Partner??{" "}
          <Link
            to="/partnership"
            className="underline font-bold hover:text-blue-100 transition"
          >
            Become a Partner
          </Link>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2">
            <img
              className="h-12 w-auto transition-all duration-500 hover:scale-105"
              src={currentLogo}
              alt="AlikoHub Academy"
              style={{ filter: "none" }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => {
              const isActive =
                currentTab === item.to ||
                (item.to !== "/" && currentTab.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-[16px] font-semibold transition-colors uppercase tracking-tight ${isActive
                      ? "text-[#F0802D]"
                      : "text-slate-600 hover:text-[#17469E]"
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Auth & Actions */}
          <div className="flex items-center gap-6">
            {currentUser ? (
              <div className="flex items-center gap-4">
                {/* Admin Panel Logic */}
                {currentUser.globalRole === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="hidden lg:flex text-sm font-bold text-white bg-[#17469E] hover:bg-blue-800 px-6 py-2.5 rounded-full transition shadow-md"
                  >
                    Admin Panel
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 hover:bg-slate-100 transition shadow-sm"
                  >
                    <div className="h-8 w-8 rounded-full bg-[#17469E] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {currentUser.firstname?.[0] || "A"}
                      {currentUser.lastname?.[0] || "U"}
                    </div>
                    <span className="hidden sm:inline text-sm font-semibold text-slate-700">
                      {currentUser.firstname}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform ${isProfileDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 shadow-2xl rounded-xl overflow-hidden py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Signed in as
                        </p>
                        <p className="text-sm text-[#17469E] font-bold truncate">
                          {currentUser.email}
                        </p>
                      </div>

                      {/* Dashboard Logic */}
                      {(currentUser.hasSelectedRole ||
                        currentUser.globalRole === "ADMIN") && (
                          <Link
                            to={dashboardPath}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition"
                          >
                            <LayoutDashboard
                              size={16}
                              className="text-[#17469E]"
                            />{" "}
                            Dashboard
                          </Link>
                        )}

                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition"
                      >
                        <User size={16} className="text-[#17469E]" /> Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition border-t border-slate-50 font-bold"
                      >
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Logged Out: Login and Sign Up Flow */
              <div className="flex items-center gap-8">
                <Link
                  to="/auth/login"
                  className="text-base font-bold text-slate-600 hover:text-[#17469E] transition"
                >
                  Login
                </Link>

                <button
                  onClick={onSignUpClick}
                  className="relative group transition-transform active:scale-95"
                >
                  <div className="absolute inset-0 bg-black rounded-full translate-y-1.5 translate-x-0.5 opacity-90" />
                  <div className="relative bg-[#F0802D] text-white px-8 py-2.5 rounded-full font-bold text-sm tracking-wide shadow-inner">
                    Sign Up
                  </div>
                </button>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-600"
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-6 space-y-4 shadow-xl">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsMenuOpen(false)}
              className="block text-xl font-bold text-slate-800 border-b border-slate-50 pb-2"
            >
              {item.label}
            </Link>
          ))}
          {!currentUser && (
            <Link
              to="/auth/login"
              className="block text-xl font-bold text-[#F0802D]"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default AcademyHeader;
