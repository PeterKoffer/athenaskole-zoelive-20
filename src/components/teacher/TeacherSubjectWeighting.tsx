import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { preferencesService, SubjectWeights } from "@/services/PreferencesService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Settings } from "lucide-react";

const SUBJECTS = [
  { id: "math", name: "Mathematics" },
  { id: "science", name: "Science" },
  { id: "english", name: "English" },
  { id: "history", name: "History" },
  { id: "art", name: "Art" },
  { id: "music", name: "Music" },
  { id: "physical_education", name: "Physical Education" },
  { id: "foreign_languages", name: "Foreign Languages" },
];

const TeacherSubjectWeighting = () => {
  const { user } = useAuth();
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user?.id) return;
      
      try {
        const preferences = await preferencesService.getTeacherPreferences(user.id);
        
        if (preferences?.subject_weights) {
          setWeights(preferences.subject_weights as Record<string, number>);
        } else {
          // Initialize with default weights of 5 for all subjects
          const defaultWeights = SUBJECTS.reduce((acc, subject) => {
            acc[subject.id] = 5;
            return acc;
          }, {} as Record<string, number>);
          setWeights(defaultWeights);
        }
      } catch (error) {
        console.error("Error loading teacher preferences:", error);
        toast.error("Failed to load subject weights");
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user?.id]);

  const handleWeightChange = (subjectId: string, value: number) => {
    setWeights(prev => ({
      ...prev,
      [subjectId]: value,
    }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setSaving(true);
    try {
      await preferencesService.updateTeacherPreferences({
        teacher_id: user.id,
        school_id: user.id, // For now, using same ID - can be updated later
        subject_weights: weights as SubjectWeights,
      });
      
      toast.success("Subject weights saved successfully!");
    } catch (error) {
      console.error("Error saving teacher preferences:", error);
      toast.error("Failed to save subject weights");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Settings className="w-5 h-5 mr-2" />
            AI Content Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading preferences...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="flex items-center text-foreground">
          <Settings className="w-5 h-5 mr-2" />
          AI Content Preferences
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Set the importance level for each subject in AI-generated content (1 = least important, 10 = most important)
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {SUBJECTS.map((subject) => (
            <div key={subject.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  {subject.name}
                </label>
                <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                  {weights[subject.id] || 5}
                </span>
              </div>
              <Slider
                min={1}
                max={10}
                step={1}
                value={[weights[subject.id] || 5]}
                onValueChange={(value) => handleWeightChange(subject.id, value[0])}
                className="w-full"
              />
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="w-full"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherSubjectWeighting;