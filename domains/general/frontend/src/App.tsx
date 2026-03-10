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

const About = lazy(() => import("./pages/About"));
const Programs = lazy(() => import("./pages/Programs"));
const Partnership = lazy(() => import("./pages/Partnership"));
const Academy = lazy(() => import("./pages/ventures/Academy"));
const DigitalHealth = lazy(() => import("./pages/ventures/DigitalHealth"));
const STEM = lazy(() => import("./pages/ventures/STEM"));
const ConsultancyEvents = lazy(() => import("./pages/ventures/ConsultancyEvents"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));

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

const App = () => (
  <QueryClientProvider client={queryClient}>
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
              <Route path="/ventures/academy" element={<Academy />} />
              <Route path="/ventures/digital-health" element={<DigitalHealth />} />
              <Route path="/ventures/stem" element={<STEM />} />
              <Route path="/ventures/consultancy-events" element={<ConsultancyEvents />} />
              <Route path="/partnership" element={<Partnership />} />

              <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Email Verification Route */}
              <Route path="/verify-email" element={<VerifyEmail />} />

              {/* Payment Success Route */}
              <Route path="/payment/success" element={<PaymentSuccess />} />

              {/* Admin Routes */}
              <Route path="/admin/submissions" element={<AdminSubmissions />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </SSOProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
