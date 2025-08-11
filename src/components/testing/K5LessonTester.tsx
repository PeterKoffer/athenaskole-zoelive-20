
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, BookOpen, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { dailyLessonGenerator } from '@/services/dailyLessonGenerator';
import { useAuth } from '@/hooks/useAuth';

interface GeneratedLesson { subject: string; grade: string; activities: any[]; totalActivities: number; estimatedDuration: number }

const K5LessonTester = () => {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState<GeneratedLesson | null>(null);
  const [error, setError] = useState('');

  const subjects = [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'english', label: 'English Language Arts' },
    { value: 'science', label: 'Science' },
    { value: 'history', label: 'History & Social Studies' },
    { value: 'geography', label: 'Geography' },
    { value: 'music', label: 'Music' },
    { value: 'creative-arts', label: 'Creative Arts' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'mental-wellness', label: 'Mental Wellness' },
    { value: 'life-essentials', label: 'Life Essentials' },
    { value: 'physical-education', label: 'Physical Education' },
    { value: 'world-languages', label: 'World Languages (Spanish)' }
  ];

  const grades = [
    { value: 'K', label: 'Kindergarten' },
    { value: '1', label: 'Grade 1' },
    { value: '2', label: 'Grade 2' },
    { value: '3', label: 'Grade 3' },
    { value: '4', label: 'Grade 4' },
    { value: '5', label: 'Grade 5' }
  ];

  const handleGenerateLesson = async () => {
    if (!selectedSubject || !selectedGrade || !user?.id) {
      setError('Please select both subject and grade level, and ensure you are logged in.');
      return;
    }

    console.log('🧪 Testing K-5 Lesson Generation:', { selectedSubject, selectedGrade });
    setIsGenerating(true);
    setError('');
    setGeneratedLesson(null);

    try {
      const gradeLevel = selectedGrade === 'K' ? 0 : parseInt(selectedGrade);
      const currentDate = new Date().toISOString().split('T')[0];

      const activities = await dailyLessonGenerator.generateDailyLesson({
        subject: selectedSubject,
        skillArea: 'general',
        userId: user.id,
        gradeLevel,
        currentDate
      });

      console.log('✅ Generated activities:', activities);
      setGeneratedLesson({
        subject: selectedSubject,
        grade: selectedGrade,
        activities,
        totalActivities: activities.length,
        estimatedDuration: activities.reduce((sum, activity) => sum + (activity.duration || 0), 0)
      });

    } catch (err) {
      console.error('❌ Lesson generation failed:', err);
      setError(`Failed to generate lesson: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTestLesson = () => {
    if (!generatedLesson) return;
    
    // Navigate to lesson experience or open in new tab
    const url = `/education/lesson?subject=${selectedSubject}&grade=${selectedGrade}&test=true`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Brain className="w-6 h-6 text-purple-400" />
            <span>K-5 Lesson Generation Tester</span>
            <Badge variant="outline" className="bg-purple-900 text-purple-200 border-purple-600">
              Test Mode
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selection Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {subjects.map((subject) => (
                    <SelectItem key={subject.value} value={subject.value} className="text-white">
                      {subject.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Grade Level</label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {grades.map((grade) => (
                    <SelectItem key={grade.value} value={grade.value} className="text-white">
                      {grade.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateLesson}
            disabled={!selectedSubject || !selectedGrade || isGenerating || !user}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Lesson...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Generate K-5 Lesson
              </>
            )}
          </Button>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Results Display */}
          {generatedLesson && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <span className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-green-400" />
                    <span>Generated Lesson Results</span>
                  </span>
                  <Button
                    onClick={handleTestLesson}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Test Lesson
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Subject</p>
                    <p className="text-white font-medium capitalize">{generatedLesson.subject}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Grade</p>
                    <p className="text-white font-medium">{generatedLesson.grade}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Activities</p>
                    <p className="text-white font-medium">{generatedLesson.totalActivities}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Duration</p>
                    <p className="text-white font-medium">{Math.round(generatedLesson.estimatedDuration / 60)}min</p>
                  </div>
                </div>

                {/* Activity List */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">Generated Activities:</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {generatedLesson.activities.map((activity: any, index: number) => (
                      <div key={activity.id} className="bg-gray-900/30 rounded p-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">
                            {index + 1}. {activity.title}
                          </span>
                          <Badge variant="outline" className="text-xs bg-blue-900 text-blue-200 border-blue-700">
                            {activity.type}
                          </Badge>
                        </div>
                        {activity.phaseDescription && (
                          <p className="text-gray-400 text-xs mt-1">{activity.phaseDescription}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <h4 className="text-blue-200 font-medium mb-2">Testing Instructions</h4>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• Select any K-5 subject and grade level</li>
              <li>• Click "Generate K-5 Lesson" to test AI lesson creation</li>
              <li>• Review the generated activities and their structure</li>
              <li>• Click "Test Lesson" to experience the actual lesson flow</li>
              <li>• This helps verify our curriculum data is working properly</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default K5LessonTester;
