
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, TrendingUp, Zap, BookOpen } from 'lucide-react';
import AILearningModule from './AILearningModule';

interface AIStats {
  totalSessions: number;
  averageScore: number;
  subjectsStudied: string[];
  currentStreak: number;
}

const AILearningDashboard = () => {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState<{subject: string, skillArea: string} | null>(null);
  const [aiStats, setAiStats] = useState<AIStats>({
    totalSessions: 0,
    averageScore: 0,
    subjectsStudied: [],
    currentStreak: 0
  });
  const [loading, setLoading] = useState(true);

  const availableModules = [
    { subject: 'mathematics', skillArea: 'fractions', title: 'Brøker', description: 'AI-tilpasset matematiklæring' },
    { subject: 'english', skillArea: 'spelling', title: 'Stavning', description: 'Intelligent engelsk træning' },
    { subject: 'english', skillArea: 'grammar', title: 'Grammatik', description: 'AI-drevet sprogtræning' }
  ];

  useEffect(() => {
    if (user) {
      loadAIStats();
    }
  }, [user]);

  const loadAIStats = async () => {
    if (!user) return;

    try {
      // Get learning sessions stats
      const { data: sessions } = await supabase
        .from('learning_sessions')
        .select('subject, score, completed')
        .eq('user_id', user.id)
        .eq('completed', true);

      // Get AI interaction stats
      const { data: interactions } = await supabase
        .from('ai_interactions')
        .select('subject, success')
        .eq('user_id', user.id)
        .eq('interaction_type', 'content_generation');

      const totalSessions = sessions?.length || 0;
      const averageScore = sessions?.length 
        ? sessions.reduce((sum, session) => sum + (session.score || 0), 0) / sessions.length 
        : 0;
      
      const subjectsStudied = [...new Set(sessions?.map(s => s.subject) || [])];

      setAiStats({
        totalSessions,
        averageScore,
        subjectsStudied,
        currentStreak: Math.min(totalSessions, 5) // Simple streak calculation
      });
    } catch (error) {
      console.error('Error loading AI stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleComplete = (score: number) => {
    loadAIStats(); // Refresh stats after completion
    setTimeout(() => {
      setActiveModule(null); // Return to dashboard after short delay
    }, 3000);
  };

  if (activeModule) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setActiveModule(null)}
          className="mb-4"
        >
          ← Tilbage til AI Dashboard
        </Button>
        <AILearningModule 
          subject={activeModule.subject}
          skillArea={activeModule.skillArea}
          onComplete={handleModuleComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Learning Header */}
      <Card className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 border-purple-400">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
                <Brain className="w-8 h-8 text-lime-400" />
                <span>AI-Drevet Læring</span>
              </h1>
              <p className="text-gray-300 mt-1">Personlig, adaptiv læring med kunstig intelligens</p>
            </div>
            <Badge className="bg-lime-400 text-black text-lg px-4 py-2">
              <Sparkles className="w-4 h-4 mr-1" />
              AI-Aktiveret
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* AI Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{aiStats.totalSessions}</p>
                <p className="text-gray-400 text-sm">AI Sessioner</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{aiStats.averageScore.toFixed(0)}%</p>
                <p className="text-gray-400 text-sm">Gennemsnit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">{aiStats.subjectsStudied.length}</p>
                <p className="text-gray-400 text-sm">Fag Studeret</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">{aiStats.currentStreak}</p>
                <p className="text-gray-400 text-sm">Række dage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available AI Modules */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Sparkles className="w-5 h-5 text-lime-400" />
            <span>Tilgængelige AI-Læringsmoduler</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableModules.map((module, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-purple-400 transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white">{module.title}</h3>
                    <Badge variant="outline" className="bg-purple-600 text-white border-purple-600">
                      <Brain className="w-3 h-3 mr-1" />
                      AI
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{module.description}</p>
                  <Button 
                    onClick={() => setActiveModule({ subject: module.subject, skillArea: module.skillArea })}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start AI-Læring
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Learning Benefits */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Brain className="w-5 h-5 text-lime-400" />
            <span>Hvorfor AI-Læring?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-lime-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-white">Personlig Tilpasning</h4>
                  <p className="text-gray-400 text-sm">AI'en tilpasser vanskeligheden baseret på din præstation</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-white">Kontinuerlig Forbedring</h4>
                  <p className="text-gray-400 text-sm">Systemet lærer af dine svar og optimerer din læringsoplevelse</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-white">Øjeblikkelig Feedback</h4>
                  <p className="text-gray-400 text-sm">Få forklaringer og hints i realtid</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <BookOpen className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-white">Adaptivt Indhold</h4>
                  <p className="text-gray-400 text-sm">Spørgsmål og øvelser genereres specifikt til dit niveau</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AILearningDashboard;
