
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import TextWithSpeaker from '../shared/TextWithSpeaker';

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
      <TextWithSpeaker
        text="Welcome to the Future of Learning. Meet Nelie, your AI-powered learning companion. Experience personalized education that adapts to your unique learning style, making every lesson engaging and effective."
        context="math-welcome-message"
        position="corner"
        showOnHover={false}
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔢</div>
          <h1 className="text-4xl font-bold text-white mb-4">Mathematics with Nelie!</h1>
          <div className="text-2xl text-purple-200 mb-6">
            Ready for an amazing math adventure?
          </div>
        </div>
      </TextWithSpeaker>

      {/* Nelie's current message */}
      <TextWithSpeaker
        text={currentStepText}
        context="introduction-step-message"
        position="corner"
        showOnHover={false}
      >
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
      </TextWithSpeaker>

      {/* Math Tips Section */}
      <TextWithSpeaker
        text="Math Learning Tips: Take your time with each problem - there's no rush! Ask Nelie to repeat if you need to hear something again. Math is like solving puzzles - have fun with it! Every mistake is a chance to learn something new."
        context="math-learning-tips"
        position="corner"
        showOnHover={false}
      >
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
      </TextWithSpeaker>

      {/* Auto-advance message when complete - NO COUNTDOWN */}
      {isIntroductionComplete && (
        <TextWithSpeaker
          text="Ready to start your math adventure! Click the button below to begin."
          context="lesson-start-message"
          position="corner"
          showOnHover={false}
        >
          <div className="text-center bg-green-900/30 border border-green-400/30 rounded-lg p-6">
            <div className="text-green-200 text-lg mb-4 font-medium">
              🎉 Ready to start your math adventure!
            </div>
            <Button
              onClick={onStartLesson}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium px-6 py-2"
            >
              Start Math Lesson
            </Button>
          </div>
        </TextWithSpeaker>
      )}
    </div>
  );
};

export default IntroductionContent;
