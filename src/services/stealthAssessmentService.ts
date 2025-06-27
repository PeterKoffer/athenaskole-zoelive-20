
// src/services/stealthAssessmentService.ts
// Legacy service file - now points to the refactored service for backward compatibility

import stealthAssessmentService from './stealthAssessment/StealthAssessmentService';

console.log('⚠️ DEPRECATION NOTICE: Using legacy stealthAssessmentService import. Please update to use the new modular service from ./stealthAssessment/');

// Re-export the refactored service for backward compatibility
export default stealthAssessmentService;
