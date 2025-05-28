
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Mail, Calendar, School, MapPin, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SubscriptionPlans from "@/components/SubscriptionPlans";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    birth_date: "",
    grade: "",
    school: "",
    address: "",
    avatar_url: ""
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setProfileData({
        name: data.name || user.user_metadata?.name || "",
        email: data.email || user.email || "",
        birth_date: data.birth_date || "",
        grade: data.grade || "",
        school: data.school || "",
        address: data.address || "",
        avatar_url: data.avatar_url || ""
      });
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        ...profileData,
        updated_at: new Date().toISOString()
      });

    if (error) {
      toast({
        title: "Fejl",
        description: "Kunne ikke opdatere profil: " + error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profil opdateret!",
        description: "Dine oplysninger er blevet gemt.",
      });
    }

    setLoading(false);
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tilbage til forsiden
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Α</span>
            </div>
            <span className="text-white font-semibold">Min Profil</span>
          </div>
          <Button
            variant="outline"
            onClick={signOut}
            className="text-white border-gray-600 hover:bg-gray-700"
          >
            Log ud
          </Button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Min Profil</h1>
          <p className="text-gray-400">Administrer dine oplysninger og abonnement</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg">
          <Button
            variant={activeTab === "profile" ? "default" : "ghost"}
            onClick={() => setActiveTab("profile")}
            className={`flex-1 ${activeTab === "profile" ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-white" : "text-gray-300 hover:text-white hover:bg-gray-700"}`}
          >
            <User className="w-4 h-4 mr-2" />
            Profil
          </Button>
          <Button
            variant={activeTab === "subscription" ? "default" : "ghost"}
            onClick={() => setActiveTab("subscription")}
            className={`flex-1 ${activeTab === "subscription" ? "bg-gradient-to-r from-purple-400 to-cyan-400 text-white" : "text-gray-300 hover:text-white hover:bg-gray-700"}`}
          >
            <Badge className="w-4 h-4 mr-2" />
            Abonnement
          </Button>
        </div>

        {activeTab === "profile" && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profil Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Fulde navn
                    </Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      placeholder="Indtast dit navn"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-300 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      placeholder="din@email.dk"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="birth_date" className="text-gray-300 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Fødselsdato
                    </Label>
                    <Input
                      id="birth_date"
                      type="date"
                      value={profileData.birth_date}
                      onChange={(e) => setProfileData({...profileData, birth_date: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="grade" className="text-gray-300">Klasse</Label>
                    <Input
                      id="grade"
                      value={profileData.grade}
                      onChange={(e) => setProfileData({...profileData, grade: e.target.value})}
                      placeholder="f.eks. 5. klasse"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="school" className="text-gray-300 flex items-center">
                      <School className="w-4 h-4 mr-2" />
                      Skole
                    </Label>
                    <Input
                      id="school"
                      value={profileData.school}
                      onChange={(e) => setProfileData({...profileData, school: e.target.value})}
                      placeholder="Navn på din skole"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-gray-300 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Adresse
                    </Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      placeholder="Din adresse"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
                >
                  {loading ? "Gemmer..." : "Gem ændringer"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === "subscription" && (
          <div>
            <SubscriptionPlans />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
