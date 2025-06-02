
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  onClose: () => void;
  onLogin: () => void;
}

const AuthModal = ({ onClose, onLogin }: AuthModalProps) => {
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔑 Attempting authentication:', { isLogin, email: formData.email });
      
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        console.log('🔑 Sign in result:', { data: data?.user?.id, error });

        if (error) {
          console.error('❌ Sign in error:', error);
          throw error;
        }

        toast({
          title: "Welcome back!",
          description: "You are now logged in.",
        });
        
        onLogin();
        onClose();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              age: formData.age
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        console.log('📝 Sign up result:', { data: data?.user?.id, error });

        if (error) {
          console.error('❌ Sign up error:', error);
          throw error;
        }

        toast({
          title: "Account created!",
          description: "Check your email to confirm your account, or try logging in if email confirmation is disabled.",
        });
        
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error("❌ Auth error:", error);
      let errorMessage = "An error occurred during login/registration";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-gray-900 border-2 border-gray-700">
        <CardHeader className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="text-center text-white">
            {isLogin ? "Log in to Nelie" : "Create account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="name" className="text-gray-300">Full name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Emily Johnson"
                    required={!isLogin}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-lime-400"
                  />
                </div>
                <div>
                  <Label htmlFor="age" className="text-gray-300">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="8-16 years"
                    min="6"
                    max="18"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-lime-400"
                  />
                </div>
              </>
            )}
            
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your@email.com"
                required
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-lime-400"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="At least 6 characters"
                required
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-lime-400"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold"
            >
              {loading ? "Please wait..." : (isLogin ? "Log in" : "Create account")}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              onClick={() => setIsLogin(!isLogin)}
              className="text-lime-400 hover:text-lime-300"
            >
              {isLogin ? "Don't have an account? Create one" : "Already have an account? Log in"}
            </Button>
          </div>

          {!isLogin && (
            <div className="mt-4 p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300">
              <p className="font-semibold text-lime-400">GDPR & Privacy:</p>
              <p>We respect privacy laws and only store necessary data in the EU.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthModal;
