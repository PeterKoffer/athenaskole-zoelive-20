
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CurriculumAlignedContent from './CurriculumAlignedContent';
import CurriculumLearningPath from './CurriculumLearningPath';
import EnhancedLearningSession from './EnhancedLearningSession';

interface CurriculumDashboardProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onBack: () => void;
}

const CurriculumDashboard = ({ subject, skillArea, difficultyLevel, onBack }: CurriculumDashboardProps) => {
  const [selectedObjective, setSelectedObjective] = useState<{
    id: string;
    title: string;
    description: string;
    difficulty_level: number;
  } | null>(null);

  if (selectedObjective) {
    return (
      <EnhancedLearningSession
        subject={subject}
        skillArea={skillArea}
        difficultyLevel={selectedObjective.difficulty_level}
        onBack={() => setSelectedObjective(null)}
        learningObjective={selectedObjective}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Curriculum-Aligned Learning
        </h1>
        <p className="text-gray-400">
          Follow structured learning paths aligned with educational standards for {subject}
        </p>
      </div>

      <Tabs defaultValue="objectives" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="objectives" className="data-[state=active]:bg-lime-500">
            Learning Objectives
          </TabsTrigger>
          <TabsTrigger value="paths" className="data-[state=active]:bg-lime-500">
            Learning Paths
          </TabsTrigger>
        </TabsList>

        <TabsContent value="objectives">
          <CurriculumAlignedContent
            subject={subject}
            onObjectiveSelect={setSelectedObjective}
          />
        </TabsContent>

        <TabsContent value="paths">
          <CurriculumLearningPath
            subject={subject}
            onStartObjective={setSelectedObjective}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CurriculumDashboard;
