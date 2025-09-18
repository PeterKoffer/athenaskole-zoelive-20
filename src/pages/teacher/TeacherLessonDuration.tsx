import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Clock, Save, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import TeacherSidebar from '@/components/teacher/TeacherSidebar';

const TeacherLessonDuration = () => {
  const navigate = useNavigate();
  const [durations, setDurations] = useState<Record<string, number[]>>({
    'Math 6A': [90],
    'Science 5B': [90],
    'English 4A': [75],
    'Math 5A': [60]
  });

  const classes = [
    {
      name: 'Math 6A',
      subject: 'Mathematics',
      grade: 'Grade 6',
      students: 24,
      recommended: 90,
      color: 'bg-blue-500'
    },
    {
      name: 'Science 5B',
      subject: 'Science',
      grade: 'Grade 5',
      students: 22,
      recommended: 90,
      color: 'bg-green-500'
    },
    {
      name: 'English 4A',
      subject: 'English',
      grade: 'Grade 4',
      students: 26,
      recommended: 75,
      color: 'bg-purple-500'
    },
    {
      name: 'Math 5A',
      subject: 'Mathematics',
      grade: 'Grade 5',
      students: 23,
      recommended: 60,
      color: 'bg-orange-500'
    }
  ];

  const handleDurationChange = (className: string, value: number[]) => {
    setDurations(prev => ({ ...prev, [className]: value }));
  };

  const resetToRecommended = (className: string, recommended: number) => {
    setDurations(prev => ({ ...prev, [className]: [recommended] }));
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
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
              <Clock className="w-6 h-6 mr-3 text-orange-400" />
              Lesson Duration Settings
            </h1>
            <p className="text-sm text-slate-400">Configure optimal lesson durations for each class</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 h-[calc(100%-5rem)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {classes.map((classItem) => (
              <Card key={classItem.name} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${classItem.color}`}></div>
                      <div>
                        <CardTitle className="text-white text-lg">{classItem.name}</CardTitle>
                        <p className="text-sm text-slate-400">{classItem.subject} • {classItem.grade}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{classItem.students} students</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-slate-200 font-medium">
                        Lesson Duration
                      </label>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-white">
                          {formatDuration(durations[classItem.name][0])}
                        </span>
                        <p className="text-xs text-slate-400">Current setting</p>
                      </div>
                    </div>
                    
                    <Slider
                      value={durations[classItem.name]}
                      onValueChange={(value) => handleDurationChange(classItem.name, value)}
                      max={120}
                      min={30}
                      step={15}
                      className="w-full"
                    />
                    
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                      <span>30m</span>
                      <span>1h</span>
                      <span>1h 30m</span>
                      <span>2h</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Recommended</p>
                      <p className="text-sm font-medium text-green-400">
                        {formatDuration(classItem.recommended)}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Optimal Range</p>
                      <p className="text-sm font-medium text-slate-200">
                        {formatDuration(classItem.recommended - 15)} - {formatDuration(classItem.recommended + 15)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-200">Duration Factors</h4>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p>• Student attention span: {classItem.grade}</p>
                      <p>• Subject complexity: {classItem.subject}</p>
                      <p>• Class size: {classItem.students} students</p>
                      <p>• Historical engagement data</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 flex-1"
                      onClick={() => resetToRecommended(classItem.name, classItem.recommended)}
                    >
                      Use Recommended
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                    >
                      Test Duration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Duration Guidelines */}
          <Card className="mt-6 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                Duration Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="text-slate-200 font-medium mb-2">Elementary (K-5)</h4>
                  <p className="text-sm text-slate-400">
                    45-75 minutes optimal. Shorter attention spans require more interactive elements.
                  </p>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="text-slate-200 font-medium mb-2">Middle School (6-8)</h4>
                  <p className="text-sm text-slate-400">
                    60-90 minutes optimal. Can handle longer content blocks with breaks.
                  </p>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="text-slate-200 font-medium mb-2">High School (9-12)</h4>
                  <p className="text-sm text-slate-400">
                    75-120 minutes optimal. Extended focus periods for complex topics.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherLessonDuration;