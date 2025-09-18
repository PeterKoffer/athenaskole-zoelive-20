import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Brain, Settings, Target, Lightbulb, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import TeacherSidebar from '@/components/teacher/TeacherSidebar';

const TeacherAIPreferences = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    adaptiveDifficulty: true,
    personalizedContent: true,
    gamification: false,
    instantFeedback: true,
    creativityBoost: true,
    difficultyLevel: [3],
    contentVariety: [4],
    interactivityLevel: [3]
  });

  const handleSwitchChange = (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSliderChange = (key: string, value: number[]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="h-[100dvh] bg-slate-900 flex">
      <TeacherSidebar showBackButton={false} />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="h-20 bg-slate-850 border-b border-slate-700 px-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white flex items-center">
              <Brain className="w-6 h-6 mr-3 text-purple-400" />
              AI Content Preferences
            </h1>
            <p className="text-sm text-slate-400">Configure how AI generates and adapts content for your classes</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Save Changes
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 h-[calc(100%-5rem)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Generation Settings */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-400" />
                  Content Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-200 font-medium">Adaptive Difficulty</p>
                    <p className="text-sm text-slate-400">AI adjusts content difficulty based on student performance</p>
                  </div>
                  <Switch
                    checked={preferences.adaptiveDifficulty}
                    onCheckedChange={(value) => handleSwitchChange('adaptiveDifficulty', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-200 font-medium">Personalized Content</p>
                    <p className="text-sm text-slate-400">Generate content based on individual learning styles</p>
                  </div>
                  <Switch
                    checked={preferences.personalizedContent}
                    onCheckedChange={(value) => handleSwitchChange('personalizedContent', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-200 font-medium">Gamification Elements</p>
                    <p className="text-sm text-slate-400">Include game-like elements in lessons</p>
                  </div>
                  <Switch
                    checked={preferences.gamification}
                    onCheckedChange={(value) => handleSwitchChange('gamification', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-200 font-medium">Instant Feedback</p>
                    <p className="text-sm text-slate-400">Provide immediate AI-generated feedback</p>
                  </div>
                  <Switch
                    checked={preferences.instantFeedback}
                    onCheckedChange={(value) => handleSwitchChange('instantFeedback', value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content Tuning */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-400" />
                  Content Tuning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-slate-200 font-medium block mb-3">
                    Base Difficulty Level
                  </label>
                  <Slider
                    value={preferences.difficultyLevel}
                    onValueChange={(value) => handleSliderChange('difficultyLevel', value)}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Beginner</span>
                    <span>Advanced</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-slate-200 font-medium block mb-3">
                    Content Variety
                  </label>
                  <Slider
                    value={preferences.contentVariety}
                    onValueChange={(value) => handleSliderChange('contentVariety', value)}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Focused</span>
                    <span>Diverse</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-slate-200 font-medium block mb-3">
                    Interactivity Level
                  </label>
                  <Slider
                    value={preferences.interactivityLevel}
                    onValueChange={(value) => handleSliderChange('interactivityLevel', value)}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Passive</span>
                    <span>Highly Interactive</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subject-Specific Settings */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-orange-400" />
                  Subject-Specific Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Mathematics', 'Science', 'English', 'History'].map((subject) => (
                    <div key={subject} className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-slate-200 font-medium">{subject}</h4>
                        <Button size="sm" variant="outline" className="bg-slate-600 border-slate-500 text-slate-200 hover:bg-slate-500">
                          Configure
                        </Button>
                      </div>
                      <div className="text-sm text-slate-400">
                        <p>Visual Learning: Enabled</p>
                        <p>Problem Solving Focus: High</p>
                        <p>Real-world Examples: Enabled</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-slate-200 mb-2">💡 <strong>Recommendation:</strong></p>
                    <p className="text-sm text-slate-300">
                      Based on student performance, consider increasing interactivity in Math 6A lessons.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-slate-200 mb-2">📈 <strong>Trend:</strong></p>
                    <p className="text-sm text-slate-300">
                      Students respond well to visual content in Science classes (+15% engagement).
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <p className="text-sm text-slate-200 mb-2">🎯 <strong>Suggestion:</strong></p>
                    <p className="text-sm text-slate-300">
                      Enable gamification for Grade 4 English to improve participation rates.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAIPreferences;