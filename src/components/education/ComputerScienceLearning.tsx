
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, BookOpen, Star, Globe, Bot, Award } from "lucide-react";
import LearningHeader from "@/components/education/LearningHeader";
import { getGamesBySubject, CurriculumGame, getGamesByGradeLevel } from '../games/CurriculumGameConfig';
import CurriculumGameSelector from '../games/CurriculumGameSelector';
import AdaptiveDifficultyManager from '../adaptive-learning/AdaptiveDifficultyManager';
import { useAuth } from '@/hooks/useAuth';
import AdaptiveLearningEngine from '../adaptive-learning/AdaptiveLearningEngine';
import { useToast } from '@/hooks/use-toast';

const ComputerScienceLearning = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string>('games');
  const [csGames, setCsGames] = useState<CurriculumGame[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    accuracy: 75,
    averageTime: 0,
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0,
    totalAttempts: 0
  });
  
  useEffect(() => {
    // Get Computer Science games
    const games = getGamesBySubject("Computer Science");
    setCsGames(games);
  }, []);

  const handleModeChange = (mode: any) => {
    setSelectedMode(mode.id);
    
    toast({
      title: `Switched to ${mode.name}`,
      description: mode.description,
      duration: 3000
    });
  };

  const handleGameSelect = (gameId: string) => {
    console.log("Selected game:", gameId);
    setSelectedGame(gameId);
  };

  const handleDifficultyChange = (newLevel: number, reason: string) => {
    toast({
      title: `Difficulty Adjusted to Level ${newLevel}`,
      description: reason,
      duration: 3000
    });
  };

  if (selectedMode === 'adaptive') {
    return (
      <div className="max-w-6xl mx-auto">
        <LearningHeader 
          title="Computer Science & AI Learning"
          backTo="/daily-program"
          backLabel="Back to Program"
          onModeChange={handleModeChange}
          currentMode={selectedMode}
        />
        
        <div className="p-6">
          <AdaptiveLearningEngine 
            subject="Computer Science"
            skillArea="programming"
            onComplete={(score) => {
              toast({
                title: "Learning Session Completed!",
                description: `You scored ${score}% in this adaptive learning session.`,
                duration: 5000
              });
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <LearningHeader 
        title="Computer Science & AI Learning"
        backTo="/daily-program"
        backLabel="Back to Program"
        onModeChange={handleModeChange}
        currentMode={selectedMode}
      />
      
      <div className="p-6">
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-white">
                <Code className="w-6 h-6 text-purple-400" />
                <span>Computer Science & AI</span>
                <Badge variant="outline" className="bg-purple-900 text-purple-400 border-purple-400">
                  New Class!
                </Badge>
              </CardTitle>
              
              <AdaptiveDifficultyManager 
                currentDifficulty={3}
                performanceMetrics={performanceMetrics}
                onDifficultyChange={handleDifficultyChange}
              />
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-800/30">
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Explore the Digital World</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Dive into programming, algorithms, AI, and computer science concepts through interactive 
                games and challenges designed to build critical computational thinking skills.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="p-3 bg-purple-900/40 rounded-xl">
                      <Code className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Coding</h3>
                      <p className="text-gray-400 text-sm">Programming fundamentals</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-xs">Learn programming basics through visual coding challenges and algorithmic puzzles.</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="p-3 bg-blue-900/40 rounded-xl">
                      <Globe className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Web & Data</h3>
                      <p className="text-gray-400 text-sm">Web and data concepts</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-xs">Discover how websites work and how data is analyzed in interactive exercises.</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:border-lime-500 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="p-3 bg-lime-900/40 rounded-xl">
                      <Bot className="w-6 h-6 text-lime-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">AI & Machine Learning</h3>
                      <p className="text-gray-400 text-sm">Intro to artificial intelligence</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-xs">Learn how AI works through hands-on training exercises and model building.</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Featured Computer Science Games</h3>
              </div>
              
              <CurriculumGameSelector 
                onGameSelect={handleGameSelect}
                userGradeLevel={6}
                preferredSubject="Computer Science"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Award className="w-6 h-6 text-yellow-400" />
              <span>CS Learning Journey</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-purple-900 text-purple-400 border-purple-400">
                    Algorithms
                  </Badge>
                  <span className="text-sm text-white">Basic Problem Solving</span>
                </div>
                <Badge className="bg-green-500">Completed</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-blue-900 text-blue-400 border-blue-400">
                    Logic
                  </Badge>
                  <span className="text-sm text-white">Conditional Statements</span>
                </div>
                <Badge className="bg-amber-500">In Progress</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-lime-900 text-lime-400 border-lime-400">
                    Loops
                  </Badge>
                  <span className="text-sm text-white">Repetition Structures</span>
                </div>
                <Badge className="bg-gray-500">Locked</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-red-900 text-red-400 border-red-400">
                    AI
                  </Badge>
                  <span className="text-sm text-white">Machine Learning Basics</span>
                </div>
                <Badge className="bg-gray-500">Locked</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComputerScienceLearning;
