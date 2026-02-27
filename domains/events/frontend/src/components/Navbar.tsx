import { Link, NavLink } from "react-router-dom";
import { LogIn, Menu, UserPlus, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-md text-sm transition ${
      isActive ? "text-blue-500" : "text-gray-300 hover:text-white"
    }`;

  return (
    <nav className="bg-[#0b1620] text-white px-6 py-4 relative z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="font-semibold text-lg">
          AlikoHub
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/events" className={linkClass}>Events</NavLink>
          <NavLink to="/news" className={linkClass}>News & Announcements</NavLink>
          <NavLink to="/promotion-request" className={linkClass}>Promotion Request</NavLink>
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-gray-600 hover:border-white transition">
            <LogIn size={16} /> Sign In
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-blue-600 hover:bg-blue-700 transition">
            <UserPlus size={16} /> Register
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden z-50"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {open && (
        <div className="fixed inset-0 bg-black/50 md:hidden">
          {/* MOBILE MENU */}
          <div
            ref={menuRef}
            className="
              bg-[#02080f]
              w-full
              mt-16
              rounded-b-xl
              p-5
              space-y-2
            "
          >
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/events" className={linkClass}>Events</NavLink>
            <NavLink to="/news" className={linkClass}>News & Announcements</NavLink>
            <NavLink to="/promotion-request" className={linkClass}>
              Promotion Request
            </NavLink>

            <hr className="border-gray-700 my-3" />

            <button className="flex items-center gap-2 px-4 py-2 w-full text-sm rounded-md border border-gray-600 hover:border-white transition">
              <LogIn size={16} /> Sign In
            </button>

            <button className="flex items-center gap-2 px-4 py-2 w-full text-sm rounded-md bg-blue-600 hover:bg-blue-700 transition">
              <UserPlus size={16} /> Register
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}              