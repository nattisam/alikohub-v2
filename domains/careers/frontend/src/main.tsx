import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./routes.tsx";
import { AuthProvider } from "./context/auth-context";
import ErrorBoundary from "./components/common/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Retry on 429 errors with exponential backoff
        if (error?.response?.status === 429) {
          return failureCount < 3;
        }
        // Default retry for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex, error: any) => {
        // Use exponential backoff for 429 errors
        if (error?.response?.status === 429) {
          const baseDelay = 1000;
          const maxDelay = 10000;
          const delay = Math.min(
            baseDelay * Math.pow(2, attemptIndex),
            maxDelay,
          );
          // Add jitter
          return delay + Math.random() * 1000;
        }
        // Default exponential backoff
        return Math.min(1000 * Math.pow(2, attemptIndex), 30000);
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
