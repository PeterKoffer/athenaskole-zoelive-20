
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserRole, ROLE_CONFIGS } from "@/types/auth";

export const useAuthForm = (selectedRole: UserRole) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    schoolCode: "",
    childCode: ""
  });

  const currentRole = ROLE_CONFIGS[selectedRole];

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

  return {
    isLogin,
    setIsLogin,
    loading,
    formData,
    setFormData,
    currentRole,
    handleSubmit
  };
};
