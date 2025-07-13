
import { CurriculumNode, CurriculumNodeFilters } from '@/types/curriculum/index';

export class CurriculumFilter {
  static applyFilters(nodes: CurriculumNode[], filters?: CurriculumNodeFilters): CurriculumNode[] {
    if (!filters || Object.keys(filters).length === 0) {
      return [...nodes];
    }

    return nodes.filter(node => this.matchesFilters(node, filters));
  }

  private static matchesFilters(node: CurriculumNode, filters: CurriculumNodeFilters): boolean {
    let match = true;

    // Handle parentId filter (including null for root nodes)
    if (filters.parentId !== undefined) {
      match = match && node.parentId === filters.parentId;
    }

    // Handle nodeType filter (single or array)
    if (filters.nodeType) {
      const types = Array.isArray(filters.nodeType) ? filters.nodeType : [filters.nodeType];
      match = match && types.includes(node.nodeType);
    }

    // Handle country/region/language filters
    if (filters.countryCode) {
      match = match && node.countryCode === filters.countryCode;
    }
    if (filters.languageCode) {
      match = match && node.languageCode === filters.languageCode;
    }
    if (filters.regionCode) {
      match = match && node.regionCode === filters.regionCode;
    }

    // Handle educational level filter (single or array)
    if (filters.educationalLevel) {
      const levels = Array.isArray(filters.educationalLevel) ? filters.educationalLevel : [filters.educationalLevel];
      match = match && node.educationalLevel !== undefined && levels.includes(node.educationalLevel);
    }

    // Handle subject enum filter (single or array)
    if (filters.subject) {
      const subjects = Array.isArray(filters.subject) ? filters.subject : [filters.subject];
      match = match && node.subject !== undefined && subjects.includes(node.subject);
    }

    // Handle tags filter (match any)
    if (filters.tags && filters.tags.length > 0) {
      match = match && node.tags && filters.tags.some(tag => node.tags!.includes(tag));
    }

    // Handle name contains filter (case-insensitive)
    if (filters.nameContains) {
      match = match && node.name && node.name.toLowerCase().includes(filters.nameContains.toLowerCase());
    }

    // Handle subject-specific filters
    if (filters.subjectSpecificFilters && node.subjectSpecific) {
      match = match && this.matchesSubjectSpecificFilters(node, filters.subjectSpecificFilters);
    }

    // Handle accessibility filters
    if (filters.hasAccessibilitySupport && filters.hasAccessibilitySupport.length > 0) {
      match = match && node.accessibilityConsiderations && 
        filters.hasAccessibilitySupport.some(support => 
          node.accessibilityConsiderations!.includes(support)
        );
    }

    // Handle assessment type filter
    if (filters.assessmentType) {
      match = match && node.assessmentTypes && 
        node.assessmentTypes.includes(filters.assessmentType as any);
    }

    // Handle max duration filter
    if (filters.maxDuration && node.estimatedDuration) {
      match = match && node.estimatedDuration <= filters.maxDuration;
    }

    // Handle teaching method filter
    if (filters.teachingMethod) {
      match = match && node.preferredTeachingMethods && 
        node.preferredTeachingMethods.includes(filters.teachingMethod);
    }

    return match;
  }

  private static matchesSubjectSpecificFilters(
    node: CurriculumNode, 
    subjectFilters: Record<string, any>
  ): boolean {
    for (const [key, value] of Object.entries(subjectFilters)) {
      const nodeValue = node.subjectSpecific![key as keyof typeof node.subjectSpecific];
      if (nodeValue !== value) {
        return false;
      }
    }
    return true;
  }
}
