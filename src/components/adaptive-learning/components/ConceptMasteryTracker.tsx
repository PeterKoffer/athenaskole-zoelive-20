
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Target, Clock } from 'lucide-react';

interface ConceptMastery {
  id: string;
  name: string;
  masteryLevel: number;
  practiceCount: number;
  lastPracticed: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ConceptMasteryTrackerProps {
  userId: string;
  subject: string;
}

const ConceptMasteryTracker: React.FC<ConceptMasteryTrackerProps> = ({ userId, subject }) => {
  const [concepts, setConcepts] = useState<ConceptMastery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    setTimeout(() => {
      setConcepts([
        {
          id: '1',
          name: 'Basic Addition',
          masteryLevel: 0.95,
          practiceCount: 25,
          lastPracticed: '2024-01-15',
          difficulty: 'easy'
        },
        {
          id: '2',
          name: 'Subtraction',
          masteryLevel: 0.78,
          practiceCount: 18,
          lastPracticed: '2024-01-14',
          difficulty: 'medium'
        },
        {
          id: '3',
          name: 'Multiplication',
          masteryLevel: 0.62,
          practiceCount: 12,
          lastPracticed: '2024-01-13',
          difficulty: 'hard'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [userId, subject]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMasteryColor = (level: number) => {
    if (level >= 0.8) return 'text-green-600';
    if (level >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold">Concept Mastery Tracker</h3>
      </div>

      <div className="space-y-4">
        {concepts.map((concept) => (
          <Card key={concept.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{concept.name}</CardTitle>
                <Badge className={getDifficultyColor(concept.difficulty)}>
                  {concept.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Mastery Level</span>
                  <span className={getMasteryColor(concept.masteryLevel)}>
                    {Math.round(concept.masteryLevel * 100)}%
                  </span>
                </div>
                <Progress value={concept.masteryLevel * 100} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span>{concept.practiceCount} practices</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span>Last: {new Date(concept.lastPracticed).toLocaleDateString()}</span>
                </div>
              </div>

              {concept.masteryLevel < 0.7 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Needs more practice</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ConceptMasteryTracker;
