
import { supabase } from '@/integrations/supabase/client';
import CurriculumIntegrationService from '../curriculum/CurriculumIntegrationService';
import { ContentGenerationRequest, AtomSequence } from './ContentGenerationService';

interface EnhancedContentRequest extends ContentGenerationRequest {
  useRealWorldScenarios?: boolean;
  includeCrossSubjectConnections?: boolean;
  adaptiveDifficulty?: boolean;
  studentInterests?: string[];
}

class EnhancedContentGenerationService {
  async generateCurriculumAlignedContent(request: EnhancedContentRequest): Promise<AtomSequence | null> {
    console.log('🎯 Enhanced content generation with curriculum integration:', request.kcId);

    try {
      // Get curriculum context for the KC
      const curriculumQuery = CurriculumIntegrationService.getCurriculumTopicByKcId(request.kcId);
      
      if (!curriculumQuery) {
        console.warn('⚠️ No curriculum mapping found for KC:', request.kcId);
        return null;
      }

      console.log('✅ Found curriculum topic:', curriculumQuery.topic.name);
      console.log('📊 Prerequisites:', curriculumQuery.prerequisites.length);
      console.log('🔗 Related topics:', curriculumQuery.relatedTopics.length);

      // Enhanced content generation with curriculum context
      const enhancedRequest = {
        ...request,
        curriculumContext: curriculumQuery.aiPromptContext,
        realWorldApplications: curriculumQuery.topic.realWorldApplications,
        crossSubjectConnections: curriculumQuery.topic.crossSubjectConnections,
        prerequisites: curriculumQuery.prerequisites.map(p => p.name),
        cognitiveLevel: curriculumQuery.topic.cognitiveLevel,
        estimatedTime: curriculumQuery.topic.estimatedTime
      };

      // Call enhanced edge function with curriculum data
      const { data: edgeResponse, error } = await supabase.functions.invoke('generate-content-atoms', {
        body: enhancedRequest
      });

      if (error) {
        console.error('❌ Enhanced content generation error:', error);
        return null;
      }

      if (edgeResponse?.atoms && edgeResponse.atoms.length > 0) {
        console.log('✅ Generated enhanced curriculum-aligned content:', edgeResponse.atoms.length, 'atoms');
        
        // Create enhanced atom sequence with curriculum metadata
        const enhancedAtoms = edgeResponse.atoms.map((atom: any) => ({
          ...atom,
          metadata: {
            ...atom.metadata,
            curriculumTopic: curriculumQuery.topic.name,
            standards: curriculumQuery.topic.standards,
            realWorldApps: curriculumQuery.topic.realWorldApplications.slice(0, 3),
            cognitiveLevel: curriculumQuery.topic.cognitiveLevel,
            crossSubject: curriculumQuery.topic.crossSubjectConnections
          }
        }));

        return {
          sequence_id: `enhanced_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          atoms: enhancedAtoms,
          kc_id: request.kcId,
          user_id: request.userId,
          created_at: new Date().toISOString()
        };
      }

      return null;
    } catch (error) {
      console.error('❌ Enhanced content generation failed:', error);
      return null;
    }
  }

  async generateRealWorldScenario(topicId: string, studentGrade: number): Promise<string> {
    const topic = CurriculumIntegrationService.getEnhancedTopic(topicId);
    if (!topic) return '';

    const applications = topic.realWorldApplications;
    const randomApp = applications[Math.floor(Math.random() * applications.length)];
    
    // Generate age-appropriate scenario
    const scenarios = {
      'Cooking and recipe measurements': `You're helping your family prepare dinner for ${studentGrade + 2} people, but the recipe serves 4. How would you adjust the measurements?`,
      'Shopping and calculating total costs': `You have $${(studentGrade * 5) + 10} to spend at the store and want to buy items that cost different amounts. How can you make sure you stay within budget?`,
      'Sports statistics and scoring': `Your favorite team scored ${studentGrade * 3} points in the first half and ${studentGrade * 2} points in the second half. What's their total score?`,
      'Garden planning and spacing plants': `You're planting a school garden that is ${studentGrade + 2} feet by ${studentGrade + 3} feet. How much space do you have for planting?`
    };

    return scenarios[randomApp as keyof typeof scenarios] || 
           `Think about how you might use ${topic.name.toLowerCase()} in your daily life or future career!`;
  }

  getAvailableCurriculumTopics(grade?: number): Array<{id: string, name: string, grade: number}> {
    const topics = grade 
      ? CurriculumIntegrationService.getTopicsForGrade(grade)
      : CurriculumIntegrationService.getTopicsForGrade(3)
          .concat(CurriculumIntegrationService.getTopicsForGrade(4))
          .concat(CurriculumIntegrationService.getTopicsForGrade(5))
          .concat(CurriculumIntegrationService.getTopicsForGrade(6));

    return topics.map(topic => ({
      id: topic.id,
      name: topic.name,
      grade: typeof topic.difficulty === 'number' ? Math.floor(topic.difficulty / 2) + 3 : 4
    }));
  }
}

export default new EnhancedContentGenerationService();
