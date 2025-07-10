
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import { AuthProvider } from "./hooks/useAuth";
import ProfileServiceTest from "./components/ProfileServiceTest";
import ProfileDebugButton from "./components/ProfileDebugButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            {/* Debug tools in top right */}
            <div className="fixed top-4 right-4 z-50 flex gap-2">
              <ProfileDebugButton />
            </div>
            
            {/* Main content */}
            <div className="container mx-auto p-4">
              <Routes>
                {navItems.map(({ to, page }) => (
                  <Route key={to} path={to} element={page} />
                ))}
              </Routes>
              
              {/* Test component for profile service */}
              <div className="mt-8">
                <ProfileServiceTest />
              </div>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
