
import type { AtomSequence } from '@/types/content';
import { EducationalContextMapper } from './aiCreativeDirector/educationalContextMapper';
import { QuestionGenerator } from './aiCreativeDirector/questionGenerator';
import { AtomSequenceBuilder } from './aiCreativeDirector/atomSequenceBuilder';

export interface IAiCreativeDirectorService {
  getAtomSequenceForKc(kcId: string, userId: string): Promise<AtomSequence | null>;
  getAtomSequenceForSubject(subject: string, skillArea: string, gradeLevel: number, userId: string): Promise<AtomSequence | null>;
}

class AiCreativeDirectorService implements IAiCreativeDirectorService {
  private questionGenerator = new QuestionGenerator();

  async getAtomSequenceForKc(kcId: string, userId: string): Promise<AtomSequence | null> {
    try {
      console.log(`🎯 AI Creative Director: Generating PERSONALIZED K-12 content for KC ${kcId}, User ${userId}`);
      
      const educationalContext = EducationalContextMapper.mapKcToEducationalContext(kcId, userId);
      console.log(`📚 Educational context: Grade ${educationalContext.gradeLevel} ${educationalContext.subject} / ${educationalContext.skillArea}`);
      
      return await this.generateAtomSequence(educationalContext, kcId, userId);
    } catch (error) {
      console.error(`❌ AI Creative Director: Error generating personalized K-12 content for KC ${kcId}:`, error);
      return AtomSequenceBuilder.createFallbackSequence(kcId, userId, 'mathematics', 'general math', 5);
    }
  }

  async getAtomSequenceForSubject(subject: string, skillArea: string, gradeLevel: number, userId: string): Promise<AtomSequence | null> {
    try {
      console.log(`🎯 AI Creative Director: Generating PERSONALIZED ${subject} content for Grade ${gradeLevel}, User ${userId}`);
      
      // Create a synthetic KC ID for the subject
      const syntheticKcId = `kc_${subject}_g${gradeLevel}_${skillArea.replace(/\s+/g, '_').toLowerCase()}`;
      
      const educationalContext = EducationalContextMapper.mapKcToEducationalContext(syntheticKcId, userId);
      console.log(`📚 Educational context: Grade ${gradeLevel} ${subject} / ${skillArea}`);
      
      return await this.generateAtomSequence(educationalContext, syntheticKcId, userId);
    } catch (error) {
      console.error(`❌ AI Creative Director: Error generating personalized ${subject} content:`, error);
      return AtomSequenceBuilder.createFallbackSequence(
        `fallback_${subject}`, 
        userId, 
        subject, 
        skillArea, 
        gradeLevel
      );
    }
  }

  private async generateAtomSequence(educationalContext: any, kcId: string, userId: string): Promise<AtomSequence | null> {
    const generatedQuestions = await this.questionGenerator.generatePersonalizedQuestions(
      educationalContext,
      userId, 
      3
    );

    if (!generatedQuestions || generatedQuestions.length === 0) {
      console.log(`⚠️ No personalized ${educationalContext.subject} questions generated, creating fallback content`);
      return AtomSequenceBuilder.createFallbackSequence(
        kcId, 
        userId, 
        educationalContext.subject, 
        educationalContext.skillArea, 
        educationalContext.difficultyLevel
      );
    }

    const atomSequence = AtomSequenceBuilder.buildAtomSequence(
      kcId,
      userId,
      generatedQuestions,
      educationalContext
    );

    const personalizedCount = generatedQuestions.filter(q => q.isPersonalized === true).length;
    const aiGeneratedCount = generatedQuestions.filter(q => q.isAiGenerated === true).length;
    const fallbackCount = generatedQuestions.filter(q => q.isAiGenerated === false).length;
    
    console.log(`✅ PERSONALIZED K-12 ${educationalContext.subject.toUpperCase()} Result: Generated ${generatedQuestions.length} questions`);
    console.log(`   📊 ${personalizedCount} fully personalized for Grade ${educationalContext.gradeLevel}`);
    console.log(`   🤖 ${aiGeneratedCount} AI-generated total`);
    console.log(`   🔧 ${fallbackCount} fallback questions`);

    return atomSequence;
  }
}

const aiCreativeDirectorService = new AiCreativeDirectorService();
export default aiCreativeDirectorService;
