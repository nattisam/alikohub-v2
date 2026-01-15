import type React from "react"
import { Navigation } from "./navigation"
import { Header } from "./header"

interface CareersLayoutProps {
  children: React.ReactNode
  userRole: "recruiter" | "admin" | "applicant"
}

export function CareersLayout({ children, userRole }: CareersLayoutProps) {
  return (
    <div className="flex h-screen bg-[#F5F8F3] text-[#1C1800]">
      <Navigation userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-[radial-gradient(circle_at_top,_rgba(17,117,189,0.06),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(230,214,0,0.06),_transparent_55%)]">
        <Header userRole={userRole} />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
