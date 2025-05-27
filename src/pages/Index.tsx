import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Crown, Trophy, Coins, Book, Users, Star, Search, Menu } from "lucide-react";
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
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-purple-500 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-green-400 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-8 h-8 bg-yellow-400 rounded-full opacity-50"></div>
        <div className="absolute top-60 right-1/3 w-3 h-3 bg-blue-400 rounded-full opacity-70 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-5 h-5 bg-pink-400 rounded-full opacity-60"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <h1 className="text-2xl font-bold">Læreleg</h1>
              </div>
              
              {user && (
                <nav className="hidden md:flex items-center space-x-6">
                  <a href="#" className="text-green-400 hover:text-green-300 transition-colors">Hjem</a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Om os</a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Udforsk</a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Kontakt</a>
                </nav>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="hidden md:flex items-center space-x-4">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Søg efter emner..."
                        className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-green-400 focus:outline-none"
                      />
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span className="font-semibold text-yellow-400">{learekroner}</span>
                    </div>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white border-0"
                  >
                    Profil
                  </Button>
                </>
              ) : (
                <>
                  <div className="hidden md:block">
                    <input 
                      type="text" 
                      placeholder="Søg efter emner..."
                      className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-green-400 focus:outline-none"
                    />
                  </div>
                  <Button 
                    onClick={() => setShowAuth(true)}
                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white border-0"
                  >
                    Tilslut Profil
                  </Button>
                </>
              )}
              <Button variant="ghost" size="icon" className="md:hidden text-white">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {!user ? (
          <div className="container mx-auto px-4 py-16">
            {/* Hero Section */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              <div className="space-y-8">
                <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Skab, Udforsk &<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                    Saml Digital Læring
                  </span>
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Køb og sælg læring fra verdens top lærere. Mere end 1.000 premium digitale læringspakker er tilgængelige for dig!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg"
                    onClick={() => setShowAuth(true)}
                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-8 py-4 text-lg rounded-xl"
                  >
                    Start Indsamling
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-800 px-8 py-4 text-lg rounded-xl"
                  >
                    Opret Læring
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-purple-900 to-blue-900 border-purple-500/20 transform rotate-3 hover:rotate-6 transition-transform">
                    <CardContent className="p-6">
                      <div className="w-full h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-4xl">🧮</span>
                      </div>
                      <h3 className="font-bold text-white mb-2">Matematik Viking</h3>
                      <p className="text-sm text-gray-300">2t 4m 32s</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-green-400 font-bold">125 kr</span>
                        <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                          Byd
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-green-900 to-teal-900 border-green-500/20 transform -rotate-2 hover:-rotate-3 transition-transform mt-8">
                    <CardContent className="p-6">
                      <div className="w-full h-40 bg-gradient-to-br from-green-400 to-teal-400 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-4xl">📚</span>
                      </div>
                      <h3 className="font-bold text-white mb-2">Dansk Mester</h3>
                      <p className="text-sm text-gray-300">1t 45m 12s</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-green-400 font-bold">89 kr</span>
                        <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                          Byd
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Top Seller Section */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold">
                  Top Lærer i <span className="text-green-400">1 dag</span>
                </h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {[
                  { name: "Emil Hansen", amount: "7.080 kr", emoji: "👨‍🏫" },
                  { name: "Maria Larsen", amount: "6.540 kr", emoji: "👩‍🔬" },
                  { name: "Lars Nielsen", amount: "6.120 kr", emoji: "👨‍💻" },
                  { name: "Sophie Andersen", amount: "5.890 kr", emoji: "👩‍🎨" },
                  { name: "Thomas Jensen", amount: "5.670 kr", emoji: "👨‍🎓" },
                  { name: "Anna Petersen", amount: "5.440 kr", emoji: "👩‍🏫" }
                ].map((teacher, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700 hover:border-green-400/50 transition-colors">
                    <CardContent className="p-4 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">
                        {teacher.emoji}
                      </div>
                      <h4 className="font-semibold text-white mb-1">{teacher.name}</h4>
                      <p className="text-green-400 font-bold">{teacher.amount}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Live Bidding Section */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold">Live Undervisning</h3>
                <Button variant="link" className="text-green-400 hover:text-green-300">
                  Opdag Mere
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Avanceret Matematik", subject: "Matematik", time: "2t 15m", price: "245 kr" },
                  { title: "Kreativ Skrivning", subject: "Dansk", time: "1t 45m", price: "189 kr" },
                  { title: "Engelsk Konversation", subject: "Engelsk", time: "1t 30m", price: "156 kr" },
                  { title: "Naturvidenskab", subject: "Natur/Teknik", time: "2t 0m", price: "198 kr" }
                ].map((course, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700 hover:border-green-400/50 transition-colors overflow-hidden group">
                    <div className="h-48 bg-gradient-to-br from-purple-500 via-blue-500 to-green-500 relative">
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <Button size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm">
                          Deltag Nu
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold text-white mb-2">{course.title}</h4>
                      <p className="text-gray-400 text-sm mb-3">{course.subject}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">{course.time}</span>
                        <span className="text-green-400 font-bold">{course.price}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <h4 className="text-4xl font-bold text-white mb-2">1.5K+</h4>
                <p className="text-gray-400">Samlinger</p>
              </div>
              <div className="text-center">
                <h4 className="text-4xl font-bold text-white mb-2">217K+</h4>
                <p className="text-gray-400">Læringsmoduler</p>
              </div>
              <div className="text-center">
                <h4 className="text-4xl font-bold text-white mb-2">3.7K+</h4>
                <p className="text-gray-400">Lærere</p>
              </div>
            </div>

            {/* How it works */}
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold mb-12">Trin for Trin Skab og Sælg Din Læring</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { step: 1, title: "Opsæt Din Profil", desc: "Opret din læringsprofil og tilpas den til dine behov", icon: "💼" },
                  { step: 2, title: "Opret Samling", desc: "Byg din egen samling af læringsmoduler og øvelser", icon: "📚" },
                  { step: 3, title: "Tilføj Din Læring", desc: "Upload dine læringsmoduler og gør dem tilgængelige", icon: "🎓" },
                  { step: 4, title: "Sælg Din Læring", desc: "Start med at tjene på din viden og undervisning", icon: "💰" }
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl">
                      {item.icon}
                    </div>
                    <h4 className="font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-8">
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 bg-gray-800 border border-gray-700">
                <TabsTrigger value="dashboard" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="tutor" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  AI Lærer
                </TabsTrigger>
                <TabsTrigger value="games" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                  Spil
                </TabsTrigger>
                <TabsTrigger value="progress" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
                  Fremskridt
                </TabsTrigger>
                <TabsTrigger value="subscription" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                  Abonnement
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="col-span-full lg:col-span-2 bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span>Dagens Udfordringer</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Matematik: Brøker</span>
                          <span className="text-gray-300">15/20 opgaver</span>
                        </div>
                        <Progress value={75} className="h-2 bg-gray-700" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Dansk: Stavning</span>
                          <span className="text-gray-300">8/15 ord</span>
                        </div>
                        <Progress value={53} className="h-2 bg-gray-700" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Engelsk: Ordforråd</span>
                          <span className="text-gray-300">12/12 ord ✓</span>
                        </div>
                        <Progress value={100} className="h-2 bg-gray-700" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-center text-white">Dine Badges</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Badge variant="outline" className="p-2 border-yellow-700 text-yellow-400 bg-gray-700">
                          🏆 Matematik Viking
                        </Badge>
                        <Badge variant="outline" className="p-2 border-blue-700 text-blue-400 bg-gray-700">
                          📚 Ordets Mester
                        </Badge>
                        <Badge variant="outline" className="p-2 border-green-700 text-green-400 bg-gray-700">
                          🎯 Stavning Pro
                        </Badge>
                        <Badge variant="outline" className="p-2 border-purple-700 text-purple-400 bg-gray-700">
                          🧪 Natur Forsker
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="col-span-full bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Hurtig Adgang</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white">
                          <span className="text-2xl">🏰</span>
                          <span className="text-sm">Byg En Vikingborg</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white">
                          <span className="text-2xl">🔍</span>
                          <span className="text-sm">Ordjagt AR</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white">
                          <span className="text-2xl">🥪</span>
                          <span className="text-sm">Kod Smørrebrød</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white">
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
          </div>
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
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-full w-16 h-16 shadow-lg"
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
