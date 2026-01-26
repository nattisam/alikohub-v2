import { useState } from "react";
import { useAuth, useHasRole } from '../context/auth-context';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const isAdmin = useHasRole('ADMIN');
  const isContentManager = useHasRole('CONTENT_MANAGER');
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLoginClick = () => {
    navigate('/login');
    setIsOpen(false);
  };

  const handleCreateEventClick = () => {
    navigate('/events/create');
    setIsOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="text-2xl font-bold text-blue-400 cursor-pointer"
            onClick={() => navigate('/')}
          >
            Aliko Events
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className={`hover:text-blue-300 transition ${isActive('/') ? 'text-blue-400' : ''}`}
            >
              Home
            </a>
            <a
              href="/events"
              className={`hover:text-blue-300 transition ${isActive('/events') ? 'text-blue-400' : ''}`}
            >
              Events
            </a>
            <a
              href="/news"
              className={`hover:text-blue-300 transition ${isActive('/news') ? 'text-blue-400' : ''}`}
            >
              News & Announcements
            </a>
            <a
              href="/promotion-request"
              className={`hover:text-blue-300 transition ${isActive('/promotion-request') ? 'text-blue-400' : ''}`}
            >
              Promotion Request
            </a>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {isContentManager && (
                  <button
                    onClick={handleCreateEventClick}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
                  >
                    Create Post
                  </button>
                )}
                
                {(isAdmin || isContentManager) && (
                  <div className="flex space-x-2">
                    {isContentManager && (
                      <a
                        href="/content-manager"
                        className={`px-3 py-1 rounded text-sm transition ${
                          isActive('/content-manager') 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        Content Manager
                      </a>
                    )}
                    {isAdmin && (
                      <a
                        href="/admin"
                        className={`px-3 py-1 rounded text-sm transition ${
                          isActive('/admin') 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        Admin
                      </a>
                    )}
                  </div>
                )}
                
                <span className="text-sm">Hi, {user?.email || 'User'}</span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-gray-800 rounded-lg mt-2 p-4">
            <div className="flex flex-col space-y-4">
              <a
                href="/"
                className={`py-2 ${isActive('/') ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </a>
              <a
                href="/events"
                className={`py-2 ${isActive('/events') ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setIsOpen(false)}
              >
                Events
              </a>
              <a
                href="/news"
                className={`py-2 ${isActive('/news') ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setIsOpen(false)}
              >
                News & Announcements
              </a>
              <a
                href="/promotion-request"
                className={`py-2 ${isActive('/promotion-request') ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setIsOpen(false)}
              >
                Promotion Request
              </a>
              
              {isAuthenticated ? (
                <>
                  {isContentManager && (
                    <button
                      onClick={handleCreateEventClick}
                      className="text-left text-green-400 hover:text-green-300 py-2"
                    >
                      Create Post
                    </button>
                  )}
                  
                  {(isAdmin || isContentManager) && (
                    <div className="flex flex-col space-y-2 pt-2 border-t border-gray-700">
                      {isContentManager && (
                        <a
                          href="/content-manager"
                          className={`py-2 px-3 rounded ${
                            isActive('/content-manager') 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          Content Manager
                        </a>
                      )}
                      {isAdmin && (
                        <a
                          href="/admin"
                          className={`py-2 px-3 rounded ${
                            isActive('/admin') 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          Admin Dashboard
                        </a>
                      )}
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-gray-700">
                    <div className="text-gray-400 text-sm mb-2">
                      Hi, {user?.email || 'User'}
                    </div>
                    <button
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export { Navbar };