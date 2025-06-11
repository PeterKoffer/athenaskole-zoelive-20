
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
    },
    {
      question: "What is an antonym for the word 'generous'?",
      options: ['Kind', 'Selfish', 'Helpful', 'Caring'],
      correctAnswer: 1
    },
    {
      question: "Which type of poem has 14 lines?",
      options: ['Haiku', 'Limerick', 'Sonnet', 'Ballad'],
      correctAnswer: 2
    },
    {
      question: "What is the past tense of 'run'?",
      options: ['Runned', 'Ran', 'Running', 'Runs'],
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
    },
    {
      question: "If you have 24 students and want to make groups of 6, how many groups will you have?",
      options: ['3 groups', '4 groups', '5 groups', '6 groups'],
      correctAnswer: 1
    },
    {
      question: "What comes next in this pattern: 5, 10, 15, 20, ?",
      options: ['22', '24', '25', '30'],
      correctAnswer: 2
    },
    {
      question: "If you buy 3 packs of pencils with 8 pencils each, how many pencils do you have?",
      options: ['21 pencils', '24 pencils', '26 pencils', '28 pencils'],
      correctAnswer: 1
    },
    {
      question: "What is 144 ÷ 12?",
      options: ['11', '12', '13', '14'],
      correctAnswer: 1
    },
    {
      question: "If a circle has a radius of 5 cm, what is its diameter?",
      options: ['5 cm', '10 cm', '15 cm', '25 cm'],
      correctAnswer: 1
    },
    {
      question: "What is 7² (7 squared)?",
      options: ['14', '49', '21', '42'],
      correctAnswer: 1
    },
    {
      question: "What is the sum of the angles in a triangle?",
      options: ['90°', '180°', '270°', '360°'],
      correctAnswer: 1
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
    },
    {
      question: "What force pulls objects toward the Earth?",
      options: ['Magnetism', 'Gravity', 'Friction', 'Electricity'],
      correctAnswer: 1
    },
    {
      question: "Which state of matter has a definite shape and volume?",
      options: ['Gas', 'Liquid', 'Solid', 'Plasma'],
      correctAnswer: 2
    },
    {
      question: "How many bones are in an adult human body?",
      options: ['106', '206', '306', '406'],
      correctAnswer: 1
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
  const [sessionQuestionHashes, setSessionQuestionHashes] = useState<Set<string>>(new Set());

  // Create a unique hash for each question to prevent exact duplicates
  const createQuestionHash = useCallback((question: string, options: string[]) => {
    return `${question}-${options.join('|')}`;
  }, []);

  const generateDynamicActivity = useCallback(async (): Promise<LessonActivity | null> => {
    if (isGeneratingQuestion) return null;
    
    setIsGeneratingQuestion(true);
    
    try {
      // Get subject-specific questions
      const subjectKey = subject.toLowerCase() as keyof typeof questionTemplates;
      const availableQuestions = questionTemplates[subjectKey] || questionTemplates.mathematics;
      
      // Find questions that haven't been used in this session
      const availableIndices = availableQuestions
        .map((_, index) => index)
        .filter(index => {
          const question = availableQuestions[index];
          const questionHash = createQuestionHash(question.question, question.options);
          return !sessionQuestionHashes.has(questionHash);
        });
      
      // If all questions have been used in this session, reset and allow reuse
      // but prefer unused questions from the current batch
      let selectedIndex: number;
      let selectedQuestion: any;
      
      if (availableIndices.length === 0) {
        console.log('🔄 All questions used in session, allowing reuse...');
        // Use questions that haven't been used recently in the current batch
        const recentlyUnusedIndices = availableQuestions
          .map((_, index) => index)
          .filter(index => !usedQuestionIndices.has(index));
        
        if (recentlyUnusedIndices.length > 0) {
          selectedIndex = recentlyUnusedIndices[Math.floor(Math.random() * recentlyUnusedIndices.length)];
        } else {
          // Reset used indices and pick randomly
          setUsedQuestionIndices(new Set());
          selectedIndex = Math.floor(Math.random() * availableQuestions.length);
        }
      } else {
        selectedIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      }
      
      selectedQuestion = availableQuestions[selectedIndex];
      
      // Mark this question as used
      const questionHash = createQuestionHash(selectedQuestion.question, selectedQuestion.options);
      setSessionQuestionHashes(prev => new Set([...prev, questionHash]));
      setUsedQuestionIndices(prev => new Set([...prev, selectedIndex]));
      
      const newActivity: LessonActivity = {
        id: `dynamic-${subject}-${Date.now()}-${selectedIndex}-${Math.random().toString(36).substr(2, 9)}`,
        title: `${subject} Practice Question ${questionsGenerated + 1}`,
        type: 'interactive-game',
        phase: 'interactive-game',
        duration: 180, // 3 minutes for questions
        phaseDescription: `Practice question for ${subject}`,
        content: {
          question: selectedQuestion.question,
          options: selectedQuestion.options,
          correctAnswer: selectedQuestion.correctAnswer,
          explanation: `This question tests your understanding of ${subject} concepts. Great job working through it!`
        }
      };
      
      setQuestionsGenerated(prev => prev + 1);
      console.log(`🎯 Generated unique ${subject} question (${availableIndices.length} unused remaining):`, selectedQuestion.question.substring(0, 50) + '...');
      
      return newActivity;
    } catch (error) {
      console.error('❌ Error generating dynamic activity:', error);
      return null;
    } finally {
      setIsGeneratingQuestion(false);
    }
  }, [subject, skillArea, isGeneratingQuestion, questionsGenerated, usedQuestionIndices, sessionQuestionHashes, createQuestionHash]);

  return {
    dynamicActivities,
    setDynamicActivities,
    questionsGenerated,
    isGeneratingQuestion,
    generateDynamicActivity
  };
};
