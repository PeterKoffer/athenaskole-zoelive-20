
import { useState, useCallback } from 'react';
import { useTemplateQuestionGeneration } from './useTemplateQuestionGeneration';

interface UseSimpleQuestionGenerationProps {
  subject: string;
  skillArea: string;
}

interface UniqueQuestion {
  id: string;
  content: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  metadata: {
    subject: string;
    skillArea: string;
    timestamp: number;
    sessionId: string;
    templateId?: string;
  };
}

export const useSimpleQuestionGeneration = ({
  subject,
  skillArea
}: UseSimpleQuestionGenerationProps) => {
  const [questionCount, setQuestionCount] = useState(0);
  const [sessionId] = useState(`class_${Date.now()}_${Math.random().toString(36).substring(7)}`);
  
  const {
    generateTemplateQuestion,
    clearTemplateSession,
    isGenerating,
    questionsGenerated
  } = useTemplateQuestionGeneration({
    subject,
    skillArea,
    sessionId,
    difficultyLevel: 1
  });

  const generateUniqueQuestion = useCallback((): UniqueQuestion => {
    console.log(`🎓 Generating UNIQUE question for class session: ${sessionId}`);
    
    const templateQuestion = generateTemplateQuestion();
    
    const uniqueQuestion: UniqueQuestion = {
      id: templateQuestion.id,
      content: {
        question: templateQuestion.question,
        options: templateQuestion.options,
        correctAnswer: templateQuestion.correctAnswer,
        explanation: templateQuestion.explanation
      },
      metadata: {
        subject,
        skillArea,
        timestamp: templateQuestion.timestamp,
        sessionId: templateQuestion.sessionId,
        templateId: templateQuestion.templateId
      }
    };
    
    setQuestionCount(prev => prev + 1);
    
    console.log(`✅ Class question ${questionCount + 1} ready:`, {
      id: uniqueQuestion.id,
      templateId: uniqueQuestion.metadata.templateId,
      session: sessionId
    });
    
    return uniqueQuestion;
  }, [generateTemplateQuestion, subject, skillArea, sessionId, questionCount]);

  const clearGeneratedQuestions = useCallback(() => {
    clearTemplateSession();
    setQuestionCount(0);
    console.log(`🧹 Reset questions for class session: ${sessionId}`);
  }, [clearTemplateSession, sessionId]);

  return {
    generateUniqueQuestion,
    clearGeneratedQuestions,
    questionCount: questionsGenerated,
    isGenerating,
    sessionId
  };
};
