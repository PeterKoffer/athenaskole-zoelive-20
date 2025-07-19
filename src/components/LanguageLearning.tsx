
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Volume2, Trophy, Star, ArrowLeft, ArrowRight, Headphones } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface LanguageLearningProps {
  language: string;
  onBack: () => void;
}

interface Lesson {
  id: string;
  title: string;
  type: "vocabulary" | "conversation" | "grammar" | "listening";
  difficulty: "beginner" | "intermediate" | "advanced";
  xp: number;
  hearts: number;
  completed: boolean;
}

const LanguageLearning: React.FC<LanguageLearningProps> = ({ language, onBack }) => {
  const { user } = useAuth();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [streak, setStreak] = useState(7);
  const [xp, setXp] = useState(1250);
  const [progress, setProgress] = useState(35);

  const lessons: Lesson[] = [
    {
      id: "1",
      title: "Basic Greetings",
      type: "vocabulary",
      difficulty: "beginner",
      xp: 10,
      hearts: 1,
      completed: false
    },
    {
      id: "2", 
      title: "Numbers 1-10",
      type: "vocabulary",
      difficulty: "beginner",
      xp: 15,
      hearts: 1,
      completed: false
    },
    {
      id: "3",
      title: "Family Members",
      type: "vocabulary", 
      difficulty: "beginner",
      xp: 20,
      hearts: 2,
      completed: false
    },
    {
      id: "4",
      title: "Simple Conversation",
      type: "conversation",
      difficulty: "intermediate",
      xp: 25,
      hearts: 2,
      completed: false
    },
    {
      id: "5",
      title: "Listening Practice",
      type: "listening",
      difficulty: "intermediate", 
      xp: 30,
      hearts: 3,
      completed: false
    }
  ];

  const currentLesson = lessons[currentLessonIndex];

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "vocabulary":
        return "📚";
      case "conversation":
        return "💬";
      case "grammar":
        return "📝";
      case "listening":
        return "👂";
      default:
        return "📖";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStartLesson = () => {
    if (hearts < currentLesson.hearts) {
      toast.error("Not enough hearts to start this lesson!");
      return;
    }

    toast.success(`Starting ${currentLesson.title}!`);
    setProgress(prev => prev + 10);
    setXp(prev => prev + currentLesson.xp);
    setStreak(prev => prev + 1);
    
    // Mark lesson as completed
    lessons[currentLessonIndex].completed = true;
    
    setTimeout(() => {
      toast.success("Lesson completed! Great job!");
    }, 3000);
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="font-bold">{hearts}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-bold">{streak}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-500" />
              <span className="font-bold">{xp} XP</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              {language} Learning Journey
            </CardTitle>
            <CardDescription>
              Keep practicing every day to maintain your streak!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Current Lesson */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="text-3xl">{getLessonIcon(currentLesson.type)}</span>
              <div>
                <h2 className="text-xl">{currentLesson.title}</h2>
                <Badge className={getDifficultyColor(currentLesson.difficulty)}>
                  {currentLesson.difficulty}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-blue-500" />
                  <span>+{currentLesson.xp} XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>Costs {currentLesson.hearts} hearts</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={handlePrevLesson}
                  disabled={currentLessonIndex === 0}
                >
                  <ArrowLeft />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleNextLesson}
                  disabled={currentLessonIndex === lessons.length - 1}
                >
                  <ArrowRight />
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleStartLesson}
              className="w-full text-lg py-6"
              disabled={hearts < currentLesson.hearts}
            >
              {currentLesson.type === "listening" && <Headphones className="mr-2 h-5 w-5" />}
              {currentLesson.type === "conversation" && <Volume2 className="mr-2 h-5 w-5" />}
              Start Lesson
            </Button>
          </CardContent>
        </Card>

        {/* Lesson Overview */}
        <Card>
          <CardHeader>
            <CardTitle>All Lessons</CardTitle>
            <CardDescription>
              Complete lessons in order to unlock new content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {lessons.map((lesson, index) => (
                <div 
                  key={lesson.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    index === currentLessonIndex 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'hover:bg-gray-50'
                  } ${lesson.completed ? 'opacity-60' : ''}`}
                  onClick={() => setCurrentLessonIndex(index)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getLessonIcon(lesson.type)}</span>
                    <div>
                      <h3 className="font-medium">{lesson.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getDifficultyColor(lesson.difficulty)}>
                          {lesson.difficulty}
                        </Badge>
                        {lesson.completed && (
                          <Badge variant="outline" className="text-green-600">
                            ✓ Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="h-4 w-4" />
                    <span>+{lesson.xp}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LanguageLearning;
