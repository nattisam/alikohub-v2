"use client"

import { Outlet, useLocation, Navigate } from "react-router-dom"
import { CareersLayout } from "./components/layout/careers-layout"
import { ApplicationProvider } from "./context/application-context"
import { useAuth } from "./context/auth-context"

type UiRole = "recruiter" | "admin" | "applicant"

export default function App() {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  // Map backend roles to UI roles used by layout/sidebar
  const userRole: UiRole =
    user?.role === "ADMIN" ? "admin" : user?.role === "RECRUITER" ? "recruiter" : "applicant"

  // Redirect to appropriate dashboard if user is on root and has a specific role
  if (location.pathname === '/' && isAuthenticated) {
    if (user?.role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    } else if (user?.role === 'RECRUITER') {
      return <Navigate to="/recruiter" replace />;
    }
  }

  return (
    <ApplicationProvider>
      <CareersLayout userRole={userRole}>
        <Outlet />
      </CareersLayout>
    </ApplicationProvider>
  )
}
