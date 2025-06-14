import { useEffect, useRef } from 'react';
import QuestionDisplayHeader from './QuestionDisplayHeader';
import QuestionOptions from './QuestionOptions';
import QuestionExplanation from './QuestionExplanation';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface QuestionDisplayProps {
  question: string;
  options: string[];
  selectedAnswer: number | null;
  correctAnswer: number;
  showResult: boolean;
  explanation?: string;
  standardInfo?: {
    code: string;
    title: string;
  };
  questionNumber: number;
  totalQuestions: number;
  onAnswerSelect: (index: number) => void;
  hasAnswered?: boolean;
  autoSubmit?: boolean;
  subject?: string;
}

const QuestionDisplay = ({
  question,
  options,
  selectedAnswer,
  correctAnswer,
  showResult,
  explanation,
  questionNumber,
  totalQuestions,
  onAnswerSelect,
  hasAnswered = false,
  autoSubmit = false,
  subject = ''
}: QuestionDisplayProps) => {
  const {
    isSpeaking,
    autoReadEnabled,
    speakText,
    handleMuteToggle
  } = useSpeechSynthesis();
  const hasAutoRead = useRef(false);

  // Clean up question text and provide fallback for technical IDs
  const cleanQuestionText = (text: string) => {
    // Remove session IDs in parentheses - pattern like (Session: 1749071447550)
    let cleanedText = text.replace(/\(Session:\s*\d+\)/gi, '');
    
    // Remove any pattern that looks like a session ID in parentheses
    cleanedText = cleanedText.replace(/\(\d{13,}\)/gi, '');
    
    // If the question looks like a technical ID, provide a proper fallback
    if (text.includes('Practice question') && text.match(/\d{13,}-\d+/)) {
      if (subject === 'music') {
        return 'Which of the following is a major scale?';
      } else if (subject === 'mathematics') {
        return 'What is the correct answer to this math problem?';
      } else if (subject === 'science') {
        return 'Which scientific concept is correct?';
      } else if (subject === 'english') {
        return 'Which reading comprehension answer is correct?';
      }
      return 'What is the correct answer to this practice question?';
    }
    
    return cleanedText
      .replace(/\(ID:\s*[^)]+\)/gi, '') // Remove (ID: ...) patterns
      .replace(/\(Question\s*\d+[^)]*\)/gi, '') // Remove (Question X) patterns
      .replace(/\s+/g, ' ') // Clean up extra spaces
      .trim();
  };

  const readQuestionAndOptions = () => {
    const cleanQuestion = cleanQuestionText(question);
    const optionsText = options.map((option, index) => 
      `Option ${String.fromCharCode(65 + index)}: ${option}`
    ).join('. ');
    
    const fullText = `Nelie asks: ${cleanQuestion}. The options are: ${optionsText}`;
    speakText(fullText);
  };

  const readExplanation = () => {
    if (explanation) {
      const resultText = selectedAnswer === correctAnswer ? 
        "Excellent work! That's the correct answer." : 
        `Not quite right this time. The correct answer is ${String.fromCharCode(65 + correctAnswer)}: ${options[correctAnswer]}.`;
      
      const fullText = `${resultText} Nelie explains: ${explanation}`;
      speakText(fullText);
    }
  };

  // Auto-read question when it first appears
  useEffect(() => {
    if (autoReadEnabled && !hasAutoRead.current && !showResult) {
      hasAutoRead.current = true;
      setTimeout(() => {
        readQuestionAndOptions();
      }, 1500); // Longer delay for better UX
    }
  }, [question, autoReadEnabled]);

  // Auto-read explanation when result is shown
  useEffect(() => {
    if (autoReadEnabled && showResult && explanation) {
      setTimeout(() => {
        readExplanation();
      }, 2000); // Delay to let the result UI appear
    }
  }, [showResult, explanation, autoReadEnabled]);

  // Reset auto-read flag when question changes
  useEffect(() => {
    hasAutoRead.current = false;
  }, [question]);

  return (
    <div className="space-y-6">
      <QuestionDisplayHeader
        question={question}
        autoReadEnabled={autoReadEnabled}
        isSpeaking={isSpeaking}
        onMuteToggle={handleMuteToggle}
        onReadQuestion={readQuestionAndOptions}
      />

      <QuestionOptions
        options={options}
        selectedAnswer={selectedAnswer}
        correctAnswer={correctAnswer}
        showResult={showResult}
        onAnswerSelect={onAnswerSelect}
      />

      {showResult && (
        <QuestionExplanation
          explanation={explanation}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          autoReadEnabled={autoReadEnabled}
          isSpeaking={isSpeaking}
          onReadExplanation={readExplanation}
        />
      )}
    </div>
  );
};

export default QuestionDisplay;
