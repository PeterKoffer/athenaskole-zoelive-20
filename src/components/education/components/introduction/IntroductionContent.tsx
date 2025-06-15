
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, RotateCcw, Play } from 'lucide-react';

interface IntroductionContentProps {
  currentStepText: string;
  currentStep: number;
  totalSteps: number;
  autoReadEnabled: boolean;
  isSpeaking: boolean;
  isIntroductionComplete: boolean;
  onMuteToggle: () => void;
  onManualRead: () => void;
  onStartLesson: () => void;
}

const IntroductionContent = ({
  currentStepText,
  currentStep,
  totalSteps,
  autoReadEnabled,
  isSpeaking,
  isIntroductionComplete,
  onMuteToggle,
  onManualRead,
  onStartLesson
}: IntroductionContentProps) => {
  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🔢</div>
        <h1 className="text-4xl font-bold text-white mb-4">Mathematics with Nelie!</h1>
        <div className="text-2xl text-purple-200 mb-6">
          Ready for an amazing math adventure?
        </div>
      </div>

      {/* Nelie's current message */}
      <div className="bg-blue-900/40 rounded-lg p-8 border border-blue-400/30">
        <div className="text-blue-100 text-xl leading-relaxed mb-6 text-center">
          {currentStepText}
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="text-blue-300 text-sm font-medium">
            Step {currentStep + 1} of {totalSteps}
          </div>
          <div className="flex-1 bg-blue-900 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full transition-all duration-700"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Math Tips Section */}
      <div className="bg-yellow-900/30 border border-yellow-400/30 rounded-lg p-6">
        <h3 className="text-yellow-200 font-bold text-lg mb-4 flex items-center">
          <span className="text-2xl mr-2">💡</span>
          Math Learning Tips
        </h3>
        <ul className="space-y-2 text-yellow-100">
          <li>• Take your time with each problem - there's no rush!</li>
          <li>• Ask Nelie to repeat if you need to hear something again</li>
          <li>• Math is like solving puzzles - have fun with it!</li>
          <li>• Every mistake is a chance to learn something new</li>
        </ul>
      </div>

      {/* Control buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          onClick={onMuteToggle}
          variant="outline"
          className="border-purple-400 bg-gray-800/60 text-white hover:bg-gray-700"
        >
          {autoReadEnabled ? (
            <>
              <Volume2 className="w-4 h-4 mr-2" />
              Sound On
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 mr-2" />
              Sound Off
            </>
          )}
        </Button>
        
        <Button
          onClick={onManualRead}
          variant="outline"
          className="border-purple-400 bg-gray-800/60 text-white hover:bg-gray-700"
          disabled={isSpeaking}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {isSpeaking ? 'Nelie is Speaking...' : 'Ask Nelie to Repeat'}
        </Button>

        <Button
          onClick={onStartLesson}
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Math Lesson!
        </Button>
      </div>

      {/* Auto-advance message when complete */}
      {isIntroductionComplete && (
        <div className="text-center bg-green-900/30 border border-green-400/30 rounded-lg p-4">
          <div className="text-green-200 text-lg mb-3 font-medium">
            🎉 Ready to start your math adventure!
          </div>
          <div className="text-green-300 text-sm">
            Starting lesson automatically in 3 seconds...
          </div>
        </div>
      )}
    </div>
  );
};

export default IntroductionContent;
