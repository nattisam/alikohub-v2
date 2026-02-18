import { Link, NavLink } from "react-router-dom";
import { LogIn, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth, useHasRole } from "../context/auth-context";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const isAdmin = useHasRole("ADMIN");
  const isCM = useHasRole("CONTENT_MANAGER");

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm transition ${
      isActive ? "text-blue-500" : "text-gray-300 hover:text-white"
    }`;

  const dashboardPath = isAdmin ? "/admin" : isCM ? "/content-manager" : "/";

  return (
    <nav className="bg-[#0b1620] text-white px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="font-semibold text-lg">
          AlikoHub
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/events" className={linkClass}>
            Events
          </NavLink>
          <NavLink to="/news" className={linkClass}>
            News & Announcements
          </NavLink>
          <NavLink to="/promotion-request" className={linkClass}>
            Promotion Request
          </NavLink>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex gap-3 items-center">
          {isAuthenticated ? (
            <>
              <Link
                to={dashboardPath}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-blue-600 hover:bg-blue-700 transition font-bold"
              >
                <LayoutDashboard size={16} />{" "}
                {isAdmin ? "Admin Panel" : "Dashboard"}
              </Link>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-white transition p-2"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-gray-600 hover:border-white transition"
            >
              <LogIn size={16} /> Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-4 space-y-2 bg-[#02080f] rounded-xl p-4 border border-white/5 shadow-2xl">
          <NavLink onClick={() => setOpen(false)} to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink
            onClick={() => setOpen(false)}
            to="/events"
            className={linkClass}
          >
            Events
          </NavLink>
          <NavLink
            onClick={() => setOpen(false)}
            to="/news"
            className={linkClass}
          >
            News & Announcements
          </NavLink>
          <NavLink
            onClick={() => setOpen(false)}
            to="/promotion-request"
            className={linkClass}
          >
            Promotion Request
          </NavLink>

          <div className="pt-4 mt-4 border-t border-white/10 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  onClick={() => setOpen(false)}
                  to={dashboardPath}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm rounded-xl bg-blue-600 text-white font-bold"
                >
                  <LayoutDashboard size={18} />{" "}
                  {isAdmin ? "Admin Panel" : "Dashboard"}
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm rounded-xl border border-gray-800 text-gray-400"
                >
                  <LogOut size={18} /> Log Out
                </button>
              </>
            ) : (
              <Link
                onClick={() => setOpen(false)}
                to="/login"
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm rounded-xl bg-white text-black font-bold"
              >
                <LogIn size={18} /> Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
