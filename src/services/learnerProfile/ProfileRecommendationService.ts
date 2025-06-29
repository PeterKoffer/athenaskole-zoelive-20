
// src/services/learnerProfile/ProfileRecommendationService.ts

import { LearnerProfile } from '@/types/learnerProfile';
import { KnowledgeComponent } from '@/types/knowledgeComponent';
import { knowledgeComponentService } from '@/services/knowledgeComponentService';

export class ProfileRecommendationService {
  async recommendNextKcs(profile: LearnerProfile, count: number = 3): Promise<KnowledgeComponent[]> {
    const allKcs = await knowledgeComponentService.getAllKcs(); 
    
    const potentialKcs = allKcs.filter(kc => {
      const mastery = profile.kcMasteryMap[kc.id];
      if (!mastery) return true; 
      return mastery.masteryLevel < 0.8; 
    });

    potentialKcs.sort((a, b) => {
      const masteryA = profile.kcMasteryMap[a.id]?.masteryLevel || 0;
      const masteryB = profile.kcMasteryMap[b.id]?.masteryLevel || 0;
      const attemptsA = profile.kcMasteryMap[a.id]?.attempts || 0;
      const attemptsB = profile.kcMasteryMap[b.id]?.attempts || 0;

      if (attemptsA > 0 && masteryA < 0.8 && (attemptsB === 0 || masteryB >= 0.8)) return -1;
      if (attemptsB > 0 && masteryB < 0.8 && (attemptsA === 0 || masteryA >= 0.8)) return 1;
      
      return (a.difficultyEstimate || 0) - (b.difficultyEstimate || 0);
    });

    console.log(`ProfileRecommendationService: Recommended next KCs:`, potentialKcs.slice(0, count).map(kc=>kc.id));
    return potentialKcs.slice(0, count);
  }
}

export const profileRecommendationService = new ProfileRecommendationService();
