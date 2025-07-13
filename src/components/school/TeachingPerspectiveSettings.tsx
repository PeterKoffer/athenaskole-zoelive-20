
import { useEffect, useState } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { TeachingPerspectiveSettings, TeachingPerspectiveType } from "@/types/school";
import { useTeachingPerspectiveSettings } from "./hooks/useTeachingPerspectiveSettings";
import { useRoleAccess } from "@/hooks/useRoleAccess";

const perspectiveOptions: { label: string, value: TeachingPerspectiveType }[] = [
  { label: "None", value: "none" },
  { label: "Mild Christian", value: "mild-christian" },
  { label: "Strong Christian", value: "strong-christian" },
  { label: "Secular", value: "secular" },
  { label: "Custom", value: "custom" },
];

const subjects = [
    { id: 'math', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'history', name: 'History' },
    { id: 'english', name: 'English' },
    { id: 'art', name: 'Art' },
];

export default function TeachingPerspectiveSettingsPanel() {
  // Call ALL hooks first, before any conditional logic
  const { userRole } = useRoleAccess();
  const { settings, saveSettings } = useTeachingPerspectiveSettings();
  const [form, setForm] = useState<TeachingPerspectiveSettings>(settings);

  useEffect(() => { 
    setForm(settings); 
    console.log("Settings loaded:", settings);
  }, [settings]);

  // Now do the conditional rendering AFTER all hooks are called - only school leaders and admins
  if (userRole !== "admin" && userRole !== "school_leader") {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🏫</div>
        <h2 className="text-xl font-bold text-white mb-2">School Leader Access Required</h2>
        <p className="text-gray-400">Only school leaders can access teaching perspective settings.</p>
      </div>
    );
  }

  const handleChange = (field: keyof TeachingPerspectiveSettings, value: any) => {
    console.log(`Updating ${field} to:`, value);
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubjectWeightChange = (subjectId: string, weight: number) => {
    setForm((prev) => ({
      ...prev,
      subjectWeights: {
        ...prev.subjectWeights,
        [subjectId]: weight,
      },
    }));
  };

  const handleSave = () => {
    console.log("Saving form data:", form);
    saveSettings(form);
  };

  return (
    <Card className="max-w-xl bg-gray-800 border-gray-700 mx-auto mb-8">
      <CardHeader>
        <CardTitle className="text-white">Teaching Perspective Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label className="block mb-1 text-gray-200">Teaching perspective</label>
          <Select value={form.perspective} onValueChange={v => handleChange('perspective', v as TeachingPerspectiveType)}>
            <SelectTrigger className="bg-gray-700 text-white border-gray-600 w-full">
              <SelectValue placeholder="Choose perspective">
                {perspectiveOptions.find(o => o.value === form.perspective)?.label || 'Choose perspective'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="z-50 bg-gray-800 border-gray-700">
              {perspectiveOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value} className="text-white hover:bg-gray-700">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-200">Strength</label>
          <Slider
            value={[form.strength]}
            min={1}
            max={5}
            step={1}
            onValueChange={v => handleChange('strength', v[0])}
            className="mb-2"
          />
          <div className="text-xs text-gray-400">
            {form.strength === 1 && "Very little influence"}
            {form.strength === 2 && "Low influence"}
            {form.strength === 3 && "Moderate influence"}
            {form.strength === 4 && "Strong influence"}
            {form.strength === 5 && "Extremely strong influence"}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-200">Special wishes for teaching</label>
          <Textarea 
            value={form.wishes || ""} 
            onChange={e => handleChange('wishes', e.target.value)} 
            className="bg-gray-700 text-white border-gray-600"
            placeholder="Describe any particular wishes, topics to emphasize, etc."
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-200">Topics or themes to avoid</label>
          <Textarea 
            value={form.avoid || ""} 
            onChange={e => handleChange('avoid', e.target.value)} 
            className="bg-gray-700 text-white border-gray-600"
            placeholder="Are there things you'd like to avoid, e.g. sensitive topics?"
          />
        </div>
        <div className="mb-4">
            <label className="block mb-2 text-gray-200">Subject Weights</label>
            {subjects.map((subject) => (
                <div key={subject.id} className="mb-2">
                <label className="block mb-1 text-gray-400">{subject.name}</label>
                <Slider
                    value={[form.subjectWeights?.[subject.id] ?? 1]}
                    min={0.5}
                    max={2}
                    step={0.1}
                    onValueChange={(value) => handleSubjectWeightChange(subject.id, value[0])}
                    className="mb-2"
                />
                <div className="text-xs text-gray-400">
                    Weight: {form.subjectWeights?.[subject.id] ?? 1}
                </div>
                </div>
            ))}
        </div>
        <Button 
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Save Settings
        </Button>
        {form.lastUpdated && (
          <p className="text-xs text-gray-400 mt-2">
            Last updated: {new Date(form.lastUpdated).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
