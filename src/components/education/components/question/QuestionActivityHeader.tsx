
import { Clock } from 'lucide-react';
import TextWithSpeaker from '../shared/TextWithSpeaker';
import QuestionHeader from './QuestionHeader';

interface QuestionActivityHeaderProps {
  questionNumber: number;
  totalQuestions: number;
  timeSpent: number;
  question: string;
}

const QuestionActivityHeader = ({
  questionNumber,
  totalQuestions,
  timeSpent,
  question
}: QuestionActivityHeaderProps) => {
  return (
    <TextWithSpeaker
      text={question}
      context="question-content"
      position="corner"
      showOnHover={false}
    >
      <QuestionHeader
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        timeSpent={timeSpent}
        question={question}
      />
    </TextWithSpeaker>
  );
};

export default QuestionActivityHeader;
