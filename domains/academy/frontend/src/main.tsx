import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";

import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 429) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex, error: any) => {
        if (error?.response?.status === 429) {
          return 0;
        }
        return Math.min(1000 * Math.pow(2, attemptIndex), 30000);
      },
      staleTime: 5 * 60 * 1000,
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
