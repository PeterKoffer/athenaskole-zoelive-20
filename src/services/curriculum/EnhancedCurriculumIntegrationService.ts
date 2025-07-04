
import UNESCOCurriculumService, { CountryCurriculum, UNESCOStandard } from './UNESCOCurriculumService';
import CurriculumIntegrationService from './CurriculumIntegrationService';
import { CurriculumTopic } from './curriculumData';

export interface GlobalCurriculumQuery {
  topic: CurriculumTopic;
  localApproach: string;
  globalApproaches: Array<{
    country: string;
    approach: string;
    gradeLevel: number;
    standards: string[];
  }>;
  unescoAlignment: UNESCOStandard[];
  recommendedSequence: string[];
  aiPromptContext: string;
}

class EnhancedCurriculumIntegrationService {
  generateGlobalCurriculumQuery(kcId: string, userCountry: string = 'US'): GlobalCurriculumQuery | null {
    // Get the local curriculum query first
    const localQuery = CurriculumIntegrationService.getCurriculumTopicByKcId(kcId);
    if (!localQuery) return null;

    // Extract topic name for global comparison
    const topicName = localQuery.topic.name;
    
    // Get global approaches to this topic
    const globalApproaches = UNESCOCurriculumService.generateCrossCountryComparison(topicName);
    
    // Get UNESCO alignment
    const unescoAlignment = UNESCOCurriculumService.alignTopicWithUNESCO(localQuery.topic.id, userCountry);
    
    // Get recommended learning sequence from top-performing countries
    const recommendedSequence = UNESCOCurriculumService.getRecommendedCountrySequence(userCountry, topicName);

    // Generate enhanced AI prompt context
    const aiPromptContext = this.generateGlobalAIPromptContext(
      localQuery.topic,
      globalApproaches,
      unescoAlignment,
      userCountry
    );

    return {
      topic: localQuery.topic,
      localApproach: localQuery.topic.description,
      globalApproaches,
      unescoAlignment,
      recommendedSequence,
      aiPromptContext
    };
  }

  private generateGlobalAIPromptContext(
    topic: CurriculumTopic, 
    globalApproaches: any[],
    unescoStandards: UNESCOStandard[],
    userCountry: string
  ): string {
    const topCountryApproaches = globalApproaches.slice(0, 3);
    const unescoGoals = unescoStandards.map(s => s.globalGoal).join(', ');

    return `
🌍 GLOBAL CURRICULUM CONTEXT:
- Topic: ${topic.name}
- Local Standard: ${topic.standards.join(', ')}
- UNESCO Alignment: ${unescoGoals || 'General K-12 Education'}

🏆 INTERNATIONAL BEST PRACTICES:
${topCountryApproaches.map(approach => 
  `- ${approach.country}: ${approach.approach} (Grade ${approach.gradeLevel})`
).join('\n')}

📚 CROSS-CULTURAL LEARNING APPROACHES:
- Incorporate diverse problem-solving methods from top-performing education systems
- Consider cultural contexts that make learning relatable across different backgrounds
- Apply evidence-based practices from international education research

🎯 GLOBAL COMPETENCY GOALS:
- Develop skills that are valued internationally
- Prepare students for global citizenship and collaboration
- Foster critical thinking that transcends cultural boundaries

⭐ CONTENT GENERATION GUIDELINES:
- Draw from the most effective teaching methods globally
- Create culturally inclusive examples and scenarios
- Align with both local standards and international best practices
- Emphasize skills that prepare students for a globally connected world
    `.trim();
  }

  getTopicsByGlobalExcellence(subject: string, countryCode?: string): CurriculumTopic[] {
    const excellenceCountries = this.getCountriesOfExcellence(subject);
    const topics: CurriculumTopic[] = [];

    excellenceCountries.forEach(country => {
      const curriculum = UNESCOCurriculumService.getCountryCurriculum(country);
      if (curriculum) {
        const subjectData = curriculum.subjects.find(s => 
          s.name.toLowerCase().includes(subject.toLowerCase())
        );
        if (subjectData) {
          topics.push(...subjectData.topics);
        }
      }
    });

    return topics;
  }

  private getCountriesOfExcellence(subject: string): string[] {
    // Based on international assessments like PISA, TIMSS, PIRLS
    const excellenceMap: Record<string, string[]> = {
      'mathematics': ['SG', 'FI', 'JP', 'KR', 'CA'],
      'science': ['SG', 'FI', 'JP', 'CA', 'AU'],
      'reading': ['FI', 'CA', 'IE', 'AU', 'GB'],
      'problem-solving': ['SG', 'JP', 'FI', 'KR', 'CA']
    };

    return excellenceMap[subject.toLowerCase()] || ['US', 'GB', 'CA', 'AU'];
  }

  generateCulturallyAdaptiveContent(kcId: string, userCountry: string, culturalContext?: string): string {
    const globalQuery = this.generateGlobalCurriculumQuery(kcId, userCountry);
    if (!globalQuery) return '';

    return `
🌐 CULTURALLY ADAPTIVE CONTENT GENERATION:

Primary Approach (${userCountry}): ${globalQuery.localApproach}

Alternative Global Approaches:
${globalQuery.globalApproaches.map(approach => 
  `• ${approach.country}: ${approach.approach}`
).join('\n')}

UNESCO Competency Alignment:
${globalQuery.unescoAlignment.map(standard => 
  `• ${standard.competency}: ${standard.description}`
).join('\n')}

CONTENT CREATION INSTRUCTIONS:
1. Start with the local curriculum approach as the foundation
2. Enhance with proven methods from high-performing countries
3. Include diverse cultural examples and contexts
4. Ensure alignment with UNESCO global education goals
5. Create content that prepares students for international collaboration

${culturalContext ? `\nSpecial Cultural Considerations: ${culturalContext}` : ''}
    `.trim();
  }
}

export default new EnhancedCurriculumIntegrationService();
