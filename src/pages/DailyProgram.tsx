
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UserMetadata } from "@/types/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Target, Play } from "lucide-react";
import { aiUniverseGenerator } from '@/services/AIUniverseGenerator';
import { Universe } from '@/services/UniverseGenerator';
import { demoScenarios } from '@/data/demoScenarios';

const DailyProgram = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [universe, setUniverse] = useState<Universe | null>(null);
  const [universeLoading, setUniverseLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  console.log('🎓 DailyProgram component rendered:', {
    userExists: !!user,
    loading,
    timestamp: new Date().toISOString()
  });
  
  const metadata = user?.user_metadata as UserMetadata | undefined;
  const firstName = metadata?.name?.split(' ')[0] || metadata?.first_name || 'Student';
  
  // Scroll to top when page loads
  useEffect(() => {
    console.log('🎓 DailyProgram useEffect - scrolling to top');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Generate universe on load
  useEffect(() => {
    if (user) {
      generateUniverse();
    }
  }, [user]);

  const generateUniverse = async () => {
    setUniverseLoading(true);
    setError(null);
    
    try {
      const prompt = "Create an engaging daily learning universe for students with interactive activities, interesting characters, and educational adventures.";
      const result = await aiUniverseGenerator.generateUniverse(prompt);
      
      if (result) {
        setUniverse(result);
        console.log('✅ Universe generated successfully:', result);
      } else {
        setError('Failed to generate universe');
      }
    } catch (err) {
      console.error('❌ Universe generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate universe');
    } finally {
      setUniverseLoading(false);
    }
  };

  const handleStartScenario = (scenarioId: string) => {
    console.log("Starting scenario:", scenarioId);
    navigate('/educational-simulator', { state: { scenarioId } });
  };

  // Show loading state while authentication is being checked
  if (loading) {
    console.log('🎓 DailyProgram showing loading state');
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎓</div>
          <p className="text-lg">Loading your daily program...</p>
        </div>
      </div>
    );
  }

  console.log('🎓 DailyProgram rendering main content:', {
    userAuthenticated: !!user,
    firstName,
    todaysDate: new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  });

  // Main content for authenticated users
  if (user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-white hover:text-gray-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>

          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-400" />
              Today's Learning Universe
            </h1>
            <p className="text-gray-300 text-lg">
              Welcome {firstName}! Your personalized daily learning adventure awaits.
            </p>
            <p className="text-blue-200 mt-2">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Universe Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Target className="w-6 h-6 text-cyan-400" />
                Your Daily Universe
              </h2>
              <Button onClick={generateUniverse} disabled={universeLoading} variant="outline" className="text-white border-gray-600">
                {universeLoading ? 'Generating...' : 'Generate New Universe'}
              </Button>
            </div>

            {universeLoading && !universe && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
                <p className="text-lg text-gray-300">Creating your personalized learning universe...</p>
              </div>
            )}

            {error && (
              <Card className="bg-red-900/20 border-red-700">
                <CardContent className="pt-6">
                  <div className="text-center text-red-400">
                    <p className="mb-4">❌ {error}</p>
                    <Button onClick={generateUniverse} variant="outline">
                      Try Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {universe && (
              <div className="space-y-6">
                <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-400/30">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white">{universe.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-gray-300">{universe.description}</p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        🎭 Characters
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {universe.characters?.length > 0 ? (
                          universe.characters.map((character, index) => (
                            <li key={index} className="text-sm text-gray-300">
                              • {character}
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-gray-400">Discovering characters...</li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        🌍 Locations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {universe.locations?.length > 0 ? (
                          universe.locations.map((location, index) => (
                            <li key={index} className="text-sm text-gray-300">
                              • {location}
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-gray-400">Exploring locations...</li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        🎯 Activities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {universe.activities?.length > 0 ? (
                          universe.activities.map((activity, index) => (
                            <li key={index} className="text-sm text-gray-300">
                              • {activity}
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-gray-400">Planning activities...</li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>

          {/* Scenarios Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Play className="w-6 h-6 text-green-400" />
              Interactive Learning Scenarios
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {demoScenarios.map(scenario => (
                <Card key={scenario.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      {scenario.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm">{scenario.description}</p>
                    <div className="text-xs text-gray-400">
                      <span className="font-semibold">Subject:</span> {scenario.educational.subject}
                      <span className="mx-2">|</span>
                      <span className="font-semibold">Grade:</span> {scenario.educational.gradeLevel}
                    </div>
                    <Button
                      onClick={() => handleStartScenario(scenario.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Scenario
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Content for non-authenticated users
  console.log('🎓 DailyProgram rendering guest content');
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🎓</div>
          <h1 className="text-3xl font-bold mb-4">Today's Learning Universe</h1>
          <p className="text-gray-300 mb-6">
            Discover your personalized learning adventure. Sign in for the full experience.
          </p>
          <Button 
            onClick={() => navigate('/auth')} 
            className="bg-blue-600 hover:bg-blue-700 mb-8"
          >
            Sign In for Full Access
          </Button>
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => navigate('/')} className="border-gray-600 text-slate-950 bg-sky-50">
            Back to home page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DailyProgram;
