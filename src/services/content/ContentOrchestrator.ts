import ContentGenerationService, { AtomSequence, ContentGenerationRequest } from './ContentGenerationService';
import EnhancedContentGenerationService from './EnhancedContentGenerationService';
import KnowledgeComponentService, { KnowledgeComponent } from './KnowledgeComponentService';
import CurriculumIntegrationService from '../curriculum/CurriculumIntegrationService';

class ContentOrchestrator {
  async getAtomSequenceForKc(kcId: string, userId: string): Promise<AtomSequence | null> {
    const useEnhancedGeneration = true; // Enable enhanced curriculum generation
    
    try {
      console.log('🎯 ContentOrchestrator: Enhanced curriculum-integrated generation for KC:', kcId);
      
      // Step 1: Try enhanced curriculum-aligned generation
      if (useEnhancedGeneration) {
        const enhancedRequest = {
          kcId,
          userId,
          contentTypes: ['TEXT_EXPLANATION', 'QUESTION_MULTIPLE_CHOICE'],
          maxAtoms: 3,
          useRealWorldScenarios: true,
          includeCrossSubjectConnections: true,
          adaptiveDifficulty: true,
          sessionId: `enhanced_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          forceUnique: true
        };

        const enhancedContent = await EnhancedContentGenerationService.generateCurriculumAlignedContent(enhancedRequest);
        if (enhancedContent && enhancedContent.atoms.length > 0) {
          console.log('✅ Enhanced curriculum content generated successfully');
          return enhancedContent;
        }
      }

      // Step 2: Try database first
      const dbAtoms = await ContentGenerationService.generateFromDatabase(kcId);
      if (dbAtoms.length > 0) {
        return this.createAtomSequence('database', dbAtoms, kcId, userId);
      }

      // Step 3: AI generation with curriculum context
      const curriculumQuery = CurriculumIntegrationService.getCurriculumTopicByKcId(kcId);
      let diversityPrompt = 'Create unique and engaging examples';
      
      if (curriculumQuery) {
        const realWorldApps = curriculumQuery.topic.realWorldApplications.slice(0, 2);
        diversityPrompt = `Create engaging content that connects to: ${realWorldApps.join(' and ')}`;
      }

      const sessionId = `curriculum_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const request: ContentGenerationRequest = {
        kcId,
        userId,
        contentTypes: ['TEXT_EXPLANATION', 'QUESTION_MULTIPLE_CHOICE'],
        maxAtoms: 3,
        diversityPrompt,
        sessionId,
        forceUnique: true
      };

      console.log('🎨 Using curriculum-enhanced diversity prompt:', diversityPrompt);
      const aiAtoms = await ContentGenerationService.generateFromAI(request);
      if (aiAtoms.length > 0) {
        return this.createAtomSequence('ai_curriculum_enhanced', aiAtoms, kcId, userId);
      }

      // Step 4: Enhanced fallback with curriculum context
      const kc = await KnowledgeComponentService.getKnowledgeComponent(kcId);
      if (!kc) {
        throw new Error(`Knowledge component not found: ${kcId}`);
      }

      const fallbackAtoms = this.generateEnhancedFallbackContent(kc, curriculumQuery);
      return this.createAtomSequence('enhanced_fallback', fallbackAtoms, kcId, userId);

    } catch (error) {
      console.error('❌ Enhanced ContentOrchestrator error:', error);
      throw error;
    }
  }

  private generateEnhancedFallbackContent(kc: any, curriculumQuery: any): any[] {
    console.log('🔄 Generating ENHANCED curriculum-aware fallback content for:', kc.name);
    
    const timestamp = Date.now();
    const randomSeed = Math.floor(Math.random() * 10000);
    
    // Use curriculum context if available
    let realWorldContext = '';
    let enhancedExplanation = this.getMathExplanationForKc(kc, randomSeed);
    
    if (curriculumQuery) {
      const apps = curriculumQuery.topic.realWorldApplications.slice(0, 2);
      realWorldContext = ` This concept is used in ${apps.join(' and ')}.`;
      enhancedExplanation += realWorldContext;
    }
    
    return [
      {
        atom_id: `enhanced_atom_${timestamp}_1_${randomSeed}`,
        atom_type: 'TEXT_EXPLANATION',
        content: {
          title: `Understanding ${kc.name}`,
          explanation: enhancedExplanation,
          examples: this.getMathExamplesForKc(kc, randomSeed),
          realWorldConnection: realWorldContext
        },
        kc_ids: [kc.id],
        metadata: {
          difficulty: kc.difficulty_estimate || 0.5,
          estimatedTimeMs: 30000,
          source: 'enhanced_curriculum_fallback',
          generated_at: timestamp,
          curriculum_integrated: !!curriculumQuery,
          randomSeed
        }
      },
      {
        atom_id: `enhanced_atom_${timestamp}_2_${randomSeed}`,
        atom_type: 'QUESTION_MULTIPLE_CHOICE',
        content: this.generateEnhancedMathQuestions(kc, randomSeed, curriculumQuery),
        kc_ids: [kc.id],
        metadata: {
          difficulty: kc.difficulty_estimate || 0.5,
          estimatedTimeMs: 45000,
          source: 'enhanced_curriculum_fallback',
          generated_at: timestamp,
          curriculum_integrated: !!curriculumQuery,
          randomSeed
        }
      }
    ];
  }

  private generateEnhancedMathQuestions(kc: any, seed: number, curriculumQuery: any) {
    // Use existing math question generation but with curriculum context
    const baseQuestion = this.generateMathQuestions(kc, seed);
    
    // Add real-world context if available
    if (curriculumQuery && curriculumQuery.topic.realWorldApplications.length > 0) {
      const app = curriculumQuery.topic.realWorldApplications[0];
      
      if (app.includes('cooking') || app.includes('recipe')) {
        baseQuestion.question = baseQuestion.question.replace(
          /What is/, 
          'When adjusting a recipe, what is'
        );
      } else if (app.includes('shopping') || app.includes('cost')) {
        baseQuestion.question = baseQuestion.question.replace(
          /What is/, 
          'When calculating the total cost, what is'
        );
      }
    }
    
    return baseQuestion;
  }

  private generateMathQuestions(kc: any, seed: number) {
    const kcId = kc.id.toLowerCase();
    
    if (kcId.includes('multiply_decimals')) {
      const factor1 = (1.2 + (seed % 5) * 0.3).toFixed(1);
      const factor2 = (2.1 + (seed % 4) * 0.2).toFixed(1);
      const product = (parseFloat(factor1) * parseFloat(factor2)).toFixed(2);
      
      return {
        question: `What is ${factor1} × ${factor2}?`,
        options: [
          product,
          (parseFloat(product) + 0.5).toFixed(2),
          (parseFloat(product) - 0.3).toFixed(2),
          (parseFloat(factor1) + parseFloat(factor2)).toFixed(2)
        ],
        correctAnswer: 0,
        correct: 0,
        explanation: `To multiply decimals, multiply the numbers normally: ${factor1} × ${factor2} = ${product}`
      };
    }
    
    const num1 = 12 + (seed % 20);
    const num2 = 5 + (seed % 15);
    const sum = num1 + num2;
    
    return {
      question: `What is ${num1} + ${num2}?`,
      options: [
        sum.toString(),
        (sum + 1).toString(),
        (sum - 2).toString(),
        (num1 - num2).toString()
      ],
      correctAnswer: 0,
      correct: 0,
      explanation: `${num1} + ${num2} = ${sum}`
    };
  }

  private getMathExplanationForKc(kc: any, seed: number) {
    const kcId = kc.id.toLowerCase();
    
    if (kcId.includes('multiply_decimals')) {
      return `Multiplying decimals is like multiplying whole numbers, but we need to place the decimal point correctly. Count the total decimal places in both numbers and put that many decimal places in your answer.`;
    }
    
    return `This mathematical concept helps us solve real-world problems and builds important thinking skills.`;
  }

  private getMathExamplesForKc(kc: any, seed: number) {
    const kcId = kc.id.toLowerCase();
    
    if (kcId.includes('multiply_decimals')) {
      return [`Example: 2.5 × 1.2 = 3.00 = 3.0`];
    }
    
    return [`Practice helps you master ${kc.name}`];
  }

  private createAtomSequence(source: string, atoms: any[], kcId: string, userId: string): AtomSequence {
    const sequenceId = `${source}_seq_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    console.log(`✅ Created ${source} sequence:`, {
      sequenceId,
      atomCount: atoms.length,
      kcId: kcId.split('_').pop(),
      curriculumIntegrated: source.includes('curriculum') || source.includes('enhanced')
    });

    return {
      sequence_id: sequenceId,
      atoms,
      kc_id: kcId,
      user_id: userId,
      created_at: new Date().toISOString()
    };
  }
}

export default new ContentOrchestrator();
