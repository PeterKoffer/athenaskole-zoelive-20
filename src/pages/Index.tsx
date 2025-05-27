
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Crown, Trophy, Coins, Book, Users, Star } from "lucide-react";
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

  const handleLogin = (userData) => {
    setUser(userData);
    setShowAuth(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-red-50 to-white">
      {/* Danish Flag Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-lg">L</span>
              </div>
              <h1 className="text-2xl font-bold">Læreleg</h1>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Learning Play
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                    <Coins className="w-4 h-4 text-yellow-300" />
                    <span className="font-semibold">{learekroner} Lære-Kroner</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="font-bold">{user.name[0]}</span>
                    </div>
                    <span>Hej, {user.name}!</span>
                  </div>
                </>
              ) : (
                <Button 
                  variant="secondary" 
                  onClick={() => setShowAuth(true)}
                  className="bg-white text-red-600 hover:bg-gray-100"
                >
                  Log ind
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!user ? (
          <div className="text-center py-16">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Velkommen til Læreleg! 🇩🇰
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                AI-drevet læring med danske værdier - Gør læring til leg!
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
                  <CardHeader className="text-center">
                    <Book className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <CardTitle className="text-blue-800">AI Lærer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Personlig AI-tutor med dansk stemme og tilpasset til Folkeskole curriculum
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
                  <CardHeader className="text-center">
                    <Trophy className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <CardTitle className="text-green-800">Spil & Belønninger</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Tjen Lære-Kroner, lås op for badges og konkurrér venligt med klassekammerater
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors">
                  <CardHeader className="text-center">
                    <Users className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                    <CardTitle className="text-purple-800">Forældreindblanding</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Ugentlige rapporter og fremskridtsanalyse til forældre og lærere
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Button 
                size="lg" 
                onClick={() => setShowAuth(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
              >
                Start din lærerejse gratis
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-white border-2 border-gray-200">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-800">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="tutor" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
                AI Lærer
              </TabsTrigger>
              <TabsTrigger value="games" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
                Spil
              </TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
                Fremskridt
              </TabsTrigger>
              <TabsTrigger value="subscription" className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-800">
                Abonnement
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="col-span-full lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span>Dagens Udfordringer</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Matematik: Brøker</span>
                        <span>15/20 opgaver</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Dansk: Stavning</span>
                        <span>8/15 ord</span>
                      </div>
                      <Progress value={53} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Engelsk: Ordforråd</span>
                        <span>12/12 ord ✓</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Dine Badges</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Badge variant="outline" className="p-2 border-yellow-300 text-yellow-700">
                        🏆 Matematik Viking
                      </Badge>
                      <Badge variant="outline" className="p-2 border-blue-300 text-blue-700">
                        📚 Ordets Mester
                      </Badge>
                      <Badge variant="outline" className="p-2 border-green-300 text-green-700">
                        🎯 Stavning Pro
                      </Badge>
                      <Badge variant="outline" className="p-2 border-purple-300 text-purple-700">
                        🧪 Natur Forsker
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-full">
                  <CardHeader>
                    <CardTitle>Hurtig Adgang</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button variant="outline" className="h-20 flex flex-col space-y-2">
                        <span className="text-2xl">🏰</span>
                        <span className="text-sm">Byg En Vikingborg</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col space-y-2">
                        <span className="text-2xl">🔍</span>
                        <span className="text-sm">Ordjagt AR</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col space-y-2">
                        <span className="text-2xl">🥪</span>
                        <span className="text-sm">Kod Smørrebrød</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col space-y-2">
                        <span className="text-2xl">🎓</span>
                        <span className="text-sm">AI Lærer Chat</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tutor">
              <AITutor />
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
          </Tabs>
        )}
      </main>

      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)} 
          onLogin={handleLogin} 
        />
      )}

      {/* Pyt-tid Button - Danish stress relief */}
      {user && (
        <div className="fixed bottom-6 right-6">
          <Button 
            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full w-16 h-16 shadow-lg"
            onClick={() => alert("Pyt-tid! Tag en dyb indånding og byg nogle LEGO klodser 🧱")}
          >
            <span className="text-2xl">😌</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;
