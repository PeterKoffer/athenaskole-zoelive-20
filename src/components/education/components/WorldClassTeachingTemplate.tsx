
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Target, Clock, Trophy, Book, Star } from 'lucide-react';

interface TeachingTemplateProps {
  subject: string;
  studentName: string;
  gradeLevel: number;
  onStartLesson: () => void;
}

const WorldClassTeachingTemplate = ({
  subject,
  studentName,
  gradeLevel,
  onStartLesson
}: TeachingTemplateProps) => {
  const [adaptiveProfile, setAdaptiveProfile] = useState({
    learningStyle: 'Visual',
    strengthAreas: ['Problem Solving', 'Critical Thinking'],
    growthAreas: ['Speed', 'Confidence'],
    engagementLevel: 85,
    masteryProgress: 72
  });

  const teachingPrinciples = [
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Adaptive Intelligence",
      description: "AI that learns your unique learning patterns and adapts in real-time"
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Precision Targeting",
      description: "Questions and content perfectly matched to your current skill level"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Optimal Pacing",
      description: "Smart timing that maximizes learning without overwhelming"
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      title: "Mastery-Based Progress",
      description: "Advance only when you've truly mastered each concept"
    },
    {
      icon: <Book className="w-5 h-5" />,
      title: "Rich Content Library",
      description: "Thousands of unique, contextual questions and explanations"
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: "Personalized Experience",
      description: "Every lesson is crafted specifically for your learning journey"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          World-Class AI Teaching System
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Experience the future of education with our adaptive AI tutor that creates unique, 
          personalized learning experiences for every student.
        </p>
      </div>

      {/* Student Profile Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            {studentName}'s Learning Profile - Grade {gradeLevel}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">Learning Style</h4>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {adaptiveProfile.learningStyle}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">Engagement Level</h4>
              <div className="flex items-center gap-2">
                <Progress value={adaptiveProfile.engagementLevel} className="flex-1" />
                <span className="text-sm font-medium">{adaptiveProfile.engagementLevel}%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">Mastery Progress</h4>
              <div className="flex items-center gap-2">
                <Progress value={adaptiveProfile.masteryProgress} className="flex-1" />
                <span className="text-sm font-medium">{adaptiveProfile.masteryProgress}%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">Subject Focus</h4>
              <Badge variant="outline" className="border-purple-200 text-purple-800">
                {subject}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Strength Areas</h4>
              <div className="flex flex-wrap gap-2">
                {adaptiveProfile.strengthAreas.map((area, index) => (
                  <Badge key={index} className="bg-green-100 text-green-800 border-green-200">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Growth Areas</h4>
              <div className="flex flex-wrap gap-2">
                {adaptiveProfile.growthAreas.map((area, index) => (
                  <Badge key={index} className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teaching Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachingPrinciples.map((principle, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                  {principle.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{principle.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Highlight */}
      <Card className="bg-gradient-to-r from-purple-900 to-blue-900 text-white">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">What Makes This The Best AI Teaching System?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="space-y-3">
                <div className="text-4xl font-bold text-blue-300">100%</div>
                <div className="text-lg font-semibold">Unique Questions</div>
                <div className="text-sm opacity-90">
                  Every question is guaranteed to be completely unique to your learning journey
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-4xl font-bold text-purple-300">AI-Powered</div>
                <div className="text-lg font-semibold">Adaptive Learning</div>
                <div className="text-sm opacity-90">
                  Advanced AI that understands your learning patterns and adapts instantly
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-4xl font-bold text-green-300">∞</div>
                <div className="text-lg font-semibold">Infinite Content</div>
                <div className="text-sm opacity-90">
                  Unlimited practice with contextual, engaging educational content
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Start Lesson Button */}
      <div className="text-center">
        <Button
          onClick={onStartLesson}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Start Your Personalized {subject} Lesson, {studentName}!
        </Button>
        <p className="text-sm text-gray-600 mt-4">
          Get ready for a learning experience tailored perfectly for you
        </p>
      </div>
    </div>
  );
};

export default WorldClassTeachingTemplate;
