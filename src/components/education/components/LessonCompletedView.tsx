
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

interface LessonCompletedViewProps {
  onBackToProgram: () => void;
}

const LessonCompletedView = ({ onBackToProgram }: LessonCompletedViewProps) => {
  return (
    <Card className="bg-green-900 border-green-600">
      <CardContent className="p-8 text-center">
        <Calculator className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Amazing Work! 🎉</h2>
        <p className="text-green-200 mb-6">
          Congratulations! You've completed your full 20-minute Mathematics adventure with Nelie. 
          You solved problems, played games, and learned so much!
        </p>
        <Button 
          onClick={onBackToProgram}
          className="bg-green-600 hover:bg-green-700"
        >
          Back to Program
        </Button>
      </CardContent>
    </Card>
  );
};

export default LessonCompletedView;
