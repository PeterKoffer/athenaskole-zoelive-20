
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const AuthTestHelper = () => {
  const { toast } = useToast();
  const [lastCreatedEmail, setLastCreatedEmail] = useState<string>("");

  const clearAllAuth = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear all local storage
      localStorage.clear();
      sessionStorage.clear();
      
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

  const createAndSignInUser = async () => {
    try {
      // Generate a completely unique test email to avoid rate limits
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const testEmail = `test${timestamp}${randomSuffix}@example.com`;
      const testPassword = "testpassword123";
      
      console.log('🧪 Creating and signing in new user:', testEmail);
      
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
      
      // Store the credentials
      setLastCreatedEmail(testEmail);
      (window as any).testUserCredentials = {
        email: testEmail,
        password: testPassword
      };
      
      // Wait a moment, then try to sign in
      setTimeout(async () => {
        try {
          console.log('🔑 Now attempting to sign in with:', testEmail);
          
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: testEmail,
            password: testPassword,
          });

          if (signInError) {
            console.error('🔑 Sign in failed:', signInError);
            toast({
              title: "Sign In Failed",
              description: `Created user but sign-in failed: ${signInError.message}`,
              variant: "destructive"
            });
            return;
          }

          console.log('🎉 Sign in successful:', signInData);
          
          toast({
            title: "Success!",
            description: `Created and signed in as: ${testEmail}`,
          });
          
        } catch (error: any) {
          console.error('🔑 Sign in error:', error);
          toast({
            title: "Sign In Error",
            description: error.message || "Failed to sign in after creation",
            variant: "destructive",
          });
        }
      }, 2000); // Wait 2 seconds before sign-in attempt
      
    } catch (error: any) {
      console.error('🧪 User creation failed:', error);
      
      // Handle rate limiting specifically
      if (error.message?.includes('rate limit') || error.status === 429) {
        toast({
          title: "Rate Limited",
          description: "Too many requests. Wait a few minutes before trying again, or use the existing test account.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to create test user",
          variant: "destructive",
        });
      }
    }
  };

  const signInWithExistingCredentials = async () => {
    try {
      const credentials = (window as any).testUserCredentials;
      if (!credentials) {
        toast({
          title: "No Credentials",
          description: "No test user credentials found. Create a test user first.",
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
          description: `Error: ${error.message}`,
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

  const useTestAccount = async () => {
    try {
      // Use a known working test account
      const testEmail = "test@example.com";
      const testPassword = "password123";
      
      console.log('🔑 Attempting to sign in with test account:', testEmail);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      if (error) {
        console.error('🔑 Test account sign in failed:', error);
        toast({
          title: "Test Account Failed",
          description: `Error: ${error.message}. This account may not exist yet.`,
          variant: "destructive"
        });
        return;
      }

      console.log('🎉 Test account sign in successful:', data);
      
      toast({
        title: "Success!",
        description: `Signed in with test account: ${testEmail}`,
      });
      
    } catch (error: any) {
      console.error('🔑 Test account sign in error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with test account",
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
          Tools to test authentication. Rate limits may apply.
        </p>
        
        <Button 
          onClick={clearAllAuth}
          variant="outline"
          className="w-full border-red-300 text-red-700 hover:bg-red-50"
        >
          🧹 Clear All Authentication
        </Button>

        <Button 
          onClick={createAndSignInUser}
          variant="outline"
          className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          👤 Create New Test User & Sign In
        </Button>

        <Button 
          onClick={signInWithExistingCredentials}
          variant="outline"
          className="w-full border-green-300 text-green-700 hover:bg-green-50"
        >
          🔑 Sign In With Last Created User
        </Button>

        <Button 
          onClick={useTestAccount}
          variant="outline"
          className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          🎯 Use Test Account (test@example.com)
        </Button>

        <Button 
          onClick={checkAuthSettings}
          variant="outline"
          className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          🔍 Check Current Auth Status
        </Button>

        {lastCreatedEmail && (
          <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
            <strong>Last created:</strong> {lastCreatedEmail}
          </div>
        )}

        <div className="text-xs text-blue-600 bg-blue-100 p-2 rounded">
          <strong>Rate Limit Issue?</strong> If you see "email rate limit exceeded", wait 5-10 minutes or try the test account button instead.
        </div>

        <div className="text-xs text-green-600 bg-green-100 p-2 rounded">
          <strong>Quick Test:</strong> Use the "Use Test Account" button for instant testing with test@example.com / password123
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthTestHelper;
