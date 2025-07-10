
// Fixed exports for learner profile services

export { default as learnerProfileService } from './LearnerProfileService';
export { mockProfileService as mockLearnerProfileService, MOCK_USER_ID, MockLearnerProfileService } from './MockLearnerProfileService';
export { default as supabaseProfileService, SupabaseProfileService } from './SupabaseProfileService';
export { ProfileRecommendationService, profileRecommendationService } from './ProfileRecommendationService';
export { userIdService } from './UserIdService';

// Repository exports
export { SupabaseProfileRepository } from './repositories/SupabaseProfileRepository';
export { SupabaseKCMasteryRepository } from './repositories/SupabaseKCMasteryRepository';
export { ProfileDataTransformers } from './utils/profileDataTransformers';
