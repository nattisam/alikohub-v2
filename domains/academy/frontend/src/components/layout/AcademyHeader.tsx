import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBook,
  FaCaretDown,
  FaCog,
  FaTachometerAlt,
  FaGraduationCap,
} from "react-icons/fa";
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
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }

    if (onLogoutComplete) {
      onLogoutComplete();
    } else {
      navigate("/");
    }
  };

  return (
    <>
      {/* ===== Academic Animated Background ===== */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        {/* Left Floating Book */}
        <div
          className="absolute left-10 top-32 opacity-10 text-blue-600"
          style={{
            animation: "floatAnimation 10s ease-in-out infinite",
          }}
        >
          <FaBook size={120} />
        </div>

        {/* Right Floating Graduation Cap */}
        <div
          className="absolute right-16 bottom-32 opacity-10 text-purple-600"
          style={{
            animation: "floatAnimation 12s ease-in-out infinite",
          }}
        >
          <FaGraduationCap size={140} />
        </div>

        {/* Soft Blur Left */}
        <div
          className="absolute -left-32 top-40 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20"
          style={{
            animation: "pulseAnimation 8s ease-in-out infinite",
          }}
        />

        {/* Soft Blur Right */}
        <div
          className="absolute -right-32 bottom-40 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20"
          style={{
            animation: "pulseAnimation 10s ease-in-out infinite",
          }}
        />

        {/* Keyframes */}
        <style>
          {`
            @keyframes floatAnimation {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
              100% { transform: translateY(0px); }
            }

            @keyframes pulseAnimation {
              0% { opacity: 0.2; }
              50% { opacity: 0.35; }
              100% { opacity: 0.2; }
            }
          `}
        </style>
      </div>

      {/* ===== Original Header ===== */}
      <header className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img className="h-8 w-auto" src={logo} alt="AlikoHub Academy" />
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
                  } px-3 py-2 rounded-md text-sm font-medium`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center">
              {currentUser ? (
                <>
                  {currentUser.globalRole === "ADMIN" && (
                    <Link
                      to="/admin"
                      className="mr-4 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md"
                    >
                      Admin Panel
                    </Link>
                  )}

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
                      className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-2 py-1"
                    >
                      {currentUser.profilePicture ? (
                        <img
                          src={currentUser.profilePicture}
                          className="h-8 w-8 rounded-full"
                          alt="Profile"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <FaUser className="text-gray-600" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {currentUser.firstname}
                      </span>
                      <FaCaretDown />
                    </button>

                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                        <Link
                          to="/dashboard"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          <FaTachometerAlt className="mr-2" /> Dashboard
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          <FaUser className="mr-2" /> Profile
                        </Link>

                        <Link
                          to="/settings"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          <FaCog className="mr-2" /> Settings
                        </Link>

                        <hr />

                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <FaSignOutAlt className="mr-2" /> Sign out
                        </button>
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
                className="md:hidden ml-4"
              >
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default AcademyHeader;
