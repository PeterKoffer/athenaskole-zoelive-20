
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { aiUniverseGenerator } from '@/services/AIUniverseGenerator';
import { Universe } from '@/services/UniverseGenerator';

const DailyUniversePage = () => {
  const navigate = useNavigate();
  const [universe, setUniverse] = useState<Universe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateUniverse = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    generateUniverse();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center">
                <Sparkles className="w-8 h-8 mr-3 text-primary" />
                Daily Universe
              </h1>
              <p className="text-muted-foreground">Your personalized learning adventure</p>
            </div>
          </div>
          <Button onClick={generateUniverse} disabled={loading} variant="outline">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate New Universe'
            )}
          </Button>
        </div>

        {loading && !universe && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg text-muted-foreground">Creating your personalized learning universe...</p>
          </div>
        )}

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="text-center text-destructive">
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
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardHeader>
                <CardTitle className="text-2xl">{universe.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground">{universe.description}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    🎭 Characters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {universe.characters?.map((character, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {character}
                      </li>
                    )) || <li className="text-sm text-muted-foreground">No characters available</li>}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    🌍 Locations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {universe.locations?.map((location, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {location}
                      </li>
                    )) || <li className="text-sm text-muted-foreground">No locations available</li>}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    🎯 Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {universe.activities?.map((activity, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {activity}
                      </li>
                    )) || <li className="text-sm text-muted-foreground">No activities available</li>}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Your Adventure
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyUniversePage;
