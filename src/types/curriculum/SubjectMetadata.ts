
/**
 * Subject-specific metadata for enhanced curriculum indexing
 */
export interface SubjectSpecificMetadata {
  // Language-specific (for Other Languages, English)
  targetLanguage?: string; // ISO 639-1 code for the language being learned
  proficiencyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'native';
  linguisticSkill?: 'speaking' | 'listening' | 'reading' | 'writing' | 'grammar' | 'vocabulary';

  // Creative Arts & Music
  medium?: string; // "digital", "traditional", "mixed", "instrumental", "vocal"
  technique?: string; // "watercolor", "sculpture", "piano", "guitar", etc.
  artisticStyle?: string; // "classical", "contemporary", "folk", etc.

  // Physical Education / Body Lab
  activityType?: 'individual' | 'team' | 'fitness' | 'sport' | 'dance' | 'martial_arts';
  physicalRequirements?: string[]; // ["coordination", "strength", "endurance", "flexibility"]
  equipmentNeeded?: string[];

  // Mental Wellness
  wellnessArea?: 'emotional_regulation' | 'social_skills' | 'stress_management' | 'self_awareness' | 'mindfulness';
  sensitivityLevel?: 'low' | 'medium' | 'high'; // For age-appropriate content
  therapeuticApproach?: string; // "cognitive_behavioral", "mindfulness_based", etc.

  // Life Essentials
  lifeStage?: 'childhood' | 'adolescence' | 'young_adult' | 'adult' | 'general';
  practicalApplication?: 'financial_literacy' | 'health_nutrition' | 'relationships' | 'career_planning' | 'civic_responsibility';
  realWorldContext?: string; // Specific scenarios or contexts

  // Science-specific enhancements
  labRequired?: boolean;
  safetyConsiderations?: string[];
  experimentType?: 'observation' | 'hypothesis_testing' | 'demonstration' | 'field_study';

  // Computer Science
  programmingLanguage?: string;
  conceptualArea?: 'algorithms' | 'data_structures' | 'software_engineering' | 'cybersecurity' | 'ai_ml';
  practicalProject?: boolean;

  // History & Religion
  culturalContext?: string[];
  timesPeriod?: string; // "ancient", "medieval", "modern", "contemporary"
  geographicalScope?: 'local' | 'national' | 'regional' | 'global';
  religiousTradition?: string;

  // Geography
  geographicalScale?: 'local' | 'regional' | 'national' | 'continental' | 'global';
  geographicalType?: 'physical' | 'human' | 'environmental' | 'political' | 'economic';
}
