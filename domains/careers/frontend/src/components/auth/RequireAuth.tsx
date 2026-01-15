"use client"

import type React from "react"
import { Navigate, useLocation } from "react-router-dom"
import type { AuthRole } from "../../lib/api"
import { useAuth } from "../../context/auth-context"

interface RequireAuthProps {
  children: React.ReactNode
  roles?: AuthRole[]
}

export function RequireAuth({ children, roles }: RequireAuthProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F5F8F3]">
        <div className="text-sm text-[#1C1800]/70">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}


