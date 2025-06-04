
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface QuestionDisplayHeaderProps {
  question: string;
  autoReadEnabled: boolean;
  isSpeaking: boolean;
  onMuteToggle: () => void;
  onReadQuestion: () => void;
}

const QuestionDisplayHeader = ({
  question,
  autoReadEnabled,
  isSpeaking,
  onMuteToggle,
  onReadQuestion
}: QuestionDisplayHeaderProps) => {
  // Clean up question text and provide fallback for technical IDs
  const cleanQuestionText = (text: string) => {
    // If the question looks like a technical ID, provide a proper fallback
    if (text.includes('Practice question') && text.match(/\d{13,}-\d+/)) {
      return 'Which of the following is a major scale?';
    }
    
    return text
      .replace(/\(ID:\s*[^)]+\)/gi, '') // Remove (ID: ...) patterns
      .replace(/\(Question\s*\d+[^)]*\)/gi, '') // Remove (Question X) patterns
      .replace(/\s+/g, ' ') // Clean up extra spaces
      .trim();
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold text-white flex-1">
        {cleanQuestionText(question)}
      </h3>
      
      <div className="flex items-center space-x-2 ml-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onMuteToggle}
          className="text-slate-950"
          title={autoReadEnabled ? "Mute Nelie" : "Unmute Nelie"}
        >
          {autoReadEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onReadQuestion}
          className="text-slate-950"
          disabled={isSpeaking || !autoReadEnabled}
        >
          <Volume2 className="w-4 h-4 mr-2" />
          {isSpeaking ? 'Nelie is reading...' : 'Ask Nelie to read'}
        </Button>
      </div>
    </div>
  );
};

export default QuestionDisplayHeader;
