
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';

interface ExplanationCardProps {
  explanation: string;
  subject: string;
  isVisible: boolean;
}

const ExplanationCard = ({ explanation, subject, isVisible }: ExplanationCardProps) => {
  const { speak } = useSpeechSynthesis();

  if (!isVisible) return null;

  const handleReadAloud = () => {
    speak(explanation);
  };

  return (
    <Card className="bg-blue-900 border-blue-600">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-blue-100">Explanation</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReadAloud}
            className="text-blue-200 border-blue-400 hover:bg-blue-800"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Listen
          </Button>
        </div>
        <p className="text-blue-200">{explanation}</p>
        {subject === 'science' && (
          <p className="text-xs text-blue-300 mt-2 italic">
            💡 Science explanation will stay visible for 15 seconds
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ExplanationCard;
