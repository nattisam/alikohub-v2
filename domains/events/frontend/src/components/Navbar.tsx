import { useEffect, useState } from "react";
import { FaX } from "react-icons/fa6";
import { FiMenu } from "react-icons/fi";
import { useAuth, useIsOrganizer } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const isOrganizer = useIsOrganizer();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [winWidth, setWinWidth] = useState(window.innerWidth);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [path, setPath] = useState(window.location.pathname);
  
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    setPath(window.location.pathname);
    
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWinWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  const handleSignupClick = () => {
    navigate('/signup');
  };
  
  const handleCreateEventClick = () => {
    navigate('/events/create');
  };

  return (
    <nav className={`flex justify-between items-center px-8 py-2 bg-[#020912]${!isScrolled ? "/50" : ""} sticky top-0 z-20`}>
      <img
        src="./AlikoLogo.svg"
        alt="Company Logo"
        className="h-11 md:w-fit md:h-full"
      />

      {winWidth > 768 && (
        <div className="md:flex justify-between w-1/2">
          <ul className="md:flex md:items-center md:space-x-6">
            <li>
              <a
                href="/"
                className={`${path === "/" ? "text-blue-500" : "text-white"} hover:text-blue-300 hover:underline hover:underline-offset-8 decoration-4 decoration-blue-300 font-bold px-3 transition`}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/news"
                className={`${path === "/news" ? "text-blue-500" : "text-white"} hover:text-blue-300 hover:underline hover:underline-offset-8 decoration-4 decoration-blue-300 font-bold px-3 transition`}
              >
                News
              </a>
            </li>
            <li>
              <a
                href="/conferences"
                className={`${path === "/conferences" ? "text-blue-500" : "text-white"} hover:text-blue-300 hover:underline hover:underline-offset-8 decoration-4 decoration-blue-300 font-bold px-3 transition`}
              >
                Conferences
              </a>
            </li>
            <li>
              <a
                href="/events"
                className={` ${path === "/events" ? "text-blue-500" : "text-white"} hover:text-blue-300 hover:underline hover:underline-offset-8 decoration-4 decoration-blue-300 font-bold px-3 transition`}
              >
                Events
              </a>
            </li>
          </ul>
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {isOrganizer && (
                <button
                  onClick={handleCreateEventClick}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
                >
                  Create Event
                </button>
              )}
              {isOrganizer && (
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
                >
                  Admin
                </button>
              )}
              <span className="text-white text-sm">Hi, {user?.name || 'User'}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={handleSignupClick}
              className="bg-gradient-to-r from-[#E6D600] to-[#F2F296] text-black px-4 py-2 rounded hover:bg-yellow-300 transition"
            >
              Sign Up
            </button>
          )}
        </div>
      )}
      {winWidth <= 768 &&
        (isOpen ? (
          <div className="absolute right-0 top-0 p-5 w-3/5 rounded-b-2xl  z-10 bg-blue-500">
            <button
              className="absolute right-5  top-3"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              <FaX className="text-lg" color="white" />
            </button>
            <ul className="flex flex-col md:flex-row md:space-x-6 mb-2 divide-gray-500 divide-y-2">
              <li className="py-2" onClick={() => setIsOpen(!isOpen)}>
                <a
                  href="/"
                  className="text-cyan-100 hover:text-blue-300 transition"
                >
                  Home
                </a>
              </li>
              <li className="py-2">
                <a
                  href="/news"
                  className="text-cyan-100 hover:text-blue-300 transition"
                >
                  News
                </a>
              </li>
              <li className="py-2">
                <a
                  href="/conferences"
                  className="text-cyan-100 hover:text-blue-300 transition"
                >
                  Conferences
                </a>
              </li>
              <li className="py-2">
                <a
                  href="/events"
                  className="text-cyan-100 hover:text-blue-300 transition"
                >
                  Events
                </a>
              </li>
            </ul>
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                {isOrganizer && (
                  <button
                    onClick={() => { handleCreateEventClick(); setIsOpen(false); }}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
                  >
                    Create Event
                  </button>
                )}
                <span className="text-cyan-100 text-sm">Hi, {user?.name || 'User'}</span>
                {isOrganizer && (
                  <button
                    onClick={() => { setIsAdminOpen(true); setIsOpen(false); }}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
                  >
                    Admin Dashboard
                  </button>
                )}
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { handleSignupClick(); setIsOpen(false); }}
                className="bg-gradient-to-r from-[#E6D600] to-[#F2F296] text-black px-4 py-2 rounded hover:bg-yellow-300 transition"
              >
                Sign Up
              </button>
            )}
          </div>
        ) : (
          <button onClick={() => setIsOpen(!isOpen)}>
            <FiMenu
              size={40}
              className="text-yellow-400 hover:text-yellow-300 transition"
            />
          </button>
        ))}

      {/* Admin Dashboard Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </nav>
  );
};

export default Navbar;