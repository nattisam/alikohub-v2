import { createBrowserRouter } from "react-router-dom"
import App from "./App"
import { AdminDashboard } from "./components/dashboards/admin-dashboard"
import { RecruiterDashboard } from "./components/dashboards/recruiter-dashboard"
import { JobPostPage } from "./pages/job-post-page"
import { JobPage } from "./pages/job-page"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import { RequireAuth } from "./components/auth/RequireAuth"
import { JobsHomePage } from "./pages/JobsHomePage"
import { ApplicationsList } from "./components/recruiter/applications-list"

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <JobsHomePage />,
      },
      {
        path: "job/:id",
        element: <JobPage />,
      },
      {
        path: "admin",
        element: (
          <RequireAuth roles={["ADMIN"]}>
            <AdminDashboard />
          </RequireAuth>
        ),
      },
      {
        path: "recruiter",
        element: (
          <RequireAuth roles={["RECRUITER"]}>
            <RecruiterDashboard />
          </RequireAuth>
        ),
      },
      {
        path: "applications",
        element: (
          <RequireAuth roles={["RECRUITER"]}>
            <ApplicationsList />
          </RequireAuth>
        ),
      },
      {
        path: "job-post",
        element: (
          <RequireAuth roles={["RECRUITER"]}>
            <JobPostPage />
          </RequireAuth>
        ),
      },
    ],
  },
])