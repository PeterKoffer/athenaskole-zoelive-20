import { CurriculumNode, CurriculumNodeFilters } from '../../types/curriculum';
import { ICurriculumService } from '../curriculumService/types'; // Corrected path
import { mockCurriculumData } from '../../data/mockCurriculumData';

export class MockCurriculumService implements ICurriculumService {
  private data: CurriculumNode[];

  constructor() {
    // In a real scenario, data might be fetched or initialized differently.
    // For mock, we can deep clone to prevent accidental modification of the source mock data during filtering.
    this.data = JSON.parse(JSON.stringify(mockCurriculumData));
  }

  async getNodeById(id: string): Promise<CurriculumNode | undefined> {
    return this.data.find(node => node.id === id);
  }

  async getChildrenOfNode(parentId: string): Promise<CurriculumNode[]> {
    return this.data.filter(node => node.parentId === parentId);
  }

  async getNodes(filters: CurriculumNodeFilters): Promise<CurriculumNode[]> {
    return this.data.filter(node => {
      let match = true;

      if (filters.parentId !== undefined && node.parentId !== filters.parentId) {
        match = false;
      }
      if (filters.nodeType) {
        const typesToFilter = Array.isArray(filters.nodeType) ? filters.nodeType : [filters.nodeType];
        if (!typesToFilter.includes(node.nodeType)) {
          match = false;
        }
      }
      if (filters.countryCode && node.countryCode !== filters.countryCode) {
        match = false;
      }
      if (filters.languageCode && node.languageCode !== filters.languageCode) {
        match = false;
      }
      if (filters.regionCode && node.regionCode !== filters.regionCode) {
        match = false;
      }
      if (filters.educationalLevel) {
        const levelsToFilter = Array.isArray(filters.educationalLevel) ? filters.educationalLevel : [filters.educationalLevel];
        if (!node.educationalLevel || !levelsToFilter.includes(node.educationalLevel)) {
          match = false;
        }
      }
      if (filters.subjectName) {
        const subjectsToFilter = Array.isArray(filters.subjectName) ? filters.subjectName : [filters.subjectName];
        if (!node.subjectName || !subjectsToFilter.includes(node.subjectName)) { // Assuming subjectName is on CurriculumNode based on schema
          match = false;
        }
      }
      if (filters.tags && filters.tags.length > 0) {
        if (!node.tags || !filters.tags.some(tag => node.tags!.includes(tag))) {
          match = false;
        }
      }
      if (filters.nameContains && (!node.name || !node.name.toLowerCase().includes(filters.nameContains.toLowerCase()))) {
        match = false;
      }

      // Basic subjectSpecificFilters check - can be expanded for more complex logic
      if (filters.subjectSpecificFilters) {
        if (!node.subjectSpecific) {
          match = false;
        } else {
          for (const key in filters.subjectSpecificFilters) {
            const filterValue = filters.subjectSpecificFilters[key as keyof typeof filters.subjectSpecificFilters];
            const nodeValue = node.subjectSpecific[key as keyof typeof node.subjectSpecific];
            if (nodeValue !== filterValue) {
              match = false;
              break;
            }
          }
        }
      }

      // Add other filter conditions from CurriculumNodeFilters as needed

      return match;
    });
  }

  // Placeholder for potential future methods, can be expanded from ICurriculumService
  // async getDescendantsOfNode(parentId: string, maxDepth?: number, filters?: CurriculumNodeFilters): Promise<CurriculumNode[]> {
  //   // Implementation for fetching descendants would go here
  //   console.warn("getDescendantsOfNode not fully implemented in MockCurriculumService");
  //   return [];
  // }

  // async getNodePath(nodeId: string): Promise<CurriculumNode[]> {
  //   // Implementation for fetching node path would go here
  //   console.warn("getNodePath not fully implemented in MockCurriculumService");
  //   return [];
  // }

  async getDescendants(parentId: string): Promise<CurriculumNode[]> {
    const descendants: CurriculumNode[] = [];
    const queue: string[] = [parentId];
    const visited: Set<string> = new Set(); // To handle potential circular dependencies if data is bad

    while (queue.length > 0) {
      const currentParentId = queue.shift()!;
      if (visited.has(currentParentId) && currentParentId !== parentId) { // Allow processing direct children of initial parentId even if visited in another branch
          continue;
      }
      visited.add(currentParentId);

      const children = await this.getChildrenOfNode(currentParentId);
      for (const child of children) {
        descendants.push(child);
        queue.push(child.id);
      }
    }
    return descendants;
  }

  // Ensure getChildren is an alias or implemented if ICurriculumService uses that name
  async getChildren(parentId: string): Promise<CurriculumNode[]> {
    return this.getChildrenOfNode(parentId);
  }

  async generateAIContextForNode(nodeId: string): Promise<string | null> {
    const node = await this.getNodeById(nodeId);
    if (!node) {
      return null;
    }

    let context = `📚 CURRICULUM CONTEXT:\n`;
    context += `- Node ID: ${node.id}\n`;
    context += `- Type: ${node.nodeType}\n`;
    context += `- Name: ${node.name}\n`;
    if (node.description) {
      context += `- Description: ${node.description}\n`;
    }
    if (node.subjectName) {
      context += `- Subject: ${node.subjectName}\n`;
    }
    if (node.educationalLevel) {
      context += `- Grade/Level: ${node.educationalLevel}\n`;
    }
    if (node.sourceIdentifier) {
      context += `- Standard/Source ID: ${node.sourceIdentifier}\n`;
    }
    if (node.estimatedDuration) {
      context += `- Estimated Time: ${node.estimatedDuration} minutes\n`;
    }

    // Prerequisites
    if (node.prerequisites && node.prerequisites.length > 0) {
      const prereqNames: string[] = [];
      for (const prereqId of node.prerequisites) {
        const prereqNode = await this.getNodeById(prereqId);
        if (prereqNode) {
          prereqNames.push(prereqNode.name);
        } else {
          prereqNames.push(prereqId); // Add ID if name not found
        }
      }
      context += `\n🔗 LEARNING PROGRESSION:\n`;
      context += `- Prerequisites: ${prereqNames.join(', ') || 'None'}\n`;
    } else {
      context += `\n🔗 LEARNING PROGRESSION:\n- Prerequisites: None\n`;
    }

    // Placeholder for Next Topics (would require reverse lookup or graph traversal)
    context += `- Next Topics: (Placeholder - Implementation needed to find nodes that list this as a prerequisite)\n`;


    // Real-world applications, cross-subject connections, etc.
    // These would ideally be populated in subjectSpecific or tags during data transformation.
    // For now, we add placeholders or extract from existing tags if relevant.
    context += `\n🌍 REAL-WORLD APPLICATIONS:\n`;
    if (node.tags?.some(tag => tag.includes('application') || tag.includes('real_world'))) {
      context += `- Based on tags: ${node.tags.filter(tag => tag.includes('application') || tag.includes('real_world')).join(', ')}\n`;
    } else {
      context += `- (Placeholder - Populate CurriculumNode.subjectSpecific.realWorldApplications or tags)\n`;
    }

    context += `\n🔄 CROSS-SUBJECT CONNECTIONS:\n`;
     if (node.tags?.some(tag => tag.includes('cross_subject') || tag.includes(node.subjectName?.toLowerCase() === 'mathematics' ? 'science' : 'ela'))) { // Simple heuristic
      context += `- Based on tags/subject: ${node.tags.filter(tag => tag.includes('cross_subject')).join(', ')}\n`;
    } else {
      context += `- (Placeholder - Populate CurriculumNode.subjectSpecific.crossSubjectConnections or tags)\n`;
    }

    if (node.subjectSpecific?.customFields?.studypugDifficulty) {
         context += `\n🎯 STUDYPUG DATA:\n- Difficulty Level: ${node.subjectSpecific.customFields.studypugDifficulty}/10\n`;
    }
     if (node.subjectSpecific?.customFields?.studypugId) {
         context += `- StudyPug ID: ${node.subjectSpecific.customFields.studypugId}\n`;
    }


    // Cognitive Level, Scenario Types, Assessment Strategies - Placeholders
    context += `\n🧠 COGNITIVE LEVEL:\n- (Placeholder - Populate CurriculumNode.subjectSpecific.cognitiveLevel)\n`;
    context += `\n🎲 SCENARIO TYPES:\n- (Placeholder - Populate CurriculumNode.subjectSpecific.scenarioTypes or tags)\n`;
    context += `\n📊 ASSESSMENT STRATEGIES:\n`;
    if (node.assessmentTypes && node.assessmentTypes.length > 0) {
         context += `- ${node.assessmentTypes.join(', ')}\n`;
    } else {
        context += `- (Placeholder - Populate CurriculumNode.assessmentTypes)\n`;
    }

    return context.trim();
  }
}
