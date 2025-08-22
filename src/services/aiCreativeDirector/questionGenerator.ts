import { GeneratedQuestion, EducationalContext } from './types';
import { invokeFn } from '@/supabase/functionsClient';

export class QuestionGenerator {
  
  private usedQuestions = new Set<string>();

  async generatePersonalizedQuestions(
    educationalContext: EducationalContext,
    userId: string,
    count: number = 3
  ): Promise<GeneratedQuestion[]> {
    try {
      console.log(`🎓 Generating ${count} PERSONALIZED K-12 questions for Grade ${educationalContext.gradeLevel} ${educationalContext.subject}/${educationalContext.skillArea}`);
      
      const questions: GeneratedQuestion[] = [];
      
      for (let i = 0; i < count; i++) {
        try {
          console.log(`📡 Calling enhanced K-12 question API for ${educationalContext.subject} question ${i + 1}...`);
          
          const questionData: any = await invokeFn('generate-question', {
            subject: educationalContext.subject,
            skillArea: educationalContext.skillArea,
            difficultyLevel: educationalContext.difficultyLevel,
            gradeLevel: educationalContext.gradeLevel,
            userId,
            questionIndex: i,
            promptVariation: this.getPromptVariation(educationalContext.subject, i),
            specificContext: `personalized K-12 learning for ${educationalContext.subject}`,
            teacherRequirements: educationalContext.teacherRequirements,
            schoolStandards: educationalContext.schoolStandards,
            studentAdaptation: educationalContext.studentAdaptation
          });

          if (questionData && !questionData.error && questionData.question) {
            if (this.validateQuestion(questionData) && !this.isDuplicateQuestion(questionData.question)) {
              this.usedQuestions.add(questionData.question);
              questions.push({
                question: questionData.question,
                options: questionData.options,
                correct: questionData.correct,
                explanation: questionData.explanation || "Great job!",
                isAiGenerated: true,
                isPersonalized: true,
                source: `openai-k12-${educationalContext.subject}`,
                educationalNotes: questionData.educationalNotes
              });
            } else {
              questions.push(this.createSubjectFallbackQuestion(educationalContext, i));
            }
          } else {
            questions.push(this.createSubjectFallbackQuestion(educationalContext, i));
          }
        } catch (questionError) {
          console.error(`❌ Failed to generate personalized ${educationalContext.subject} question ${i + 1}:`, questionError);
          questions.push(this.createSubjectFallbackQuestion(educationalContext, i));
        }
      }

      return questions;
    } catch (error) {
      console.error(`❌ Error in generatePersonalizedQuestions for ${educationalContext.subject}:`, error);
      return [this.createSubjectFallbackQuestion(educationalContext, 0)];
    }
  }

  private getPromptVariation(subject: string, index: number): string {
    const variations = {
      mathematics: ['basic', 'word_problem', 'real_world'],
      english: ['comprehension', 'grammar', 'vocabulary'],
      science: ['observation', 'experiment', 'concept'],
      computer_science: ['logic', 'problem_solving', 'coding'],
      music: ['theory', 'rhythm', 'listening'],
      creative_arts: ['visual', 'technique', 'creative'],
      mental_wellness: ['awareness', 'coping', 'social'],
      language_lab: ['vocabulary', 'grammar', 'conversation'],
      history_religion: ['timeline', 'cause_effect', 'cultural'],
      geography: ['location', 'climate', 'human_environment'],
      body_lab: ['nutrition', 'fitness', 'wellness'],
      life_essentials: ['practical', 'planning', 'decision_making']
    };

    const subjectVariations = variations[subject as keyof typeof variations] || ['basic', 'application', 'mixed'];
    return subjectVariations[index % subjectVariations.length];
  }

  private validateQuestion(questionData: any): boolean {
    return questionData && 
           questionData.question && 
           Array.isArray(questionData.options) && 
           questionData.options.length === 4 &&
           typeof questionData.correct === 'number' &&
           questionData.correct >= 0 && 
           questionData.correct <= 3;
  }

  private isDuplicateQuestion(question: string): boolean {
    const questionKey = question.toLowerCase().replace(/[^a-z0-9]/g, '');
    return this.usedQuestions.has(questionKey);
  }

  private createSubjectFallbackQuestion(educationalContext: EducationalContext, index: number): GeneratedQuestion {
    const { subject, skillArea, gradeLevel } = educationalContext;

    // Subject-specific fallback questions
    switch (subject) {
      case 'mathematics':
        return this.createMathFallback(skillArea, index);
      
      case 'english':
        return this.createEnglishFallback(skillArea, gradeLevel, index);
      
      case 'science':
        return this.createScienceFallback(skillArea, gradeLevel, index);
      
      case 'computer_science':
        return this.createComputerScienceFallback(skillArea, gradeLevel, index);
      
      case 'music':
        return this.createMusicFallback(skillArea, gradeLevel, index);
      
      case 'creative_arts':
        return this.createCreativeArtsFallback(skillArea, gradeLevel, index);
      
      default:
        return this.createGeneralFallback(subject, skillArea, gradeLevel, index);
    }
  }

  private createMathFallback(skillArea: string, index: number): GeneratedQuestion {
    if (skillArea.includes('fraction') && skillArea.includes('like denominators')) {
      return this.createFractionFallback(index);
    }
    
    if (skillArea.includes('decimal multiplication')) {
      return this.createDecimalFallback(index);
    }

    // General math fallback
    const problems = [
      { question: "What is 15 + 27?", options: ["42", "41", "43", "40"], correct: 0 },
      { question: "What is 8 × 6?", options: ["48", "46", "50", "44"], correct: 0 },
      { question: "What is 63 ÷ 9?", options: ["7", "8", "6", "9"], correct: 0 }
    ];
    
    const problem = problems[index % problems.length];
    return {
      ...problem,
      explanation: `This helps you practice basic ${skillArea} skills.`,
      isAiGenerated: false,
      isPersonalized: false,
      source: 'math-fallback'
    };
  }

  private createEnglishFallback(_skillArea: string, _gradeLevel: number, index: number): GeneratedQuestion {
    const questions = [
      {
        question: "Which word is a noun?", 
        options: ["quickly", "happy", "teacher", "running"], 
        correct: 2,
        explanation: "A noun is a person, place, or thing. 'Teacher' is a person, so it's a noun."
      },
      {
        question: "What is the past tense of 'run'?", 
        options: ["runned", "ran", "running", "runs"], 
        correct: 1,
        explanation: "The past tense of 'run' is 'ran'."
      },
      {
        question: "Which sentence uses correct punctuation?", 
        options: ["Hello there", "Hello, there!", "Hello there.", "hello there"], 
        correct: 2,
        explanation: "Sentences should end with proper punctuation and start with a capital letter."
      }
    ];
    
    const question = questions[index % questions.length];
    return {
      ...question,
      isAiGenerated: false,
      isPersonalized: false,
      source: 'english-fallback'
    };
  }

  private createScienceFallback(_skillArea: string, _gradeLevel: number, index: number): GeneratedQuestion {
    const questions = [
      {
        question: "What do plants need to grow?", 
        options: ["Only water", "Only sunlight", "Water, sunlight, and air", "Only soil"], 
        correct: 2,
        explanation: "Plants need water, sunlight, and air (carbon dioxide) to grow through photosynthesis."
      },
      {
        question: "Which is the largest planet in our solar system?", 
        options: ["Earth", "Jupiter", "Saturn", "Mars"], 
        correct: 1,
        explanation: "Jupiter is the largest planet in our solar system."
      },
      {
        question: "What happens to water when it freezes?", 
        options: ["It becomes gas", "It becomes solid ice", "It disappears", "It becomes warmer"], 
        correct: 1,
        explanation: "When water freezes, it becomes solid ice at 0°C (32°F)."
      }
    ];
    
    const question = questions[index % questions.length];
    return {
      ...question,
      isAiGenerated: false,
      isPersonalized: false,
      source: 'science-fallback'
    };
  }

  private createComputerScienceFallback(_skillArea: string, _gradeLevel: number, index: number): GeneratedQuestion {
    const questions = [
      {
        question: "What is an algorithm?", 
        options: ["A type of computer", "A step-by-step solution to a problem", "A programming language", "A computer game"], 
        correct: 1,
        explanation: "An algorithm is a step-by-step set of instructions to solve a problem or complete a task."
      },
      {
        question: "What does 'debugging' mean in programming?", 
        options: ["Writing new code", "Finding and fixing errors", "Deleting a program", "Running a program"], 
        correct: 1,
        explanation: "Debugging means finding and fixing errors or 'bugs' in your code."
      },
      {
        question: "Which is a programming concept?", 
        options: ["Loop", "Chair", "Book", "Tree"], 
        correct: 0,
        explanation: "A loop is a programming concept that repeats a set of instructions."
      }
    ];
    
    const question = questions[index % questions.length];
    return {
      ...question,
      isAiGenerated: false,
      isPersonalized: false,
      source: 'cs-fallback'
    };
  }

  private createMusicFallback(_skillArea: string, _gradeLevel: number, index: number): GeneratedQuestion {
    const questions = [
      {
        question: "How many beats are in a whole note?", 
        options: ["1", "2", "3", "4"], 
        correct: 3,
        explanation: "A whole note gets 4 beats in 4/4 time signature."
      },
      {
        question: "What are the first three notes of the C major scale?", 
        options: ["C, D, E", "A, B, C", "F, G, A", "G, A, B"], 
        correct: 0,
        explanation: "The C major scale starts with C, D, E..."
      },
      {
        question: "What does 'forte' mean in music?", 
        options: ["Soft", "Loud", "Fast", "Slow"], 
        correct: 1,
        explanation: "'Forte' means to play loudly."
      }
    ];
    
    const question = questions[index % questions.length];
    return {
      ...question,
      isAiGenerated: false,
      isPersonalized: false,
      source: 'music-fallback'
    };
  }

  private createCreativeArtsFallback(_skillArea: string, _gradeLevel: number, index: number): GeneratedQuestion {
    const questions = [
      {
        question: "What are the primary colors?", 
        options: ["Red, Blue, Yellow", "Red, Green, Blue", "Blue, Yellow, Orange", "Red, Purple, Green"], 
        correct: 0,
        explanation: "The primary colors are red, blue, and yellow. They cannot be made by mixing other colors."
      },
      {
        question: "What happens when you mix red and yellow?", 
        options: ["Purple", "Orange", "Green", "Brown"], 
        correct: 1,
        explanation: "Red and yellow mix to create orange."
      },
      {
        question: "What is a self-portrait?", 
        options: ["A picture of someone else", "A picture of yourself", "A picture of a place", "A picture of an animal"], 
        correct: 1,
        explanation: "A self-portrait is an artwork where the artist draws or paints themselves."
      }
    ];
    
    const question = questions[index % questions.length];
    return {
      ...question,
      isAiGenerated: false,
      isPersonalized: false,
      source: 'arts-fallback'
    };
  }

  private createGeneralFallback(subject: string, skillArea: string, gradeLevel: number, index: number): GeneratedQuestion {
    const timestamp = Date.now().toString().slice(-4);
    return {
      question: `What is an important concept in Grade ${gradeLevel} ${subject}? (Question ${index + 1}-${timestamp})`,
      options: [`Concept A-${timestamp}`, `Concept B-${timestamp}`, `Concept C-${timestamp}`, `Concept D-${timestamp}`],
      correct: 0,
      explanation: `This helps you practice ${skillArea} skills in ${subject}.`,
      isAiGenerated: false,
      isPersonalized: false,
      source: 'general-fallback'
    };
  }

  private createFractionFallback(index: number): GeneratedQuestion {
    const denominators = [6, 8, 10, 12];
    const denominator = denominators[index % denominators.length];
    const numerator1 = 1 + index;
    const numerator2 = 1 + (index % 2);
    const correctSum = numerator1 + numerator2;
    
    if (correctSum >= denominator) {
      return this.createFractionFallback((index + 1) % 4);
    }
    
    const correctAnswer = `${correctSum}/${denominator}`;
    const wrongOptions = [
      `${correctSum + 1}/${denominator}`,
      `${correctSum}/${denominator + denominator}`,
      `${correctSum - 1}/${denominator}`
    ];
    
    return {
      question: `What is ${numerator1}/${denominator} + ${numerator2}/${denominator}?`,
      options: [correctAnswer, ...wrongOptions],
      correct: 0,
      explanation: `When adding fractions with the same denominator, add the numerators: ${numerator1} + ${numerator2} = ${correctSum}. The answer is ${correctAnswer}.`,
      isAiGenerated: false,
      isPersonalized: false,
      source: 'fraction-fallback'
    };
  }

  private createDecimalFallback(index: number): GeneratedQuestion {
    const factor1 = (1.2 + index * 0.3).toFixed(1);
    const factor2 = (2.1 + index * 0.2).toFixed(1);
    const product = (parseFloat(factor1) * parseFloat(factor2)).toFixed(2);
    
    return {
      question: `What is ${factor1} × ${factor2}?`,
      options: [
        product,
        (parseFloat(product) + 1).toFixed(2),
        (parseFloat(product) - 0.5).toFixed(2),
        (parseFloat(factor1) + parseFloat(factor2)).toFixed(2)
      ],
      correct: 0,
      explanation: `To multiply decimals: ${factor1} × ${factor2} = ${product}.`,
      isAiGenerated: false,
      isPersonalized: false,
      source: 'decimal-fallback'
    };
  }
}
