
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Star, Brain } from 'lucide-react';

interface MathWelcomeMessageProps {
  studentName: string;
  onStartLesson: () => void;
}

const MathWelcomeMessage = ({ studentName, onStartLesson }: MathWelcomeMessageProps) => {
  return (
    <Card className="bg-black/70 border-purple-400/50 backdrop-blur-md max-w-2xl w-full">
      <CardContent className="p-8 text-center">
        {/* Welcome Header */}
        <div className="mb-6">
          <Calculator className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to Mathematics, {studentName}!
          </h1>
          <p className="text-gray-300 text-lg">
            I'm Nelie, your AI math teacher. Let's explore the wonderful world of numbers together!
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-black/40 rounded-lg p-4 border border-blue-400/30">
            <Brain className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">AI-Generated Questions</h3>
            <p className="text-gray-400 text-sm">Custom math problems just for you</p>
          </div>
          
          <div className="bg-black/40 rounded-lg p-4 border border-green-400/30">
            <Star className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">Track Your Progress</h3>
            <p className="text-gray-400 text-sm">See your score and accuracy improve</p>
          </div>
          
          <div className="bg-black/40 rounded-lg p-4 border border-yellow-400/30">
            <Calculator className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">Interactive Learning</h3>
            <p className="text-gray-400 text-sm">Hands-on math practice</p>
          </div>
        </div>

        {/* Session Info */}
        <div className="bg-purple-900/30 rounded-lg p-4 mb-6 border border-purple-400/30">
          <h3 className="text-white font-semibold mb-2">Today's Session</h3>
          <p className="text-gray-300 text-sm">
            We'll work through 6 math problems together. Take your time, and remember - every mistake is a chance to learn!
          </p>
        </div>

        {/* Start Button */}
        <Button
          onClick={onStartLesson}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 text-lg rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
        >
          Start Your Math Adventure! 🚀
        </Button>
      </CardContent>
    </Card>
  );
};

export default MathWelcomeMessage;
