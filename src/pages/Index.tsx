import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Monitor,
  LayoutDashboard,
  BookOpenCheck,
  Gamepad2,
  BrainCircuit,
  Settings,
  LogOut
} from "lucide-react";
import AuthModal from "@/components/AuthModal";
import ProgressDashboard from "@/components/ProgressDashboard";
import GameHub from "@/components/GameHub";
import EnhancedAITutor from "@/components/EnhancedAITutor";

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [showAITutor, setShowAITutor] = useState(false);

  const userProgress = {
    matematik: 75,
    dansk: 60,
    engelsk: 80,
    naturteknik: 90
  };

  useEffect(() => {
    if (user) {
      console.log("User is logged in:", user);
    }
  }, [user]);

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  const handleModalClose = () => {
    setShowAuthModal(false);
  };

  const handleLogin = () => {
    setShowAuthModal(false);
    // User state will be updated automatically by useAuth hook
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="/" className="flex items-center space-x-2">
            <BrainCircuit className="w-6 h-6 text-blue-500" />
            <span className="font-bold text-lg">Athena</span>
          </a>
          <div className="space-x-4">
            {user ? (
              <>
                <Button variant="ghost" onClick={() => setShowProgress(true)}>
                  <Monitor className="w-4 h-4 mr-2" />
                  Fremskridt
                </Button>
                <Button variant="ghost" onClick={() => setShowGames(true)}>
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Spil
                </Button>
                <Button variant="ghost" onClick={() => setShowAITutor(true)}>
                  <BookOpenCheck className="w-4 h-4 mr-2" />
                  AI Lærer
                </Button>
                <Button variant="outline" onClick={() => navigate('/profile')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Profil
                </Button>
                <Button variant="outline" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Log ud
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={handleGetStarted}>
                  Log ind
                </Button>
                <Button variant="outline" onClick={handleGetStarted}>
                  Start Gratis
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showProgress && user ? (
          <div className="py-8">
            <ProgressDashboard userProgress={userProgress} />
          </div>
        ) : showGames ? (
          <div className="py-8">
            <GameHub />
          </div>
        ) : showAITutor ? (
          <div className="py-8">
            <EnhancedAITutor user={user} />
          </div>
        ) : (
          <>
            <div className="text-center py-20">
              <h1 className="text-5xl font-bold text-white mb-4">
                Velkommen til Athena
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Din personlige platform for sprog og læring.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                onClick={handleGetStarted}
              >
                Kom i gang
              </Button>
            </div>

            <section className="py-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-white">
                  Hvad kan du lære?
                </h2>
                <p className="text-gray-400">
                  Udforsk et bredt udvalg af fag og sprog.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold text-white mb-2">Dansk</h3>
                    <p className="text-gray-300">
                      Forbedre dit ordforråd og grammatik.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold text-white mb-2">Engelsk</h3>
                    <p className="text-gray-300">
                      Bliv flydende i engelsk gennem interaktive øvelser.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold text-white mb-2">Matematik</h3>
                    <p className="text-gray-300">
                      Lær matematik på en sjov og engagerende måde.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="py-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-white">
                  Funktioner
                </h2>
                <p className="text-gray-400">
                  Oplev de mange måder, Athena kan hjælpe dig med at lære.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <LayoutDashboard className="w-6 h-6 text-blue-500 mb-2" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      Personligt Dashboard
                    </h3>
                    <p className="text-gray-300">
                      Få et overblik over dine fremskridt.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <BookOpenCheck className="w-6 h-6 text-green-500 mb-2" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      Interaktive Lektioner
                    </h3>
                    <p className="text-gray-300">
                      Engagerende indhold, der gør læring sjov.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <Gamepad2 className="w-6 h-6 text-purple-500 mb-2" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      Gamificeret Læring
                    </h3>
                    <p className="text-gray-300">
                      Tjen point og badges, mens du lærer.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <BrainCircuit className="w-6 h-6 text-orange-500 mb-2" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      AI-drevet Tutor
                    </h3>
                    <p className="text-gray-300">
                      Få personlig hjælp fra vores AI-tutor.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
            
            <section className="py-20">
              <div className="text-center mb-16">
                <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 mb-4">
                  🚀 Nye Features - Phase 1
                </Badge>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Forbedret Læring med AI
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Oplev de nyeste forbedringer til Athena med avanceret udtale-feedback, 
                  daglige udfordringer og bedre forældre-kommunikation.
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">🎤</div>
                    <h3 className="text-xl font-bold text-white mb-3">Udtale Feedback</h3>
                    <p className="text-gray-300 mb-4">
                      Få øjeblikkelig feedback på din udtale med avanceret stemme-genkendelse.
                    </p>
                    <Badge variant="outline" className="bg-green-600 text-white border-green-600">
                      Nye AI-funktioner
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">🎯</div>
                    <h3 className="text-xl font-bold text-white mb-3">Daglige Udfordringer</h3>
                    <p className="text-gray-300 mb-4">
                      Nye udfordringer hver dag med belønninger og streak-system for motivation.
                    </p>
                    <Badge variant="outline" className="bg-yellow-600 text-white border-yellow-600">
                      Gamification
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">📧</div>
                    <h3 className="text-xl font-bold text-white mb-3">Forældre Rapporter</h3>
                    <p className="text-gray-300 mb-4">
                      Automatiske ugentlige rapporter til forældre med detaljeret fremskridts-tracking.
                    </p>
                    <Badge variant="outline" className="bg-purple-600 text-white border-purple-600">
                      Smart Kommunikation
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center mt-12">
                <Button
                  onClick={() => setShowAITutor(true)}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-4 text-lg"
                >
                  Prøv Forbedret AI Lærer
                </Button>
              </div>
            </section>

            <section className="py-12">
              <div className="text-center">
                <h2 className="text-3xl font-semibold text-white mb-4">
                  Klar til at starte?
                </h2>
                <p className="text-gray-400 mb-8">
                  Opret en gratis konto og begynd din læringsrejse i dag!
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                  onClick={handleGetStarted}
                >
                  Tilmeld dig gratis
                </Button>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="bg-gray-800 p-4 text-center">
        <p className="text-gray-500">
          &copy; {new Date().getFullYear()} Athena. Alle rettigheder forbeholdes.
        </p>
      </footer>

      {showAuthModal && (
        <AuthModal 
          onClose={handleModalClose} 
          onLogin={handleLogin} 
        />
      )}
    </div>
  );
};

export default Index;
