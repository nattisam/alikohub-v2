import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSSO } from "@/hooks/useSSO";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Partnership from "./pages/Partnership";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import VerifyEmail from "./pages/VerifyEmail";
import AdminSubmissions from "./pages/AdminSubmissions";

import PublicRoute from "./components/PublicRoute";

const queryClient = new QueryClient();

function SSOProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useSSO();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        queryClient.setQueryData(["user"], user);
      } else {
        queryClient.setQueryData(["user"], null);
      }
    }
  }, [isAuthenticated, isLoading, user, queryClient]);

  return <>{children}</>;
}

import { ThemeProvider } from "next-themes";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem storageKey="alikohub-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SSOProvider>
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/programs" element={<Programs />} />
                <Route path="/partnership" element={<Partnership />} />
                <Route element={<PublicRoute />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* Email Verification Route */}
                <Route path="/verify-email" element={<VerifyEmail />} />

                {/* Payment Success Route */}
                <Route path="/payment/success" element={<PaymentSuccess />} />

                <Route path="/admin/submissions" element={<AdminSubmissions />} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </SSOProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);


export default App;
