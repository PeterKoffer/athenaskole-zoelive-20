import { CurriculumNode } from '@/types/curriculum/index';

// Mock curriculum data for testing and development
export const mockCurriculumData: CurriculumNode[] = [
  // USA - Root country node
  {
    id: 'us',
    parentId: null,
    nodeType: 'country',
    name: 'United States',
    description: 'K-12 Education System in the United States',
    countryCode: 'US',
    languageCode: 'en'
  },
  
  // Grade levels in the US
  {
    id: 'us-k',
    parentId: 'us',
    nodeType: 'grade_level',
    name: 'Kindergarten',
    description: 'Kindergarten level education',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K'
  },
  {
    id: 'us-g1',
    parentId: 'us',
    nodeType: 'grade_level',
    name: 'Grade 1',
    description: 'First grade education',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1'
  },
  {
    id: 'us-g6',
    parentId: 'us',
    nodeType: 'grade_level',
    name: 'Grade 6',
    description: 'Sixth grade education',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6'
  },

  // Mathematics subject for different grades
  {
    id: 'us-k-math',
    parentId: 'us-k',
    nodeType: 'subject',
    name: 'Mathematics',
    description: 'Kindergarten Mathematics',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    tags: ['foundational', 'number-sense']
  },
  {
    id: 'us-g1-math',
    parentId: 'us-g1',
    nodeType: 'subject',
    name: 'Mathematics',
    description: 'Grade 1 Mathematics',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'Mathematics',
    tags: ['foundational', 'addition', 'subtraction']
  },
  {
    id: 'us-g6-math',
    parentId: 'us-g6',
    nodeType: 'subject',
    name: 'Mathematics',
    description: 'Grade 6 Mathematics',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'Mathematics',
    tags: ['ratios', 'algebra-readiness']
  },

  // Ratios and Proportional Relationships domain for Grade 6
  {
    id: 'us-g6-math-rp',
    parentId: 'us-g6-math',
    nodeType: 'domain',
    name: 'Ratios and Proportional Relationships',
    description: 'Understand ratio concepts and use ratio reasoning to solve problems',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'Mathematics',
    sourceIdentifier: '6.RP',
    tags: ['ratios', 'proportions']
  },

  // Topics within Ratios and Proportional Relationships
  {
    id: 'us-g6-math-rp-1',
    parentId: 'us-g6-math-rp',
    nodeType: 'topic',
    name: 'Understanding Ratios',
    description: 'Understand the concept of a ratio and use ratio language',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'Mathematics',
    sourceIdentifier: '6.RP.A.1',
    estimatedDuration: 45,
    tags: ['ratios', 'conceptual']
  },

  // Learning objectives within Understanding Ratios
  {
    id: 'us-g6-math-rp-1-obj1',
    parentId: 'us-g6-math-rp-1',
    nodeType: 'learning_objective',
    name: 'Describe ratio relationships',
    description: 'Understand the concept of a ratio and use ratio language to describe a ratio relationship between two quantities',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'Mathematics',
    sourceIdentifier: '6.RP.A.1',
    estimatedDuration: 25,
    assessmentTypes: ['formative', 'summative'],
    preferredTeachingMethods: ['hands_on', 'discussion']
  },

  // Knowledge Components for the learning objective
  {
    id: 'us-g6-math-rp-1-obj1-kc1',
    parentId: 'us-g6-math-rp-1-obj1',
    nodeType: 'kc',
    name: 'Define ratio',
    description: 'Define what a ratio is and identify ratio relationships',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'Mathematics',
    estimatedDuration: 10,
    assessmentTypes: ['formative'],
    tags: ['definition', 'vocabulary']
  },
  {
    id: 'us-g6-math-rp-1-obj1-kc2',
    parentId: 'us-g6-math-rp-1-obj1',
    nodeType: 'kc',
    name: 'Use ratio language',
    description: 'Use appropriate language to describe ratio relationships',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'Mathematics',
    estimatedDuration: 15,
    assessmentTypes: ['formative', 'peer'],
    prerequisites: ['us-g6-math-rp-1-obj1-kc1'],
    tags: ['communication', 'application']
  },

  // Other subjects for variety
  {
    id: 'us-g6-ela',
    parentId: 'us-g6',
    nodeType: 'subject',
    name: 'English Language Arts',
    description: 'Grade 6 English Language Arts',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'English Language Arts',
    subjectSpecific: {
      proficiencyLevel: 'intermediate',
      linguisticSkill: 'reading'
    }
  },

  // Science subject with enhanced metadata
  {
    id: 'us-g6-science',
    parentId: 'us-g6',
    nodeType: 'subject',
    name: 'Science',
    description: 'Grade 6 Science',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'Science',
    subjectSpecific: {
      labRequired: true,
      safetyConsiderations: ['eye_protection', 'chemical_handling'],
      experimentType: 'hypothesis_testing'
    }
  },

  // Denmark example for international support
  {
    id: 'dk',
    parentId: null,
    nodeType: 'country',
    name: 'Denmark',
    description: 'Danish Education System',
    countryCode: 'DK',
    languageCode: 'da'
  },
  {
    id: 'dk-g6',
    parentId: 'dk',
    nodeType: 'grade_level',
    name: '6. klasse',
    description: 'Sixth grade in Danish system',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6'
  },
  {
    id: 'dk-g6-math',
    parentId: 'dk-g6',
    nodeType: 'subject',
    name: 'Matematik',
    description: '6. klasse matematik',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6',
    subjectName: 'Mathematics'
  },

  // --- Enhancements for USA ELA (Grade 6) ---
  {
    id: 'us-g6-ela-rl',
    parentId: 'us-g6-ela', // Assumes 'us-g6-ela' subject node exists
    nodeType: 'domain',
    name: 'Reading: Literature',
    description: 'Key Ideas and Details in Literature for Grade 6.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'English Language Arts',
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.6',
    tags: ['literature', 'reading_comprehension', 'analysis']
  },
  {
    id: 'us-g6-ela-rl-1',
    parentId: 'us-g6-ela-rl',
    nodeType: 'learning_objective',
    name: 'Cite textual evidence to support analysis of what the text says explicitly as well as inferences drawn from the text.',
    description: 'Students will be able to accurately quote or paraphrase evidence from the text to support their understanding and interpretations.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'English Language Arts',
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.6.1',
    assessmentTypes: ['formative', 'summative', 'project'],
    preferredTeachingMethods: ['close_reading', 'text-based_discussion', 'modeling'],
    subjectSpecific: {
      linguisticSkill: 'reading',
      proficiencyLevel: 'native', // For US ELA context
    },
    tags: ['textual_evidence', 'inference', 'analysis']
  },
  {
    id: 'us-g6-ela-rl-1-kc1',
    parentId: 'us-g6-ela-rl-1',
    nodeType: 'kc',
    name: 'Identify explicit textual evidence',
    description: 'Skill of locating sentences or phrases in the text that directly state a piece of information.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'English Language Arts',
    estimatedDuration: 20, // minutes
    subjectSpecific: {
      linguisticSkill: 'reading',
      proficiencyLevel: 'native',
    }
  },
  {
    id: 'us-g6-ela-rl-1-kc2',
    parentId: 'us-g6-ela-rl-1',
    nodeType: 'kc',
    name: 'Draw inferences from textual details',
    description: 'Skill of combining textual clues with background knowledge to make a logical conclusion not explicitly stated.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'English Language Arts',
    estimatedDuration: 30, // minutes
    subjectSpecific: {
      linguisticSkill: 'reading',
      proficiencyLevel: 'native',
    }
  },

  // --- Adding Danish Language Arts ("Dansk") for Denmark Grade 6 ---
  {
    id: 'dk-g6-dansk',
    parentId: 'dk-g6', // Assumes 'dk-g6' grade level node exists
    nodeType: 'subject',
    name: 'Dansk',
    description: '6. klasse Dansk (Danish Language Arts)',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6',
    subjectName: 'Danish Language Arts', // Standardized name
    tags: ['danish', 'native_language']
  },
  {
    id: 'dk-g6-dansk-laesning',
    parentId: 'dk-g6-dansk',
    nodeType: 'domain',
    name: 'Læsning (Reading)',
    description: 'Fokus på læsefærdigheder og tekstforståelse i 6. klasse.',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6',
    subjectName: 'Danish Language Arts',
    tags: ['læsning', 'reading_comprehension']
  },
  {
    id: 'dk-g6-dansk-laesning-obj1',
    parentId: 'dk-g6-dansk-laesning',
    nodeType: 'learning_objective',
    name: 'Eleven kan sammenfatte hovedindholdet af en tekst (The student can summarize the main content of a text).',
    description: 'Fælles Mål, Dansk, Læsning, Kompetenceområde: Tekstforståelse, efter 6. kl.',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6',
    subjectName: 'Danish Language Arts',
    sourceIdentifier: 'FM-DA-LAE-6-TEKSTFORSTAAELSE-1', // Example Fælles Mål identifier
    subjectSpecific: {
      linguisticSkill: 'reading',
      proficiencyLevel: 'native', // For Danish in Denmark
    },
    tags: ['summarize', 'hovedindhold', 'tekstforståelse']
  },

  // --- Adding English as a Foreign Language for Denmark Grade 6 ---
  {
    id: 'dk-g6-engelsk',
    parentId: 'dk-g6', // Assumes 'dk-g6' grade level node exists
    nodeType: 'subject',
    name: 'Engelsk',
    description: '6. klasse Engelsk (English as a Foreign Language)',
    countryCode: 'DK',
    languageCode: 'da', // The curriculum itself is likely in Danish
    educationalLevel: '6',
    subjectName: 'English as a Foreign Language', // Standardized name
    tags: ['english', 'foreign_language', 'efl']
  },
  {
    id: 'dk-g6-engelsk-mundtlig',
    parentId: 'dk-g6-engelsk',
    nodeType: 'domain',
    name: 'Mundtlig kommunikation (Oral Communication)',
    description: 'Fokus på mundtlige engelskfærdigheder i 6. klasse.',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6',
    subjectName: 'English as a Foreign Language',
    tags: ['speaking', 'listening', 'oral_communication']
  },
  {
    id: 'dk-g6-engelsk-mundtlig-obj1',
    parentId: 'dk-g6-engelsk-mundtlig',
    nodeType: 'learning_objective',
    name: 'Eleven kan deltage i enkle, forberedte samtaler om nære emner (The student can participate in simple, prepared conversations about familiar topics).',
    description: 'Fælles Mål, Engelsk, Mundtlig Kommunikation, Kompetenceområde: Samtale, efter 6. kl.',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6',
    subjectName: 'English as a Foreign Language',
    sourceIdentifier: 'FM-EN-MUN-6-SAMTALE-1', // Example Fælles Mål identifier
    subjectSpecific: {
      targetLanguage: 'en',
      linguisticSkill: 'speaking',
      proficiencyLevel: 'beginner', // Or A1/A2 level for CEFR if applicable
    },
    tags: ['conversation', 'dialogue', 'familiar_topics']
  },

  // --- US ELA - Kindergarten ---
  // Subject node for Kindergarten ELA (child of 'us-k')
  {
    id: 'us-k-ela',
    parentId: 'us-k',
    nodeType: 'subject',
    name: 'English Language Arts - Kindergarten',
    description: 'Kindergarten English Language Arts based on Common Core State Standards.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts', // Standardized human-readable name
    tags: ['ela', 'kindergarten', 'common_core']
  },

  // US ELA - Kindergarten - Reading: Literature (RL) Strand
  {
    id: 'us-k-ela-rl',
    parentId: 'us-k-ela',
    nodeType: 'domain',
    name: 'Reading: Literature (RL)',
    description: 'Kindergarten standards for reading literature.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.K' // Strand identifier
  },
  // Standard RL.K.1
  {
    id: 'us-k-ela-rl-1',
    parentId: 'us-k-ela-rl',
    nodeType: 'learning_objective',
    name: 'With prompting and support, ask and answer questions about key details in a text.',
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.K.1',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
    subjectSpecific: { linguisticSkill: 'reading', proficiencyLevel: 'native' },
    tags: ['questions', 'key_details', 'prompting_support', 'RL.K.1']
  },
  {
    id: 'us-k-ela-rl-1-kc1',
    parentId: 'us-k-ela-rl-1',
    nodeType: 'kc',
    name: 'Ask questions about key details in a text (with prompting/support)',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
  },
  {
    id: 'us-k-ela-rl-1-kc2',
    parentId: 'us-k-ela-rl-1',
    nodeType: 'kc',
    name: 'Answer questions about key details in a text (with prompting/support)',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
  },
  // Standard RL.K.3
  {
    id: 'us-k-ela-rl-3',
    parentId: 'us-k-ela-rl',
    nodeType: 'learning_objective',
    name: 'With prompting and support, identify characters, settings, and major events in a story.',
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.K.3',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
    subjectSpecific: { linguisticSkill: 'reading', proficiencyLevel: 'native' },
    tags: ['characters', 'settings', 'major_events', 'RL.K.3']
  },
  {
    id: 'us-k-ela-rl-3-kc1',
    parentId: 'us-k-ela-rl-3',
    nodeType: 'kc',
    name: 'Identify characters in a story (with prompting/support)',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
  },

  // US ELA - Kindergarten - Reading: Foundational Skills (RF) Strand
  {
    id: 'us-k-ela-rf',
    parentId: 'us-k-ela',
    nodeType: 'domain',
    name: 'Reading: Foundational Skills (RF)',
    description: 'Kindergarten standards for foundational reading skills.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
    sourceIdentifier: 'CCSS.ELA-Literacy.RF.K' // Strand identifier
  },
  // Standard RF.K.1d
  {
    id: 'us-k-ela-rf-1d',
    parentId: 'us-k-ela-rf',
    nodeType: 'learning_objective',
    name: 'Recognize and name all upper- and lowercase letters of the alphabet.',
    sourceIdentifier: 'CCSS.ELA-Literacy.RF.K.1d',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
    subjectSpecific: { linguisticSkill: 'reading', proficiencyLevel: 'native' },
    tags: ['alphabet', 'letter_recognition', 'RF.K.1d']
  },
  {
    id: 'us-k-ela-rf-1d-kc1',
    parentId: 'us-k-ela-rf-1d',
    nodeType: 'kc',
    name: 'Recognize uppercase letters',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
  },
  {
    id: 'us-k-ela-rf-1d-kc2',
    parentId: 'us-k-ela-rf-1d',
    nodeType: 'kc',
    name: 'Name lowercase letters',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
  },


  // US ELA - Kindergarten - Writing (W) Strand
  {
    id: 'us-k-ela-w',
    parentId: 'us-k-ela',
    nodeType: 'domain',
    name: 'Writing (W)',
    description: 'Kindergarten standards for writing.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
    sourceIdentifier: 'CCSS.ELA-Literacy.W.K' // Strand identifier
  },
  // Standard W.K.1
  {
    id: 'us-k-ela-w-1',
    parentId: 'us-k-ela-w',
    nodeType: 'learning_objective',
    name: 'Use a combination of drawing, dictating, and writing to compose opinion pieces in which they tell a reader the topic or the name of the book they are writing about and state an opinion or preference about the topic or book.',
    sourceIdentifier: 'CCSS.ELA-Literacy.W.K.1',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
    subjectSpecific: { linguisticSkill: 'writing', proficiencyLevel: 'native' },
    tags: ['opinion_writing', 'drawing', 'dictating', 'W.K.1']
  },
  {
    id: 'us-k-ela-w-1-kc1',
    parentId: 'us-k-ela-w-1',
    nodeType: 'kc',
    name: 'State an opinion or preference about a topic or book',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
  },

  // --- US ELA - Grade 1 ---
  // Subject node for Grade 1 ELA (child of 'us-g1')
  {
    id: 'us-g1-ela',
    parentId: 'us-g1',
    nodeType: 'subject',
    name: 'English Language Arts - Grade 1',
    description: 'Grade 1 English Language Arts based on Common Core State Standards.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
    tags: ['ela', 'grade1', 'common_core']
  },

  // US ELA - Grade 1 - Reading: Literature (RL) Strand
  {
    id: 'us-g1-ela-rl',
    parentId: 'us-g1-ela',
    nodeType: 'domain',
    name: 'Reading: Literature (RL)',
    description: 'Grade 1 standards for reading literature.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.1' // Strand identifier
  },
  // Standard RL.1.1
  {
    id: 'us-g1-ela-rl-1',
    parentId: 'us-g1-ela-rl',
    nodeType: 'learning_objective',
    name: 'Ask and answer questions about key details in a text.',
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.1.1',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
    subjectSpecific: { linguisticSkill: 'reading', proficiencyLevel: 'native' },
    tags: ['questions', 'key_details', 'RL.1.1']
  },
  {
    id: 'us-g1-ela-rl-1-kc1',
    parentId: 'us-g1-ela-rl-1',
    nodeType: 'kc',
    name: 'Ask questions about key details in a Grade 1 level text',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
  },
  // Standard RL.1.2
  {
    id: 'us-g1-ela-rl-2',
    parentId: 'us-g1-ela-rl',
    nodeType: 'learning_objective',
    name: 'Retell stories, including key details, and demonstrate understanding of their central message or lesson.',
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.1.2',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
    subjectSpecific: { linguisticSkill: 'reading', proficiencyLevel: 'native' },
    tags: ['retelling_stories', 'central_message', 'lesson', 'RL.1.2']
  },
  {
    id: 'us-g1-ela-rl-2-kc1',
    parentId: 'us-g1-ela-rl-2',
    nodeType: 'kc',
    name: 'Retell a story including key details',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
  },
  {
    id: 'us-g1-ela-rl-2-kc2',
    parentId: 'us-g1-ela-rl-2',
    nodeType: 'kc',
    name: 'Identify the central message or lesson of a story',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
  },

  // US ELA - Grade 1 - Reading: Foundational Skills (RF) Strand
  {
    id: 'us-g1-ela-rf',
    parentId: 'us-g1-ela',
    nodeType: 'domain',
    name: 'Reading: Foundational Skills (RF)',
    description: 'Grade 1 standards for foundational reading skills.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
    sourceIdentifier: 'CCSS.ELA-Literacy.RF.1' // Strand identifier
  },
  // Standard RF.1.2b
  {
    id: 'us-g1-ela-rf-2b',
    parentId: 'us-g1-ela-rf',
    nodeType: 'learning_objective',
    name: 'Orally produce single-syllable words by blending sounds (phonemes), including consonant blends.',
    sourceIdentifier: 'CCSS.ELA-Literacy.RF.1.2b',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
    subjectSpecific: { linguisticSkill: 'reading', proficiencyLevel: 'native' },
    tags: ['phonological_awareness', 'blending_sounds', 'phonemes', 'RF.1.2b']
  },

  // US ELA - Grade 1 - Writing (W) Strand
  {
    id: 'us-g1-ela-w',
    parentId: 'us-g1-ela',
    nodeType: 'domain',
    name: 'Writing (W)',
    description: 'Grade 1 standards for writing.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
    sourceIdentifier: 'CCSS.ELA-Literacy.W.1' // Strand identifier
  },
  // Standard W.1.2
  {
    id: 'us-g1-ela-w-2',
    parentId: 'us-g1-ela-w',
    nodeType: 'learning_objective',
    name: 'Write informative/explanatory texts in which they name a topic, supply some facts about the topic, and provide some sense of closure.',
    sourceIdentifier: 'CCSS.ELA-Literacy.W.1.2',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
    subjectSpecific: { linguisticSkill: 'writing', proficiencyLevel: 'native' },
    tags: ['informative_writing', 'explanatory_writing', 'facts', 'closure', 'W.1.2']
  },
  {
    id: 'us-g1-ela-w-2-kc1',
    parentId: 'us-g1-ela-w-2',
    nodeType: 'kc',
    name: 'Name a topic for an informative text',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
  },

  // --- US Grade 2 (if not already present) ---
  {
    id: 'us-g2',
    parentId: 'us',
    nodeType: 'grade_level',
    name: 'Grade 2',
    description: 'Second grade education',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2'
  },

  // --- US ELA - Grade 2 ---
  // Subject node for Grade 2 ELA (child of 'us-g2')
  {
    id: 'us-g2-ela',
    parentId: 'us-g2',
    nodeType: 'subject',
    name: 'English Language Arts - Grade 2',
    description: 'Grade 2 English Language Arts based on Common Core State Standards.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
    tags: ['ela', 'grade2', 'common_core']
  },

  // US ELA - Grade 2 - Reading: Literature (RL) Strand
  {
    id: 'us-g2-ela-rl',
    parentId: 'us-g2-ela',
    nodeType: 'domain',
    name: 'Reading: Literature (RL)',
    description: 'Grade 2 standards for reading literature.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.2' // Strand identifier
  },
  // Standard RL.2.1
  {
    id: 'us-g2-ela-rl-1',
    parentId: 'us-g2-ela-rl',
    nodeType: 'learning_objective',
    name: 'Ask and answer such questions as who, what, where, when, why, and how to demonstrate understanding of key details in a text.',
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.2.1',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
    subjectSpecific: { linguisticSkill: 'reading', proficiencyLevel: 'native' },
    tags: ['5W_H_questions', 'key_details', 'text_comprehension', 'RL.2.1']
  },
  {
    id: 'us-g2-ela-rl-1-kc1',
    parentId: 'us-g2-ela-rl-1',
    nodeType: 'kc',
    name: 'Ask "who" questions about a text',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
  },
  {
    id: 'us-g2-ela-rl-1-kc2',
    parentId: 'us-g2-ela-rl-1',
    nodeType: 'kc',
    name: 'Answer "why" questions about a text using key details',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
  },

  // US ELA - Grade 2 - Reading: Foundational Skills (RF) Strand
  {
    id: 'us-g2-ela-rf',
    parentId: 'us-g2-ela',
    nodeType: 'domain',
    name: 'Reading: Foundational Skills (RF)',
    description: 'Grade 2 standards for foundational reading skills.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
    sourceIdentifier: 'CCSS.ELA-Literacy.RF.2' // Strand identifier
  },
  // Standard RF.2.3b
  {
    id: 'us-g2-ela-rf-3b',
    parentId: 'us-g2-ela-rf',
    nodeType: 'learning_objective',
    name: 'Know spelling-sound correspondences for additional common vowel teams.',
    sourceIdentifier: 'CCSS.ELA-Literacy.RF.2.3b',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
    subjectSpecific: { linguisticSkill: 'reading', proficiencyLevel: 'native' },
    tags: ['phonics', 'vowel_teams', 'spelling_sound', 'RF.2.3b']
  },

  // US ELA - Grade 2 - Writing (W) Strand
  {
    id: 'us-g2-ela-w',
    parentId: 'us-g2-ela',
    nodeType: 'domain',
    name: 'Writing (W)',
    description: 'Grade 2 standards for writing.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
    sourceIdentifier: 'CCSS.ELA-Literacy.W.2' // Strand identifier
  },
  // Standard W.2.3
  {
    id: 'us-g2-ela-w-3',
    parentId: 'us-g2-ela-w',
    nodeType: 'learning_objective',
    name: 'Write narratives in which they recount a well-elaborated event or short sequence of events, include details to describe actions, thoughts, and feelings, use temporal words to signal event order, and provide a sense of closure.',
    sourceIdentifier: 'CCSS.ELA-Literacy.W.2.3',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
    subjectSpecific: { linguisticSkill: 'writing', proficiencyLevel: 'native' },
    tags: ['narrative_writing', 'sequence_of_events', 'temporal_words', 'closure', 'W.2.3']
  },
  {
    id: 'us-g2-ela-w-3-kc1',
    parentId: 'us-g2-ela-w-3',
    nodeType: 'kc',
    name: 'Use temporal words to signal event order in a narrative',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subject: import('../types/curriculum/NELIESubjects').NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
  }
];
