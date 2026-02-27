import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 429 errors - let axios interceptor handle it
        // This prevents cascading retries between axios and React Query
        if (error?.response?.status === 429) {
          return false;
        }
        // Default retry for other errors (network errors, etc.)
        return failureCount < 2;
      },
      retryDelay: (attemptIndex, error: any) => {
        // Skip delay calculation for 429 since we don't retry
        if (error?.response?.status === 429) {
          return 0;
        }
        // Default exponential backoff for other errors
        return Math.min(1000 * Math.pow(2, attemptIndex), 30000);
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
