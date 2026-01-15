import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DefaultLayout } from "./layouts";
import EventsHomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import CreateEventPage from "./pages/CreateEventPage";
import EventDetailPage from "./pages/EventDetailPage";
import SignupPage from "./pages/SignupPage";
import UserLoginPage from "./pages/UserLoginPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={createBrowserRouter([{
          path: "/",
          element: <DefaultLayout />,
          children: [
            { index: true, element: <EventsHomePage /> },
            { path: "login", element: <UserLoginPage /> },
            { path: "signup", element: <SignupPage /> },
            { path: "news", element: <EventsHomePage /> },
            { path: "events", element: <EventsPage /> },
            { 
              path: "events/create", 
              element: (
                <ProtectedRoute>
                  <CreateEventPage />
                </ProtectedRoute>
              ) 
            },
            { path: "events/:id", element: <EventDetailPage /> },
            { path: "conferences", element: <EventsHomePage /> },
          ]
        }])} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;