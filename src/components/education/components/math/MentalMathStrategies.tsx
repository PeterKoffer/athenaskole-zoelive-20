
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import { useEffect } from 'react';
import AskNelieButtons from '../shared/AskNelieButtons';
import Blackboard from '../shared/Blackboard';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';

interface MentalMathStrategiesProps {
  studentName: string;
  onComplete: () => void;
}

const MentalMathStrategies = ({ studentName, onComplete }: MentalMathStrategiesProps) => {
  const { speakAsNelie, autoReadEnabled } = useUnifiedSpeech();

  // Welcome message to be spoken by Nelie
  const welcomeMessage = `Hello there, ${studentName}! I'm Nelie, your AI learning companion, and I'm absolutely thrilled to be your teacher today! Welcome to our Mathematics class. I'm here to guide you through this amazing learning journey, step by step, making sure you understand everything clearly and have fun while learning!`;

  // Speak welcome message when component loads
  useEffect(() => {
    if (autoReadEnabled) {
      const timer = setTimeout(() => {
        speakAsNelie(welcomeMessage, true, 'mental-math-welcome');
      }, 1000); // Small delay to ensure component is fully loaded

      return () => clearTimeout(timer);
    }
  }, [autoReadEnabled, speakAsNelie, welcomeMessage]);

  return (
    <Blackboard>
      <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
        <Brain className="w-6 h-6 mr-3 text-purple-400" />
        Mental Math Strategies
      </h2>
      
      <div className="text-gray-300 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-900/60 to-blue-900/60 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-white">Welcome to Class</h3>
            <AskNelieButtons 
              content={welcomeMessage}
              context="mental-math-welcome"
              className="ml-4"
            />
          </div>
          <p className="text-gray-200 leading-relaxed">
            Hello there, {studentName}! I'm Nelie, your AI learning companion, and I'm absolutely thrilled to be 
            your teacher today! Welcome to our Mathematics class. I'm here to guide you through this 
            amazing learning journey, step by step, making sure you understand everything clearly and 
            have fun while learning!
          </p>
        </div>

        <div className="bg-blue-900/30 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-blue-200">Key Strategies for {studentName}:</h3>
            <AskNelieButtons 
              content="Key mental math strategies include number bonds, compensation, doubling and halving, and using benchmark numbers"
              context="mental-math-overview"
              className="ml-4"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-purple-800/30 rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-purple-200">🔢 Number Bonds</h4>
                  <AskNelieButtons 
                    content="Number bonds help you break numbers into friendly parts that add up to 10. For example, 8 plus 7 equals 8 plus 2 plus 5, which equals 10 plus 5, which equals 15"
                    context="number-bonds"
                  />
                </div>
                <p className="text-sm text-purple-100">Break numbers into friendly parts that add up to 10</p>
                <p className="text-xs text-purple-300 mt-1">Example: 8 + 7 = 8 + 2 + 5 = 10 + 5 = 15</p>
              </div>
              
              <div className="bg-green-800/30 rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-green-200">➕ Compensation</h4>
                  <AskNelieButtons 
                    content="Compensation means rounding to easier numbers, then adjusting your answer. For example, 29 plus 15 becomes 30 plus 15 minus 1, which equals 44"
                    context="compensation"
                  />
                </div>
                <p className="text-sm text-green-100">Round to easier numbers, then adjust</p>
                <p className="text-xs text-green-300 mt-1">Example: 29 + 15 = 30 + 15 - 1 = 44</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-orange-800/30 rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-orange-200">✖️ Doubling & Halving</h4>
                  <AskNelieButtons 
                    content="Doubling and halving uses known doubles to solve problems. For example, 6 times 8 equals 6 times 4 times 2, which equals 24 times 2, which equals 48"
                    context="doubling-halving"
                  />
                </div>
                <p className="text-sm text-orange-100">Use known doubles to solve problems</p>
                <p className="text-xs text-orange-300 mt-1">Example: 6 × 8 = (6 × 4) × 2 = 24 × 2 = 48</p>
              </div>
              
              <div className="bg-red-800/30 rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-red-200">🎯 Benchmark Numbers</h4>
                  <AskNelieButtons 
                    content="Benchmark numbers like 10, 100, or 1000 serve as reference points. For example, 98 plus 47 becomes 100 plus 47 minus 2, which equals 145"
                    context="benchmark-numbers"
                  />
                </div>
                <p className="text-sm text-red-100">Use 10, 100, or 1000 as reference points</p>
                <p className="text-xs text-red-300 mt-1">Example: 98 + 47 = 100 + 47 - 2 = 145</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-white">💡 Quick Tips for Mental Math Success:</h3>
            <AskNelieButtons 
              content="Here are quick tips for mental math success: Practice with small numbers first, then work up to larger ones. Look for patterns and number relationships. Use the strategy that feels most comfortable for each problem. Don't rush, accuracy is more important than speed"
              context="mental-math-tips"
            />
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span>Practice with small numbers first, then work up to larger ones</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span>Look for patterns and number relationships</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span>Use the strategy that feels most comfortable for each problem</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span>Don't rush - accuracy is more important than speed</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <Button
          onClick={onComplete}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8"
        >
          Ready to Practice These Strategies, {studentName}!
        </Button>
      </div>
    </Blackboard>
  );
};

export default MentalMathStrategies;
