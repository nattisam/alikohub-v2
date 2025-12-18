import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import HomePage from "./pages/HomePage.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext.tsx";
import GeneralLoginPage from "./pages/LoginPage.tsx";
import GeneralSignupPage from "./pages/SignupPage.tsx";

const routers = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/auth/login", element: <GeneralLoginPage /> },
  { path: "/auth/signup", element: <GeneralSignupPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={routers} />
    </UserProvider>
  </StrictMode>
);
