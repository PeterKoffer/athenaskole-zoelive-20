
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Zap, Award } from "lucide-react";

interface LearningMode {
  id: string;
  name: string;
  description: string;
  icon: any;
  difficulty: string;
  estimatedTime: string;
  benefits: string[];
}

interface LearningModeSelectorProps {
  onModeSelect: (mode: LearningMode) => void;
}

const LearningModeSelector = ({ onModeSelect }: LearningModeSelectorProps) => {
  const learningModes: LearningMode[] = [
    {
      id: 'adaptive',
      name: 'Adaptiv Læring',
      description: 'AI tilpasser sværhedsgraden baseret på din præstation',
      icon: Brain,
      difficulty: 'Tilpasset',
      estimatedTime: '10-15 min',
      benefits: ['Personlig tilpasning', 'Optimal udfordring', 'Hurtigere fremgang']
    },
    {
      id: 'focused',
      name: 'Fokuseret Træning',
      description: 'Målrettet træning inden for specifikke færdighedsområder',
      icon: Target,
      difficulty: 'Valgfri',
      estimatedTime: '5-10 min',
      benefits: ['Målrettet læring', 'Specifikke færdigheder', 'Hurtige sessioner']
    },
    {
      id: 'challenge',
      name: 'Udfordrings Mode',
      description: 'Test dine grænser med avancerede problemer',
      icon: Zap,
      difficulty: 'Høj',
      estimatedTime: '15-20 min',
      benefits: ['Høj sværhedsgrad', 'Ekstreme udfordringer', 'Maksimal læring']
    },
    {
      id: 'mastery',
      name: 'Mestring Mode',
      description: 'Gentag og perfektioner tidligere lærte emner',
      icon: Award,
      difficulty: 'Gentagelse',
      estimatedTime: '8-12 min',
      benefits: ['Konsolidering', 'Perfektion', 'Selvtillid']
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Vælg Din Læringsmode</h2>
        <p className="text-gray-400">
          Hver mode er designet til at optimere din læring på forskellige måder
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {learningModes.map((mode) => {
          const Icon = mode.icon;
          return (
            <Card
              key={mode.id}
              className="bg-gray-800 border-gray-700 hover:border-lime-400 transition-all duration-200 cursor-pointer group"
              onClick={() => onModeSelect(mode)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-lime-600 rounded-lg group-hover:bg-lime-500 transition-colors">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{mode.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-lime-400 border-lime-400">
                          {mode.difficulty}
                        </Badge>
                        <span className="text-gray-400 text-sm">{mode.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-300">{mode.description}</p>
                
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Fordele:</h4>
                  <ul className="space-y-1">
                    {mode.benefits.map((benefit, index) => (
                      <li key={index} className="text-gray-400 text-sm flex items-center">
                        <span className="w-1.5 h-1.5 bg-lime-400 rounded-full mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="w-full bg-lime-600 hover:bg-lime-700 text-white">
                  Start {mode.name}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LearningModeSelector;
