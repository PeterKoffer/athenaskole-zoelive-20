
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, CheckCircle } from 'lucide-react';
import GoalCard from './learning-path/GoalCard';

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  estimatedTime: number;
  prerequisites: string[];
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface UserProfile {
  strengths: string[];
  weaknesses: string[];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  preferredPace: 'slow' | 'medium' | 'fast';
}

interface LearningPathOptimizerProps {
  subject: string;
  userProfile: UserProfile;
  completedGoals: string[];
  onGoalSelect: (goal: LearningGoal) => void;
}

const LearningPathOptimizer = ({ 
  subject, 
  userProfile, 
  completedGoals, 
  onGoalSelect 
}: LearningPathOptimizerProps) => {
  const [optimizedPath, setOptimizedPath] = useState<LearningGoal[]>([]);
  const [currentFocus, setCurrentFocus] = useState<LearningGoal | null>(null);

  // Sample learning goals - in a real app, these would come from a database
  const allGoals: { [key: string]: LearningGoal[] } = {
    mathematics: [
      {
        id: 'fractions-basic',
        title: 'Basic Fractions',
        description: 'Understanding numerators and denominators',
        difficulty: 1,
        estimatedTime: 15,
        prerequisites: [],
        completed: false,
        priority: 'high'
      },
      {
        id: 'fractions-operations',
        title: 'Fraction Operations',
        description: 'Adding, subtracting, multiplying fractions',
        difficulty: 2,
        estimatedTime: 25,
        prerequisites: ['fractions-basic'],
        completed: false,
        priority: 'high'
      },
      {
        id: 'geometry-shapes',
        title: 'Basic Geometry',
        description: 'Identifying and measuring shapes',
        difficulty: 2,
        estimatedTime: 20,
        prerequisites: [],
        completed: false,
        priority: 'medium'
      },
      {
        id: 'area-perimeter',
        title: 'Area and Perimeter',
        description: 'Calculating area and perimeter of shapes',
        difficulty: 3,
        estimatedTime: 30,
        prerequisites: ['geometry-shapes'],
        completed: false,
        priority: 'medium'
      }
    ],
    english: [
      {
        id: 'reading-comprehension',
        title: 'Reading Comprehension',
        description: 'Understanding stories and texts',
        difficulty: 1,
        estimatedTime: 20,
        prerequisites: [],
        completed: false,
        priority: 'high'
      },
      {
        id: 'vocabulary-building',
        title: 'Vocabulary Building',
        description: 'Learning new words and meanings',
        difficulty: 2,
        estimatedTime: 15,
        prerequisites: ['reading-comprehension'],
        completed: false,
        priority: 'high'
      },
      {
        id: 'grammar-basics',
        title: 'Basic Grammar',
        description: 'Understanding sentence structure',
        difficulty: 2,
        estimatedTime: 25,
        prerequisites: ['vocabulary-building'],
        completed: false,
        priority: 'medium'
      }
    ],
    creative: [
      {
        id: 'storytelling-basics',
        title: 'Story Writing',
        description: 'Creating engaging stories',
        difficulty: 1,
        estimatedTime: 20,
        prerequisites: [],
        completed: false,
        priority: 'high'
      },
      {
        id: 'character-development',
        title: 'Character Creation',
        description: 'Developing interesting characters',
        difficulty: 2,
        estimatedTime: 25,
        prerequisites: ['storytelling-basics'],
        completed: false,
        priority: 'medium'
      }
    ]
  };

  useEffect(() => {
    optimizeLearningPath();
  }, [subject, completedGoals, userProfile]);

  const optimizeLearningPath = () => {
    const subjectGoals = allGoals[subject] || [];
    
    // Mark completed goals
    const goalsWithProgress = subjectGoals.map(goal => ({
      ...goal,
      completed: completedGoals.includes(goal.id)
    }));

    // Filter available goals (prerequisites met)
    const availableGoals = goalsWithProgress.filter(goal => {
      if (goal.completed) return false;
      return goal.prerequisites.every(prereq => completedGoals.includes(prereq));
    });

    // Sort by priority and difficulty based on user profile
    const sortedGoals = availableGoals.sort((a, b) => {
      // Prioritize based on weaknesses
      const aAddressesWeakness = userProfile.weaknesses.some(weakness => 
        a.title.toLowerCase().includes(weakness.toLowerCase())
      );
      const bAddressesWeakness = userProfile.weaknesses.some(weakness => 
        b.title.toLowerCase().includes(weakness.toLowerCase())
      );

      if (aAddressesWeakness && !bAddressesWeakness) return -1;
      if (!aAddressesWeakness && bAddressesWeakness) return 1;

      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Then by difficulty (easier first for slow learners)
      if (userProfile.preferredPace === 'slow') {
        return a.difficulty - b.difficulty;
      } else {
        return b.difficulty - a.difficulty;
      }
    });

    setOptimizedPath(sortedGoals.slice(0, 3)); // Show top 3 recommendations
    setCurrentFocus(sortedGoals[0] || null);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Brain className="w-5 h-5 text-purple-400" />
          <span>Personalized Learning Path</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentFocus && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-purple-200">Recommended Focus</h4>
            </div>
            <GoalCard 
              goal={currentFocus} 
              isRecommended={true} 
              onSelect={onGoalSelect} 
            />
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-white font-medium">Up Next</h4>
          {optimizedPath.slice(1).map((goal) => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onSelect={onGoalSelect} 
            />
          ))}
        </div>

        {optimizedPath.length === 0 && (
          <div className="text-center py-4">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-white font-medium">All goals completed!</p>
            <p className="text-gray-400 text-sm">Great job! New goals will be available soon.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningPathOptimizer;
