import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Scale, Save, RotateCcw, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import TeacherSidebar from '@/components/teacher/TeacherSidebar';

const TeacherSubjectWeighting = () => {
  const navigate = useNavigate();
  const [weights, setWeights] = useState<Record<string, number[]>>({
    'Mathematics': [85],
    'Science': [80],
    'English': [75],
    'History': [70],
    'Physical Education': [60],
    'Art': [55],
    'Music': [50]
  });

  const subjects = [
    {
      name: 'Mathematics',
      description: 'Core mathematical concepts and problem solving',
      classes: ['Math 6A', 'Math 5A'],
      color: 'bg-blue-500',
      priority: 'High'
    },
    {
      name: 'Science',
      description: 'Scientific method, experiments, and discoveries',
      classes: ['Science 5B'],
      color: 'bg-green-500',
      priority: 'High'
    },
    {
      name: 'English',
      description: 'Language arts, reading, and writing skills',
      classes: ['English 4A'],
      color: 'bg-purple-500',
      priority: 'High'
    },
    {
      name: 'History',
      description: 'Historical events and social studies',
      classes: ['History 6B'],
      color: 'bg-orange-500',
      priority: 'Medium'
    },
    {
      name: 'Physical Education',
      description: 'Physical fitness and sports activities',
      classes: ['PE All Grades'],
      color: 'bg-red-500',
      priority: 'Medium'
    },
    {
      name: 'Art',
      description: 'Creative expression and visual arts',
      classes: ['Art 4-6'],
      color: 'bg-pink-500',
      priority: 'Low'
    },
    {
      name: 'Music',
      description: 'Musical education and performance',
      classes: ['Music 4-6'],
      color: 'bg-indigo-500',
      priority: 'Low'
    }
  ];

  const handleWeightChange = (subject: string, value: number[]) => {
    setWeights(prev => ({ ...prev, [subject]: value }));
  };

  const resetToDefaults = () => {
    const defaultWeights: Record<string, number[]> = {};
    subjects.forEach(subject => {
      if (subject.priority === 'High') defaultWeights[subject.name] = [80];
      else if (subject.priority === 'Medium') defaultWeights[subject.name] = [65];
      else defaultWeights[subject.name] = [50];
    });
    setWeights(defaultWeights);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getWeightLabel = (weight: number) => {
    if (weight >= 80) return 'Critical';
    if (weight >= 70) return 'High';
    if (weight >= 60) return 'Medium';
    if (weight >= 40) return 'Low';
    return 'Minimal';
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
              <Scale className="w-6 h-6 mr-3 text-yellow-400" />
              Subject Weighting
            </h1>
            <p className="text-sm text-slate-400">Configure the importance and priority of each subject</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
              onClick={resetToDefaults}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Weights
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 h-[calc(100%-5rem)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subjects.map((subject) => (
              <Card key={subject.name} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${subject.color}`}></div>
                      <div>
                        <CardTitle className="text-white text-lg">{subject.name}</CardTitle>
                        <p className="text-sm text-slate-400">{subject.description}</p>
                      </div>
                    </div>
                    <Badge className={`${getPriorityColor(subject.priority)} text-white`}>
                      {subject.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-slate-200 font-medium">
                        Subject Weight
                      </label>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-white">
                          {weights[subject.name][0]}%
                        </span>
                        <p className="text-xs text-slate-400">
                          {getWeightLabel(weights[subject.name][0])}
                        </p>
                      </div>
                    </div>
                    
                    <Slider
                      value={weights[subject.name]}
                      onValueChange={(value) => handleWeightChange(subject.name, value)}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                    
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-200">Associated Classes</h4>
                    <div className="flex flex-wrap gap-2">
                      {subject.classes.map((className) => (
                        <Badge 
                          key={className} 
                          variant="outline" 
                          className="bg-slate-700 border-slate-600 text-slate-200"
                        >
                          {className}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-slate-400 mb-1">Impact on GPA</p>
                      <p className="text-slate-200 font-medium">
                        {(weights[subject.name][0] * 0.01 * 4).toFixed(1)} pts
                      </p>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-slate-400 mb-1">Weekly Hours</p>
                      <p className="text-slate-200 font-medium">
                        {Math.round(weights[subject.name][0] * 0.08)}h
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Card */}
          <Card className="mt-6 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                Weighting Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="text-slate-200 font-medium mb-2">Total Weight</h4>
                  <p className="text-2xl font-bold text-white">
                    {Object.values(weights).reduce((sum, weight) => sum + weight[0], 0)}%
                  </p>
                  <p className="text-sm text-slate-400">Across all subjects</p>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="text-slate-200 font-medium mb-2">Average Weight</h4>
                  <p className="text-2xl font-bold text-white">
                    {Math.round(Object.values(weights).reduce((sum, weight) => sum + weight[0], 0) / subjects.length)}%
                  </p>
                  <p className="text-sm text-slate-400">Per subject</p>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="text-slate-200 font-medium mb-2">High Priority</h4>
                  <p className="text-2xl font-bold text-white">
                    {subjects.filter(s => s.priority === 'High').length}
                  </p>
                  <p className="text-sm text-slate-400">Critical subjects</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-slate-200 mb-2">💡 <strong>Recommendation:</strong></p>
                <p className="text-sm text-slate-300">
                  Current weighting favors core academic subjects. Consider balancing with creative and physical education for well-rounded development.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherSubjectWeighting;