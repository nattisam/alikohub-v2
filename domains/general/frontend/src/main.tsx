import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import HomePage from "./pages/HomePage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GeneralLoginPage from "./pages/LoginPage.tsx";
import GeneralSignupPage from "./pages/SignupPage.tsx";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const routers = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/auth/login", element: <GeneralLoginPage /> },
  { path: "/auth/signup", element: <GeneralSignupPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={routers} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
