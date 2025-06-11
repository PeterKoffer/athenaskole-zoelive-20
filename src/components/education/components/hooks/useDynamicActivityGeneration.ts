
import { useState, useCallback } from 'react';
import { LessonActivity } from '../types/LessonTypes';

interface UseDynamicActivityGenerationProps {
  subject: string;
  skillArea: string;
  timeElapsed: number;
}

const questionTemplates = {
  english: [
    {
      question: "Which literary device is used in the sentence: 'The wind whispered through the trees'?",
      options: ['Metaphor', 'Personification', 'Simile', 'Alliteration'],
      correctAnswer: 1
    },
    {
      question: "What is the main purpose of a thesis statement in an essay?",
      options: ['To conclude the essay', 'To present the main argument', 'To provide examples', 'To ask questions'],
      correctAnswer: 1
    },
    {
      question: "Which sentence structure uses a dependent clause?",
      options: ['Simple sentence', 'Compound sentence', 'Complex sentence', 'Fragment'],
      correctAnswer: 2
    },
    {
      question: "What type of writing technique involves showing rather than telling?",
      options: ['Exposition', 'Description', 'Narration', 'Persuasion'],
      correctAnswer: 1
    },
    {
      question: "Which punctuation mark is used to join two independent clauses?",
      options: ['Comma', 'Semicolon', 'Colon', 'Apostrophe'],
      correctAnswer: 1
    }
  ],
  mathematics: [
    {
      question: "What is the result of 15 × 8?",
      options: ['110', '120', '125', '130'],
      correctAnswer: 1
    },
    {
      question: "If a triangle has angles of 60°, 60°, and 60°, what type of triangle is it?",
      options: ['Right triangle', 'Equilateral triangle', 'Isosceles triangle', 'Scalene triangle'],
      correctAnswer: 1
    },
    {
      question: "What is the value of x in the equation: 3x + 7 = 22?",
      options: ['3', '4', '5', '6'],
      correctAnswer: 2
    },
    {
      question: "Which of these is a prime number?",
      options: ['21', '27', '29', '33'],
      correctAnswer: 2
    },
    {
      question: "What is the area of a rectangle with length 8 cm and width 5 cm?",
      options: ['26 cm²', '32 cm²', '40 cm²', '45 cm²'],
      correctAnswer: 2
    }
  ],
  science: [
    {
      question: "Which planet is closest to the Sun?",
      options: ['Venus', 'Mercury', 'Earth', 'Mars'],
      correctAnswer: 1
    },
    {
      question: "What is the chemical formula for water?",
      options: ['CO2', 'H2O', 'NaCl', 'O2'],
      correctAnswer: 1
    },
    {
      question: "Which type of energy is stored in food?",
      options: ['Kinetic energy', 'Chemical energy', 'Sound energy', 'Light energy'],
      correctAnswer: 1
    },
    {
      question: "What gas do plants absorb from the atmosphere during photosynthesis?",
      options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
      correctAnswer: 2
    },
    {
      question: "Which organ in the human body pumps blood?",
      options: ['Lungs', 'Liver', 'Heart', 'Kidneys'],
      correctAnswer: 2
    }
  ]
};

export const useDynamicActivityGeneration = ({
  subject,
  skillArea,
  timeElapsed
}: UseDynamicActivityGenerationProps) => {
  const [dynamicActivities, setDynamicActivities] = useState<LessonActivity[]>([]);
  const [questionsGenerated, setQuestionsGenerated] = useState(0);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [usedQuestionIndices, setUsedQuestionIndices] = useState<Set<number>>(new Set());

  const generateDynamicActivity = useCallback(async (): Promise<LessonActivity | null> => {
    if (isGeneratingQuestion) return null;
    
    setIsGeneratingQuestion(true);
    
    try {
      // Get subject-specific questions
      const subjectKey = subject.toLowerCase() as keyof typeof questionTemplates;
      const availableQuestions = questionTemplates[subjectKey] || questionTemplates.english;
      
      // Find unused questions
      const unusedIndices = availableQuestions
        .map((_, index) => index)
        .filter(index => !usedQuestionIndices.has(index));
      
      // If all questions used, reset the set
      if (unusedIndices.length === 0) {
        setUsedQuestionIndices(new Set());
        unusedIndices.push(...availableQuestions.map((_, index) => index));
      }
      
      // Select random unused question
      const randomIndex = unusedIndices[Math.floor(Math.random() * unusedIndices.length)];
      const selectedQuestion = availableQuestions[randomIndex];
      
      // Mark as used
      setUsedQuestionIndices(prev => new Set([...prev, randomIndex]));
      
      const newActivity: LessonActivity = {
        id: `dynamic-${subject}-${Date.now()}-${randomIndex}`,
        title: `${subject} Practice Question ${questionsGenerated + 1}`,
        type: 'interactive-game',
        phase: 'interactive-game',
        duration: 300, // 5 minutes
        phaseDescription: `Practice question for ${subject}`,
        content: {
          question: selectedQuestion.question,
          options: selectedQuestion.options,
          correctAnswer: selectedQuestion.correctAnswer,
          explanation: `This question tests your understanding of ${subject} concepts.`
        }
      };
      
      setQuestionsGenerated(prev => prev + 1);
      console.log(`🎯 Generated new ${subject} question:`, selectedQuestion.question);
      
      return newActivity;
    } catch (error) {
      console.error('❌ Error generating dynamic activity:', error);
      return null;
    } finally {
      setIsGeneratingQuestion(false);
    }
  }, [subject, skillArea, isGeneratingQuestion, questionsGenerated, usedQuestionIndices]);

  return {
    dynamicActivities,
    setDynamicActivities,
    questionsGenerated,
    isGeneratingQuestion,
    generateDynamicActivity
  };
};
