
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const QuickTestAuth = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const createAndSignInTestUser = async () => {
    setLoading(true);
    try {
      // First, try to sign in with the known test account
      console.log('🧪 Attempting sign in with existing test account');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      });

      if (!signInError && signInData.user) {
        console.log('🎉 Successfully signed in with existing test account');
        toast({
          title: "Success!",
          description: "Signed in with test@example.com",
        });
        return;
      }

      // If sign in failed, try to create the account
      console.log('🧪 Creating new test account...');
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            name: 'Test User',
            age: '25'
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (signUpError) {
        console.error('❌ Sign up failed:', signUpError);
        
        // If it's a rate limit, wait and try sign in again
        if (signUpError.message?.toLowerCase().includes('rate')) {
          console.log('⏰ Rate limited, waiting 2 seconds and trying sign in...');
          
          setTimeout(async () => {
            try {
              const { data, error } = await supabase.auth.signInWithPassword({
                email: 'test@example.com',
                password: 'password123',
              });
              
              if (!error && data.user) {
                toast({
                  title: "Success!",
                  description: "Signed in with test@example.com after rate limit",
                });
              } else {
                throw error;
              }
            } catch (retryError: any) {
              toast({
                title: "Error",
                description: retryError.message || "Failed to sign in after retry",
                variant: "destructive"
              });
            }
          }, 2000);
          
          toast({
            title: "Rate Limited",
            description: "Waiting 2 seconds then trying to sign in with existing account...",
          });
          return;
        }
        
        throw signUpError;
      }

      console.log('✅ Test account created:', signUpData.user?.email);
      toast({
        title: "Account Created!",
        description: "Test account created and you should be signed in automatically",
      });

    } catch (error: any) {
      console.error('❌ Test auth failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create/sign in test user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      console.log('Current session:', session);
      
      toast({
        title: "Auth Status",
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
    <Card className="w-full max-w-md mx-auto mt-4 bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-800">🚀 Quick Test Login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-blue-700">
          Use this to quickly get signed in for testing.
        </p>
        
        <Button 
          onClick={createAndSignInTestUser}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? "Working..." : "🔑 Create/Sign In Test User"}
        </Button>

        <Button 
          onClick={checkCurrentAuth}
          variant="outline"
          className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          🔍 Check Current Auth Status
        </Button>

        <div className="text-xs text-blue-600 bg-blue-100 p-2 rounded">
          <strong>Test Account:</strong> test@example.com / password123
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickTestAuth;
