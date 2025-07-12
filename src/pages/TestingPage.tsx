
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TestTube, Brain, BookOpen } from 'lucide-react';
import K5LessonTester from '@/components/testing/K5LessonTester';

const TestingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="mb-4 text-white border-gray-600 hover:bg-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <TestTube className="w-6 h-6 text-cyan-400" />
              <span>NELIE K-5 Testing Center</span>
            </CardTitle>
            <p className="text-gray-300">
              Test the AI lesson generation system with our comprehensive K-5 curriculum data.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-700">
                <Brain className="w-8 h-8 text-purple-400 mb-2" />
                <h3 className="text-white font-medium mb-1">AI Generation</h3>
                <p className="text-gray-300 text-sm">Test if AI can create lessons from curriculum data</p>
              </div>
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700">
                <BookOpen className="w-8 h-8 text-blue-400 mb-2" />
                <h3 className="text-white font-medium mb-1">All Subjects</h3>
                <p className="text-gray-300 text-sm">Test all 12 K-5 subjects we've populated</p>
              </div>
              <div className="bg-green-900/20 rounded-lg p-4 border border-green-700">
                <TestTube className="w-8 h-8 text-green-400 mb-2" />
                <h3 className="text-white font-medium mb-1">Live Testing</h3>
                <p className="text-gray-300 text-sm">Experience generated lessons in real-time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Testing Interface */}
      <K5LessonTester />
    </div>
  );
};

export default TestingPage;
