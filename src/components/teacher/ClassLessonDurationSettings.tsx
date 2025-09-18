import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { CLASS_OPTIONS } from "@/constants/school";
import { useClassLessonDurations } from "./hooks/useClassLessonDurations";

const ClassLessonDurationSettings = () => {
  const { durations, saveDurations } = useClassLessonDurations();
  const [form, setForm] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    CLASS_OPTIONS.forEach(opt => {
      initial[opt.value] = durations[opt.value] ?? 2.5;
    });
    return initial;
  });

  const handleChange = (classId: string, value: number) => {
    setForm(prev => ({ ...prev, [classId]: value }));
  };

  const handleSave = () => {
    saveDurations(form);
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="flex items-center text-foreground">
          <Settings className="w-5 h-5 mr-2" />
          Lesson Duration per Class
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Set preferred daily lesson length (in hours) for each class
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {CLASS_OPTIONS.map(cls => (
            <div key={cls.value} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  {cls.label}
                </label>
                <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                  {form[cls.value]} hr
                </span>
              </div>
              <Slider
                min={1}
                max={6}
                step={0.5}
                value={[form[cls.value]]}
                onValueChange={v => handleChange(cls.value, v[0])}
              />
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-border">
          <Button onClick={handleSave} className="w-full">
            Save Durations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassLessonDurationSettings;
