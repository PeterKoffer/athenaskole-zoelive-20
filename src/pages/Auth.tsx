
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, GraduationCap, Users, BookOpen, Building } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(searchParams.get('role') || '');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    schoolCode: "",
    childCode: ""
  });

  const roleConfig = {
    student: {
      title: "Elev",
      icon: GraduationCap,
      color: "from-blue-400 to-blue-600",
      description: "Log ind for at få adgang til dine lektioner og spil"
    },
    parent: {
      title: "Forælder",
      icon: Users,
      color: "from-green-400 to-green-600",
      description: "Følg dit barns fremskridt og kommuniker med skolen"
    },
    teacher: {
      title: "Lærer",
      icon: BookOpen,
      color: "from-purple-400 to-purple-600",
      description: "Administrer dine klasser og elevernes udvikling"
    },
    school: {
      title: "Skole",
      icon: Building,
      color: "from-orange-400 to-orange-600",
      description: "Få overblik over hele skolen og statistikker"
    }
  };

  const currentRole = roleConfig[selectedRole as keyof typeof roleConfig];
  const IconComponent = currentRole?.icon || GraduationCap;

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
          description: `Du er nu logget ind som ${currentRole?.title.toLowerCase()}.`,
        });
        
        // Redirect based on role
        if (selectedRole === 'school') {
          navigate('/school-dashboard');
        } else if (selectedRole === 'parent') {
          navigate('/parent-dashboard');
        } else if (selectedRole === 'teacher') {
          navigate('/teacher-dashboard');
        } else {
          navigate('/');
        }
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

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl mb-4">Vælg din rolle</CardTitle>
            <p className="text-gray-300">Hvordan vil du bruge Athena?</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(roleConfig).map(([role, config]) => {
                const IconComponent = config.icon;
                return (
                  <Button
                    key={role}
                    variant="outline"
                    className="h-auto p-6 bg-gray-700 border-gray-600 hover:bg-gray-600 text-white flex flex-col space-y-3"
                    onClick={() => setSelectedRole(role)}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold">{config.title}</span>
                  </Button>
                );
              })}
            </div>
            <div className="text-center mt-6">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="text-gray-400 border-gray-600 hover:bg-gray-700"
              >
                Tilbage til forsiden
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <div className={`w-12 h-12 bg-gradient-to-br ${currentRole?.color} rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4`}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-white">
              {isLogin ? `Log ind som ${currentRole?.title}` : `Opret ${currentRole?.title} konto`}
            </CardTitle>
            <p className="text-gray-400 text-sm mt-2">{currentRole?.description}</p>
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

            {!isLogin && (selectedRole === 'parent' || selectedRole === 'teacher') && (
              <div>
                <Label htmlFor="schoolCode" className="text-gray-300">
                  {selectedRole === 'parent' ? 'Skole kode' : 'Skole kode'}
                </Label>
                <Input
                  id="schoolCode"
                  value={formData.schoolCode}
                  onChange={(e) => setFormData({...formData, schoolCode: e.target.value})}
                  placeholder="Indtast skolekoden"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
                />
              </div>
            )}

            {!isLogin && selectedRole === 'parent' && (
              <div>
                <Label htmlFor="childCode" className="text-gray-300">Barn kode</Label>
                <Input
                  id="childCode"
                  value={formData.childCode}
                  onChange={(e) => setFormData({...formData, childCode: e.target.value})}
                  placeholder="Indtast dit barns kode"
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
              className={`w-full bg-gradient-to-r ${currentRole?.color} hover:opacity-90 text-white border-none`}
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
