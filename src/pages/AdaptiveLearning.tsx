import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import AILearningModule from '@/components/adaptive-learning/AILearningModule';
import PerformanceAnalytics from '@/components/adaptive-learning/PerformanceAnalytics';
import { Brain, BarChart3, BookOpen, Target, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const subjects = [
  { id: 'matematik', name: 'Matematik', skills: ['addition', 'subtraction', 'multiplication', 'division', 'fractions'], color: 'bg-blue-500' },
  { id: 'dansk', name: 'Dansk', skills: ['spelling', 'grammar', 'reading', 'writing'], color: 'bg-red-500' },
  { id: 'engelsk', name: 'Engelsk', skills: ['vocabulary', 'grammar', 'reading', 'speaking'], color: 'bg-green-500' },
  { id: 'naturteknik', name: 'Natur/Teknik', skills: ['science', 'technology', 'experiments', 'nature'], color: 'bg-purple-500' }
];

const AdaptiveLearning = () => {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [showEngine, setShowEngine] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);

  const handleSubjectSelect = (subjectId: string) => {
    console.log('📚 Subject selected:', subjectId);
    setSelectedSubject(subjectId);
    setSelectedSkill(null);
    setShowEngine(false);
  };

  const handleSkillSelect = (skill: string) => {
    console.log('🎯 Skill selected:', skill, 'for subject:', selectedSubject);
    setSelectedSkill(skill);
    setShowEngine(true);
    setSessionKey(prev => prev + 1);
  };

  const handleComplete = (score: number) => {
    console.log('✅ AI Learning session completed with score:', score);
    setShowEngine(false);
    setSelectedSkill(null);
  };

  const handleQuickTest = () => {
    console.log('🚀 QUICK TEST BUTTON CLICKED - Starting QUICK AI TEST');
    console.log('👤 Current user:', user?.id);
    console.log('📋 Setting subject to matematik, skill to fractions');
    
    setSelectedSubject('matematik');
    setSelectedSkill('fractions');
    setShowEngine(true);
    setSessionKey(prev => {
      const newKey = prev + 1;
      console.log('🔑 New session key:', newKey);
      return newKey;
    });
    
    console.log('✅ Quick test setup complete - AI should start generating now');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-4">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-red-900 border-red-700">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Login Required</h3>
              <p className="text-red-300">Du skal være logget ind for at bruge AI-læring.</p>
              <Button 
                onClick={() => window.location.href = '/auth'}
                className="mt-4 bg-red-600 hover:bg-red-700"
              >
                Log ind
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">
            Adaptiv AI Læring med <span className="text-lime-400">Nelie</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Personlig læring der tilpasser sig dit niveau og læringsstil
          </p>
        </div>

        <Tabs defaultValue="learning" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900">
            <TabsTrigger value="learning" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Adaptiv Læring</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Performance Analyse</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learning" className="space-y-6">
            {!showEngine ? (
              <>
                <Card className="bg-gradient-to-r from-lime-900 to-green-900 border-lime-400">
                  <CardContent className="p-6 text-center">
                    <Brain className="w-12 h-12 text-lime-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Test Real AI Generation Now!</h3>
                    <p className="text-lime-200 mb-4">
                      Skip setup and test REAL AI-generated math questions powered by OpenAI
                    </p>
                    <Button
                      onClick={handleQuickTest}
                      className="bg-lime-400 hover:bg-lime-500 text-black font-semibold"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Quick AI Test - Math Fractions
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <BookOpen className="w-5 h-5 text-lime-400" />
                      <span>Vælg Fag</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {subjects.map((subject) => (
                        <Button
                          key={subject.id}
                          variant={selectedSubject === subject.id ? "default" : "outline"}
                          className={`h-20 flex flex-col items-center justify-center space-y-2 ${
                            selectedSubject === subject.id 
                              ? "bg-lime-400 text-black hover:bg-lime-500" 
                              : "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                          }`}
                          onClick={() => handleSubjectSelect(subject.id)}
                        >
                          <div className={`w-8 h-8 rounded-full ${subject.color}`} />
                          <span className="font-medium">{subject.name}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {selectedSubject && (
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <Target className="w-5 h-5 text-lime-400" />
                        <span>Vælg Færdighedsområde</span>
                        <Badge variant="outline" className="ml-auto capitalize">
                          {subjects.find(s => s.id === selectedSubject)?.name}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {subjects.find(s => s.id === selectedSubject)?.skills.map((skill) => (
                          <Button
                            key={skill}
                            variant="outline"
                            className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 capitalize"
                            onClick={() => handleSkillSelect(skill)}
                          >
                            {skill}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <>
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowEngine(false)}
                          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                        >
                          ← Tilbage
                        </Button>
                        <Badge variant="outline" className="capitalize">
                          {subjects.find(s => s.id === selectedSubject)?.name}
                        </Badge>
                        <Badge className="bg-lime-400 text-black capitalize">
                          {selectedSkill}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {selectedSubject && selectedSkill && (
                  <div className="space-y-4">
                    <Card className="bg-gradient-to-r from-green-900 to-blue-900 border-green-400">
                      <CardContent className="p-4 text-center">
                        <Brain className="w-8 h-8 text-lime-400 mx-auto mb-2" />
                        <p className="text-white">
                          🤖 AI is generating a REAL personalized question for {selectedSubject} - {selectedSkill}
                        </p>
                      </CardContent>
                    </Card>
                    
                    <AILearningModule
                      key={sessionKey}
                      subject={selectedSubject}
                      skillArea={selectedSkill}
                      onComplete={handleComplete}
                    />
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <PerformanceAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdaptiveLearning;
