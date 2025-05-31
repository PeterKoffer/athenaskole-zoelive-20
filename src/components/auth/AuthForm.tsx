
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types/auth";
import { useAuthForm } from "@/hooks/useAuthForm";
import AuthFormFields from "./AuthFormFields";

interface AuthFormProps {
  selectedRole: UserRole;
  onRoleDeselect: () => void;
}

const AuthForm = ({ selectedRole, onRoleDeselect }: AuthFormProps) => {
  const navigate = useNavigate();
  const {
    isLogin,
    setIsLogin,
    loading,
    formData,
    setFormData,
    currentRole,
    handleSubmit
  } = useAuthForm(selectedRole);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white hover:bg-gray-700"
              onClick={onRoleDeselect}
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
            <AuthFormFields
              isLogin={isLogin}
              selectedRole={selectedRole}
              formData={formData}
              onFormDataChange={setFormData}
            />

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

export default AuthForm;
