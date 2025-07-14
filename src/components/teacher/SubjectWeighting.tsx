import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// This component allows teachers to adjust the weighting of each subject.
const SubjectWeighting = ({ subjects, onSave }) => {
  const [weights, setWeights] = useState(
    subjects.reduce((acc, subject) => {
      acc[subject.id] = subject.weight || 5;
      return acc;
    }, {})
  );

  const handleWeightChange = (subjectId, value) => {
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
          {subjects.map((subject) => (
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
