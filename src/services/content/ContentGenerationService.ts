
import { supabase } from '@/integrations/supabase/client';

export interface ContentGenerationRequest {
  kcId: string;
  userId: string;
  difficultyLevel?: number;
  contentTypes?: string[];
  maxAtoms?: number;
  diversityPrompt?: string;
  sessionId?: string;
  forceUnique?: boolean;
}

export interface AtomSequence {
  sequence_id: string;
  atoms: any[];
  kc_id: string;
  user_id: string;
  created_at: string;
}

class ContentGenerationService {
  async generateFromDatabase(kcId: string): Promise<any[]> {
    console.log('🔍 Checking database for pre-built atoms...');
    
    const { data: existingAtoms, error } = await supabase
      .from('content_atoms')
      .select('*')
      .contains('kc_ids', [kcId])
      .limit(5);

    if (error) {
      console.error('❌ Database query error:', error);
      return [];
    }

    if (existingAtoms && existingAtoms.length > 0) {
      console.log('✅ Found pre-built atoms in database:', existingAtoms.length);
      return existingAtoms.map(atom => ({
        atom_id: atom.id,
        atom_type: atom.atom_type,
        content: atom.content,
        kc_ids: atom.kc_ids,
        metadata: {
          ...atom.metadata,
          source: 'database',
          loadedAt: Date.now()
        }
      }));
    }

    console.log('⚠️ No pre-built atoms found in database');
    return [];
  }

  async generateFromAI(request: ContentGenerationRequest): Promise<any[]> {
    console.log('🤖 Attempting ENHANCED AI content generation...');
    
    try {
      // Extract more specific information from KC ID
      const kcParts = request.kcId.split('_');
      const subject = kcParts[1] || 'math';
      const grade = kcParts[2] || 'g4';
      const topic = kcParts.slice(3).join(' ').replace(/_/g, ' ') || 'general topic';
      
      console.log('📚 Extracted KC info:', { subject, grade, topic });

      const { data: edgeResponse, error } = await supabase.functions.invoke('generate-content-atoms', {
        body: {
          kcId: request.kcId,
          userId: request.userId,
          subject: subject,
          gradeLevel: grade,
          topic: topic,
          contentTypes: request.contentTypes || ['TEXT_EXPLANATION', 'QUESTION_MULTIPLE_CHOICE', 'INTERACTIVE_EXERCISE'],
          maxAtoms: request.maxAtoms || 3,
          diversityPrompt: request.diversityPrompt || `Create engaging ${grade} ${subject} content about ${topic}`,
          sessionId: request.sessionId,
          forceUnique: request.forceUnique,
          enhancedPrompt: true
        }
      });

      if (error) {
        console.error('❌ Edge Function error:', error);
        return [];
      }

      if (edgeResponse?.atoms && edgeResponse.atoms.length > 0) {
        console.log('✅ AI generated content successfully:', edgeResponse.atoms.length, 'atoms');
        return edgeResponse.atoms;
      }

      console.log('⚠️ Edge Function returned no atoms');
      return [];
    } catch (error) {
      console.error('❌ AI generation failed:', error);
      return [];
    }
  }

  generateFallbackContent(kc: any): any[] {
    console.log('🔄 Generating DIVERSE fallback content for:', kc.name);
    
    const timestamp = Date.now();
    const randomSeed = Math.floor(Math.random() * 1000);
    
    // Create diverse question variations based on the KC
    const questionTemplates = this.getQuestionTemplatesForKc(kc);
    const selectedTemplate = questionTemplates[randomSeed % questionTemplates.length];
    
    return [
      {
        atom_id: `atom_${timestamp}_1`,
        atom_type: 'TEXT_EXPLANATION',
        content: {
          title: `Understanding ${kc.name}`,
          explanation: this.getExplanationForKc(kc),
          examples: this.getExamplesForKc(kc)
        },
        kc_ids: [kc.id],
        metadata: {
          difficulty: kc.difficulty_estimate || 0.5,
          estimatedTimeMs: 30000,
          source: 'diverse_fallback',
          generated_at: timestamp,
          randomSeed
        }
      },
      {
        atom_id: `atom_${timestamp}_2`,
        atom_type: 'QUESTION_MULTIPLE_CHOICE',
        content: selectedTemplate,
        kc_ids: [kc.id],
        metadata: {
          difficulty: kc.difficulty_estimate || 0.5,
          estimatedTimeMs: 45000,
          source: 'diverse_fallback',
          generated_at: timestamp,
          randomSeed
        }
      },
      {
        atom_id: `atom_${timestamp}_3`,
        atom_type: 'INTERACTIVE_EXERCISE',
        content: {
          title: `Practice ${kc.name}`,
          description: this.getExerciseDescriptionForKc(kc),
          exerciseType: 'problem-solving',
          components: {
            problem: this.getProblemForKc(kc),
            answer: 'correct solution'
          }
        },
        kc_ids: [kc.id],
        metadata: {
          difficulty: kc.difficulty_estimate || 0.5,
          estimatedTimeMs: 60000,
          source: 'diverse_fallback',
          generated_at: timestamp,
          randomSeed
        }
      }
    ];
  }

  private getQuestionTemplatesForKc(kc: any) {
    const kcId = kc.id.toLowerCase();
    
    if (kcId.includes('area_rectangles')) {
      return [
        {
          question: "A rectangle has a length of 8 units and a width of 5 units. What is its area?",
          options: ["40 square units", "13 square units", "26 square units", "30 square units"],
          correctAnswer: 0,
          correct: 0,
          explanation: "Area = length × width = 8 × 5 = 40 square units"
        },
        {
          question: "If a rectangular garden is 6 meters long and 4 meters wide, how much space does it cover?",
          options: ["24 square meters", "10 square meters", "20 square meters", "14 square meters"],
          correctAnswer: 0,
          correct: 0,
          explanation: "The area of a rectangle is length × width = 6 × 4 = 24 square meters"
        },
        {
          question: "What formula do we use to find the area of a rectangle?",
          options: ["length × width", "length + width", "length ÷ width", "2 × (length + width)"],
          correctAnswer: 0,
          correct: 0,
          explanation: "The area of a rectangle is always length × width"
        }
      ];
    }
    
    if (kcId.includes('add_fractions')) {
      return [
        {
          question: "What is 2/5 + 1/5?",
          options: ["3/5", "3/10", "2/5", "1/5"],
          correctAnswer: 0,
          correct: 0,
          explanation: "When adding fractions with the same denominator, add the numerators: 2 + 1 = 3, so 2/5 + 1/5 = 3/5"
        },
        {
          question: "Solve: 1/4 + 2/4",
          options: ["3/4", "3/8", "1/2", "2/4"],
          correctAnswer: 0,
          correct: 0,
          explanation: "Add the numerators: 1 + 2 = 3, keep the denominator: 3/4"
        }
      ];
    }
    
    // Default templates for other KCs
    return [
      {
        question: `What is a key concept in ${kc.name}?`,
        options: ["Understanding the fundamentals", "Memorizing rules", "Skipping practice", "Avoiding examples"],
        correctAnswer: 0,
        correct: 0,
        explanation: `Understanding the fundamentals is essential for mastering ${kc.name}`
      },
      {
        question: `How can you improve at ${kc.name}?`,
        options: ["Practice regularly", "Avoid difficult problems", "Skip explanations", "Rush through examples"],
        correctAnswer: 0,
        correct: 0,
        explanation: `Regular practice is the best way to improve at ${kc.name}`
      }
    ];
  }

  private getExplanationForKc(kc: any) {
    const kcId = kc.id.toLowerCase();
    
    if (kcId.includes('area_rectangles')) {
      return "Finding the area of rectangles is a fundamental skill in geometry. The area tells us how much space a rectangle covers. To find the area, we multiply the length by the width. This gives us the total number of square units inside the rectangle.";
    }
    
    if (kcId.includes('add_fractions')) {
      return "Adding fractions with like denominators is straightforward. When the denominators are the same, we simply add the numerators together and keep the denominator the same. This represents combining parts of the same whole.";
    }
    
    return `${kc.name} is an important concept that builds foundational understanding in ${kc.subject}. Let's explore this topic step by step.`;
  }

  private getExamplesForKc(kc: any) {
    const kcId = kc.id.toLowerCase();
    
    if (kcId.includes('area_rectangles')) {
      return [
        "A classroom that is 10 feet long and 8 feet wide has an area of 80 square feet",
        "A book cover that is 9 inches long and 6 inches wide has an area of 54 square inches"
      ];
    }
    
    if (kcId.includes('add_fractions')) {
      return [
        "1/3 + 1/3 = 2/3 (one-third plus one-third equals two-thirds)",
        "3/8 + 2/8 = 5/8 (three-eighths plus two-eighths equals five-eighths)"
      ];
    }
    
    return [`Example of ${kc.name} in practice`, `Real-world application of ${kc.name}`];
  }

  private getExerciseDescriptionForKc(kc: any) {
    const kcId = kc.id.toLowerCase();
    
    if (kcId.includes('area_rectangles')) {
      return "Practice calculating areas of different rectangles. Remember: Area = length × width";
    }
    
    if (kcId.includes('add_fractions')) {
      return "Practice adding fractions with the same denominator. Add the numerators and keep the denominator.";
    }
    
    return `Let's practice ${kc.name} with hands-on activities.`;
  }

  private getProblemForKc(kc: any) {
    const kcId = kc.id.toLowerCase();
    
    if (kcId.includes('area_rectangles')) {
      return "Find the area of a rectangular playground that is 12 meters long and 7 meters wide.";
    }
    
    if (kcId.includes('add_fractions')) {
      return "Add these fractions: 2/7 + 3/7";
    }
    
    return `Solve this problem involving ${kc.name}`;
  }
}

export default new ContentGenerationService();
