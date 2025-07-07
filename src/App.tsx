
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import { AuthProvider } from '@/hooks/useAuth';

// Import pages directly
import Index from "./pages/Index";
import TestPage from "./pages/TestPage";
import SimpleStealthTest from "./pages/SimpleStealthTest";
import StealthAssessmentTest from "./pages/StealthAssessmentTest";
import AuthPage from "./pages/AuthPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/stealth-assessment-test" element={<StealthAssessmentTest />} />
            <Route path="/simple-stealth-test" element={<SimpleStealthTest />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
