
export interface ConceptMastery {
  conceptName: string;
  masteryLevel: number;
  lastPracticed: string;
}

export class ConceptMasteryService {
  async getConceptMastery(userId: string, subject: string): Promise<ConceptMastery[]> {
    // Mock implementation
    return [
      {
        conceptName: 'Basic Addition',
        masteryLevel: 0.9,
        lastPracticed: new Date().toISOString()
      },
      {
        conceptName: 'Multiplication',
        masteryLevel: 0.7,
        lastPracticed: new Date().toISOString()
      }
    ];
  }

  async updateConceptMastery(userId: string, concept: string, subject: string, isCorrect: boolean): Promise<void> {
    // Mock implementation
    console.log('Updating concept mastery:', { userId, concept, subject, isCorrect });
  }

  async getWeakConcepts(userId: string, subject: string): Promise<ConceptMastery[]> {
    // Mock implementation - return concepts with low mastery
    const allConcepts = await this.getConceptMastery(userId, subject);
    return allConcepts.filter(concept => concept.masteryLevel < 0.5);
  }

  async getConceptsNeedingReview(userId: string, subject: string): Promise<ConceptMastery[]> {
    // Mock implementation - return concepts that haven't been practiced recently
    const allConcepts = await this.getConceptMastery(userId, subject);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    return allConcepts.filter(concept => 
      new Date(concept.lastPracticed) < threeDaysAgo
    );
  }
}

export const conceptMasteryService = new ConceptMasteryService();
