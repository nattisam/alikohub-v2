import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
