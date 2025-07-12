import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Component to handle Lovable token authentication
export function AuthHandler() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check for Lovable token in URL params
    const urlParams = new URLSearchParams(location.search);
    const lovableToken = urlParams.get('__lovable_token');
    
    if (lovableToken) {
      // Store token and authenticate
      sessionStorage.setItem('lovable_token', lovableToken);
      setIsAuthenticated(true);
      
      // Clean up URL by removing token parameter
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('__lovable_token');
      window.history.replaceState({}, '', newUrl.toString());
    } else {
      // Check if already authenticated
      const storedToken = sessionStorage.getItem('lovable_token');
      setIsAuthenticated(!!storedToken);
    }
  }, [location]);

  return isAuthenticated;
}

// Authentication wrapper component
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = AuthHandler();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Authentication Required</h2>
          <p className="text-muted-foreground">Please authenticate through Lovable to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}