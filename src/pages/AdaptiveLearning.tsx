
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import AdaptiveLearningEngine from '@/components/adaptive-learning/AdaptiveLearningEngine';
import PerformanceAnalytics from '@/components/adaptive-learning/PerformanceAnalytics';
import { Brain, BarChart3, BookOpen, Target } from 'lucide-react';

const subjects = [
  { id: 'matematik', name: 'Matematik', skills: ['addition', 'subtraction', 'multiplication', 'division'], color: 'bg-blue-500' },
  { id: 'dansk', name: 'Dansk', skills: ['spelling', 'grammar', 'reading', 'writing'], color: 'bg-red-500' },
  { id: 'engelsk', name: 'Engelsk', skills: ['vocabulary', 'grammar', 'reading', 'speaking'], color: 'bg-green-500' },
  { id: 'naturteknik', name: 'Natur/Teknik', skills: ['science', 'technology', 'experiments', 'nature'], color: 'bg-purple-500' }
];

const AdaptiveLearning = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [showEngine, setShowEngine] = useState(false);

  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setSelectedSkill(null);
    setShowEngine(false);
  };

  const handleSkillSelect = (skill: string) => {
    setSelectedSkill(skill);
    setShowEngine(true);
  };

  const handleComplete = (score: number) => {
    console.log('Session completed with score:', score);
    // Could trigger achievements, level up notifications, etc.
  };

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
                {/* Subject Selection */}
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

                {/* Skill Area Selection */}
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
                {/* Back Navigation */}
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

                {/* Adaptive Learning Engine */}
                {selectedSubject && selectedSkill && (
                  <AdaptiveLearningEngine
                    subject={selectedSubject}
                    skillArea={selectedSkill}
                    onComplete={handleComplete}
                  />
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
