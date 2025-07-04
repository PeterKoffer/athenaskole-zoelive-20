
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LearningAtom } from '@/services/dailyUniverse/DailyUniverseGenerator';
import { 
  Rocket, 
  Search, 
  Lightbulb, 
  Palette, 
  BookOpen,
  Play,
  CheckCircle 
} from 'lucide-react';

interface UniverseAtomRendererProps {
  atom: LearningAtom;
  isActive: boolean;
  isCompleted: boolean;
  onStart: () => void;
  onComplete: () => void;
  progress?: number;
}

const UniverseAtomRenderer = ({ 
  atom, 
  isActive, 
  isCompleted, 
  onStart, 
  onComplete, 
  progress = 0 
}: UniverseAtomRendererProps) => {
  
  const getAtomIcon = (type: string) => {
    switch (type) {
      case 'exploration': return <Search className="w-5 h-5" />;
      case 'challenge': return <Rocket className="w-5 h-5" />;
      case 'discovery': return <Lightbulb className="w-5 h-5" />;
      case 'creation': return <Palette className="w-5 h-5" />;
      case 'reflection': return <BookOpen className="w-5 h-5" />;
      default: return <Play className="w-5 h-5" />;
    }
  };

  const getAtomColor = (type: string) => {
    switch (type) {
      case 'exploration': return 'from-blue-500 to-cyan-500';
      case 'challenge': return 'from-red-500 to-orange-500';
      case 'discovery': return 'from-yellow-500 to-amber-500';
      case 'creation': return 'from-purple-500 to-pink-500';
      case 'reflection': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getSubjectColor = (subject: string) => {
    const subjectLower = subject.toLowerCase();
    if (subjectLower.includes('math')) return 'bg-blue-100 text-blue-800';
    if (subjectLower.includes('english') || subjectLower.includes('language')) return 'bg-green-100 text-green-800';
    if (subjectLower.includes('science')) return 'bg-purple-100 text-purple-800';
    if (subjectLower.includes('history')) return 'bg-amber-100 text-amber-800';
    if (subjectLower.includes('art')) return 'bg-pink-100 text-pink-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className={`
      transition-all duration-300 border-2
      ${isActive ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-gray-200'}
      ${isCompleted ? 'bg-green-50 border-green-300' : 'bg-white'}
      ${!isActive && !isCompleted ? 'opacity-75' : ''}
    `}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full bg-gradient-to-r ${getAtomColor(atom.type)} text-white`}>
              {isCompleted ? <CheckCircle className="w-5 h-5" /> : getAtomIcon(atom.type)}
            </div>
            <div>
              <CardTitle className="text-lg">{atom.content.title || atom.curriculumObjective}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getSubjectColor(atom.subject)}>
                  {atom.subject}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {atom.estimatedMinutes} min
                </Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {atom.type}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        {isActive && progress > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-l-4 border-indigo-400">
            <p className="text-sm text-indigo-800 font-medium mb-1">🌟 Your Mission:</p>
            <p className="text-sm text-indigo-700">{atom.narrativeContext}</p>
          </div>

          {atom.content.description && (
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">What you'll learn:</p>
              <p>{atom.content.description}</p>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <div className="text-xs text-gray-500 capitalize">
              {atom.interactionType} • {atom.type}
            </div>
            
            {isActive && !isCompleted && (
              <Button onClick={onStart} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <Play className="w-4 h-4 mr-2" />
                Start Mission
              </Button>
            )}
            
            {isActive && isCompleted && (
              <Button variant="outline" className="border-green-300 text-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UniverseAtomRenderer;
