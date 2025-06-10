
export interface BaseLessonControlsProps {
  disabled?: boolean;
  className?: string;
}

export interface QuestionLessonControlsProps extends BaseLessonControlsProps {
  showResult: boolean;
  selectedAnswer: number | null;
  isLastQuestion: boolean;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
}

export interface SessionLessonControlsProps extends BaseLessonControlsProps {
  isSessionActive: boolean;
  onToggleSession: () => void;
  onNextQuestion?: () => void;
  canSkip: boolean;
  showSkip?: boolean;
}

export type LessonControlsProps = QuestionLessonControlsProps | SessionLessonControlsProps;

export function isQuestionControls(props: LessonControlsProps): props is QuestionLessonControlsProps {
  return 'showResult' in props;
}

export function isSessionControls(props: LessonControlsProps): props is SessionLessonControlsProps {
  return 'isSessionActive' in props;
}
