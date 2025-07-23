

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, Lightbulb, Users } from 'lucide-react';

const EnhancedMentalWellnessLearning = () => {
  const topics = [
    {
      title: "Understanding Emotions",
      description: "Learn to identify and understand your feelings",
      icon: Heart,
      color: "text-red-400"
    },
    {
      title: "Coping Strategies", 
      description: "Discover healthy ways to manage stress and anxiety",
      icon: Lightbulb,
      color: "text-yellow-400"
    },
    {
      title: "Mindfulness Basics",
      description: "Practice techniques to stay present and calm",
      icon: Brain,
      color: "text-blue-400"
    },
    {
      title: "Building Relationships",
      description: "Learn how to support others and build connections",
      icon: Users,
      color: "text-green-400"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Mental Wellness Learning</h1>
        <p className="text-gray-300 text-lg">
          Nurture your mind and learn valuable life skills for emotional well-being
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {topics.map((topic, index) => {
          const IconComponent = topic.icon;
          return (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-teal-500 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white">
                  <IconComponent className={`w-6 h-6 ${topic.color}`} />
                  <span>{topic.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{topic.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default EnhancedMentalWellnessLearning;
