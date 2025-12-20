import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { UserProvider } from "./context_providers/UserContextProvider";
import { StudentCoursesProvider } from "./context_providers/StudentCourseContextProvider";
import { InstructorCoursesProvider } from "./context_providers/InstructorCourseContextProvider";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <StudentCoursesProvider>
        <InstructorCoursesProvider>
          <App />
        </InstructorCoursesProvider>
      </StudentCoursesProvider>
    </UserProvider>
  </StrictMode>
);
