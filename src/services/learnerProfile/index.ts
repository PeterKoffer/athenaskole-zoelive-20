
// Fixed exports for learner profile services

export { default as learnerProfileService } from './LearnerProfileService';
export { mockProfileService as mockLearnerProfileService, MOCK_USER_ID, MockProfileService } from './MockProfileService';
export { default as supabaseProfileService, SupabaseProfileService } from './SupabaseProfileService';
export { ProfileRecommendationService } from './ProfileRecommendationService';
export { userIdService } from './UserIdService';

// Create a default profileRecommendationService instance
export const profileRecommendationService = new ProfileRecommendationService();
