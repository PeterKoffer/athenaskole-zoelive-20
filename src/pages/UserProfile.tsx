
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, User, Trophy, TrendingUp, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  address: string | null;
  birth_date: string | null;
  grade: string | null;
  school: string | null;
  avatar_url: string | null;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const previousYearsProgress = [
    { year: "2023", matematik: 85, dansk: 78, engelsk: 82, naturteknik: 75 },
    { year: "2022", matematik: 72, dansk: 69, engelsk: 74, naturteknik: 68 },
    { year: "2021", matematik: 65, dansk: 63, engelsk: 67, naturteknik: 60 }
  ];

  const earnedBadges = [
    { name: "Matematik Viking", date: "2024-01-15", difficulty: "Guld" },
    { name: "Ordets Mester", date: "2024-01-10", difficulty: "Sølv" },
    { name: "Stavning Pro", date: "2024-01-05", difficulty: "Bronze" },
    { name: "Natur Forsker", date: "2023-12-20", difficulty: "Sølv" }
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create a new profile if one doesn't exist
        const newProfile = {
          user_id: user.id,
          name: user.user_metadata?.name || null,
          email: user.email || null,
          address: null,
          birth_date: null,
          grade: null,
          school: null,
          avatar_url: null
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) throw createError;
        setProfile(createdProfile);
      }
    } catch (error: any) {
      toast({
        title: "Fejl",
        description: "Kunne ikke hente profil: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile || !user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          email: profile.email,
          address: profile.address,
          birth_date: profile.birth_date,
          grade: profile.grade,
          school: profile.school,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profil gemt!",
        description: "Dine ændringer er blevet gemt.",
      });
      setEditMode(false);
    } catch (error: any) {
      toast({
        title: "Fejl",
        description: "Kunne ikke gemme profil: " + error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !profile) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: data.publicUrl });

      toast({
        title: "Profilbillede opdateret!",
        description: "Dit nye profilbillede er blevet gemt.",
      });
    } catch (error: any) {
      toast({
        title: "Fejl",
        description: "Kunne ikke uploade billede: " + error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Indlæser...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Profil ikke fundet</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Tilbage til Athena
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-lg">Α</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Min Profil
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-white">
                <User className="w-5 h-5 text-purple-400" />
                <span>Personlige Oplysninger</span>
              </CardTitle>
              <Button
                onClick={() => editMode ? handleSave() : setEditMode(true)}
                disabled={saving}
                className="bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
              >
                {saving ? 'Gemmer...' : (editMode ? 'Gem' : 'Rediger')}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.avatar_url || undefined} alt="Profilbillede" />
                    <AvatarFallback className="bg-gray-700 text-white text-xl">
                      {profile.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-purple-500 rounded-full p-2 cursor-pointer hover:bg-purple-600 transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
                {uploading && <span className="text-gray-300">Uploader...</span>}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Navn</label>
                  {editMode ? (
                    <Input
                      value={profile.name || ''}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  ) : (
                    <p className="text-white font-medium">{profile.name || 'Ikke angivet'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Email</label>
                  {editMode ? (
                    <Input
                      value={profile.email || ''}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  ) : (
                    <p className="text-white font-medium">{profile.email || 'Ikke angivet'}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-300 mb-2 block">Adresse</label>
                  {editMode ? (
                    <Input
                      value={profile.address || ''}
                      onChange={(e) => setProfile({...profile, address: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  ) : (
                    <p className="text-white font-medium">{profile.address || 'Ikke angivet'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Fødselsdato</label>
                  {editMode ? (
                    <Input
                      type="date"
                      value={profile.birth_date || ''}
                      onChange={(e) => setProfile({...profile, birth_date: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  ) : (
                    <p className="text-white font-medium">{profile.birth_date || 'Ikke angivet'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Klasse</label>
                  {editMode ? (
                    <Input
                      value={profile.grade || ''}
                      onChange={(e) => setProfile({...profile, grade: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  ) : (
                    <p className="text-white font-medium">{profile.grade || 'Ikke angivet'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Skole</label>
                  {editMode ? (
                    <Input
                      value={profile.school || ''}
                      onChange={(e) => setProfile({...profile, school: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  ) : (
                    <p className="text-white font-medium">{profile.school || 'Ikke angivet'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Stats */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span>Statistikker</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">12</div>
                <div className="text-sm text-gray-300">Badges Opnået</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">1,247</div>
                <div className="text-sm text-gray-300">Lære-Kroner</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">89%</div>
                <div className="text-sm text-gray-300">Gennemsnit</div>
              </div>
            </CardContent>
          </Card>

          {/* Previous Years Progress */}
          <Card className="lg:col-span-3 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span>Tidligere År Fremskridt</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 text-gray-300">År</th>
                      <th className="text-left py-2 text-gray-300">Matematik</th>
                      <th className="text-left py-2 text-gray-300">Dansk</th>
                      <th className="text-left py-2 text-gray-300">Engelsk</th>
                      <th className="text-left py-2 text-gray-300">Natur & Teknik</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previousYearsProgress.map((year) => (
                      <tr key={year.year} className="border-b border-gray-700">
                        <td className="py-2 text-white font-medium">{year.year}</td>
                        <td className="py-2 text-white">{year.matematik}%</td>
                        <td className="py-2 text-white">{year.dansk}%</td>
                        <td className="py-2 text-white">{year.engelsk}%</td>
                        <td className="py-2 text-white">{year.naturteknik}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Earned Badges */}
          <Card className="lg:col-span-3 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span>Opnåede Badges</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {earnedBadges.map((badge, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 transform hover:scale-105 transition-transform shadow-lg"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">🏆</div>
                      <div className="font-semibold text-white text-sm mb-1">{badge.name}</div>
                      <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/30">
                        {badge.difficulty}
                      </Badge>
                      <div className="text-xs text-white/80 mt-2">{badge.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
