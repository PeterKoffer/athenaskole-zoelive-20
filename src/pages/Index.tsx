import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Users, GraduationCap, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AITutor from "@/components/AITutor";
import GameHub from "@/components/GameHub";
import ProgressDashboard from "@/components/ProgressDashboard";
const Index = () => {
  const navigate = useNavigate();
  const {
    user,
    signOut
  } = useAuth();
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  // Sample user progress data
  const userProgress = {
    matematik: 75,
    dansk: 68,
    engelsk: 82,
    naturteknik: 71
  };
  const userRoles = [{
    id: "student",
    title: "Elev",
    description: "Log ind som elev for at få adgang til lektioner og spil",
    icon: GraduationCap,
    color: "bg-blue-500 hover:bg-blue-600",
    route: "/auth?role=student"
  }, {
    id: "parent",
    title: "Forælder",
    description: "Følg dit barns fremskridt og kommuniker med skolen",
    icon: Users,
    color: "bg-green-500 hover:bg-green-600",
    route: "/auth?role=parent"
  }, {
    id: "teacher",
    title: "Lærer",
    description: "Administrer klasser og følg elevernes udvikling",
    icon: BookOpen,
    color: "bg-purple-500 hover:bg-purple-600",
    route: "/auth?role=teacher"
  }, {
    id: "school",
    title: "Skole",
    description: "Få overblik over hele skolen og statistikker",
    icon: Building,
    color: "bg-orange-500 hover:bg-orange-600",
    route: "/auth?role=school"
  }];
  if (user) {
    return <div className="min-h-screen bg-gray-900 text-white">
        <nav className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-sm">Α</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold">Athena</h1>
              <Badge variant="outline" className="bg-gradient-to-r from-purple-400 to-cyan-400 text-white border-purple-400">
                Dansk AI Læring
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/profile')} className="border-gray-600 hover:bg-gray-700 text-slate-950">
                Profil
              </Button>
              <Button variant="outline" onClick={signOut} className="border-gray-600 hover:bg-gray-700 text-slate-950">
                Log ud
              </Button>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto p-6 space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              Velkommen tilbage, {user.user_metadata?.name || 'Elev'}! 🎓
            </h2>
            <p className="text-xl text-gray-300">
              Klar til at lære noget nyt i dag?
            </p>
          </div>

          <ProgressDashboard userProgress={userProgress} />
          <AITutor user={user} />
          <GameHub />
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <span className="text-gray-900 font-bold text-2xl">Α</span>
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">Athena</h1>
          <p className="text-xl text-gray-300 mb-8">
            Danmarks mest avancerede AI-platform til læring
          </p>
          <Badge variant="outline" className="bg-gradient-to-r from-purple-400 to-cyan-400 text-white border-purple-400 text-lg px-4 py-2">
            🇩🇰 Tilpasset dansk folkeskole
          </Badge>
        </div>

        {!showRoleSelection ? <div className="text-center space-y-8">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-center">🤖 AI Lærer</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 text-center">
                  Personlig AI-tutor der tilpasser sig din læringsstil og hjælper dig med alle fag.
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-center">🎮 Læringsspil</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 text-center">
                  Lær gennem sjove spil og interaktive aktiviteter der gør læring til leg.
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-center">📊 Fremskridt</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 text-center">
                  Følg din udvikling og se hvor du kan forbedre dig mest.
                </CardContent>
              </Card>
            </div>

            <Button onClick={() => setShowRoleSelection(true)} size="lg" className="bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 text-white border-none text-lg px-8 py-4">
              Kom i gang <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div> : <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Vælg din rolle</h2>
              <p className="text-gray-300 mb-8">Hvordan vil du bruge Athena?</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userRoles.map(role => {
            const IconComponent = role.icon;
            return <Card key={role.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all cursor-pointer" onClick={() => navigate(role.route)}>
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 ${role.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-white text-xl">{role.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-300 text-sm mb-4">{role.description}</p>
                      <Button className={`w-full ${role.color} text-white border-none`}>
                        Log ind som {role.title.toLowerCase()}
                      </Button>
                    </CardContent>
                  </Card>;
          })}
            </div>

            <div className="text-center">
              <Button variant="outline" onClick={() => setShowRoleSelection(false)} className="border-gray-600 hover:bg-gray-700 text-slate-950">
                Tilbage
              </Button>
            </div>
          </div>}
      </div>
    </div>;
};
export default Index;