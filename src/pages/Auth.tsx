
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

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
          title: "Velkommen tilbage!",
          description: "Du er nu logget ind.",
        });
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
            }
          }
        });

        if (error) throw error;

        toast({
          title: "Konto oprettet!",
          description: "Du kan nu logge ind med din nye konto.",
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: "Fejl",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-2 top-2 text-gray-400 hover:text-white hover:bg-gray-700"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-gray-900 font-bold text-lg">Α</span>
              </div>
            </div>
            <CardTitle className="text-white">
              {isLogin ? "Log ind på Athena" : "Opret konto på Athena"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="text-gray-300">Fulde navn</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="f.eks. Emil Nielsen"
                  required={!isLogin}
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
                placeholder="din@email.dk"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-300">Adgangskode</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Mindst 6 tegn"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
            >
              {loading ? "Vent..." : (isLogin ? "Log ind" : "Opret konto")}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-400 hover:text-purple-300"
            >
              {isLogin ? "Har du ikke en konto? Opret en" : "Har du allerede en konto? Log ind"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
