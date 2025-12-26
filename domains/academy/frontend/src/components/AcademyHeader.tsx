import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBook,
  FaCaretDown,
  FaCog,
  FaTachometerAlt,
} from "react-icons/fa";
import logo from "../assets/logo.svg";

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
  const { logout, refreshProfile } = useAuth();

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
    logout();
    onLogout?.();
    navigate("/");
    onLogoutComplete?.();
  };

  return (
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
                {/* Choose Role button ONLY if no role */}
                {!currentUser.hasSelectedRole && (
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
                <Link to="/auth/login" className="text-sm font-medium">
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2">
              Home
            </Link>
            <Link to="/courses" className="block px-3 py-2">
              <FaBook className="inline mr-2" /> Courses
            </Link>
            <Link to="/about" className="block px-3 py-2">
              About
            </Link>
            <Link to="/contact" className="block px-3 py-2">
              Contact
            </Link>

            {currentUser && (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-red-600"
              >
                <FaSignOutAlt className="inline mr-2" /> Sign out
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default AcademyHeader;
