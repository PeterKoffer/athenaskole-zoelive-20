import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Subject = { id: string; name: string; weight?: number }
interface SubjectWeightingProps { subjects: Subject[]; onSave: (weights: Record<string, number>) => void }
// This component allows teachers to adjust the weighting of each subject.
const SubjectWeighting = ({ subjects, onSave }: SubjectWeightingProps) => {
  const [weights, setWeights] = useState<Record<string, number>>(
    subjects.reduce((acc: Record<string, number>, subject: Subject) => {
      acc[subject.id] = subject.weight ?? 5;
      return acc;
    }, {})
  );

  const handleWeightChange = (subjectId: string, value: number) => {
    setWeights({
      ...weights,
      [subjectId]: value,
    });
  };

  const handleSave = () => {
    onSave(weights);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subject Weighting</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subjects.map((subject: Subject) => (
            <div key={subject.id} className="flex items-center justify-between">
              <span className="font-medium">{subject.name}</span>
              <div className="flex items-center gap-4">
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[weights[subject.id]]}
                  onValueChange={(value) =>
                    handleWeightChange(subject.id, value[0])
                  }
                  className="w-48"
                />
                <span className="text-sm font-medium">
                  {weights[subject.id]}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave}>Save Weights</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectWeighting;
