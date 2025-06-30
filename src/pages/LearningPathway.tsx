
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Target, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LearningPathway: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            className="border-gray-600 text-slate-950 bg-zinc-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">Learning Pathway</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-400" />
                Learning Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Set and track your personalized learning objectives across all subjects.
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Set Learning Goals
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Monitor your learning progress and celebrate achievements.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                View Progress
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pathway Overview */}
        <Card className="bg-gray-800 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white">Your Learning Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Discover your personalized learning pathway based on your goals, interests, and progress.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => navigate('/education/math')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Mathematics
              </Button>
              <Button 
                onClick={() => navigate('/education/english')}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                English
              </Button>
              <Button 
                onClick={() => navigate('/education/science')}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Science
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearningPathway;
