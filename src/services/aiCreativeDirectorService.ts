
import type { AtomSequence, ContentAtom } from '@/types/content';
import { EducationalContextMapper } from './aiCreativeDirector/educationalContextMapper';
// import { QuestionGenerator } from './aiCreativeDirector/questionGenerator'; // May not be needed for this flow
import { AtomSequenceBuilder } from './aiCreativeDirector/atomSequenceBuilder';
import { contentAtomRepository } from './contentAtomRepository'; // Import the repository

export interface UserContext {
  userId: string;
  targetLanguage: string; // e.g., "en-US", "da-DK"
  targetContextCurriculum: string; // e.g., "US_CCSSM", "DK_FM" - for future use in KC filtering
}

export interface IAiCreativeDirectorService {
  getAtomSequenceForKc(kcId: string, userContext: UserContext): Promise<AtomSequence | null>;
  // getAtomSequenceForSubject might need similar refactoring if it's to use pre-built atoms
  getAtomSequenceForSubject(subject: string, skillArea: string, gradeLevel: number, userContext: UserContext): Promise<AtomSequence | null>;
}

const DEFAULT_FALLBACK_LANGUAGE = "en-US";

class AiCreativeDirectorService implements IAiCreativeDirectorService {
  // private questionGenerator = new QuestionGenerator(); // Keep if other methods use it

  async getAtomSequenceForKc(kcId: string, userContext: UserContext): Promise<AtomSequence | null> {
    const { userId, targetLanguage, targetContextCurriculum } = userContext;
    try {
      console.log(`🎯 AI Creative Director: Fetching content for KC ${kcId}, User ${userId}, Lang ${targetLanguage}, Curriculum ${targetContextCurriculum}`);
      
      // EducationalContextMapper might also use targetLanguage/targetContextCurriculum in the future
      const educationalContext = EducationalContextMapper.mapKcToEducationalContext(kcId, userId /*, targetContextCurriculum */);
      console.log(`📚 Educational context: Grade ${educationalContext.gradeLevel} ${educationalContext.subject} / ${educationalContext.skillArea}`);
      
      let atomsForSequence: ContentAtom[] = await contentAtomRepository.getAtomsByKcIdAndLanguage(kcId, targetLanguage);

      if (!atomsForSequence || atomsForSequence.length === 0) {
        console.warn(`⚠️ No content atoms found for KC ${kcId} in language ${targetLanguage}. Attempting fallback to ${DEFAULT_FALLBACK_LANGUAGE}.`);
        if (targetLanguage !== DEFAULT_FALLBACK_LANGUAGE) {
          atomsForSequence = await contentAtomRepository.getAtomsByKcIdAndLanguage(kcId, DEFAULT_FALLBACK_LANGUAGE);
        }
      }

      if (!atomsForSequence || atomsForSequence.length === 0) {
        console.error(`❌ No content atoms found for KC ${kcId} even after fallback. Cannot build sequence.`);
        // Potentially return a more structured "empty" or error sequence, or use AtomSequenceBuilder.createFallbackSequence
        // For now, returning null if no atoms are found.
        return null;
      }

      console.log(`✅ Fetched ${atomsForSequence.length} atoms for KC ${kcId} in language ${targetLanguage} (or fallback).`);

      // The AtomSequenceBuilder might need to be adapted if its input was strictly generated questions.
      // For now, assuming it can take an array of ContentAtom.
      // If AtomSequenceBuilder is too tied to question generation, we might simplify this:
      const sequence: AtomSequence = {
        sequence_id: `seq_${kcId}_${userId}_${Date.now()}`,
        atoms: atomsForSequence, // Simple sequence of fetched atoms
        kc_id: kcId,
        user_id: userId,
        created_at: new Date().toISOString(),
      };
      // return AtomSequenceBuilder.buildAtomSequence(kcId, userId, atomsForSequence, educationalContext);
      return sequence;

    } catch (error) {
      console.error(`❌ AI Creative Director: Error fetching content for KC ${kcId}:`, error);
      // Fallback sequence might need to be language aware too, or very generic.
      // For now, returning null on error.
      return null;
      // return AtomSequenceBuilder.createFallbackSequence(kcId, userId, 'mathematics', 'general math', 5);
    }
  }

  // This method likely needs a similar refactor if it's intended to use pre-built atoms.
  // For now, it might still rely on on-the-fly generation or a different logic.
  // If it should use pre-built atoms, it would need to:
  // 1. Determine relevant KC(s) from subject, skillArea, gradeLevel.
  // 2. Fetch atoms for those KCs considering language.
  async getAtomSequenceForSubject(subject: string, skillArea: string, gradeLevel: number, userContext: UserContext): Promise<AtomSequence | null> {
    const { userId, targetLanguage, targetContextCurriculum } = userContext;
    try {
      console.warn(`🎯 AI Creative Director: getAtomSequenceForSubject called. This method may need refactoring to fully utilize language/curriculum-tagged content atoms. Current implementation might be placeholder or use older generation logic.`);
      
      const syntheticKcId = `kc_${subject}_g${gradeLevel}_${skillArea.replace(/\s+/g, '_').toLowerCase()}`;
      const educationalContext = EducationalContextMapper.mapKcToEducationalContext(syntheticKcId, userId);
      
      // This part would need to be replaced with fetching atoms, similar to getAtomSequenceForKc
      // For now, let's assume it might fall back to a generic, non-atom based sequence or error out.
      console.error(`❌ getAtomSequenceForSubject is not yet fully refactored to use language-aware atom fetching. Returning null.`);
      return null;
      // Example of how it might be structured:
      // const kcsForSubject = await knowledgeComponentService.getKcsBySubjectAndGrade(subject, gradeLevel); // Needs a KC service
      // if (!kcsForSubject || kcsForSubject.length === 0) return null;
      // const targetKc = kcsForSubject.find(kc => kc.domain === skillArea || kc.name.includes(skillArea)); // Simplified KC selection
      // if (!targetKc) return null;
      // return this.getAtomSequenceForKc(targetKc.id, userContext);


      // Fallback to old logic IF it's still desired for some cases, or remove.
      // return await this.generateAtomSequence(educationalContext, syntheticKcId, userId); // This was the old call
    } catch (error) {
      console.error(`❌ AI Creative Director: Error in getAtomSequenceForSubject for ${subject}:`, error);
      return null;
    }
  }

  // The old generateAtomSequence which relied on questionGenerator might be deprecated
  // or kept if on-the-fly question generation is still a separate desired feature.
  // For the flow of assembling pre-built atoms, it's replaced by the new logic in getAtomSequenceForKc.
  /*
  private async generateAtomSequence(educationalContext: any, kcId: string, userId: string): Promise<AtomSequence | null> {
    // ... old implementation using this.questionGenerator ...
  }
  */
}

export default new AICreativeDirectorService();
