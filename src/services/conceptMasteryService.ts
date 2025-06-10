
export interface ConceptMastery {
  conceptName: string;
  masteryLevel: number;
  practiceCount: number;
  lastPractice: string;
}

export class ConceptMasteryService {
  static async getConceptMastery(userId: string, subject?: string): Promise<ConceptMastery[]> {
    console.log('Getting concept mastery for user:', userId, 'subject:', subject);
    
    // Mock implementation
    return [
      {
        conceptName: 'addition',
        masteryLevel: 0.8,
        practiceCount: 15,
        lastPractice: new Date().toISOString()
      },
      {
        conceptName: 'subtraction', 
        masteryLevel: 0.6,
        practiceCount: 10,
        lastPractice: new Date().toISOString()
      }
    ];
  }

  static async updateConceptMastery(
    userId: string,
    conceptName: string,
    subject: string,
    isCorrect: boolean
  ): Promise<void> {
    console.log('Updating concept mastery:', { userId, conceptName, subject, isCorrect });
    // Implementation will be added when needed
  }

  static async getWeakConcepts(userId: string, subject: string, threshold: number = 0.6): Promise<ConceptMastery[]> {
    console.log('Getting weak concepts for user:', userId, 'subject:', subject, 'threshold:', threshold);
    
    const allConcepts = await this.getConceptMastery(userId, subject);
    return allConcepts.filter(concept => concept.masteryLevel < threshold);
  }

  static async getConceptsNeedingReview(userId: string, subject: string, daysSinceLastPractice: number = 7): Promise<ConceptMastery[]> {
    console.log('Getting concepts needing review for user:', userId, 'subject:', subject, 'days:', daysSinceLastPractice);
    
    const allConcepts = await this.getConceptMastery(userId, subject);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysSinceLastPractice);
    
    return allConcepts.filter(concept => {
      const lastPracticeDate = new Date(concept.lastPractice);
      return lastPracticeDate < cutoffDate;
    });
  }

  // Instance methods that delegate to static methods for backward compatibility
  async getConceptMastery(userId: string, subject?: string): Promise<ConceptMastery[]> {
    return ConceptMasteryService.getConceptMastery(userId, subject);
  }

  async updateConceptMastery(
    userId: string,
    conceptName: string,
    subject: string,
    isCorrect: boolean
  ): Promise<void> {
    return ConceptMasteryService.updateConceptMastery(userId, conceptName, subject, isCorrect);
  }

  async getWeakConcepts(userId: string, subject: string, threshold: number = 0.6): Promise<ConceptMastery[]> {
    return ConceptMasteryService.getWeakConcepts(userId, subject, threshold);
  }

  async getConceptsNeedingReview(userId: string, subject: string, daysSinceLastPractice: number = 7): Promise<ConceptMastery[]> {
    return ConceptMasteryService.getConceptsNeedingReview(userId, subject, daysSinceLastPractice);
  }
}

export const conceptMasteryService = new ConceptMasteryService();
