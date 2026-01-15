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

  // Check if user has the required roles
  if (roles && user) {
    // For admin access, check global role
    if (roles.includes('ADMIN') && user.globalRole !== 'ADMIN') {
      return <Navigate to="/" replace />
    }
    // For recruiter access, check careers-specific role
    if (roles.includes('RECRUITER') && user.careersRole !== 'RECRUITER') {
      return <Navigate to="/" replace />
    }
    // For general user access, check global role
    if (roles.includes('USER') && user.globalRole !== 'USER' && user.globalRole !== 'ADMIN') {
      return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}


