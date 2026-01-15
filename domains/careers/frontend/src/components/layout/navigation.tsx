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
    <aside className="hidden md:flex w-64 bg-white/80 ring-1 ring-black/5 shadow-sm backdrop-blur-sm flex-col">
      {/* Logo / Brand */}
      <div className="p-5 border-b border-sidebar-border bg-gradient-to-r from-[#0F4875] to-[#1175BD]">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/25">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-white tracking-tight">Aliko Careers</h1>
            <p className="text-[11px] text-white/70 leading-tight">
              Talent &amp; opportunities in one place
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-4">
        <p className="text-[11px] font-semibold text-[#1C1800]/60 uppercase tracking-[0.18em]">
          Overview
        </p>
        <ul className="space-y-1.5">
          <li>
            <Link
              to="/"
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive("/")
                  ? "bg-[#0F4875] text-white shadow-sm"
                  : "text-[#1C1800]/80 hover:bg-[#F5F8F3] hover:shadow-xs"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="truncate">Dashboard</span>
            </Link>
          </li>
          {userRole === "admin" && (
            <li>
              <Link
                to="/admin"
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive("/admin")
                    ? "bg-[#0F4875] text-white shadow-sm"
                    : "text-[#1C1800]/80 hover:bg-[#F5F8F3] hover:shadow-xs"
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
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive("/recruiter")
                    ? "bg-[#0F4875] text-white shadow-sm"
                    : "text-[#1C1800]/80 hover:bg-[#F5F8F3] hover:shadow-xs"
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
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive("/applications")
                    ? "bg-[#0F4875] text-white shadow-sm"
                    : "text-[#1C1800]/80 hover:bg-[#F5F8F3] hover:shadow-xs"
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