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

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout, setRoleModalOpen } = useAuth();

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
    else navigate("/");
  };

  const academyRole =
    currentUser?.academyActiveRole || currentUser?.academyUser?.activeRole;
  const dashboardPath =
    currentUser?.globalRole === "ADMIN"
      ? "/admin"
      : academyRole === "INSTRUCTOR"
        ? "/instructor"
        : "/student-dashboard";

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-300 shadow-md">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              className="h-12 w-auto transition hover:opacity-90 grayscale brightness-0"
              src={logo}
              alt="AlikoHub Academy"
              style={{ filter: "none" }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-12">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/courses", label: "Courses" },
              { to: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`relative text-base font-medium transition ${
                  currentTab === item.to
                    ? "text-sky-600"
                    : "text-slate-600 hover:text-sky-600"
                }`}
              >
                {item.label}
                {currentTab === item.to && (
                  <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-sky-600 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                {/* Admin Panel */}
                {currentUser.globalRole === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="mr-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-5 h-10 rounded-full flex items-center transition shadow-sm"
                  >
                    Admin Panel
                  </Link>
                )}

                {/* Choose Role */}
                {!currentUser.hasSelectedRole &&
                  currentUser.globalRole !== "ADMIN" && (
                    <button
                      onClick={() => setRoleModalOpen(true)}
                      className="bg-sky-600 hover:bg-sky-700 text-white px-5 h-10 rounded-full text-sm font-medium flex items-center justify-center shadow-md transition-all active:scale-95"
                    >
                      Choose Role
                    </button>
                  )}

                {/* Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 hover:bg-slate-100 transition shadow-sm"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {currentUser.firstname?.[0] || "A"}
                      {currentUser.lastname?.[0] || "U"}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-slate-700">
                      {currentUser.firstname}
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm text-slate-900 font-semibold truncate">
                          {currentUser.email}
                        </p>
                      </div>

                      {/* Dashboard */}
                      {(currentUser.hasSelectedRole ||
                        currentUser.globalRole === "ADMIN") && (
                        <Link
                          to={dashboardPath}
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition"
                        >
                          <LayoutDashboard className="h-4 w-4 text-slate-400" />
                          Dashboard
                        </Link>
                      )}

                      {/* Profile */}
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition"
                      >
                        <User className="h-4 w-4 text-slate-400" />
                        Profile
                      </Link>

                      {/* Sign out */}
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-8">
                <Link
                  to="/auth/login"
                  className="text-base font-medium text-slate-600 hover:text-sky-600 transition"
                >
                  Login
                </Link>

                <button
                  onClick={onSignUpClick}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden animate-in slide-in-from-top-2">
            {[
              { to: "/", label: "Home" },
              { to: "/courses", label: "Courses" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className="block px-5 py-4 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-sky-600"
              >
                {item.label}
              </Link>
            ))}

            {currentUser && (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-5 py-4 text-sm font-medium text-red-500 hover:bg-red-50"
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
