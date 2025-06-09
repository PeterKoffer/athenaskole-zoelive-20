
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward } from "lucide-react";

interface LessonControlsProps {
  isSessionActive: boolean;
  onToggleSession: () => void;
  onNextQuestion?: () => void;
  canSkip: boolean;
  showSkip?: boolean;
}

const LessonControls = ({
  isSessionActive,
  onToggleSession,
  onNextQuestion,
  canSkip,
  showSkip = false
}: LessonControlsProps) => {
  return (
    <div className="flex justify-center space-x-4 p-4 bg-gray-900 border-t border-gray-700">
      <Button 
        onClick={onToggleSession} 
        className={`${isSessionActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
      >
        {isSessionActive ? (
          <>
            <Pause className="w-4 h-4 mr-2" />
            Pause Session
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Resume Session
          </>
        )}
      </Button>
      
      {showSkip && canSkip && onNextQuestion && (
        <Button 
          onClick={onNextQuestion} 
          variant="outline" 
          className="border-gray-600 text-slate-950 bg-slate-50"
        >
          <SkipForward className="w-4 h-4 mr-2" />
          Skip Question
        </Button>
      )}
    </div>
  );
};

export default LessonControls;
