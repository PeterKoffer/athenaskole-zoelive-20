
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User, Mail, MapPin, Calendar, Trophy, TrendingUp, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "Emil Nielsen",
    email: "emil@example.com",
    address: "Københavnsgade 123, 2100 København Ø",
    birthDate: "2012-05-15",
    grade: "5. klasse",
    school: "Østerbro Skole"
  });

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

  const handleSave = () => {
    setEditMode(false);
    // Here you would typically save to database
  };

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
                className="bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
              >
                {editMode ? 'Gem' : 'Rediger'}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Navn</label>
                  {editMode ? (
                    <Input
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  ) : (
                    <p className="text-white font-medium">{userInfo.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Email</label>
                  {editMode ? (
                    <Input
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  ) : (
                    <p className="text-white font-medium">{userInfo.email}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-300 mb-2 block">Adresse</label>
                  {editMode ? (
                    <Input
                      value={userInfo.address}
                      onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  ) : (
                    <p className="text-white font-medium">{userInfo.address}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Fødselsdato</label>
                  {editMode ? (
                    <Input
                      type="date"
                      value={userInfo.birthDate}
                      onChange={(e) => setUserInfo({...userInfo, birthDate: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  ) : (
                    <p className="text-white font-medium">{userInfo.birthDate}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Klasse</label>
                  <p className="text-white font-medium">{userInfo.grade}</p>
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
