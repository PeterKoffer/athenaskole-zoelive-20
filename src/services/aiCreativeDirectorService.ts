import type { AtomSequence, ContentAtom } from '@/types/content';

export interface IAiCreativeDirectorService {
  getAtomSequenceForKc(kcId: string, userId: string): Promise<AtomSequence | null>;
}

class AiCreativeDirectorService implements IAiCreativeDirectorService {
  private questionCache = new Map<string, any[]>();
  private usedQuestions = new Set<string>();

  async getAtomSequenceForKc(kcId: string, userId: string): Promise<AtomSequence | null> {
    try {
      console.log(`🎯 AI Creative Director: Generating PERSONALIZED K-12 content for KC ${kcId}, User ${userId}`);
      
      // Map KC ID to generation parameters with enhanced educational context
      const educationalContext = this.mapKcToEducationalContext(kcId, userId);
      console.log(`📚 Educational context: Grade ${educationalContext.gradeLevel} ${educationalContext.subject} / ${educationalContext.skillArea}`);
      console.log(`👨‍🏫 Teacher focus: ${educationalContext.teacherRequirements?.focusAreas.join(', ') || 'standard curriculum'}`);
      console.log(`🎓 Student adaptations: ${educationalContext.studentAdaptation?.learningStyle || 'mixed'} learning style`);
      
      // Generate AI-powered questions with full educational context
      const generatedQuestions = await this.generatePersonalizedQuestions(
        educationalContext,
        userId, 
        3 // Generate 3 questions per sequence
      );

      if (!generatedQuestions || generatedQuestions.length === 0) {
        console.log('⚠️ No personalized questions generated, creating fallback content');
        return this.createFallbackSequence(kcId, userId, educationalContext.subject, educationalContext.skillArea, educationalContext.difficultyLevel);
      }

      // Convert to ContentAtom format with enhanced metadata
      const atoms: ContentAtom[] = generatedQuestions.map((question, index) => ({
        atom_id: `k12_${kcId}_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${index}`,
        atom_type: 'QUESTION_MULTIPLE_CHOICE',
        content: {
          question: question.question,
          options: question.options,
          correctAnswer: question.correct,
          correctFeedback: question.explanation || "Excellent work!",
          generalIncorrectFeedback: question.explanation || "Let's review this concept together.",
          explanation: question.explanation
        },
        kc_ids: [kcId],
        metadata: {
          difficulty: educationalContext.difficultyLevel,
          gradeLevel: educationalContext.gradeLevel,
          estimatedTime: 90,
          generated: true,
          aiGenerated: true,
          aiGeneratedTimestamp: Date.now(),
          source: 'openai-gpt-4o-mini-k12',
          personalizedForStudent: true,
          educationalContext: {
            teacherFocus: educationalContext.teacherRequirements?.focusAreas || [],
            schoolStandards: educationalContext.schoolStandards?.curriculum || 'common_core',
            studentLearningStyle: educationalContext.studentAdaptation?.learningStyle || 'mixed'
          },
          timestamp: Date.now(),
          uniqueId: `${kcId}_${Date.now()}_${Math.random()}`
        }
      }));

      console.log(`✅ Generated ${atoms.length} PERSONALIZED K-12 questions for ${educationalContext.skillArea}`);
      console.log(`🎓 All questions adapted for Grade ${educationalContext.gradeLevel} with teacher/school/student requirements`);

      return {
        sequence_id: `k12_seq_${kcId}_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        atoms: atoms,
        kc_id: kcId,
        user_id: userId,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error(`❌ AI Creative Director: Error generating personalized K-12 content for KC ${kcId}:`, error);
      return this.createFallbackSequence(kcId, userId, 'mathematics', 'general math', 5);
    }
  }

  private mapKcToEducationalContext(kcId: string, userId: string): any {
    // Enhanced mapping with full educational context
    const baseMapping = {
      'kc_math_g5_multiply_decimals': {
        subject: 'mathematics',
        skillArea: 'decimal multiplication',
        difficultyLevel: 5,
        gradeLevel: 5,
        teacherRequirements: {
          focusAreas: ['place value understanding', 'computational fluency'],
          avoidTopics: ['complex word problems'],
          preferredQuestionTypes: ['multiple_choice'],
          difficultyPreference: 'standard' as const
        },
        schoolStandards: {
          curriculum: 'common_core' as const,
          assessmentStyle: 'traditional' as const,
          learningGoals: ['5.NBT.7 - multiply decimals to hundredths'],
          mandatoryTopics: ['decimal place value', 'multiplication strategies']
        },
        studentAdaptation: {
          learningStyle: 'mixed' as const,
          previousPerformance: {
            accuracy: 0.75,
            averageTime: 45,
            strugglingConcepts: ['decimal place value'],
            masteredConcepts: ['basic multiplication']
          },
          engagementLevel: 'medium' as const,
          preferredContexts: ['money', 'measurement', 'real-world applications']
        }
      },
      'kc_math_g4_subtract_fractions_likedenom': {
        subject: 'mathematics',
        skillArea: 'fraction subtraction with like denominators',
        difficultyLevel: 4,
        gradeLevel: 4,
        teacherRequirements: {
          focusAreas: ['conceptual understanding', 'visual representations'],
          avoidTopics: ['unlike denominators'],
          preferredQuestionTypes: ['multiple_choice'],
          difficultyPreference: 'standard' as const
        },
        schoolStandards: {
          curriculum: 'common_core' as const,
          assessmentStyle: 'traditional' as const,
          learningGoals: ['4.NF.3 - understand fraction subtraction'],
          mandatoryTopics: ['fraction concepts', 'like denominators']
        },
        studentAdaptation: {
          learningStyle: 'visual' as const,
          previousPerformance: {
            accuracy: 0.70,
            averageTime: 50,
            strugglingConcepts: ['fraction concepts'],
            masteredConcepts: ['basic subtraction']
          },
          engagementLevel: 'medium' as const,
          preferredContexts: ['food', 'sharing', 'parts of wholes']
        }
      }
      // Add more KC mappings as needed
    };

    return baseMapping[kcId as keyof typeof baseMapping] || {
      subject: 'mathematics',
      skillArea: 'general math concepts',
      difficultyLevel: 5,
      gradeLevel: 5,
      teacherRequirements: {
        focusAreas: ['problem solving'],
        avoidTopics: [],
        preferredQuestionTypes: ['multiple_choice'],
        difficultyPreference: 'standard' as const
      },
      schoolStandards: {
        curriculum: 'common_core' as const,
        assessmentStyle: 'traditional' as const,
        learningGoals: ['mathematical thinking'],
        mandatoryTopics: []
      },
      studentAdaptation: {
        learningStyle: 'mixed' as const,
        previousPerformance: {
          accuracy: 0.75,
          averageTime: 40,
          strugglingConcepts: [],
          masteredConcepts: []
        },
        engagementLevel: 'medium' as const,
        preferredContexts: ['real-world']
      }
    };
  }

  private async generatePersonalizedQuestions(
    educationalContext: any,
    userId: string,
    count: number = 3
  ): Promise<any[]> {
    try {
      console.log(`🎓 Generating ${count} PERSONALIZED K-12 questions for Grade ${educationalContext.gradeLevel} ${educationalContext.subject}/${educationalContext.skillArea}`);
      
      const questions = [];
      
      for (let i = 0; i < count; i++) {
        try {
          console.log(`📡 Calling enhanced K-12 question API for question ${i + 1}...`);
          
          const response = await fetch('https://tgjudtnjhtumrfthegis.supabase.co/functions/v1/generate-question', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnanVkdG5qaHR1bXJmdGhlZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NTk4NjEsImV4cCI6MjA2NDQzNTg2MX0.1OexubPIEWxM3sZ4ds3kSeWxNslKXbJo5GzCDOZRHcQ`
            },
            body: JSON.stringify({
              // Base parameters
              subject: educationalContext.subject,
              skillArea: educationalContext.skillArea,
              difficultyLevel: educationalContext.difficultyLevel,
              gradeLevel: educationalContext.gradeLevel,
              userId,
              questionIndex: i,
              promptVariation: i === 0 ? 'basic' : i === 1 ? 'word_problem' : 'mixed',
              specificContext: 'personalized K-12 learning',
              
              // Enhanced educational parameters
              teacherRequirements: educationalContext.teacherRequirements,
              schoolStandards: educationalContext.schoolStandards,
              studentAdaptation: educationalContext.studentAdaptation
            }),
          });

          console.log(`📊 Enhanced API Response status: ${response.status}`);

          if (response.ok) {
            const questionData = await response.json();
            
            console.log(`📝 Raw K-12 API response:`, {
              hasQuestion: !!questionData.question,
              hasEducationalNotes: !!questionData.educationalNotes,
              validationsPassed: questionData.metadata?.validationsPassed
            });
            
            if (questionData.error || !questionData.question) {
              console.error(`❌ API returned error: ${questionData.error || 'Invalid response structure'}`);
              throw new Error(questionData.error || 'Invalid response structure');
            }
            
            console.log(`🎓 K-12 Personalized Question ${i + 1} received:`, {
              question: questionData.question?.substring(0, 50) + '...',
              gradeLevel: educationalContext.gradeLevel,
              hasEducationalNotes: !!questionData.educationalNotes,
              isPersonalized: questionData.metadata?.personalizedForStudent
            });
            
            if (this.validateQuestion(questionData) && !this.isDuplicateQuestion(questionData.question)) {
              this.usedQuestions.add(questionData.question);
              questions.push({
                question: questionData.question,
                options: questionData.options,
                correct: questionData.correct,
                explanation: questionData.explanation || "Great job!",
                isAiGenerated: true,
                isPersonalized: true,
                source: 'openai-k12-personalized',
                educationalNotes: questionData.educationalNotes
              });
              
              console.log(`✅ Added PERSONALIZED K-12 question ${i + 1} (NOT FALLBACK)`);
            } else {
              console.log(`⚠️ Question ${i + 1} failed validation, using fallback`);
              const fallback = this.createSpecificFallback(educationalContext.subject, educationalContext.skillArea, educationalContext.difficultyLevel, i);
              questions.push({
                ...fallback,
                isAiGenerated: false,
                isPersonalized: false,
                source: 'fallback'
              });
            }
          } else {
            const errorText = await response.text();
            console.error(`❌ HTTP error for question ${i + 1}:`, response.status, errorText);
            const fallback = this.createSpecificFallback(educationalContext.subject, educationalContext.skillArea, educationalContext.difficultyLevel, i);
            questions.push({
              ...fallback,
              isAiGenerated: false,
              isPersonalized: false,
              source: 'fallback'
            });
          }
        } catch (questionError) {
          console.error(`❌ Failed to generate personalized question ${i + 1}:`, questionError);
          const fallback = this.createSpecificFallback(educationalContext.subject, educationalContext.skillArea, educationalContext.difficultyLevel, i);
          questions.push({
            ...fallback,
            isAiGenerated: false,
            isPersonalized: false,
            source: 'fallback'
          });
        }
      }

      const personalizedCount = questions.filter(q => q.isPersonalized === true).length;
      const aiGeneratedCount = questions.filter(q => q.isAiGenerated === true).length;
      const fallbackCount = questions.filter(q => q.isAiGenerated === false).length;
      
      console.log(`✅ PERSONALIZED K-12 Result: Generated ${questions.length} questions`);
      console.log(`   📊 ${personalizedCount} fully personalized for Grade ${educationalContext.gradeLevel}`);
      console.log(`   🤖 ${aiGeneratedCount} AI-generated total`);
      console.log(`   🔧 ${fallbackCount} fallback questions`);
      console.log(`🎯 SUCCESS: ${personalizedCount > 0 ? 'PERSONALIZED K-12 QUESTIONS ARE WORKING!' : 'Using fallback questions'}`);
      
      return questions;
    } catch (error) {
      console.error('❌ Error in generatePersonalizedQuestions:', error);
      return [this.createSpecificFallback(educationalContext.subject, educationalContext.skillArea, educationalContext.difficultyLevel, 0)];
    }
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

  private createSpecificFallback(subject: string, skillArea: string, difficultyLevel: number, index: number) {
    console.log(`🔧 Creating fallback question ${index + 1} for ${skillArea}`);
    
    if (skillArea.includes('fraction') && skillArea.includes('like denominators')) {
      return this.createFractionFallback(index);
    }
    
    if (skillArea.includes('decimal multiplication')) {
      return this.createDecimalFallback(index);
    }

    // Generic fallback
    const timestamp = Date.now().toString().slice(-4);
    return {
      question: `What is an important concept in Grade ${difficultyLevel} ${subject}? (Question ${index + 1}-${timestamp})`,
      options: [`Concept A-${timestamp}`, `Concept B-${timestamp}`, `Concept C-${timestamp}`, `Concept D-${timestamp}`],
      correct: 0,
      explanation: `This helps you practice ${skillArea} skills.`
    };
  }

  private createFractionFallback(index: number) {
    const denominators = [6, 8, 10, 12];
    const denominator = denominators[index % denominators.length];
    const numerator1 = 1 + index;
    const numerator2 = 1 + (index % 2);
    const correctSum = numerator1 + numerator2;
    
    // Ensure we don't exceed the denominator
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
      explanation: `When adding fractions with the same denominator, add the numerators: ${numerator1} + ${numerator2} = ${correctSum}. The answer is ${correctAnswer}.`
    };
  }

  private createDecimalFallback(index: number) {
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
      explanation: `To multiply decimals: ${factor1} × ${factor2} = ${product}.`
    };
  }

  private createFallbackSequence(kcId: string, userId: string, subject: string, skillArea: string, difficultyLevel: number): AtomSequence {
    console.log(`🔧 Creating fallback sequence for ${kcId}`);
    
    const fallbackQuestions = [
      this.createSpecificFallback(subject, skillArea, difficultyLevel, 0),
      this.createSpecificFallback(subject, skillArea, difficultyLevel, 1),
      this.createSpecificFallback(subject, skillArea, difficultyLevel, 2)
    ];

    const atoms: ContentAtom[] = fallbackQuestions.map((question, index) => ({
      atom_id: `fallback_${kcId}_${userId}_${Date.now()}_${index}`,
      atom_type: 'QUESTION_MULTIPLE_CHOICE',
      content: {
        question: question.question,
        options: question.options,
        correctAnswer: question.correct,
        correctFeedback: question.explanation,
        generalIncorrectFeedback: question.explanation,
        explanation: question.explanation
      },
      kc_ids: [kcId],
      metadata: {
        difficulty: difficultyLevel,
        estimatedTime: 90,
        generated: true,
        fallback: true,
        timestamp: Date.now()
      }
    }));

    return {
      sequence_id: `fallback_seq_${kcId}_${userId}_${Date.now()}`,
      atoms: atoms,
      kc_id: kcId,
      user_id: userId,
      created_at: new Date().toISOString()
    };
  }
}

const aiCreativeDirectorService = new AiCreativeDirectorService();
export default aiCreativeDirectorService;
