import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { FaUser, FaChalkboardTeacher, FaGraduationCap, FaSignOutAlt, FaBars, FaTimes, FaBook } from "react-icons/fa";
import logo from "../assets/logo.svg";
import type { ExtendedUser } from "../contexts/UserContext";

interface AcademyHeaderProps {
  currentTab: string;
  currentUser?: ExtendedUser;
  onSignUpClick?: () => void;
  onUserAvatarClick?: () => void;
  onLogout?: () => void;
  onLogoutComplete?: () => void;
}

const AcademyHeader: React.FC<AcademyHeaderProps> = ({
  currentTab,
  currentUser,
  onSignUpClick,
  onUserAvatarClick,
  onLogout,
  onLogoutComplete,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUser();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = async () => {
    console.log('AcademyHeader: handleLogout called');
    // Close the profile menu
    setIsProfileMenuOpen(false);
    
    // Call the logout function from context
    logout();
    
    // Call the onLogout callback if provided
    if (onLogout) {
      onLogout();
    }
    
    // Navigate to home page
    navigate("/");
    
    // Call the onLogoutComplete callback if provided
    if (onLogoutComplete) {
      onLogoutComplete();
    }
  };

  const handleProfileClick = () => {
    // Close the profile menu
    setIsProfileMenuOpen(false);
    
    // Navigate to the appropriate profile page based on user role
    if (currentUser?.academyRole === 'INSTRUCTOR' || currentUser?.academyRole === 'ADMIN') {
      navigate("/instructor/profile");
    } else {
      navigate("/dashboard/profile");
    }
  };

  const handleDashboardClick = () => {
    // Navigate to the appropriate dashboard based on user role
    if (currentUser?.academyRole === 'INSTRUCTOR' || currentUser?.academyRole === 'ADMIN') {
      navigate("/instructor");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img className="h-8 w-auto" src={logo} alt="AlikoHub Academy" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`${
                currentTab === "/" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
              } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`${
                currentTab === "/about" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
              } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              About
            </Link>
            <Link
              to="/courses"
              className={`${
                currentTab === "/courses" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
              } px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center`}
            >
              Courses
            </Link>
            
            <Link
              to="/contact"
              className={`${
                currentTab === "/contact" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
              } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              Contact
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  {currentUser.profilePicture ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={currentUser.profilePicture}
                      alt="Profile"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <FaUser className="h-4 w-4 text-gray-600" />
                    </div>
                  )}
                  <span className="ml-2 hidden md:block text-sm font-medium text-gray-700">
                    {currentUser.firstname}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <button
                      onClick={handleDashboardClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaChalkboardTeacher className="inline mr-2" />
                      {currentUser.academyRole === 'INSTRUCTOR' || currentUser.academyRole === 'ADMIN' 
                        ? "Instructor Dashboard" 
                        : "Student Dashboard"}
                    </button>
                    <button
                      onClick={handleProfileClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaUser className="inline mr-2" />
                      Your Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="inline mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/auth/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <button
                  onClick={onSignUpClick}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className={`${
                  currentTab === "/" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                } block px-3 py-2 rounded-md text-base font-medium`}
              >
                Home
              </Link>
              <Link
                to="/courses"
                className={`${
                  currentTab === "/courses" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                } block px-3 py-2 rounded-md text-base font-medium flex items-center`}
              >
                <FaBook className="mr-2" />
                Courses
              </Link>
              <Link
                to="/about"
                className={`${
                  currentTab === "/about" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                } block px-3 py-2 rounded-md text-base font-medium`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`${
                  currentTab === "/contact" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                } block px-3 py-2 rounded-md text-base font-medium`}
              >
                Contact
              </Link>
              {currentUser && (
                <>
                  <button
                    onClick={handleDashboardClick}
                    className="w-full text-left text-gray-700 hover:bg-gray-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    {currentUser.academyRole === 'INSTRUCTOR' || currentUser.academyRole === 'ADMIN' 
                      ? "Instructor Dashboard" 
                      : "Student Dashboard"}
                  </button>
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left text-gray-700 hover:bg-gray-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Your Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-gray-700 hover:bg-gray-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Sign out
                  </button>
                </>
              )}
              {!currentUser && (
                <>
                  <Link
                    to="/auth/login"
                    className="text-gray-700 hover:bg-gray-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Login
                  </Link>
                  <button
                    onClick={onSignUpClick}
                    className="w-full text-left text-gray-700 hover:bg-gray-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AcademyHeader;