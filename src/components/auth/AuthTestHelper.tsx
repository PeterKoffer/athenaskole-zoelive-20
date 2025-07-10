
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthTestHelper = () => {
  const { toast } = useToast();

  const clearAllAuth = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear all local storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear cookies by setting them to expire
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
      
      toast({
        title: "Authentication Cleared",
        description: "All sessions and storage cleared. Page will reload.",
      });
      
      // Reload the page to ensure clean state
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Error clearing auth:', error);
      toast({
        title: "Error",
        description: "Failed to clear authentication completely",
        variant: "destructive",
      });
    }
  };

  const createTestUser = async () => {
    try {
      // Generate a unique test email
      const timestamp = Date.now();
      const testEmail = `testuser${timestamp}@example.org`; // Using .org instead of .com
      const testPassword = "testpassword123";
      
      console.log('🧪 Creating test user:', testEmail);
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            name: "Test User",
            age: "25"
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Test User Created",
        description: `Created user: ${testEmail} with password: ${testPassword}`,
      });
      
      console.log('🧪 Test user created successfully:', data);
      
    } catch (error: any) {
      console.error('🧪 Test user creation failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create test user",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8 bg-yellow-50 border-yellow-200">
      <CardHeader>
        <CardTitle className="text-yellow-800">🧪 Auth Test Helper</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-yellow-700">
          Use these tools to manage authentication state during testing.
        </p>
        
        <Button 
          onClick={clearAllAuth}
          variant="outline"
          className="w-full border-red-300 text-red-700 hover:bg-red-50"
        >
          🧹 Clear All Authentication
        </Button>
        
        <Button 
          onClick={createTestUser}
          variant="outline"
          className="w-full border-green-300 text-green-700 hover:bg-green-50"
        >
          👤 Create Random Test User
        </Button>
        
        <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
          <strong>Pro tip:</strong> Use "Clear All Authentication" first, then reload the page, 
          then use "Create Random Test User" for clean testing.
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthTestHelper;
