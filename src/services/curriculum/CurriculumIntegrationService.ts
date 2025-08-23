// @ts-nocheck

import { completeStudyPugCurriculum, CurriculumLevel, CurriculumTopic } from './curriculumData';

export interface EnhancedCurriculumTopic extends CurriculumTopic {
  realWorldApplications: string[];
  crossSubjectConnections: string[];
  scenarioTypes: string[];
  cognitiveLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  assessmentStrategies: string[];
}

export interface CurriculumQueryResult {
  topic: EnhancedCurriculumTopic;
  prerequisites: CurriculumTopic[];
  relatedTopics: CurriculumTopic[];
  nextTopics: CurriculumTopic[];
  aiPromptContext: string;
}

class CurriculumIntegrationService {
  private curriculumCache = new Map<string, EnhancedCurriculumTopic>();
  private topicRelationsCache = new Map<string, CurriculumTopic[]>();

  constructor() {
    this.initializeEnhancedTopics();
  }

  private initializeEnhancedTopics() {
    console.log('🏗️ Initializing enhanced curriculum topics with AI context...');
    
    completeStudyPugCurriculum.forEach(level => {
      level.subjects?.forEach(subject => {
        subject.topics.forEach(topic => {
          const enhanced = this.enhanceTopicForAI(topic, level.grade);
          this.curriculumCache.set(topic.id, enhanced);
        });
      });
    });

    console.log(`✅ Enhanced ${this.curriculumCache.size} curriculum topics for AI generation`);
  }

  private enhanceTopicForAI(topic: CurriculumTopic, grade: number | string): EnhancedCurriculumTopic {
    // Add AI-specific enhancements based on topic content
    const realWorldApplications = this.generateRealWorldApplications(topic);
    const crossSubjectConnections = this.generateCrossSubjectConnections(topic);
    const scenarioTypes = this.generateScenarioTypes(topic);
    const cognitiveLevel = this.determineCognitiveLevel(topic);
    const assessmentStrategies = this.generateAssessmentStrategies(topic);

    return {
      ...topic,
      realWorldApplications,
      crossSubjectConnections,
      scenarioTypes,
      cognitiveLevel,
      assessmentStrategies
    };
  }

  private generateRealWorldApplications(topic: CurriculumTopic): string[] {
    const topicName = topic.name.toLowerCase();
    
    if (topicName.includes('fraction')) {
      return [
        'Cooking and recipe measurements',
        'Construction and carpentry',
        'Medical dosages and prescriptions',
        'Financial calculations and budgeting',
        'Art and design proportions'
      ];
    }
    
    if (topicName.includes('multiplication') || topicName.includes('division')) {
      return [
        'Shopping and calculating total costs',
        'Planning events and party supplies',
        'Sports statistics and scoring',
        'Garden planning and spacing plants',
        'Time management and scheduling'
      ];
    }
    
    if (topicName.includes('area') || topicName.includes('perimeter')) {
      return [
        'Home improvement and flooring',
        'Landscaping and garden design',
        'Sports field dimensions',
        'Art canvas and frame sizing',
        'Packaging and shipping calculations'
      ];
    }
    
    if (topicName.includes('ratio') || topicName.includes('proportion')) {
      return [
        'Maps and scale drawings',
        'Photography and image scaling',
        'Nutrition and recipe scaling',
        'Engineering and model building',
        'Economics and currency exchange'
      ];
    }
    
    return [
      'Everyday problem solving',
      'STEM career applications',
      'Financial literacy',
      'Creative projects',
      'Community service planning'
    ];
  }

  private generateCrossSubjectConnections(topic: CurriculumTopic): string[] {
    const connections = ['Mathematics']; // Always include math
    
    const topicName = topic.name.toLowerCase();
    
    if (topicName.includes('measurement') || topicName.includes('data')) {
      connections.push('Science', 'Geography');
    }
    
    if (topicName.includes('fraction') || topicName.includes('ratio')) {
      connections.push('Art', 'Science', 'Social Studies');
    }
    
    if (topicName.includes('geometry') || topicName.includes('area')) {
      connections.push('Art', 'Architecture', 'Engineering');
    }
    
    return connections;
  }

  private generateScenarioTypes(topic: CurriculumTopic): string[] {
    const scenarios = [];
    
    const topicName = topic.name.toLowerCase();
    
    if (topicName.includes('word problem') || topicName.includes('application')) {
      scenarios.push('story-based', 'real-world', 'problem-solving');
    }
    
    scenarios.push('interactive', 'visual', 'hands-on', 'collaborative');
    
    return scenarios;
  }

  private determineCognitiveLevel(topic: CurriculumTopic): 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create' {
    const description = topic.description.toLowerCase();
    
    if (description.includes('apply') || description.includes('solve')) {
      return 'apply';
    }
    
    if (description.includes('analyze') || description.includes('compare')) {
      return 'analyze';
    }
    
    if (description.includes('explain') || description.includes('interpret')) {
      return 'understand';
    }
    
    return 'understand'; // Default for most elementary math topics
  }

  private generateAssessmentStrategies(topic: CurriculumTopic): string[] {
    return [
      'Multiple choice questions',
      'Problem-solving scenarios',
      'Visual representation tasks',
      'Real-world application projects',
      'Peer explanation activities'
    ];
  }

  // Public API methods
  getCurriculumByGrade(grade: number | string): CurriculumLevel | undefined {
    return completeStudyPugCurriculum.find(level => level.grade === grade);
  }

  getTopicsForGrade(grade: number | string): CurriculumTopic[] {
    const curriculum = this.getCurriculumByGrade(grade);
    if (!curriculum || !curriculum.subjects) return [];

    return curriculum.subjects.flatMap(subject => subject.topics);
  }

  getEnhancedTopic(topicId: string): EnhancedCurriculumTopic | undefined {
    return this.curriculumCache.get(topicId);
  }

  searchTopics(keyword: string, grade?: number | string): CurriculumTopic[] {
    const searchTerm = keyword.toLowerCase();
    let topics: CurriculumTopic[] = [];

    if (grade) {
      topics = this.getTopicsForGrade(grade);
    } else {
      topics = completeStudyPugCurriculum.flatMap(level => 
        level.subjects?.flatMap(subject => subject.topics) || []
      );
    }

    return topics.filter(topic => 
      topic.name.toLowerCase().includes(searchTerm) ||
      topic.description.toLowerCase().includes(searchTerm) ||
      topic.standards.some(standard => standard.toLowerCase().includes(searchTerm))
    );
  }

  getPrerequisiteTopics(topicId: string): CurriculumTopic[] {
    const cached = this.topicRelationsCache.get(`prereq_${topicId}`);
    if (cached) return cached;

    const allTopics = completeStudyPugCurriculum.flatMap(level => 
      level.subjects?.flatMap(subject => subject.topics) || []
    );

    const topic = allTopics.find(t => t.id === topicId);
    if (!topic) return [];

    const prerequisites = allTopics.filter(t => topic.prerequisites.includes(t.id));
    this.topicRelationsCache.set(`prereq_${topicId}`, prerequisites);
    
    return prerequisites;
  }

  getNextTopics(topicId: string): CurriculumTopic[] {
    const cached = this.topicRelationsCache.get(`next_${topicId}`);
    if (cached) return cached;

    const allTopics = completeStudyPugCurriculum.flatMap(level => 
      level.subjects?.flatMap(subject => subject.topics) || []
    );

    const nextTopics = allTopics.filter(t => t.prerequisites.includes(topicId));
    this.topicRelationsCache.set(`next_${topicId}`, nextTopics);
    
    return nextTopics;
  }

  generateAIPromptContext(topicId: string): string {
    const topic = this.getEnhancedTopic(topicId);
    if (!topic) return '';

    const prerequisites = this.getPrerequisiteTopics(topicId);
    const nextTopics = this.getNextTopics(topicId);

    return `
📚 CURRICULUM CONTEXT:
- Topic: ${topic.name}
- Description: ${topic.description}
- Difficulty Level: ${topic.difficulty}/10
- Estimated Time: ${topic.estimatedTime} minutes
- Standards: ${topic.standards.join(', ')}

🔗 LEARNING PROGRESSION:
- Prerequisites: ${prerequisites.map(p => p.name).join(', ') || 'None'}
- Next Topics: ${nextTopics.map(n => n.name).join(', ') || 'None'}

🌍 REAL-WORLD APPLICATIONS:
${topic.realWorldApplications.map(app => `- ${app}`).join('\n')}

🔄 CROSS-SUBJECT CONNECTIONS:
${topic.crossSubjectConnections.join(', ')}

🎯 COGNITIVE LEVEL: ${topic.cognitiveLevel}

🎲 SCENARIO TYPES: ${topic.scenarioTypes.join(', ')}

📊 ASSESSMENT STRATEGIES:
${topic.assessmentStrategies.map(strategy => `- ${strategy}`).join('\n')}
    `.trim();
  }

  getFullCurriculumQuery(topicId: string): CurriculumQueryResult | null {
    const topic = this.getEnhancedTopic(topicId);
    if (!topic) return null;

    return {
      topic,
      prerequisites: this.getPrerequisiteTopics(topicId),
      relatedTopics: this.searchTopics(topic.name.split(' ')[0]),
      nextTopics: this.getNextTopics(topicId),
      aiPromptContext: this.generateAIPromptContext(topicId)
    };
  }

  // KC ID mapping for existing system compatibility
  mapKcIdToCurriculumId(kcId: string): string | null {
    // Extract grade and standard from KC ID
    // Example: "kc_math_g3_oa_1" -> "3-oa-1"
    const parts = kcId.toLowerCase().split('_');
    
    if (parts.length < 5) return null;
    
    const gradeStr = parts[2]?.replace('g', '');
    const domain = parts[3];
    const standardNum = parts[4];
    
    if (!gradeStr || !domain || !standardNum) return null;
    
    return `${gradeStr}-${domain}-${standardNum}`;
  }

  getCurriculumTopicByKcId(kcId: string): CurriculumQueryResult | null {
    const curriculumId = this.mapKcIdToCurriculumId(kcId);
    if (!curriculumId) return null;
    
    return this.getFullCurriculumQuery(curriculumId);
  }
}

export default new CurriculumIntegrationService();
