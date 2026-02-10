import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { AdminDashboard } from "./components/dashboards/admin-dashboard";
import { RecruiterDashboard } from "./components/dashboards/recruiter-dashboard";
import { JobPostPage } from "./pages/job-post-page";
import { JobPage } from "./pages/job-page";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RequireAuth } from "./components/auth/RequireAuth";
import { JobsHomePage } from "./pages/JobsHomePage";
import { ApplicantList } from "./components/recruiter/applicant-list";

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
            <ApplicantList />
          </RequireAuth>
        ),
      },
      {
        path: "applications/:jobId",
        element: (
          <RequireAuth roles={["RECRUITER"]}>
            {/* This route might not be strictly needed if RecruiterDashboard handles it inline, 
                 but good to have if we want to link directly to a job's applicants */}
            <ApplicantList />
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
]);
