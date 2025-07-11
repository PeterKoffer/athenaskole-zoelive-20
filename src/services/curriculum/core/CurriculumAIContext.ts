
import { CurriculumNode } from '@/types/curriculum/index';

export class CurriculumAIContext {
  static async generateContextForNode(
    node: CurriculumNode,
    getNodeById: (id: string) => Promise<CurriculumNode | undefined>,
    getChildren: (parentId: string) => Promise<CurriculumNode[]>
  ): Promise<string> {
    // Get parent context
    const parent = node.parentId ? await getNodeById(node.parentId) : null;
    const children = await getChildren(node.id);

    let context = `**${node.nodeType.toUpperCase()}: ${node.name}**\n`;
    
    if (node.description) {
      context += `Description: ${node.description}\n`;
    }

    if (parent) {
      context += `Parent: ${parent.name} (${parent.nodeType})\n`;
    }

    if (node.countryCode) {
      context += `Country: ${node.countryCode}\n`;
    }

    if (node.educationalLevel) {
      context += `Grade Level: ${node.educationalLevel}\n`;
    }

    if (node.subjectName) {
      context += `Subject: ${node.subjectName}\n`;
    }

    if (node.estimatedDuration) {
      context += `Estimated Duration: ${node.estimatedDuration} minutes\n`;
    }

    if (node.tags && node.tags.length > 0) {
      context += `Tags: ${node.tags.join(', ')}\n`;
    }

    if (node.prerequisites && node.prerequisites.length > 0) {
      context += `Prerequisites: ${node.prerequisites.join(', ')}\n`;
    }

    if (children.length > 0) {
      context += `Children: ${children.map(c => c.name).join(', ')}\n`;
    }

    if (node.subjectSpecific) {
      context += `Subject-Specific Details: ${JSON.stringify(node.subjectSpecific, null, 2)}\n`;
    }

    return context.trim();
  }
}
