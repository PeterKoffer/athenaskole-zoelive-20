
import { CurriculumNode } from './CurriculumNode';
import { SubjectSpecificMetadata } from './SubjectMetadata';

/**
 * Validation utilities for curriculum nodes
 */
export const CurriculumValidation = {
  /**
   * Validates that a curriculum node is properly structured for its subject
   */
  validateNodeForSubject(node: CurriculumNode): { isValid: boolean; warnings: string[] } {
    const warnings: string[] = [];
    
    // Subject-specific validation logic
    if (node.subjectName?.toLowerCase().includes('language') && !node.subjectSpecific?.targetLanguage) {
      warnings.push('Language subjects should specify targetLanguage in subjectSpecific metadata');
    }
    
    if (node.subjectName?.toLowerCase().includes('physical') && !node.subjectSpecific?.activityType) {
      warnings.push('Physical education should specify activityType in subjectSpecific metadata');
    }
    
    if (node.subjectName?.toLowerCase().includes('art') && !node.subjectSpecific?.medium) {
      warnings.push('Creative arts should specify medium in subjectSpecific metadata');
    }
    
    return {
      isValid: warnings.length === 0,
      warnings
    };
  },

  /**
   * Suggests appropriate metadata fields based on subject
   */
  suggestMetadataForSubject(subjectName: string): Partial<SubjectSpecificMetadata> {
    const subject = subjectName.toLowerCase();
    
    if (subject.includes('language') || subject.includes('english')) {
      return {
        proficiencyLevel: 'beginner',
        linguisticSkill: 'reading'
      };
    }
    
    if (subject.includes('art') || subject.includes('creative')) {
      return {
        medium: 'traditional',
        technique: 'drawing'
      };
    }
    
    if (subject.includes('music')) {
      return {
        medium: 'instrumental',
        artisticStyle: 'classical'
      };
    }
    
    if (subject.includes('physical') || subject.includes('body')) {
      return {
        activityType: 'fitness',
        physicalRequirements: ['coordination']
      };
    }
    
    if (subject.includes('wellness') || subject.includes('mental')) {
      return {
        wellnessArea: 'emotional_regulation',
        sensitivityLevel: 'medium'
      };
    }
    
    if (subject.includes('computer') || subject.includes('technology')) {
      return {
        conceptualArea: 'algorithms',
        practicalProject: true
      };
    }
    
    return {};
  }
};
