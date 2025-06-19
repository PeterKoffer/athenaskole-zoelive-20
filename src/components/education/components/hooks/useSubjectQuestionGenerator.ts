
import { useState, useCallback } from 'react';
import { LessonActivity } from '../types/LessonTypes';

interface SubjectQuestionConfig {
  subject: string;
  skillArea: string;
  difficulty: number;
  usedQuestionIds: Set<string>;
}

export const useSubjectQuestionGenerator = (config: SubjectQuestionConfig) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestion = useCallback(async (): Promise<LessonActivity | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      // Generate a unique question based on subject and skill area
      const questionId = `${config.subject}_${config.skillArea}_${Date.now()}`;
      
      // Check if this question has been used before
      if (config.usedQuestionIds.has(questionId)) {
        console.log('Question already used, generating new one...');
        return generateQuestion();
      }

      const questionTemplates = {
        mathematics: {
          fractions: [
            {
              type: "interactive-question" as const,
              content: {
                question: "What is 1/2 + 1/4?",
                options: ["3/4", "2/6", "1/3", "3/6"],
                correct: 0,
                explanation: "To add fractions, find a common denominator. 1/2 = 2/4, so 2/4 + 1/4 = 3/4"
              },
              duration: 5,
              learningObjectives: ["Adding fractions with different denominators"]
            },
            {
              type: "interactive-question" as const,
              content: {
                question: "Which fraction is equivalent to 2/4?",
                options: ["1/2", "3/6", "4/8", "All of the above"],
                correct: 3,
                explanation: "All these fractions simplify to 1/2 when reduced to lowest terms"
              },
              duration: 4,
              learningObjectives: ["Understanding equivalent fractions"]
            }
          ],
          algebra: [
            {
              type: "interactive-question" as const,
              content: {
                question: "Solve for x: 2x + 5 = 15",
                options: ["x = 5", "x = 10", "x = 7.5", "x = 20"],
                correct: 0,
                explanation: "Subtract 5 from both sides: 2x = 10. Then divide by 2: x = 5"
              },
              duration: 6,
              learningObjectives: ["Solving linear equations"]
            }
          ]
        },
        english: {
          grammar: [
            {
              type: "interactive-question" as const,
              content: {
                question: "Which sentence uses correct grammar?",
                options: [
                  "She don't like apples",
                  "She doesn't like apples", 
                  "She do not like apples",
                  "She don't likes apples"
                ],
                correct: 1,
                explanation: "Use 'doesn't' (does not) with third person singular subjects like 'she'"
              },
              duration: 4,
              learningObjectives: ["Subject-verb agreement"]
            }
          ],
          spelling: [
            {
              type: "interactive-question" as const,
              content: {
                question: "Which word is spelled correctly?",
                options: ["recieve", "receive", "receeve", "receve"],
                correct: 1,
                explanation: "Remember: 'i' before 'e' except after 'c' - but 'receive' is an exception!"
              },
              duration: 3,
              learningObjectives: ["Common spelling patterns"]
            }
          ]
        },
        science: {
          biology: [
            {
              type: "interactive-question" as const,
              content: {
                question: "What process do plants use to make food?",
                options: ["Respiration", "Photosynthesis", "Digestion", "Metabolism"],
                correct: 1,
                explanation: "Photosynthesis uses sunlight, water, and carbon dioxide to create glucose"
              },
              duration: 5,
              learningObjectives: ["Understanding photosynthesis"]
            }
          ]
        }
      };

      const subjectQuestions = questionTemplates[config.subject as keyof typeof questionTemplates];
      const skillQuestions = subjectQuestions?.[config.skillArea as keyof typeof subjectQuestions];

      if (!skillQuestions || skillQuestions.length === 0) {
        throw new Error(`No questions available for ${config.subject} - ${config.skillArea}`);
      }

      // Select a random question from available templates
      const randomIndex = Math.floor(Math.random() * skillQuestions.length);
      const selectedQuestion = skillQuestions[randomIndex];

      // Add the question ID to used questions
      config.usedQuestionIds.add(questionId);

      return {
        ...selectedQuestion,
        id: questionId
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate question';
      setError(errorMessage);
      console.error('Error generating question:', err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [config]);

  return {
    generateQuestion,
    isGenerating,
    error
  };
};
