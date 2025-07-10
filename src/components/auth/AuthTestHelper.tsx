
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

  const createAndSignInTestUser = async () => {
    try {
      // Generate a unique test email with a more standard domain
      const timestamp = Date.now();
      const testEmail = `testuser${timestamp}@gmail.com`;
      const testPassword = "testpassword123";
      
      console.log('🧪 Creating and signing in test user:', testEmail);
      
      // First, create the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
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

      if (signUpError) {
        throw signUpError;
      }

      console.log('🧪 User created successfully:', signUpData);
      
      // Then immediately sign them in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      if (signInError) {
        console.warn('⚠️ Sign up successful but sign in failed:', signInError);
        toast({
          title: "User Created",
          description: `User ${testEmail} created but not signed in. Try signing in manually with password: ${testPassword}`,
          variant: "destructive"
        });
        return;
      }

      console.log('🎉 User signed in successfully:', signInData);
      
      toast({
        title: "Success!",
        description: `Test user created and signed in: ${testEmail}. You can now test the profile functionality!`,
      });
      
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
          onClick={createAndSignInTestUser}
          variant="outline"
          className="w-full border-green-300 text-green-700 hover:bg-green-50"
        >
          🚀 Create & Sign In Test User
        </Button>
        
        <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
          <strong>How to test:</strong>
          <ol className="list-decimal list-inside mt-1 space-y-1">
            <li>Click "Create & Sign In Test User"</li>
            <li>You should see success message and be automatically signed in</li>
            <li>Navigate to "Stealth Assessment Test" to test profile creation</li>
            <li>Use "Check Profile" button to verify database integration</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthTestHelper;
