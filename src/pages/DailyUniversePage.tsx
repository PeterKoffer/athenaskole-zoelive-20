import React, { useEffect, useState } from 'react';
import { contentGenerationService } from '../services/ContentGenerationService';
import { CurriculumNode } from '../types/curriculum/CurriculumNode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DailyUniversePage: React.FC = () => {
  const [universe, setUniverse] = useState<any>(null);

  useEffect(() => {
    const fetchUniverse = async () => {
      // In a real application, we would pass the student's profile here.
      const studentProfile = {};
      const dailyUniverse = await contentGenerationService.generateDailyUniverse(studentProfile);
      setUniverse(dailyUniverse);
    };

    fetchUniverse();
  }, []);

  if (!universe) {
    return <div>Loading your daily universe...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{universe.title}</h1>
      <p className="text-lg mb-8">{universe.description}</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {universe.objectives.map((objective: CurriculumNode) => (
          <Card key={objective.id}>
            <CardHeader>
              <CardTitle>{objective.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{objective.description}</p>
              <Button className="mt-4">Start Task</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DailyUniversePage;
