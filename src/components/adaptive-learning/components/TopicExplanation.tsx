
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight } from 'lucide-react';

interface TopicExplanationProps {
  subject: string;
  skillArea: string;
  gradeLevel?: number;
  standardInfo?: {
    code: string;
    title: string;
    description: string;
  };
  onStartQuestions: () => void;
}

const TopicExplanation = ({
  subject,
  skillArea,
  gradeLevel,
  standardInfo,
  onStartQuestions
}: TopicExplanationProps) => {
  const getExplanationContent = () => {
    const gradeText = gradeLevel ? `Grade ${gradeLevel}` : '';
    
    switch (subject.toLowerCase()) {
      case 'mathematics':
      case 'math':
        return {
          title: `${gradeText} ${skillArea}`,
          explanation: `Welcome to your ${skillArea} lesson! In this session, we'll explore key concepts and practice problems to strengthen your understanding. ${skillArea} is an important mathematical skill that builds on previous knowledge and prepares you for more advanced topics.`,
          keyPoints: [
            'We\'ll start with fundamental concepts',
            'Practice with guided examples',
            'Apply your knowledge to solve problems',
            'Build confidence through step-by-step learning'
          ]
        };
      
      case 'science':
        return {
          title: `${gradeText} ${skillArea}`,
          explanation: `Welcome to your ${skillArea} lesson! Science is all about understanding how the world around us works. In this session, we'll explore fascinating concepts through observation, questioning, and discovery.`,
          keyPoints: [
            'Observe and analyze scientific phenomena',
            'Learn through hands-on examples',
            'Develop critical thinking skills',
            'Connect science to everyday life'
          ]
        };
      
      case 'english':
      case 'language arts':
        return {
          title: `${gradeText} ${skillArea}`,
          explanation: `Welcome to your ${skillArea} lesson! Language arts helps us communicate effectively and understand the world through reading and writing. Let's develop your skills together!`,
          keyPoints: [
            'Improve reading comprehension',
            'Enhance writing techniques',
            'Build vocabulary and grammar skills',
            'Express ideas clearly and creatively'
          ]
        };
      
      default:
        return {
          title: `${gradeText} ${skillArea}`,
          explanation: `Welcome to your ${skillArea} lesson! Today we'll explore this important topic step by step, building your understanding through clear explanations and practical examples.`,
          keyPoints: [
            'Learn fundamental concepts',
            'Practice with real examples',
            'Build understanding gradually',
            'Apply knowledge confidently'
          ]
        };
    }
  };

  const content = getExplanationContent();

  return (
    <Card className="bg-gray-900 border-gray-800 max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3 text-white">
          <BookOpen className="w-6 h-6 text-lime-400" />
          <div>
            <h2 className="text-2xl font-bold">{content.title}</h2>
            {standardInfo && (
              <p className="text-sm text-gray-400 mt-1">
                Aligned with {standardInfo.code}: {standardInfo.title}
              </p>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-200 mb-3">
            📚 What You'll Learn Today
          </h3>
          <p className="text-blue-100 leading-relaxed">
            {content.explanation}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            🎯 Learning Objectives
          </h3>
          <ul className="space-y-2">
            {content.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start space-x-3 text-gray-300">
                <span className="text-lime-400 font-bold text-sm mt-1">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {standardInfo && (
          <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
            <h4 className="text-green-200 font-medium mb-2">📖 Curriculum Standard</h4>
            <p className="text-green-100 text-sm">{standardInfo.description}</p>
          </div>
        )}

        <div className="bg-gradient-to-r from-lime-900/30 to-green-900/30 border border-lime-700 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-lime-200 mb-2">
            Ready to Start Learning? 🚀
          </h3>
          <p className="text-lime-300 mb-4">
            Your personalized questions are ready! Let's practice what we've discussed.
          </p>
          <Button 
            onClick={onStartQuestions}
            className="bg-lime-500 hover:bg-lime-600 text-black font-semibold px-8 py-3 text-lg"
          >
            Start Practice Questions
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicExplanation;
