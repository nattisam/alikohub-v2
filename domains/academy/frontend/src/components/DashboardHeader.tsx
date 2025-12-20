import { useState, useEffect } from "react";
import { FaSearch, FaChevronDown, FaBars, FaUser } from "react-icons/fa";
import avatarProfile from "../assets/student2.png";
import { useUser } from "../hooks/useUser";
import type { Language } from "./types.d";
import { FiMenu } from "react-icons/fi";

type HeaderProps = {
  logoSrc?: string;
  dashboardLabel?: string;
  avatarSrc?: string;
  stickyBgDefault?: string;
  stickyBgScrolled?: string;
  onAvatarClick: () => void;
  onMenu:()=>void;
};

const DashboardHeader: React.FC<HeaderProps> = ({
  logoSrc = "/AlikoLogo.svg",
  dashboardLabel = "Dashboard",
  avatarSrc = avatarProfile,
  stickyBgDefault = "bg-transparent",
  stickyBgScrolled = "bg-white shadow-md",
  onAvatarClick,
  onMenu
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage } = useUser();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? stickyBgScrolled : stickyBgDefault
      }`}
    >
      <div className="mx-auto flex items-center justify-between px-4 md:px-8 py-4 md:py-6 bg-[#F3F4F6]">
        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={onMenu}><FiMenu size={25} /></button>
          <img src={logoSrc} alt="Logo" className="h-10 md:h-14 w-auto" />
          <a
            href="/dashboard"
            className="text-md md:text-xl font-bold relative inline-block hover:after:block after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0E76C0] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
          >
            {dashboardLabel}
          </a>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4 md:gap-6">
            <FaSearch className="text-xl cursor-pointer" />
            <span className="flex items-center text-sm md:text-md font-medium cursor-pointer gap-1">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
              >
                <option value={"En"}>English</option>
                <option value={"Amh"}>Amharic</option>
                <option value={"Swahili"}>Swahili</option>
              </select>
            </span>
            <span className="flex items-center text-sm md:text-md font-medium cursor-pointer gap-1">
              Help <FaChevronDown className="text-xs md:text-sm" />
            </span>
            <button
              onClick={onAvatarClick}
              title={
                "See your profile. \n" +
                (avatarSrc
                  ? "your profile picture"
                  : "add your profile picture")
              }
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="User Avatar"
                  className="h-8 md:h-10 w-8 md:w-10 rounded-full object-cover cursor-pointer"
                />
              ) : (
                <FaUser className="text-gray-600 bg-gray-400 w-8 md:w-10 h-8 md:h-10 pt-1 rounded-full" />
              )}
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 py-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 cursor-pointer">
            <FaSearch /> Search
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
            >
              <option value={"En"}>English</option>
              <option value={"Amh"}>Amharic</option>
              <option value={"Swahili"}>Swahili</option>
            </select>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            Help <FaChevronDown />
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src={avatarProfile}
              alt="User Avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
            Profile
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
