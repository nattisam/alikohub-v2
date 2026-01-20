"use client"
import { Briefcase, BarChart3, FileText, Users } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

interface NavigationProps {
  userRole: "recruiter" | "admin" | "applicant"
}

export function Navigation({ userRole }: NavigationProps) {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(path)
  }

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col">
      {/* Logo / Brand */}
      <div className="p-5 border-b border-gray-200 bg-[#0C69AD]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 shadow-sm">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Aliko Careers</h1>
            <p className="text-xs text-white/80 leading-tight mt-1">
              Talent &amp; opportunities in one place
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-5">
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">
          Overview
        </p>
        <ul className="space-y-2">
          <li>
            <Link
              to="/" 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive("/")
                  ? "bg-[#0C69AD] text-white shadow-md"
                  : "text-gray-600 hover:bg-[#0A5FA0] hover:text-white hover:shadow-sm"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="truncate">Jobs</span>
            </Link>
          </li>
          {userRole === "admin" && (
            <li>
              <Link
                to="/admin"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive("/admin")
                  ? "bg-[#0C69AD] text-white shadow-md"
                  : "text-gray-600 hover:bg-[#0A5FA0] hover:text-white hover:shadow-sm"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="truncate">Admin Dashboard</span>
              </Link>
            </li>
          )}
          {userRole === "recruiter" && (
            <li>
              <Link
                to="/recruiter"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive("/recruiter")
                  ? "bg-[#0C69AD] text-white shadow-md"
                  : "text-gray-600 hover:bg-[#0A5FA0] hover:text-white hover:shadow-sm"
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="truncate">Recruiter Dashboard</span>
              </Link>
            </li>
          )}
          {userRole === "recruiter" && (
            <li>
              <Link
                to="/applications"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive("/applications")
                  ? "bg-[#0C69AD] text-white shadow-md"
                  : "text-gray-600 hover:bg-[#0A5FA0] hover:text-white hover:shadow-sm"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="truncate">Applications</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  )
}