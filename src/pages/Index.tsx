import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Crown, Trophy, Coins, Book, Users, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthModal from "@/components/AuthModal";
import AITutor from "@/components/AITutor";
import GameHub from "@/components/GameHub";
import ProgressDashboard from "@/components/ProgressDashboard";
import SubscriptionPlans from "@/components/SubscriptionPlans";

const Index = () => {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [learekroner, setLearekroner] = useState(125);
  const [userProgress, setUserProgress] = useState({
    matematik: 80,
    dansk: 65,
    engelsk: 72,
    naturteknik: 58
  });
  const navigate = useNavigate();

  const handleLogin = userData => {
    setUser(userData);
    setShowAuth(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return <div className="min-h-screen bg-gray-900">
      {/* Dark NFT-style Header */}
      <header className="bg-gray-900 border-b border-gray-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* New Athena Logo */}
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-lg">Α</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Athena
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? <>
                  <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-full border border-gray-700">
                    <Coins className="w-4 h-4 text-lime-400" />
                    <span className="font-semibold text-white">{learekroner} Lære-Kroner</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleProfileClick}
                      className="w-10 h-10 bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-400 rounded-full flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                    >
                      <span className="font-bold text-white text-lg">{user.name[0]}</span>
                    </button>
                    <span className="text-white">Hej, {user.name}!</span>
                  </div>
                </> : <Button variant="secondary" onClick={() => setShowAuth(true)} className="bg-gradient-to-r from-purple-400 to-cyan-400 text-white hover:from-purple-500 hover:to-cyan-500 border-none">
                  Log ind
                </Button>}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!user ? <div className="text-center py-16 relative overflow-hidden">
            {/* Background decoration dots */}
            <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400 rounded-full"></div>
            <div className="absolute top-40 right-32 w-3 h-3 bg-cyan-400 rounded-full"></div>
            <div className="absolute bottom-40 left-40 w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-4 h-4 bg-purple-500 rounded-full"></div>
            
            <div className="mb-8 relative z-10">
              <h2 className="text-5xl font-bold text-white mb-4">
                Velkommen til Athena! 🇩🇰
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                AI-drevet læring med danske værdier - Din personlige læringsguddess!
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
                <Card className="bg-gray-800 border-gray-700 hover:border-purple-400 transition-colors group">
                  <CardHeader className="text-center">
                    <Book className="w-12 h-12 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <CardTitle className="text-white">AI Lærer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      Personlig AI-tutor med dansk stemme og tilpasset til Folkeskole curriculum
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700 hover:border-cyan-400 transition-colors group">
                  <CardHeader className="text-center">
                    <Trophy className="w-12 h-12 text-cyan-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <CardTitle className="text-white">3D Badges & Belønninger</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      Tjen Lære-Kroner, lås op for 3D Pixar-style badges og konkurrér venligt
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700 hover:border-blue-400 transition-colors group">
                  <CardHeader className="text-center">
                    <Users className="w-12 h-12 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <CardTitle className="text-white">Personlig Profil</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      Dine fremskridt, badges og personlige læringsrejse på ét sted
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Button size="lg" onClick={() => setShowAuth(true)} className="bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 text-white px-8 py-3 text-lg font-semibold rounded-full border-none">
                  Start din lærerejse gratis
                </Button>
                <Button size="lg" variant="outline" className="border-gray-600 px-8 py-3 text-lg ml-4 rounded-full bg-slate-50 text-slate-950">
                  Udforsk mere
                </Button>
              </div>
            </div>
          </div> : <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-gray-800 border border-gray-700">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-cyan-400 data-[state=active]:text-white text-gray-300">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="tutor" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-cyan-400 data-[state=active]:text-white text-gray-300">
                AI Lærer
              </TabsTrigger>
              <TabsTrigger value="games" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-cyan-400 data-[state=active]:text-white text-gray-300">
                Spil
              </TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-cyan-400 data-[state=active]:text-white text-gray-300">
                Fremskridt
              </TabsTrigger>
              <TabsTrigger value="subscription" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-cyan-400 data-[state=active]:text-white text-gray-300">
                Abonnement
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="col-span-full lg:col-span-2 bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <Star className="w-5 h-5 text-purple-400" />
                      <span>Dagens Udfordringer</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-white">
                        <span>Matematik: Brøker</span>
                        <span>15/20 opgaver</span>
                      </div>
                      <Progress value={75} className="h-2 bg-gray-700" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-white">
                        <span>Dansk: Stavning</span>
                        <span>8/15 ord</span>
                      </div>
                      <Progress value={53} className="h-2 bg-gray-700" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-white">
                        <span>Engelsk: Ordforråd</span>
                        <span>12/12 ord ✓</span>
                      </div>
                      <Progress value={100} className="h-2 bg-gray-700" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-center text-white">Dine 3D Badges</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 transform hover:scale-105 transition-transform shadow-lg">
                        <div className="text-2xl mb-1">🏆</div>
                        <div className="text-xs font-semibold text-white">Matematik Viking</div>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 transform hover:scale-105 transition-transform shadow-lg">
                        <div className="text-2xl mb-1">📚</div>
                        <div className="text-xs font-semibold text-white">Ordets Mester</div>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 transform hover:scale-105 transition-transform shadow-lg">
                        <div className="text-2xl mb-1">🎯</div>
                        <div className="text-xs font-semibold text-white">Stavning Pro</div>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 transform hover:scale-105 transition-transform shadow-lg">
                        <div className="text-2xl mb-1">🧪</div>
                        <div className="text-xs font-semibold text-white">Natur Forsker</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-full bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Hurtig Adgang</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-lime-400 text-white">
                        <span className="text-2xl">🏰</span>
                        <span className="text-sm">Byg En Vikingborg</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-lime-400 text-white">
                        <span className="text-2xl">🔍</span>
                        <span className="text-sm">Ordjagt AR</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-lime-400 text-white">
                        <span className="text-2xl">🥪</span>
                        <span className="text-sm">Kod Smørrebrød</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-lime-400 text-white">
                        <span className="text-2xl">🎓</span>
                        <span className="text-sm">AI Lærer Chat</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tutor">
              <AITutor user={user} />
            </TabsContent>

            <TabsContent value="games">
              <GameHub />
            </TabsContent>

            <TabsContent value="progress">
              <ProgressDashboard userProgress={userProgress} />
            </TabsContent>

            <TabsContent value="subscription">
              <SubscriptionPlans />
            </TabsContent>
          </Tabs>}
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={handleLogin} />}

      {/* Pyt-tid Button - Danish stress relief */}
      {user && <div className="fixed bottom-6 right-6">
          <Button className="bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 text-white rounded-full w-16 h-16 shadow-lg border-none" onClick={() => alert("Pyt-tid! Tag en dyb indånding og byg nogle LEGO klodser 🧱")}>
            <span className="text-2xl">😌</span>
          </Button>
        </div>}
    </div>;
};

export default Index;
