import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { UIProvider } from "./contexts/UIContext";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 429) {
          return failureCount < 3;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex, error: any) => {
        const delay = Math.min(1000 * Math.pow(2, attemptIndex), 30000);

        if (error?.response?.status === 429) {
          return delay + 2000;
        }
        return delay;
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
        <UIProvider>
          <App />
        </UIProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
