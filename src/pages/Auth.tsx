
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Home } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import RoleSelector from "@/components/auth/RoleSelector";
import { UserRole, ROLE_CONFIGS } from "@/types/auth";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(
    (searchParams.get('role') as UserRole) || null
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    schoolCode: "",
    childCode: ""
  });

  const currentRole = selectedRole ? ROLE_CONFIGS[selectedRole] : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: `You are now logged in as ${currentRole?.title.toLowerCase()}.`,
        });
        
        // Redirect based on role
        navigate(currentRole?.dashboardRoute || '/');
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              role: selectedRole,
              schoolCode: formData.schoolCode,
              childCode: formData.childCode
            }
          }
        });

        if (error) throw error;

        toast({
          title: "Account created!",
          description: "You can now log in with your new account.",
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <RoleSelector
        onRoleSelect={setSelectedRole}
        onBack={() => navigate('/')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white hover:bg-gray-700"
              onClick={() => setSelectedRole(null)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white hover:bg-gray-700"
              onClick={() => navigate('/')}
            >
              <Home className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-center">
            <CardTitle className="text-white">
              {isLogin ? `Log in as ${currentRole?.title}` : `Create ${currentRole?.title} account`}
            </CardTitle>
            <p className="text-gray-400 text-sm mt-2">{currentRole?.description}</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="text-gray-300">Full name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Emil Nielsen"
                  required={!isLogin}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
                />
              </div>
            )}

            {!isLogin && (selectedRole === 'parent' || selectedRole === 'teacher') && (
              <div>
                <Label htmlFor="schoolCode" className="text-gray-300">School code</Label>
                <Input
                  id="schoolCode"
                  value={formData.schoolCode}
                  onChange={(e) => setFormData({...formData, schoolCode: e.target.value})}
                  placeholder="Enter school code"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
                />
              </div>
            )}

            {!isLogin && selectedRole === 'parent' && (
              <div>
                <Label htmlFor="childCode" className="text-gray-300">Child code</Label>
                <Input
                  id="childCode"
                  value={formData.childCode}
                  onChange={(e) => setFormData({...formData, childCode: e.target.value})}
                  placeholder="Enter your child's code"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
                />
              </div>
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
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
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
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-400 to-purple-600 hover:opacity-90 text-white border-none"
            >
              {loading ? "Please wait..." : (isLogin ? "Log in" : "Create account")}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-400 hover:text-purple-300"
            >
              {isLogin ? "Don't have an account? Create one" : "Already have an account? Log in"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
