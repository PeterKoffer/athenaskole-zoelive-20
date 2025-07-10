
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

  const createTestUserOnly = async () => {
    try {
      // Generate a unique test email
      const timestamp = Date.now();
      const testEmail = `testuser${timestamp}@gmail.com`;
      const testPassword = "testpassword123";
      
      console.log('🧪 Creating test user (no auto sign-in):', testEmail);
      
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

      console.log('🧪 User created successfully:', data);
      
      toast({
        title: "Test User Created",
        description: `User created: ${testEmail}. Password: ${testPassword}. Try signing in manually or use the quick sign-in button below.`,
      });

      // Store the test credentials for easy access
      (window as any).testUserCredentials = {
        email: testEmail,
        password: testPassword
      };
      
      console.log('🧪 Test credentials stored in window.testUserCredentials');
      
    } catch (error: any) {
      console.error('🧪 User creation failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create test user",
        variant: "destructive",
      });
    }
  };

  const signInWithStoredCredentials = async () => {
    try {
      const credentials = (window as any).testUserCredentials;
      if (!credentials) {
        toast({
          title: "No Credentials",
          description: "Create a test user first",
          variant: "destructive"
        });
        return;
      }

      console.log('🔑 Attempting to sign in with stored credentials:', credentials.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error('🔑 Sign in failed:', error);
        toast({
          title: "Sign In Failed",
          description: `Error: ${error.message}. You may need to check Supabase email confirmation settings.`,
          variant: "destructive"
        });
        return;
      }

      console.log('🎉 Sign in successful:', data);
      
      toast({
        title: "Success!",
        description: `Signed in as: ${credentials.email}`,
      });
      
    } catch (error: any) {
      console.error('🔑 Sign in error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      });
    }
  };

  const checkAuthSettings = async () => {
    try {
      console.log('🔍 Checking current session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
      }
      
      console.log('Current session:', session);
      
      toast({
        title: "Session Check",
        description: session ? `Signed in as: ${session.user.email}` : "No active session",
      });
      
    } catch (error: any) {
      console.error('Auth check error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to check auth status",
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
          Enhanced tools to debug authentication issues.
        </p>
        
        <Button 
          onClick={clearAllAuth}
          variant="outline"
          className="w-full border-red-300 text-red-700 hover:bg-red-50"
        >
          🧹 Clear All Authentication
        </Button>

        <Button 
          onClick={createTestUserOnly}
          variant="outline"
          className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          👤 Create Test User (No Auto Sign-In)
        </Button>

        <Button 
          onClick={signInWithStoredCredentials}
          variant="outline"
          className="w-full border-green-300 text-green-700 hover:bg-green-50"
        >
          🔑 Sign In With Last Created User
        </Button>

        <Button 
          onClick={checkAuthSettings}
          variant="outline"
          className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          🔍 Check Current Auth Status
        </Button>

        <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
          <strong>Debug Steps:</strong>
          <ol className="list-decimal list-inside mt-1 space-y-1">
            <li>Click "Create Test User" - this will store credentials</li>
            <li>Click "Sign In With Last Created User" to test manual sign-in</li>
            <li>If sign-in fails, check Supabase settings:</li>
            <ul className="list-disc list-inside ml-4 text-xs">
              <li>Authentication → Settings → Email Confirm: OFF</li>
              <li>Authentication → Settings → Enable email confirmations: OFF</li>
            </ul>
          </ol>
        </div>

        <div className="text-xs text-red-600 bg-red-100 p-2 rounded">
          <strong>If still having issues:</strong> The email confirmation setting might be cached. Try creating a completely new test user email or check if there are multiple email confirmation settings in your Supabase project.
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthTestHelper;
