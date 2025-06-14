import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { userLearningProfileService } from '@/services/userLearningProfileService';
import { useWorkingSpeech } from '../hooks/useWorkingSpeech';

interface ExplanationCardProps {
  explanation: string;
  subject: string;
  skillArea?: string;
  isVisible: boolean;
  onSpeechEnd?: () => void;
  isCorrect?: boolean;
  correctAnswer?: string;
  questionData?: any;
  userAnswer?: string;
  responseTimeSeconds?: number;
  sessionId?: string;
  questionNumber?: number;
  totalQuestions?: number;
}

const ExplanationCard = ({
  explanation,
  subject,
  skillArea = 'general',
  isVisible,
  onSpeechEnd,
  isCorrect = true,
  correctAnswer,
  questionData,
  userAnswer,
  responseTimeSeconds,
  sessionId,
  questionNumber,
  totalQuestions
}: ExplanationCardProps) => {
  const { user } = useAuth();
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [displayTime, setDisplayTime] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const hasAutoSpoken = useRef(false);
  const { isSpeaking, autoReadEnabled, speakText, stopSpeaking } = useWorkingSpeech();

  // Load user preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      if (user?.id) {
        const preferences = await userLearningProfileService.getUserPreferences(user.id);
        setUserPreferences(preferences);
      }
    };
    loadPreferences();
  }, [user?.id]);

  // Track how long explanation is displayed
  useEffect(() => {
    if (isVisible) {
      const timer = setInterval(() => {
        setDisplayTime(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(timer);
    } else {
      setDisplayTime(0);
      hasAutoSpoken.current = false; // Reset when explanation becomes invisible
    }
  }, [isVisible]);

  // Record question history when explanation becomes visible
  useEffect(() => {
    const recordQuestionHistory = async () => {
      if (isVisible && user?.id && questionData) {
        console.log('📝 Recording question history for learning memory...');
        const historyEntry = {
          user_id: user.id,
          subject: subject,
          skill_area: skillArea,
          question_text: questionData.question || 'Unknown question',
          question_type: 'multiple_choice',
          difficulty_level: questionData.difficulty_level || 1,
          concepts_covered: questionData.concepts || [],
          user_answer: userAnswer || '',
          correct_answer: correctAnswer || '',
          is_correct: isCorrect,
          response_time_seconds: responseTimeSeconds || 0,
          session_id: sessionId,
          question_number: questionNumber || 1,
          total_questions_in_session: totalQuestions || 1,
          struggle_indicators: isCorrect ? {} : {
            incorrect_answer: userAnswer,
            response_time: responseTimeSeconds
          },
          mastery_indicators: isCorrect ? {
            quick_response: (responseTimeSeconds || 0) < 10,
            confident_selection: true
          } : {}
        };
        const success = await userLearningProfileService.recordQuestionHistory(historyEntry);
        if (success) {
          console.log('✅ Question history recorded successfully');

          await userLearningProfileService.analyzeAndUpdateProfile(user.id, subject, skillArea, questionData, {
            answer: userAnswer,
            is_correct: isCorrect,
            response_time: responseTimeSeconds
          });
        } else {
          console.error('❌ Failed to record question history');
        }
      }
    };
    recordQuestionHistory();
  }, [isVisible, user?.id, questionData, userAnswer, isCorrect, correctAnswer, responseTimeSeconds, sessionId, questionNumber, totalQuestions, subject, skillArea]);

  // Auto-scroll to explanation when it becomes visible
  useEffect(() => {
    if (isVisible && cardRef.current) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }, 200);
    }
  }, [isVisible]);

  // Auto-read explanation if enabled (only once per explanation)
  useEffect(() => {
    if (isVisible && autoReadEnabled && !hasAutoSpoken.current) {
      hasAutoSpoken.current = true;
      setTimeout(() => {
        handleReadAloud();
      }, 1200);
    }
  }, [isVisible, autoReadEnabled]);

  if (!isVisible) return null;

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    let speechText = `Nelie explains: ${explanation}`;
    if (!isCorrect && correctAnswer) {
      speechText = `That's not quite right. The correct answer is: ${correctAnswer}. Let me explain: ${explanation}`;
    }
    
    // Create unique context for this explanation
    const context = `explanation-${questionNumber}-${isCorrect ? 'correct' : 'incorrect'}`;
    console.log('🔊 ExplanationCard speaking with context:', context, speechText.substring(0, 50));
    speakText(speechText, true);
  };

  return (
    <Card 
      ref={cardRef} 
      className={`${isCorrect ? 'bg-blue-900 border-blue-600' : 'bg-red-900 border-red-600'} mt-4`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-lg font-semibold text-center flex-1 ${isCorrect ? 'text-blue-100' : 'text-red-100'}`}>
            {isCorrect ? 'Nelie\'s Explanation' : 'Nelie\'s Correction'}
          </h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleReadAloud} className="text-slate-950">
              <Volume2 className="w-4 h-4 mr-2" />
              {isSpeaking ? 'Stop Nelie' : 'Listen to Nelie'}
            </Button>
            {isSpeaking && (
              <div className={`flex items-center ${isCorrect ? 'text-blue-300' : 'text-red-300'}`}>
                <div className={`w-2 h-2 ${isCorrect ? 'bg-blue-400' : 'bg-red-400'} rounded-full animate-pulse mr-1`}></div>
                <span className="text-xs">Nelie is speaking...</span>
              </div>
            )}
          </div>
        </div>
        {!isCorrect && correctAnswer && (
          <p className="text-red-300 font-medium mb-2 text-center">
            Correct answer: {correctAnswer}
          </p>
        )}
        <p className={`text-center ${isCorrect ? 'text-blue-200' : 'text-red-200'}`}>{explanation}</p>
        
        <div className="mt-3 text-center">
          <span className={`text-xs ${isCorrect ? 'text-blue-400' : 'text-red-400'}`}>
            Reading time: {displayTime}s • Nelie's explanation is always available
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExplanationCard;
