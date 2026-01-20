"use client"

import { Outlet } from "react-router-dom"
import { CareersLayout } from "./components/layout/careers-layout"
import { ApplicationProvider } from "./context/application-context"
import { useAuth } from "./context/auth-context"

type UiRole = "recruiter" | "admin" | "applicant"

export default function App() {
  const { user, isAuthenticated } = useAuth()

  // Map backend roles to UI roles used by layout/sidebar
  const userRole: UiRole =
    user?.role === "ADMIN" ? "admin" : user?.careersRole === "RECRUITER" ? "recruiter" : "applicant"

  // No automatic redirection from homepage - let users stay on /
  // Admins and recruiters can navigate to their dashboards manually

  return (
    <ApplicationProvider>
      <CareersLayout userRole={userRole}>
        <Outlet />
      </CareersLayout>
    </ApplicationProvider>
  )
}
