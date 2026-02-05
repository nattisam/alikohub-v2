import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Menu,
  X,
  Book,
} from "lucide-react";
import logo from "../../assets/logo.svg";

interface AcademyHeaderProps {
  currentTab: string;
  currentUser?: any;
  onSignUpClick?: () => void;
  onLogout?: () => void;
  onLogoutComplete?: () => void;
}

const AcademyHeader: React.FC<AcademyHeaderProps> = ({
  currentTab,
  currentUser,
  onSignUpClick,
  onLogout,
  onLogoutComplete,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    // Priority to onLogout if provided, otherwise use local logout
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }

    // Priority to onLogoutComplete if provided, otherwise navigate to home
    if (onLogoutComplete) {
      onLogoutComplete();
    } else {
      navigate("/");
    }
  };

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img className="h-12 w-auto" src={logo} alt="AlikoHub Academy" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/courses", label: "Courses" },
              { to: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`${
                  currentTab === item.to
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                } px-3 py-2 rounded-md text-md font-medium`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center">
            {currentUser ? (
              <>
                {/* Admin Panel button for global admin users */}
                {currentUser.globalRole === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="mr-4 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md"
                  >
                    Admin Panel
                  </Link>
                )}

                {/* Choose Role button ONLY if no role and not admin */}
                {!currentUser.hasSelectedRole &&
                  currentUser.globalRole !== "ADMIN" && (
                    <Link
                      to="/role"
                      className="mr-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
                    >
                      Choose Role
                    </Link>
                  )}

                {/* Avatar */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 transition-colors hover:bg-gray-100"
                  >
                    <div className="h-7 w-7 rounded-full bg-[#3E92D1] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {currentUser.firstname?.[0] || "A"}
                      {currentUser.lastname?.[0] || "U"}
                    </div>
                    <span className="hidden text-sm font-medium text-gray-700 sm:inline">
                      {currentUser.firstname}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-xl z-[60]">
                      {!(
                        currentUser.hasSelectedRole ||
                        currentUser.academyUser?.hasSelectedRole ||
                        currentUser.globalRole === "ADMIN"
                      ) ? (
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      ) : (
                        <>
                          <div className="mb-1 border-b border-gray-100 px-4 py-2">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                              Account
                            </p>
                            <p className="truncate text-sm font-medium text-gray-800">
                              {currentUser.email}
                            </p>
                          </div>

                          {(() => {
                            const academyRole =
                              currentUser?.academyActiveRole ||
                              currentUser?.academyUser?.activeRole;
                            const dashboardPath =
                              currentUser?.globalRole === "ADMIN"
                                ? "/admin"
                                : academyRole === "INSTRUCTOR"
                                  ? "/instructor"
                                  : "/student-dashboard";
                            return (
                              <Link
                                to={dashboardPath}
                                onClick={() => setIsProfileDropdownOpen(false)}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                              >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                              </Link>
                            );
                          })()}

                          <Link
                            to="/profile"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          >
                            <User className="h-4 w-4" />
                            Profile
                          </Link>

                          <button
                            onClick={handleLogout}
                            className="mt-1 flex w-full items-center gap-3 border-t border-gray-100 px-4 py-3 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign out
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/auth/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md"
                >
                  Login
                </Link>
                <button
                  onClick={onSignUpClick}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden ml-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2">
              Home
            </Link>
            <Link
              to="/courses"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600"
            >
              <Book className="inline mr-2 h-4 w-4" /> Courses
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600"
            >
              Contact
            </Link>

            {currentUser && (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
              >
                <LogOut className="inline mr-2 h-4 w-4" /> Sign out
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default AcademyHeader;
