
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { aiUniverseGenerator } from '@/services/AIUniverseGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Users, MapPin, Target } from 'lucide-react';
import { Universe } from '@/services/UniverseGenerator';

const DailyUniversePage = () => {
  const { user } = useAuth();
  const [universe, setUniverse] = useState<Universe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateUniverse = async () => {
    if (!user) return;

    console.log('📡 DailyUniversePage: Starting AI universe generation...');
    console.log('👤 Student profile:', user);
    
    setLoading(true);
    setError(null);
    
    try {
      const generatedUniverse = await aiUniverseGenerator.generateUniverse(user);
      console.log('🎯 Generated universe:', generatedUniverse);
      
      if (generatedUniverse) {
        setUniverse(generatedUniverse);
      } else {
        setError('Failed to generate universe - no content returned');
      }
    } catch (err) {
      console.error('❌ Universe generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate universe');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !universe && !loading) {
      generateUniverse();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please sign in to access your daily learning universe.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Daily Learning Universe</h1>
          </div>
          <p className="text-xl text-purple-200">Your personalized AI-generated learning adventure</p>
        </div>

        {/* Loading State */}
        {loading && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto" />
                <div className="space-y-2">
                  <p className="text-white text-lg font-medium">Nelie is creating your universe...</p>
                  <p className="text-gray-300">This may take a moment</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="bg-red-900/20 border-red-700">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-red-300 text-lg">Error generating universe: {error}</p>
                <Button onClick={generateUniverse} variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Universe Content */}
        {universe && !loading && (
          <div className="space-y-6">
            {/* Main Universe Card */}
            <Card className="bg-gray-800/50 border-gray-700 text-white">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  <CardTitle className="text-3xl font-bold">{universe.title}</CardTitle>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>AI-Generated Theme: {universe.theme || 'Learning Adventure'}</span>
                  <span className="px-2 py-1 bg-green-600 text-white rounded text-xs">Powered by Nelie</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-lg leading-relaxed text-center">
                  {universe.description}
                </p>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-800/50 border-gray-700 text-white text-center">
                <CardContent className="pt-6">
                  <Target className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <div className="text-2xl font-bold text-blue-400">{universe.activities?.length || 0}</div>
                  <div className="text-gray-400">AI-Generated Challenges</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700 text-white text-center">
                <CardContent className="pt-6">
                  <Users className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <div className="text-2xl font-bold text-purple-400">~45</div>
                  <div className="text-gray-400">Minutes of Fun</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700 text-white text-center">
                <CardContent className="pt-6">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                  <div className="text-2xl font-bold text-yellow-400">{universe.characters?.length || 0}</div>
                  <div className="text-gray-400">Achievements</div>
                </CardContent>
              </Card>
            </div>

            {/* Universe Details */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Characters */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    Characters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {universe.characters?.map((character, index) => (
                      <div key={index} className="bg-gray-700/50 p-3 rounded-lg">
                        <p className="text-white text-sm">{character}</p>
                      </div>
                    )) || <p className="text-gray-400">No characters available</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Locations */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    Locations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {universe.locations?.map((location, index) => (
                      <div key={index} className="bg-gray-700/50 p-3 rounded-lg">
                        <p className="text-white text-sm">{location}</p>
                      </div>
                    )) || <p className="text-gray-400">No locations available</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Activities */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-400" />
                    Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {universe.activities?.map((activity, index) => (
                      <div key={index} className="bg-gray-700/50 p-3 rounded-lg">
                        <p className="text-white text-sm">{activity}</p>
                      </div>
                    )) || <p className="text-gray-400">No activities available</p>}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="text-center space-y-4">
              <Button 
                onClick={generateUniverse}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate New Universe
              </Button>
              <p className="text-gray-400 text-sm">
                Powered by Nelie AI - Your personalized learning companion
              </p>
            </div>
          </div>
        )}

        {/* Default message when no universe */}
        {!universe && !loading && !error && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="text-center py-12">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-semibold text-white mb-2">Ready to explore?</h3>
              <p className="text-gray-300 mb-6">Let Nelie create your personalized learning universe!</p>
              <Button onClick={generateUniverse} size="lg" className="bg-purple-600 hover:bg-purple-700">
                Generate My Universe
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DailyUniversePage;
