import { CurriculumNode } from '@/types/curriculum/index';
import { NELIESubject } from '../types/curriculum/NELIESubjects'; // Added import

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
    subject: NELIESubject.MATH, // Added subject enum
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
    subject: NELIESubject.MATH, // Added subject enum
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
    subject: NELIESubject.MATH, // Added subject enum
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
    },
    subject: NELIESubject.SCIENCE // Added subject enum
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
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
    subject: NELIESubject.ENGLISH,
    subjectName: 'English Language Arts',
  },

  // --- US Grade 3 (if not already present) ---
  {
    id: 'us-g3',
    parentId: 'us',
    nodeType: 'grade_level',
    name: 'Grade 3',
    description: 'Third grade education',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3'
  },

  // --- US Math - Grade 3 - From StudyPug Sample Transformation ---
  // Subject node for Grade 3 Math (child of 'us-g3')
  {
    id: 'us-g3-math',
    parentId: 'us-g3',
    nodeType: 'subject',
    name: 'Mathematics - Grade 3',
    description: 'Grade 3 Mathematics, incorporating StudyPug content.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    tags: ['math', 'grade3', 'studypug_based']
  },

  // Domain: Operations and Algebraic Thinking (from StudyPug)
  {
    id: 'us-g3-math-oa',
    parentId: 'us-g3-math',
    nodeType: 'domain',
    name: 'Operations and Algebraic Thinking',
    description: 'Represent and solve problems involving multiplication and division. (StudyPug Domain)',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    tags: ['algebraic_thinking', 'multiplication', 'division']
  },

  // Learning Objective: Interpret products of whole numbers (from StudyPug Topic "3-oa-1")
  {
    id: 'sp-us-g3-math-oa-1', // "sp" prefix for StudyPug-derived
    parentId: 'us-g3-math-oa',
    nodeType: 'learning_objective',
    name: 'Interpret products of whole numbers, e.g., interpret 5 × 7 as the total number of objects in 5 groups of 7 objects each.',
    description: 'Original StudyPug Topic Name: Interpret products of whole numbers. Full Description: Interpret products of whole numbers, e.g., interpret 5 × 7 as the total number of objects in 5 groups of 7 objects each. For example: 3 × 4 can be thought of as 3 groups of 4 objects, or 4 groups of 3 objects.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    sourceIdentifier: '3.OA.A.1', // From StudyPug standards array
    estimatedDuration: 40, // From StudyPug estimatedTime
    subjectSpecific: {
      // Assuming SubjectSpecificMetadata can hold custom fields
      // We might need to define a proper structure if these are common
      // For now, using it as a flexible record:
      customFields: {
        studypugId: "3-oa-1",
        studypugDifficulty: 4
      }
    },
    tags: ['multiplication', 'interpretation', 'products', 'studypug_transformed'],
    prerequisites: [] // StudyPug prerequisites was empty for this one
  },
  {
    id: 'sp-us-g3-math-oa-1-kc1',
    parentId: 'sp-us-g3-math-oa-1',
    nodeType: 'kc',
    name: 'Understand multiplication as repeated addition (e.g., 5 groups of 7)',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
  },
  {
    id: 'sp-us-g3-math-oa-1-kc2',
    parentId: 'sp-us-g3-math-oa-1',
    nodeType: 'kc',
    name: 'Represent multiplication using visual models (groups of objects)',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
  },

  // --- Continuing US Math - Grade 3 - From StudyPug Sample Transformation ---
  // Domain: Operations and Algebraic Thinking (already has sp-us-g3-math-oa-1)
  // Adding next topic: Interpret whole-number quotients (StudyPug Topic "3-oa-2")
  {
    id: 'sp-us-g3-math-oa-2',
    parentId: 'us-g3-math-oa', // Parent is "Operations and Algebraic Thinking" domain
    nodeType: 'learning_objective',
    name: 'Interpret whole-number quotients of whole numbers, e.g., interpret 56 ÷ 8 as the number of objects in each share when 56 objects are partitioned equally into 8 shares.',
    description: 'Original StudyPug Topic Name: Interpret whole-number quotients.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    sourceIdentifier: '3.OA.A.2',
    estimatedDuration: 45,
    subjectSpecific: { customFields: { studypugId: "3-oa-2", studypugDifficulty: 5 } },
    tags: ['division', 'quotients', 'interpretation', 'studypug_transformed'],
    prerequisites: ['sp-us-g3-math-oa-1'] // Mapped from StudyPug prerequisite "3-oa-1"
  },
  {
    id: 'sp-us-g3-math-oa-2-kc1',
    parentId: 'sp-us-g3-math-oa-2',
    nodeType: 'kc',
    name: 'Understand division as partitioning into equal shares',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
  },

  // Domain: Number and Operations - Fractions (from StudyPug for Grade 3)
  {
    id: 'us-g3-math-nf',
    parentId: 'us-g3-math', // Parent is Grade 3 Math subject
    nodeType: 'domain',
    name: 'Number and Operations - Fractions',
    description: 'Understanding fractions as numbers. (StudyPug Domain)',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    tags: ['fractions', 'number_operations']
  },
  // Learning Objective: Understand fractions as numbers (from StudyPug Topic "3-nf-1")
  {
    id: 'sp-us-g3-math-nf-1',
    parentId: 'us-g3-math-nf',
    nodeType: 'learning_objective',
    name: 'Understand a fraction 1/b as the quantity formed by 1 part when a whole is partitioned into b equal parts.',
    description: 'Original StudyPug Topic Name: Understand fractions as numbers.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    sourceIdentifier: '3.NF.A.1',
    estimatedDuration: 45,
    subjectSpecific: { customFields: { studypugId: "3-nf-1", studypugDifficulty: 4 } },
    tags: ['fractions', 'unit_fractions', 'partitioning', 'studypug_transformed'],
    prerequisites: []
  },
  {
    id: 'sp-us-g3-math-nf-1-kc1',
    parentId: 'sp-us-g3-math-nf-1',
    nodeType: 'kc',
    name: 'Define a unit fraction (1/b)',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
  },

  // --- US Grade 4 (New Grade Level Node) ---
  {
    id: 'us-g4',
    parentId: 'us',
    nodeType: 'grade_level',
    name: 'Grade 4',
    description: 'Fourth grade education',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4'
  },
  // Subject node for Grade 4 Math
  {
    id: 'us-g4-math',
    parentId: 'us-g4',
    nodeType: 'subject',
    name: 'Mathematics - Grade 4',
    description: 'Grade 4 Mathematics, incorporating StudyPug content.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    tags: ['math', 'grade4', 'studypug_based']
  },

  // Domain: Number and Operations - Fractions (Grade 4 - StudyPug)
  {
    id: 'us-g4-math-nf',
    parentId: 'us-g4-math',
    nodeType: 'domain',
    name: 'Number and Operations - Fractions',
    description: 'Extend understanding of fraction equivalence and ordering. (StudyPug Domain)',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
  },
  // LO: Fraction equivalence (StudyPug "4-nf-1")
  {
    id: 'sp-us-g4-math-nf-1',
    parentId: 'us-g4-math-nf',
    nodeType: 'learning_objective',
    name: 'Explain why a fraction a/b is equivalent to a fraction (n×a)/(n×b).',
    description: 'Original StudyPug Topic Name: Fraction equivalence.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    sourceIdentifier: '4.NF.A.1',
    estimatedDuration: 50,
    subjectSpecific: { customFields: { studypugId: "4-nf-1", studypugDifficulty: 5 } },
    prerequisites: ['sp-us-g3-math-nf-1'] // Mapped from "3-nf-1"
  },
  // LO: Compare fractions (StudyPug "4-nf-2")
  {
    id: 'sp-us-g4-math-nf-2',
    parentId: 'us-g4-math-nf',
    nodeType: 'learning_objective',
    name: 'Compare two fractions with different numerators and denominators.',
    description: 'Original StudyPug Topic Name: Compare fractions.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    sourceIdentifier: '4.NF.A.2',
    estimatedDuration: 55,
    subjectSpecific: { customFields: { studypugId: "4-nf-2", studypugDifficulty: 6 } },
    prerequisites: ['sp-us-g4-math-nf-1'] // Mapped from "4-nf-1"
  },
  // LO: Add and subtract fractions (StudyPug "4-nf-3")
  {
    id: 'sp-us-g4-math-nf-3',
    parentId: 'us-g4-math-nf',
    nodeType: 'learning_objective',
    name: 'Understand addition and subtraction of fractions as joining and separating parts.',
    description: 'Original StudyPug Topic Name: Add and subtract fractions.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    sourceIdentifier: '4.NF.B.3, 4.NF.B.3a, 4.NF.B.3b, 4.NF.B.3c, 4.NF.B.3d', // Multiple standards
    estimatedDuration: 60,
    subjectSpecific: { customFields: { studypugId: "4-nf-3", studypugDifficulty: 7 } },
    prerequisites: ['sp-us-g4-math-nf-1', 'sp-us-g4-math-nf-2'] // Mapped
  },

  // Domain: Operations and Algebraic Thinking (Grade 4 - StudyPug)
  {
    id: 'us-g4-math-oa',
    parentId: 'us-g4-math',
    nodeType: 'domain',
    name: 'Operations and Algebraic Thinking',
    description: 'Use the four operations with whole numbers to solve problems. (StudyPug Domain)',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
  },
  // LO: Multiplicative comparisons (StudyPug "4-oa-1")
  {
    id: 'sp-us-g4-math-oa-1',
    parentId: 'us-g4-math-oa',
    nodeType: 'learning_objective',
    name: 'Interpret multiplication equations as comparisons.',
    description: 'Original StudyPug Topic Name: Multiplicative comparisons.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    sourceIdentifier: '4.OA.A.1',
    estimatedDuration: 40,
    subjectSpecific: { customFields: { studypugId: "4-oa-1", studypugDifficulty: 4 } },
    prerequisites: ['sp-us-g3-math-oa-1'] // Mapped
  },
  // LO: Word problems with multiplication and division (StudyPug "4-oa-2")
  {
    id: 'sp-us-g4-math-oa-2',
    parentId: 'us-g4-math-oa',
    nodeType: 'learning_objective',
    name: 'Multiply or divide to solve word problems involving multiplicative comparison.',
    description: 'Original StudyPug Topic Name: Word problems with multiplication and division.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    sourceIdentifier: '4.OA.A.2',
    estimatedDuration: 50,
    subjectSpecific: { customFields: { studypugId: "4-oa-2", studypugDifficulty: 6 } },
    prerequisites: ['sp-us-g4-math-oa-1'] // Mapped
  },

  // Domain: Measurement and Data (Grade 4 - StudyPug)
  {
    id: 'us-g4-math-md',
    parentId: 'us-g4-math',
    nodeType: 'domain',
    name: 'Measurement and Data',
    description: 'Solve problems involving measurement and conversion of measurements. (StudyPug Domain)',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
  },
  // LO: Area and perimeter (StudyPug "4-md-3")
  {
    id: 'sp-us-g4-math-md-3',
    parentId: 'us-g4-math-md',
    nodeType: 'learning_objective',
    name: 'Apply the area and perimeter formulas for rectangles in real world problems.',
    description: 'Original StudyPug Topic Name: Area and perimeter.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    sourceIdentifier: '4.MD.A.3',
    estimatedDuration: 45,
    subjectSpecific: { customFields: { studypugId: "4-md-3", studypugDifficulty: 5 } },
    prerequisites: []
  },

  // --- US Grade 5 (New Grade Level Node) ---
  {
    id: 'us-g5',
    parentId: 'us',
    nodeType: 'grade_level',
    name: 'Grade 5',
    description: 'Fifth grade education',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5'
  },
  // Subject node for Grade 5 Math
  {
    id: 'us-g5-math',
    parentId: 'us-g5',
    nodeType: 'subject',
    name: 'Mathematics - Grade 5',
    description: 'Grade 5 Mathematics, incorporating StudyPug content.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    tags: ['math', 'grade5', 'studypug_based']
  },

  // Domain: Number and Operations - Fractions (Grade 5 - StudyPug)
  {
    id: 'us-g5-math-nf',
    parentId: 'us-g5-math',
    nodeType: 'domain',
    name: 'Number and Operations - Fractions',
    description: 'Use equivalent fractions as a strategy to add and subtract fractions. (StudyPug Domain)',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
  },
  // LO: Add and subtract fractions with unlike denominators (StudyPug "5-nf-1")
  {
    id: 'sp-us-g5-math-nf-1',
    parentId: 'us-g5-math-nf',
    nodeType: 'learning_objective',
    name: 'Add and subtract fractions with unlike denominators by replacing given fractions with equivalent fractions.',
    description: 'Original StudyPug Topic Name: Add and subtract fractions with unlike denominators.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    sourceIdentifier: '5.NF.A.1',
    estimatedDuration: 65,
    subjectSpecific: { customFields: { studypugId: "5-nf-1", studypugDifficulty: 7 } },
    prerequisites: ['sp-us-g4-math-nf-3'] // Mapped
  },
  // LO: Multiply fractions (StudyPug "5-nf-4")
  {
    id: 'sp-us-g5-math-nf-4',
    parentId: 'us-g5-math-nf',
    nodeType: 'learning_objective',
    name: 'Apply and extend previous understandings of multiplication to multiply a fraction by a whole number.', // Note: StudyPug description is more specific, standard is broader. Using StudyPug's specific focus.
    description: 'Original StudyPug Topic Name: Multiply fractions.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    sourceIdentifier: '5.NF.B.4, 5.NF.B.4a, 5.NF.B.4b',
    estimatedDuration: 70,
    subjectSpecific: { customFields: { studypugId: "5-nf-4", studypugDifficulty: 8 } },
    prerequisites: ['sp-us-g4-math-nf-3'] // Mapped
  },

  // Domain: Number and Operations in Base Ten (Grade 5 - StudyPug)
  {
    id: 'us-g5-math-nbt',
    parentId: 'us-g5-math',
    nodeType: 'domain',
    name: 'Number and Operations in Base Ten',
    description: 'Understand the place value system and perform operations with multi-digit whole numbers and decimals. (StudyPug Domain)',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
  },
  // LO: Add and subtract decimals (StudyPug "5-nbt-7-add-subtract")
  {
    id: 'sp-us-g5-math-nbt-7as', // Shortened for add-subtract
    parentId: 'us-g5-math-nbt',
    nodeType: 'learning_objective',
    name: 'Add and subtract decimals to hundredths, using concrete models or drawings and strategies based on place value.', // Combined from StudyPug description parts
    description: 'Original StudyPug Topic Name: Add and subtract decimals.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    sourceIdentifier: '5.NBT.B.7',
    estimatedDuration: 55,
    subjectSpecific: { customFields: { studypugId: "5-nbt-7-add-subtract", studypugDifficulty: 6 } },
    prerequisites: []
  },
  // LO: Multiply decimals (StudyPug "5-nbt-7-multiply")
  {
    id: 'sp-us-g5-math-nbt-7m', // Shortened for multiply
    parentId: 'us-g5-math-nbt',
    nodeType: 'learning_objective',
    name: 'Multiply decimals to hundredths using concrete models, drawings, and strategies based on place value and properties of operations.',
    description: 'Original StudyPug Topic Name: Multiply decimals.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    sourceIdentifier: '5.NBT.B.7',
    estimatedDuration: 60,
    subjectSpecific: { customFields: { studypugId: "5-nbt-7-multiply", studypugDifficulty: 7 } },
    prerequisites: ['sp-us-g5-math-nbt-7as'] // Mapped
  },
  // LO: Divide decimals (StudyPug "5-nbt-7-divide")
  {
    id: 'sp-us-g5-math-nbt-7d', // Shortened for divide
    parentId: 'us-g5-math-nbt',
    nodeType: 'learning_objective',
    name: 'Divide decimals to hundredths using concrete models, drawings, and strategies based on place value and properties of operations.',
    description: 'Original StudyPug Topic Name: Divide decimals.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    sourceIdentifier: '5.NBT.B.7',
    estimatedDuration: 65,
    subjectSpecific: { customFields: { studypugId: "5-nbt-7-divide", studypugDifficulty: 8 } },
    prerequisites: ['sp-us-g5-math-nbt-7m'] // Mapped
  },

  // --- US Math - Grade 6 (from StudyPug, to be merged/compared with existing G6 Math) ---
  // Note: 'us-g6' and 'us-g6-math' nodes should already exist from initial mock data.
  // Domain: Ratios and Proportional Relationships (Grade 6 - StudyPug)
  // The existing 'us-g6-math-rp' can be used or this can be additive if structure differs.
  // For now, creating new domain ID to avoid conflict during this append.
  {
    id: 'sp-us-g6-math-rp', // Prefixed to distinguish from potentially existing 'us-g6-math-rp'
    parentId: 'us-g6-math', // Parent is existing Grade 6 Math subject
    nodeType: 'domain',
    name: 'Ratios and Proportional Relationships (StudyPug)',
    description: 'Understand ratio concepts and use ratio reasoning to solve problems. (StudyPug Domain)',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
  },
  // LO: Ratios and rates (StudyPug "6-rp-1")
  {
    id: 'sp-us-g6-math-rp-1',
    parentId: 'sp-us-g6-math-rp',
    nodeType: 'learning_objective',
    name: 'Understand the concept of a ratio and use ratio language to describe a ratio relationship between two quantities.',
    description: 'Original StudyPug Topic Name: Ratios and rates.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    sourceIdentifier: '6.RP.A.1',
    estimatedDuration: 50,
    subjectSpecific: { customFields: { studypugId: "6-rp-1", studypugDifficulty: 6 } },
    prerequisites: ['sp-us-g5-math-nf-4'] // Mapped
  },
  // LO: Unit rates (StudyPug "6-rp-2")
  {
    id: 'sp-us-g6-math-rp-2',
    parentId: 'sp-us-g6-math-rp',
    nodeType: 'learning_objective',
    name: 'Understand the concept of a unit rate a/b associated with a ratio a:b with b ≠ 0, and use rate language in the context of a ratio relationship.',
    description: 'Original StudyPug Topic Name: Unit rates.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    sourceIdentifier: '6.RP.A.2',
    estimatedDuration: 55,
    subjectSpecific: { customFields: { studypugId: "6-rp-2", studypugDifficulty: 7 } },
    prerequisites: ['sp-us-g6-math-rp-1'] // Mapped
  },

  // Domain: The Number System (Grade 6 - StudyPug)
  {
    id: 'sp-us-g6-math-ns', // Prefixed
    parentId: 'us-g6-math',
    nodeType: 'domain',
    name: 'The Number System (StudyPug)',
    description: 'Apply and extend previous understandings of numbers to the system of rational numbers. (StudyPug Domain)',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
  },
  // LO: Positive and negative numbers (StudyPug "6-ns-5")
  {
    id: 'sp-us-g6-math-ns-5',
    parentId: 'sp-us-g6-math-ns',
    nodeType: 'learning_objective',
    name: 'Understand that positive and negative numbers are used together to describe quantities having opposite directions or values.',
    description: 'Original StudyPug Topic Name: Positive and negative numbers.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subject: NELIESubject.MATH,
    subjectName: 'Mathematics',
    sourceIdentifier: '6.NS.C.5',
    estimatedDuration: 45,
    subjectSpecific: { customFields: { studypugId: "6-ns-5", studypugDifficulty: 6 } },
    prerequisites: ['sp-us-g5-math-nbt-7d'] // Mapped from "5-nbt-7-divide"
  },

  // --- US Science - Kindergarten ---
  {
    id: 'us-k-science',
    parentId: 'us-k',
    nodeType: 'subject',
    name: 'Science - Kindergarten',
    description: 'Kindergarten Science exploration.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subject: NELIESubject.SCIENCE,
    subjectName: 'Science',
    tags: ['science', 'kindergarten', 'early_exploration']
  },
  {
    id: 'us-k-science-ls',
    parentId: 'us-k-science',
    nodeType: 'domain',
    name: 'Life Science',
    description: 'Understanding plants, animals, and the local environment.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subject: NELIESubject.SCIENCE,
    subjectName: 'Science',
  },
  {
    id: 'us-k-science-ls-obj1',
    parentId: 'us-k-science-ls',
    nodeType: 'learning_objective',
    name: 'Observe and describe similarities and differences in the appearance and behavior of plants and animals.',
    sourceIdentifier: 'NGSS-K-LS1-1 (Adapted)', // Example, actual NGSS might be more complex
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subject: NELIESubject.SCIENCE,
    subjectName: 'Science',
    tags: ['observation', 'plants', 'animals']
  },

  // --- US Science - Grade 1 ---
  {
    id: 'us-g1-science',
    parentId: 'us-g1',
    nodeType: 'subject',
    name: 'Science - Grade 1',
    description: 'Grade 1 Science exploration.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subject: NELIESubject.SCIENCE,
    subjectName: 'Science',
    tags: ['science', 'grade1']
  },
  {
    id: 'us-g1-science-ess',
    parentId: 'us-g1-science',
    nodeType: 'domain',
    name: 'Earth and Space Science',
    description: 'Understanding weather patterns and objects in the sky.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subject: NELIESubject.SCIENCE,
    subjectName: 'Science',
  },
  {
    id: 'us-g1-science-ess-obj1',
    parentId: 'us-g1-science-ess',
    nodeType: 'learning_objective',
    name: 'Observe, describe, and predict patterns of the sun, moon, and stars in the sky.',
    sourceIdentifier: 'NGSS-1-ESS1-1 (Adapted)',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subject: NELIESubject.SCIENCE,
    subjectName: 'Science',
    tags: ['patterns', 'sun', 'moon', 'stars']
  },

  // --- US Science - Grade 2 ---
  {
    id: 'us-g2-science',
    parentId: 'us-g2',
    nodeType: 'subject',
    name: 'Science - Grade 2',
    description: 'Grade 2 Science exploration.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subject: NELIESubject.SCIENCE,
    subjectName: 'Science',
    tags: ['science', 'grade2']
  },
  {
    id: 'us-g2-science-ps',
    parentId: 'us-g2-science',
    nodeType: 'domain',
    name: 'Physical Science',
    description: 'Understanding properties of materials and changes in matter.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subject: NELIESubject.SCIENCE,
    subjectName: 'Science',
  },
  {
    id: 'us-g2-science-ps-obj1',
    parentId: 'us-g2-science-ps',
    nodeType: 'learning_objective',
    name: 'Plan and conduct an investigation to describe and classify different kinds of materials by their observable properties.',
    sourceIdentifier: 'NGSS-2-PS1-1 (Adapted)',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subject: NELIESubject.SCIENCE,
    subjectName: 'Science',
    tags: ['materials', 'properties', 'investigation', 'classification']
  },

  // --- US Math - Kindergarten (Adding Detail) ---
  // 'us-k-math' subject node already exists. Adding domains and LOs.
  {
    id: 'us-k-math-cc', // Counting & Cardinality
    parentId: 'us-k-math',
    nodeType: 'domain',
    name: 'Counting and Cardinality',
    description: 'Know number names and the count sequence. Count to tell the number of objects. Compare numbers.',
    countryCode: 'US', languageCode: 'en', educationalLevel: 'K', subject: NELIESubject.MATH, subjectName: 'Mathematics',
    sourceIdentifier: 'CCSS.Math.Content.K.CC'
  },
  {
    id: 'us-k-math-cc-a-1',
    parentId: 'us-k-math-cc',
    nodeType: 'learning_objective',
    name: 'Count to 100 by ones and by tens.',
    sourceIdentifier: 'CCSS.Math.Content.K.CC.A.1',
    countryCode: 'US', languageCode: 'en', educationalLevel: 'K', subject: NELIESubject.MATH, subjectName: 'Mathematics',
    tags: ['counting', 'hundreds_chart']
  },

  // --- US Math - Grade 1 (Adding Detail) ---
  // 'us-g1-math' subject node already exists. Adding domains and LOs.
  {
    id: 'us-g1-math-oa', // Operations & Algebraic Thinking
    parentId: 'us-g1-math',
    nodeType: 'domain',
    name: 'Operations and Algebraic Thinking',
    description: 'Represent and solve problems involving addition and subtraction. Understand and apply properties of operations and the relationship between addition and subtraction. Add and subtract within 20. Work with addition and subtraction equations.',
    countryCode: 'US', languageCode: 'en', educationalLevel: '1', subject: NELIESubject.MATH, subjectName: 'Mathematics',
    sourceIdentifier: 'CCSS.Math.Content.1.OA'
  },
  {
    id: 'us-g1-math-oa-a-1',
    parentId: 'us-g1-math-oa',
    nodeType: 'learning_objective',
    name: 'Use addition and subtraction within 20 to solve word problems involving situations of adding to, taking from, putting together, taking apart, and comparing, with unknowns in all positions, e.g., by using objects, drawings, and equations with a symbol for the unknown number to represent the problem.',
    sourceIdentifier: 'CCSS.Math.Content.1.OA.A.1',
    countryCode: 'US', languageCode: 'en', educationalLevel: '1', subject: NELIESubject.MATH, subjectName: 'Mathematics',
    tags: ['word_problems', 'addition', 'subtraction', 'within_20']
  },

  // --- US Math - Grade 2 (Adding Subject, Domain, LO) ---
  // 'us-g2' grade node already exists.
  {
    id: 'us-g2-math',
    parentId: 'us-g2',
    nodeType: 'subject',
    name: 'Mathematics - Grade 2',
    description: 'Grade 2 Mathematics based on Common Core State Standards.',
    countryCode: 'US', languageCode: 'en', educationalLevel: '2', subject: NELIESubject.MATH, subjectName: 'Mathematics',
    tags: ['math', 'grade2', 'common_core']
  },
  {
    id: 'us-g2-math-nbt', // Number & Operations in Base Ten
    parentId: 'us-g2-math',
    nodeType: 'domain',
    name: 'Number and Operations in Base Ten',
    description: 'Understand place value. Use place value understanding and properties of operations to add and subtract.',
    countryCode: 'US', languageCode: 'en', educationalLevel: '2', subject: NELIESubject.MATH, subjectName: 'Mathematics',
    sourceIdentifier: 'CCSS.Math.Content.2.NBT'
  },
  {
    id: 'us-g2-math-nbt-a-1',
    parentId: 'us-g2-math-nbt',
    nodeType: 'learning_objective',
    name: 'Understand that the three digits of a three-digit number represent amounts of hundreds, tens, and ones; e.g., 706 equals 7 hundreds, 0 tens, and 6 ones.',
    sourceIdentifier: 'CCSS.Math.Content.2.NBT.A.1',
    countryCode: 'US', languageCode: 'en', educationalLevel: '2', subject: NELIESubject.MATH, subjectName: 'Mathematics',
    tags: ['place_value', 'three_digit_numbers', 'hundreds_tens_ones']
  },

  // --- US Science - Grades 3-5 (Adding Subject Stubs and sample Domains) ---
  // 'us-g3', 'us-g4', 'us-g5' grade nodes exist from StudyPug Math transformation.
  {
    id: 'us-g3-science', parentId: 'us-g3', nodeType: 'subject', name: 'Science - Grade 3', educationalLevel: '3', subject: NELIESubject.SCIENCE, subjectName: 'Science', countryCode: 'US', languageCode: 'en', tags: ['science', 'grade3']
  },
  {
    id: 'us-g3-science-ls', parentId: 'us-g3-science', nodeType: 'domain', name: 'Life Science (G3)', educationalLevel: '3', subject: NELIESubject.SCIENCE, subjectName: 'Science', countryCode: 'US', languageCode: 'en'
  },
  {
    id: 'us-g4-science', parentId: 'us-g4', nodeType: 'subject', name: 'Science - Grade 4', educationalLevel: '4', subject: NELIESubject.SCIENCE, subjectName: 'Science', countryCode: 'US', languageCode: 'en', tags: ['science', 'grade4']
  },
  {
    id: 'us-g4-science-ps', parentId: 'us-g4-science', nodeType: 'domain', name: 'Physical Science (G4)', educationalLevel: '4', subject: NELIESubject.SCIENCE, subjectName: 'Science', countryCode: 'US', languageCode: 'en'
  },
  {
    id: 'us-g5-science', parentId: 'us-g5', nodeType: 'subject', name: 'Science - Grade 5', educationalLevel: '5', subject: NELIESubject.SCIENCE, subjectName: 'Science', countryCode: 'US', languageCode: 'en', tags: ['science', 'grade5']
  },
  {
    id: 'us-g5-science-ess', parentId: 'us-g5-science', nodeType: 'domain', name: 'Earth and Space Science (G5)', educationalLevel: '5', subject: NELIESubject.SCIENCE, subjectName: 'Science', countryCode: 'US', languageCode: 'en'
  }
  // Note: 'us-g6-science' subject node already exists as a stub.
];
