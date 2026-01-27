"use client"

import type React from "react"
import { Navigate, useLocation } from "react-router-dom"
import type { AuthRole } from "../../lib/api"
import { useAuth } from "../../context/auth-context"

interface RequireAuthProps {
  children: React.ReactNode
  roles?: AuthRole[]
}

import AccessDenied from "../common/AccessDenied";

export function RequireAuth({ children, roles }: RequireAuthProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 text-stone-400 gap-4">
        <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Verifying Access</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check if user has the required roles
  if (roles && user) {
    let hasAccess = false;

    // For admin access, check global role
    if (roles.includes('ADMIN')) {
      hasAccess = user.globalRole === 'ADMIN';
    } 
    // For recruiter access, check careers-specific role
    else if (roles.includes('RECRUITER')) {
      hasAccess = user.careersRole === 'RECRUITER' || user.globalRole === 'ADMIN';
    }
    // For general user access, check global role
    else if (roles.includes('USER')) {
      hasAccess = true; // Any authenticated user
    }

    if (!hasAccess) {
      return <AccessDenied />;
    }
  }

  return <>{children}</>
}


