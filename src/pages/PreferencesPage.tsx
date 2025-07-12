
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Settings, Volume2, Speech } from 'lucide-react';

console.log('PreferencesPage component loading...');

interface UserPreferences {
  speech_enabled: boolean;
  speech_rate: number;
  speech_pitch: number;
  preferred_voice: string;
  auto_read_questions: boolean;
  auto_read_explanations: boolean;
}

const PreferencesPage = () => {
  console.log('PreferencesPage rendering...');
  
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    speech_enabled: true,
    speech_rate: 0.8,
    speech_pitch: 1.2,
    preferred_voice: 'female',
    auto_read_questions: true,
    auto_read_explanations: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('PreferencesPage mounted, user:', user);
  }, [user]);

  const handleSavePreferences = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      console.log('Saving preferences:', preferences);
      toast.success('Preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Settings className="w-8 h-8 mr-3" />
            Preferences
          </h1>
          <p className="text-muted-foreground">Customize your learning experience</p>
        </div>

        <div className="grid gap-6">
          {/* Speech Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Speech className="w-5 h-5 mr-2" />
                Speech Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="speech-enabled">
                  Enable Text-to-Speech
                </Label>
                <Switch
                  id="speech-enabled"
                  checked={preferences.speech_enabled}
                  onCheckedChange={(checked) => updatePreference('speech_enabled', checked)}
                />
              </div>

              {preferences.speech_enabled && (
                <>
                  <div className="space-y-2">
                    <Label>Speech Rate: {preferences.speech_rate}</Label>
                    <Slider
                      value={[preferences.speech_rate]}
                      onValueChange={([value]) => updatePreference('speech_rate', value)}
                      max={2}
                      min={0.5}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Speech Pitch: {preferences.speech_pitch}</Label>
                    <Slider
                      value={[preferences.speech_pitch]}
                      onValueChange={([value]) => updatePreference('speech_pitch', value)}
                      max={2}
                      min={0.5}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Voice</Label>
                    <Select
                      value={preferences.preferred_voice}
                      onValueChange={(value) => updatePreference('preferred_voice', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Auto-Read Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Volume2 className="w-5 h-5 mr-2" />
                Auto-Read Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-read-questions">
                  Automatically read questions aloud
                </Label>
                <Switch
                  id="auto-read-questions"
                  checked={preferences.auto_read_questions}
                  onCheckedChange={(checked) => updatePreference('auto_read_questions', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-read-explanations">
                  Automatically read explanations aloud
                </Label>
                <Switch
                  id="auto-read-explanations"
                  checked={preferences.auto_read_explanations}
                  onCheckedChange={(checked) => updatePreference('auto_read_explanations', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSavePreferences}
              disabled={loading}
              className="px-8"
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;
