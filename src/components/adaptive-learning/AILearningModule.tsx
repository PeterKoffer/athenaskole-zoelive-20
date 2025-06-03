
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EnhancedCurriculumDashboard from "./components/EnhancedCurriculumDashboard";
import EnhancedLearningSession from "./components/EnhancedLearningSession";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Users, 
  Award,
  Zap,
  BarChart3
} from "lucide-react";

interface AILearningModuleProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onBack: () => void;
}

const AILearningModule = ({ subject, skillArea, difficultyLevel, onBack }: AILearningModuleProps) => {
  const [activeMode, setActiveMode] = useState<string>("curriculum");

  const learningModes = [
    {
      id: "curriculum",
      name: "Curriculum-Aligned Learning",
      description: "Follow structured educational standards with AI-powered adaptations",
      icon: BookOpen,
      features: ["Standards-aligned content", "Personalized learning paths", "Progress tracking", "AI recommendations"],
      color: "bg-blue-600",
      recommended: true
    },
    {
      id: "adaptive",
      name: "Adaptive Practice",
      description: "Dynamic difficulty adjustment based on your performance",
      icon: Brain,
      features: ["Real-time difficulty adjustment", "Concept mastery tracking", "Spaced repetition", "Performance analytics"],
      color: "bg-purple-600"
    },
    {
      id: "focused",
      name: "Focused Sessions",
      description: "Targeted practice on specific concepts or weak areas",
      icon: Target,
      features: ["Weakness targeting", "Intensive practice", "Quick assessments", "Skill building"],
      color: "bg-green-600"
    },
    {
      id: "collaborative",
      name: "Peer Learning",
      description: "Learn with others through shared challenges and discussions",
      icon: Users,
      features: ["Group challenges", "Peer comparisons", "Discussion forums", "Collaborative projects"],
      color: "bg-orange-600",
      comingSoon: true
    }
  ];

  const handleModeSelect = (modeId: string) => {
    const mode = learningModes.find(m => m.id === modeId);
    if (mode && !mode.comingSoon) {
      setActiveMode(modeId);
    }
  };

  const renderModeContent = () => {
    switch (activeMode) {
      case "curriculum":
        return (
          <EnhancedCurriculumDashboard
            subject={subject}
            skillArea={skillArea}
            difficultyLevel={difficultyLevel}
            onBack={onBack}
          />
        );
      case "adaptive":
        return (
          <EnhancedLearningSession
            subject={subject}
            skillArea={skillArea}
            difficultyLevel={difficultyLevel}
            onBack={onBack}
          />
        );
      case "focused":
        return (
          <EnhancedLearningSession
            subject={subject}
            skillArea={skillArea}
            difficultyLevel={Math.max(1, difficultyLevel - 1)}
            onBack={onBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* AI Learning Mode Selector */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Zap className="w-6 h-6 text-lime-400" />
                <span>AI-Powered Learning Modes</span>
              </CardTitle>
              <p className="text-gray-400 mt-1">Choose your preferred learning approach for {subject}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-lime-600 text-white border-lime-600">
                <BarChart3 className="w-3 h-3 mr-1" />
                AI Enhanced
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {learningModes.map((mode) => {
              const IconComponent = mode.icon;
              const isActive = activeMode === mode.id;
              const isDisabled = mode.comingSoon;
              
              return (
                <Card 
                  key={mode.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    isActive 
                      ? 'bg-gray-700 border-lime-400' 
                      : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handleModeSelect(mode.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${mode.color}`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex space-x-1">
                          {mode.recommended && (
                            <Badge variant="secondary" className="text-xs">
                              <Award className="w-3 h-3 mr-1" />
                              Recommended
                            </Badge>
                          )}
                          {mode.comingSoon && (
                            <Badge variant="outline" className="text-xs">
                              Coming Soon
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-white font-medium text-sm">{mode.name}</h3>
                        <p className="text-gray-400 text-xs mt-1 line-clamp-2">{mode.description}</p>
                      </div>
                      
                      <div className="space-y-1">
                        {mode.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-lime-400 rounded-full" />
                            <span className="text-gray-300 text-xs">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      {isActive && (
                        <Button size="sm" className="w-full bg-lime-500 hover:bg-lime-600">
                          <TrendingUp className="w-3 h-3 mr-2" />
                          Active Mode
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Render Selected Mode Content */}
      {renderModeContent()}
    </div>
  );
};

export default AILearningModule;
