import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { StudentCoursesProvider } from "./context_providers/StudentCourseContextProvider";
import { InstructorCoursesProvider } from "./context_providers/InstructorCourseContextProvider";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StudentCoursesProvider>
          <InstructorCoursesProvider>
            <App />
          </InstructorCoursesProvider>
        </StudentCoursesProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
