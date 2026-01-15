import { useState, useEffect, useRef } from "react";
import logo from "../assets/AlikoLogo.svg";
import { Link, useNavigate } from "react-router-dom";
import { FiLoader, FiMenu } from "react-icons/fi";
import { FaUser, FaX, FaCaretDown } from "react-icons/fa6";
import { useUser } from "../hooks";

const Header = ({
  navLinks,
  currentPage,
}: {
  navLinks: { label: string; link: string }[];
  currentPage: string;
}) => {
  const { currentUser, verifyingUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [winWidth, setWinWidth] = useState(window.innerWidth);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setMobileDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleWinResize = () => {
      setWinWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleWinResize);

    // Cleanup event listener
    return () => {
      window.removeEventListener("resize", handleWinResize);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  const toggleMobileDropdown = () => {
    setMobileDropdownOpen(!mobileDropdownOpen);
  };
  
  const handleNavigate = (path: string) => {
    navigate(path);
    setDropdownOpen(false);
    setMobileDropdownOpen(false);
    setIsOpen(false);
  };
  
  return (
    <header className="flex items-center justify-around">
      <img src={logo} alt="Alikohub Logo" className="h-10 md:h-fit" />

      {winWidth > 760 ? (
        <div className={`flex items-center`}>
          <nav>
            {navLinks.map(({ label, link }, index) => (
              <Link
                key={index}
                to={link}
                className={`text-2xl font-semibold mx-10 hover:underline hover:decoration-4 hover:decoration-neutral-700 ${currentPage === link
                  ? "underline underline-offset-8 decoration-4 decoration-neutral-950"
                  : ""
                  }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          {verifyingUser ?
            <button className="w-32 py-1 px-3 bg-[#FFC107]/70 text-black  rounded-md hover:bg-[#FFC107]/90 transition duration-300 ">
              <FiLoader className='text-gray-600 text-3xl' />
            </button>
            :
            !currentUser
              ?
              (
                <Link to="/signup">
                  <button className="w-32 py-1 px-3 bg-[#FFC107]/70 text-black  rounded-md hover:bg-[#FFC107]/90 transition duration-300 ">
                    {"Sign Up"}
                  </button>
                </Link>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    className="p-2 bg-[#FFC107]/70 text-black rounded-full hover:bg-[#FFC107]/90 transition duration-300 flex items-center"
                    onClick={toggleDropdown}
                  >
                    {currentUser?.profilePicture ? 
                      <img src={currentUser?.profilePicture} alt="Profile Picture" className="rounded-full w-8 h-8 object-cover mr-2" /> : 
                      <FaUser size={20} className="mr-2" />
                    }
                    <FaCaretDown size={12} />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                      <button 
                        onClick={() => handleNavigate('/dashboard')} 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Dashboard
                      </button>
                      <button 
                        onClick={() => handleNavigate('/profile')} 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Profile
                      </button>
                    </div>
                  )}
                  
                  {/* Show Choose Role button if user hasn't selected a role */}
                  {!currentUser?.hasSelectedRole && (
                    <button 
                      onClick={() => handleNavigate('/role-selection')} 
                      className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                    >
                      Choose Role
                    </button>
                  )}
                </div>
              )}
        </div>
      ) : (
        <button
          className={`${isOpen ? "opacity-0" : "opacity-100"}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <FiMenu size={45} />
        </button>
      )}
      {isOpen && winWidth < 760 && (
        <div className="absolute top-0 right-0 z-10 px-5 py-3 bg-white rounded-b-2xl flex flex-col items-end">
          <button className="relative right-3" onClick={() => setIsOpen(!isOpen)}>
            <FaX size={30} />
          </button>
          <nav className="flex flex-col divide-y-2 self-start">
            {navLinks.map(({ label, link }, index) => (
              <Link
                key={index}
                to={link}
                onClick={() => { setIsOpen(!isOpen) }}
                className={`text-2xl font-semibold px-2 my-2 hover:underline hover:decoration-4 hover:decoration-neutral-700 ${currentPage === link
                  ? "bg-amber-300 rounded-md"
                  : ""
                  }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          {verifyingUser ?
            <button className="w-32 py-1 px-3 bg-[#FFC107]/70 text-black  rounded-md hover:bg-[#FFC107]/90 transition duration-300 ">
              <FiLoader className='text-gray-600 text-3xl' />
            </button>
            : !currentUser ? (
              <Link to="/signup" onClick={() => setIsOpen(!isOpen)}>
                <button className="w-32 mt-5 py-1 px-3 bg-[#FFC107]/70 text-black  rounded-md hover:bg-[#FFC107]/90 transition duration-300 ">
                  Sign Up
                </button>
              </Link>
            ) : (
              <div className="relative" ref={mobileDropdownRef}>
                <button 
                  className="text-2xl font-semibold px-2 my-2 hover:underline hover:decoration-4 hover:decoration-neutral-700 flex items-center"
                  onClick={toggleMobileDropdown}
                >
                  {currentUser?.profilePicture ? 
                    <img src={currentUser?.profilePicture} alt="Profile Picture" className="rounded-full w-8 h-8 object-cover mr-2" /> : 
                    <FaUser size={20} className="mr-2" />
                  }
                  <FaCaretDown size={12} />
                </button>
                
                {mobileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                    <button 
                      onClick={() => handleNavigate('/dashboard')} 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => handleNavigate('/profile')} 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Profile
                    </button>
                  </div>
                )}
                
                {/* Show Choose Role button if user hasn't selected a role */}
                {!currentUser?.hasSelectedRole && (
                  <button 
                    onClick={() => handleNavigate('/role-selection')} 
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 w-full"
                  >
                    Choose Role
                  </button>
                )}
              </div>
            )}
        </div>
      )}
    </header>
  );
};
export default Header;