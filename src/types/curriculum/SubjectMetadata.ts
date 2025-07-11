
/**
 * Subject-specific metadata that can be attached to curriculum nodes
 * to provide additional context for different academic disciplines.
 */
export interface SubjectSpecificMetadata {
  // Language Arts specific
  linguisticSkill?: 'reading' | 'writing' | 'speaking' | 'listening';
  literatureGenre?: 'fiction' | 'non_fiction' | 'poetry' | 'drama';
  writingType?: 'narrative' | 'expository' | 'persuasive' | 'descriptive';
  textType?: 'informational' | 'literary' | 'technical' | 'academic';
  readingLevel?: 'below_grade' | 'at_grade' | 'above_grade';
  
  // Mathematics specific
  mathDomain?: 'arithmetic' | 'algebra' | 'geometry' | 'statistics' | 'calculus';
  problemType?: 'word_problem' | 'computation' | 'proof' | 'application';
  mathematicalPractice?: 'problem_solving' | 'reasoning' | 'modeling' | 'representation';
  
  // Science specific
  scienceDiscipline?: 'physics' | 'chemistry' | 'biology' | 'earth_science';
  inquiryType?: 'observation' | 'experiment' | 'investigation' | 'research';
  scientificPractice?: 'asking_questions' | 'developing_models' | 'planning_investigations' | 'analyzing_data';
  
  // Social Studies specific
  historicalPeriod?: 'ancient' | 'medieval' | 'modern' | 'contemporary';
  geographicRegion?: 'local' | 'national' | 'global';
  civicsConcept?: 'government' | 'citizenship' | 'economics' | 'law';
  
  // General interaction and engagement
  interactionType?: 'individual' | 'collaborative' | 'peer_review' | 'discussion';
  cognitiveLevel?: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  
  // Technology integration
  technologyRequired?: boolean;
  digitalTools?: string[];
  
  // Differentiation support
  multipleIntelligences?: ('linguistic' | 'logical' | 'spatial' | 'bodily' | 'musical' | 'interpersonal' | 'intrapersonal' | 'naturalistic')[];
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading_writing';
}
