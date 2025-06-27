
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, Database } from 'lucide-react';
import { LearnerProfile } from '@/types/learnerProfile';
import { KnowledgeComponent } from '@/types/knowledgeComponent';
import { ContentAtom } from '@/types/content';
import TextExplanationAtom from '../atoms/TextExplanationAtom';
import QuestionCard from '../cards/QuestionCard';

interface PracticeContentProps {
  currentKc: KnowledgeComponent | null;
  learnerProfile: LearnerProfile | null;
  currentAtom: ContentAtom;
  showFeedback: boolean;
  isCorrect: boolean;
  feedbackMessage: string;
  isLoading: boolean;
  onQuestionAnswer: (atom: ContentAtom, answerGiven: string | string[], isCorrectAnswer: boolean) => void;
  onNextAtom: () => void;
  onShowServiceTests: () => void;
}

const PracticeContent: React.FC<PracticeContentProps> = ({
  currentKc,
  learnerProfile,
  currentAtom,
  showFeedback,
  isCorrect,
  feedbackMessage,
  isLoading,
  onQuestionAnswer,
  onNextAtom,
  onShowServiceTests
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto mt-4 md:mt-8 shadow-2xl bg-slate-800 text-slate-50 border border-slate-700">
      <CardHeader className="pb-4 bg-slate-700/50 rounded-t-lg">
        <CardTitle className="text-xl md:text-2xl font-bold text-center text-sky-300">
          Adaptive Practice: {currentKc?.name}
        </CardTitle>
        {learnerProfile && currentKc && learnerProfile.kcMasteryMap[currentKc.id] && (
          <p className="text-xs text-center text-slate-400 mt-1">
            User: {learnerProfile.userId} | KC Mastery: {learnerProfile.kcMasteryMap[currentKc.id].masteryLevel.toFixed(2)}
          </p>
        )}
        <div className="flex justify-center mt-2">
          <Button
            onClick={onShowServiceTests}
            variant="outline"
            size="sm"
            className="text-xs text-slate-300 border-slate-500"
          >
            <Database className="h-3 w-3 mr-1" />
            Service Tests
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 md:p-6 min-h-[200px] md:min-h-[300px] relative">
        {isLoading && currentAtom && (
          <div className="absolute inset-0 bg-slate-800/70 flex flex-col items-center justify-center z-10 rounded-b-lg">
            <Loader2 className="h-12 w-12 animate-spin text-sky-400" />
            <p className="mt-3 text-sky-200">Loading next item...</p>
          </div>
        )}

        {!isLoading && currentAtom.atom_type === 'TEXT_EXPLANATION' && (
          <TextExplanationAtom atom={currentAtom} />
        )}
        
        {!isLoading && currentAtom.atom_type === 'QUESTION_MULTIPLE_CHOICE' && (
          <QuestionCard
            key={currentAtom.atom_id}
            atom={currentAtom}
            onSubmitAnswer={(answer, isCorrectAnswer) => onQuestionAnswer(currentAtom, answer, isCorrectAnswer)}
            disabled={showFeedback || isLoading}
          />
        )}

        {showFeedback && (
          <div className={`mt-4 p-3 rounded-md text-sm ${
            isCorrect 
              ? 'bg-green-700/30 border border-green-500 text-green-200' 
              : 'bg-red-700/30 border border-red-500 text-red-200'
          }`}>
            <p><strong>{isCorrect ? "Correct!" : "Review:"}</strong> {feedbackMessage}</p>
          </div>
        )}
      </CardContent>
      
      <div className="px-4 md:px-6 py-4 border-t border-slate-700 flex justify-end bg-slate-700/30 rounded-b-lg">
        <Button
          onClick={onNextAtom}
          disabled={isLoading || (currentAtom.atom_type === 'QUESTION_MULTIPLE_CHOICE' && !showFeedback)}
          className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:transform-none disabled:shadow-none"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Next'}
          {!isLoading && <ArrowRight className="h-5 w-5 ml-2" />}
        </Button>
      </div>
    </Card>
  );
};

export default PracticeContent;
