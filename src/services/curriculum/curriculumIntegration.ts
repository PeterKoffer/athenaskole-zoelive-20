
import { completeStudyPugCurriculum, CurriculumLevel, CurriculumSubject, CurriculumTopic } from './studyPugCurriculum';

export class CurriculumIntegrationService {
  // Get curriculum by grade level
  static getCurriculumByGrade(grade: number | string): CurriculumLevel | undefined {
    return completeStudyPugCurriculum.find(level => level.grade === grade);
  }

  // Get all topics for a specific grade
  static getTopicsForGrade(grade: number | string): CurriculumTopic[] {
    const curriculum = this.getCurriculumByGrade(grade);
    if (!curriculum || !curriculum.subjects) return [];

    return curriculum.subjects.flatMap(subject => subject.topics);
  }

  // Get topics by difficulty range
  static getTopicsByDifficulty(minDifficulty: number, maxDifficulty: number): CurriculumTopic[] {
    const allTopics = completeStudyPugCurriculum.flatMap(level => 
      level.subjects?.flatMap(subject => subject.topics) || []
    );

    return allTopics.filter(topic => 
      topic.difficulty >= minDifficulty && topic.difficulty <= maxDifficulty
    );
  }

  // Get prerequisite topics for a given topic
  static getPrerequisiteTopics(topicId: string): CurriculumTopic[] {
    const allTopics = completeStudyPugCurriculum.flatMap(level => 
      level.subjects?.flatMap(subject => subject.topics) || []
    );

    const topic = allTopics.find(t => t.id === topicId);
    if (!topic) return [];

    return allTopics.filter(t => topic.prerequisites.includes(t.id));
  }

  // Get next recommended topics based on completed topics
  static getNextRecommendedTopics(completedTopicIds: string[], grade: number | string): CurriculumTopic[] {
    const gradeTopics = this.getTopicsForGrade(grade);
    
    return gradeTopics.filter(topic => {
      // Check if all prerequisites are completed
      const prerequisitesMet = topic.prerequisites.every(prereq => 
        completedTopicIds.includes(prereq)
      );
      
      // Topic is not already completed
      const notCompleted = !completedTopicIds.includes(topic.id);
      
      return prerequisitesMet && notCompleted;
    }).sort((a, b) => a.difficulty - b.difficulty);
  }

  // Convert StudyPug topic to Knowledge Component format
  static convertToKnowledgeComponent(topic: CurriculumTopic, subject: CurriculumSubject, level: CurriculumLevel) {
    return {
      id: `kc_${topic.id}`,
      name: topic.name,
      description: topic.description,
      subject: 'Mathematics',
      domain: subject.name,
      grade_levels: Array.isArray(level.grade) ? [level.grade] : [typeof level.grade === 'string' ? 12 : level.grade],
      difficulty_estimate: topic.difficulty / 10, // Convert to 0-1 scale
      prerequisites: topic.prerequisites.map(p => `kc_${p}`),
      standards: topic.standards,
      estimated_time_minutes: topic.estimatedTime
    };
  }

  // Get curriculum progression path for a student
  static generateLearningPath(currentGrade: number | string, completedTopics: string[] = []): CurriculumTopic[] {
    const path: CurriculumTopic[] = [];
    
    // Start from kindergarten and work up to current grade
    const startGrade = typeof currentGrade === 'string' ? 0 : Math.max(0, currentGrade - 2);
    const endGrade = typeof currentGrade === 'string' ? 12 : currentGrade;
    
    for (let grade = startGrade; grade <= endGrade; grade++) {
      const nextTopics = this.getNextRecommendedTopics(
        [...completedTopics, ...path.map(t => t.id)], 
        grade
      );
      
      // Add up to 3 topics per grade level
      path.push(...nextTopics.slice(0, 3));
    }
    
    return path;
  }

  // Search topics by keyword
  static searchTopics(keyword: string): CurriculumTopic[] {
    const allTopics = completeStudyPugCurriculum.flatMap(level => 
      level.subjects?.flatMap(subject => subject.topics) || []
    );

    const searchTerm = keyword.toLowerCase();
    return allTopics.filter(topic => 
      topic.name.toLowerCase().includes(searchTerm) ||
      topic.description.toLowerCase().includes(searchTerm) ||
      topic.standards.some(standard => standard.toLowerCase().includes(searchTerm))
    );
  }

  // Get curriculum statistics
  static getCurriculumStats() {
    const totalLevels = completeStudyPugCurriculum.length;
    const totalSubjects = completeStudyPugCurriculum.reduce((sum, level) => 
      sum + (level.subjects?.length || 0), 0
    );
    const totalTopics = completeStudyPugCurriculum.reduce((sum, level) => 
      sum + (level.subjects?.reduce((subSum, subject) => 
        subSum + subject.topics.length, 0
      ) || 0), 0
    );

    return {
      totalLevels,
      totalSubjects,
      totalTopics,
      gradeRange: 'K-12',
      standards: 'Common Core State Standards'
    };
  }
}
