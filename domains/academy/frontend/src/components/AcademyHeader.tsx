import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaBook } from "react-icons/fa";
import logo from "../assets/logo.svg";

interface AcademyHeaderProps {
  currentTab: string;
  onSignUpClick?: () => void;
}

const AcademyHeader: React.FC<AcademyHeaderProps> = ({
  currentTab,
  onSignUpClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="AlikoHub Academy" className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`${
                currentTab === "/"
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              } px-3 py-2 text-sm font-medium`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`${
                currentTab === "/about"
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              } px-3 py-2 text-sm font-medium`}
            >
              About
            </Link>
            <Link
              to="/courses"
              className={`${
                currentTab === "/courses"
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              } px-3 py-2 text-sm font-medium flex items-center`}
            >
              <FaBook className="mr-1" />
              Courses
            </Link>
            <Link
              to="/contact"
              className={`${
                currentTab === "/contact"
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              } px-3 py-2 text-sm font-medium`}
            >
              Contact
            </Link>
          </nav>

          {/* Auth CTA (UI only) */}
          <div className="hidden md:flex space-x-4">
            <button
              onClick={() => navigate("/auth/login")}
              className="text-gray-700 hover:text-blue-600 text-sm font-medium"
            >
              Login
            </button>
            <button
              onClick={onSignUpClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden px-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-gray-700">
              Home
            </Link>
            <Link to="/courses" className="block px-3 py-2 text-gray-700">
              Courses
            </Link>
            <Link to="/about" className="block px-3 py-2 text-gray-700">
              About
            </Link>
            <Link to="/contact" className="block px-3 py-2 text-gray-700">
              Contact
            </Link>
            <button
              onClick={() => navigate("/auth/login")}
              className="block w-full text-left px-3 py-2 text-gray-700"
            >
              Login
            </button>
            <button
              onClick={onSignUpClick}
              className="block w-full text-left px-3 py-2 text-blue-600 font-semibold"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AcademyHeader;
