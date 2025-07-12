
import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const usElaCurriculumNodes: CurriculumNode[] = [
  // US ELA Subject Node
  {
    id: 'us-ela',
    parentId: 'us-root',
    nodeType: 'subject',
    name: 'English Language Arts',
    description: 'US K-5 English Language Arts curriculum based on Common Core State Standards',
    educationalLevel: 'K-5',
    subject: NELIESubject.ENGLISH,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['ccss', 'language_arts', 'elementary']
  },

  // --- Kindergarten ELA ---
  {
    id: 'us-k-ela',
    parentId: 'us-ela',
    nodeType: 'grade_level',
    name: 'Kindergarten English Language Arts',
    description: 'Foundational literacy skills for kindergarten students',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['kindergarten', 'foundational_literacy']
  },

  // K.RF - Reading: Foundational Skills
  {
    id: 'us-k-ela-rf',
    parentId: 'us-k-ela',
    nodeType: 'domain',
    name: 'Reading: Foundational Skills',
    description: 'Print concepts, phonological awareness, phonics and word recognition, fluency',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    tags: ['phonics', 'phonological_awareness', 'print_concepts']
  },

  {
    id: 'us-k-ela-rf-1',
    parentId: 'us-k-ela-rf',
    nodeType: 'learning_objective',
    name: 'Demonstrate understanding of print concepts',
    description: 'Demonstrate understanding of the organization and basic features of print',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 30,
    tags: ['print_concepts', 'reading_direction']
  },

  {
    id: 'us-k-ela-rf-2',
    parentId: 'us-k-ela-rf',
    nodeType: 'learning_objective',
    name: 'Demonstrate understanding of phonological awareness',
    description: 'Demonstrate understanding of spoken words, syllables, and sounds (phonemes)',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 35,
    tags: ['phonological_awareness', 'phonemes', 'syllables']
  },

  // K.SL - Speaking and Listening
  {
    id: 'us-k-ela-sl',
    parentId: 'us-k-ela',
    nodeType: 'domain',
    name: 'Speaking and Listening',
    description: 'Comprehension and collaboration, presentation of knowledge and ideas',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    tags: ['oral_communication', 'listening_skills']
  },

  {
    id: 'us-k-ela-sl-1',
    parentId: 'us-k-ela-sl',
    nodeType: 'learning_objective',
    name: 'Participate in collaborative conversations',
    description: 'Participate in collaborative conversations with diverse partners about kindergarten topics',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 25,
    tags: ['conversation', 'collaboration', 'turn_taking']
  },

  // --- Grade 1 ELA ---
  {
    id: 'us-g1-ela',
    parentId: 'us-ela',
    nodeType: 'grade_level',
    name: 'Grade 1 English Language Arts',
    description: 'First grade English Language Arts curriculum',
    educationalLevel: '1',
    subject: NELIESubject.ENGLISH,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade1', 'elementary']
  },

  // 1.RF - Reading: Foundational Skills
  {
    id: 'us-g1-ela-rf',
    parentId: 'us-g1-ela',
    nodeType: 'domain',
    name: 'Reading: Foundational Skills',
    description: 'Print concepts, phonological awareness, phonics and word recognition, fluency',
    educationalLevel: '1',
    subject: NELIESubject.ENGLISH,
    tags: ['phonics', 'decoding', 'fluency']
  },

  {
    id: 'us-g1-ela-rf-1',
    parentId: 'us-g1-ela-rf',
    nodeType: 'learning_objective',
    name: 'Demonstrate understanding of print organization',
    description: 'Demonstrate understanding of the organization and basic features of print',
    educationalLevel: '1',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 30,
    tags: ['print_concepts', 'capitalization', 'punctuation']
  },

  // 1.RL - Reading: Literature
  {
    id: 'us-g1-ela-rl',
    parentId: 'us-g1-ela',
    nodeType: 'domain',
    name: 'Reading: Literature',
    description: 'Key ideas and details, craft and structure, integration of knowledge and ideas',
    educationalLevel: '1',
    subject: NELIESubject.ENGLISH,
    tags: ['literature', 'comprehension', 'story_elements']
  },

  {
    id: 'us-g1-ela-rl-1',
    parentId: 'us-g1-ela-rl',
    nodeType: 'learning_objective',
    name: 'Ask and answer questions about key details',
    description: 'Ask and answer questions about key details in a text',
    educationalLevel: '1',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 40,
    tags: ['questioning', 'key_details', 'comprehension']
  },

  // --- Grade 2 ELA ---
  {
    id: 'us-g2-ela',
    parentId: 'us-ela',
    nodeType: 'grade_level',
    name: 'Grade 2 English Language Arts',
    description: 'Second grade English Language Arts curriculum',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade2', 'elementary']
  },

  // 2.RL - Reading: Literature
  {
    id: 'us-g2-ela-rl',
    parentId: 'us-g2-ela',
    nodeType: 'domain',
    name: 'Reading: Literature',
    description: 'Key ideas and details, craft and structure, integration of knowledge and ideas',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    tags: ['literature', 'story_elements', 'comprehension']
  },

  {
    id: 'us-g2-ela-rl-1',
    parentId: 'us-g2-ela-rl',
    nodeType: 'learning_objective',
    name: 'Ask and answer questions for comprehension',
    description: 'Ask and answer such questions as who, what, where, when, why, and how to demonstrate understanding',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 45,
    tags: ['5w1h_questions', 'comprehension', 'understanding']
  },

  // 2.W - Writing
  {
    id: 'us-g2-ela-w',
    parentId: 'us-g2-ela',
    nodeType: 'domain',
    name: 'Writing',
    description: 'Text types and purposes, production and distribution of writing, research to build knowledge',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    tags: ['writing', 'text_types', 'composition']
  },

  {
    id: 'us-g2-ela-w-1',
    parentId: 'us-g2-ela-w',
    nodeType: 'learning_objective',
    name: 'Write opinion pieces',
    description: 'Write opinion pieces in which they introduce the topic, state an opinion, and provide reasons',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 50,
    tags: ['opinion_writing', 'supporting_reasons', 'text_structure']
  },

  // --- Grade 3 ELA ---
  {
    id: 'us-g3-ela',
    parentId: 'us-ela',
    nodeType: 'grade_level',
    name: 'Grade 3 English Language Arts',
    description: 'Third grade English Language Arts curriculum',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade3', 'elementary']
  },

  // 3.RL - Reading: Literature
  {
    id: 'us-g3-ela-rl',
    parentId: 'us-g3-ela',
    nodeType: 'domain',
    name: 'Reading: Literature',
    description: 'Key ideas and details, craft and structure, integration of knowledge and ideas',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    tags: ['literature', 'theme', 'character_analysis']
  },

  {
    id: 'us-g3-ela-rl-1',
    parentId: 'us-g3-ela-rl',
    nodeType: 'learning_objective',
    name: 'Ask and answer questions about texts',
    description: 'Ask and answer questions to demonstrate understanding of a text, referring explicitly to the text',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 45,
    tags: ['text_evidence', 'explicit_reference', 'comprehension']
  },

  // 3.W - Writing
  {
    id: 'us-g3-ela-w',
    parentId: 'us-g3-ela',
    nodeType: 'domain',
    name: 'Writing',
    description: 'Text types and purposes, production and distribution of writing, research to build knowledge',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    tags: ['writing', 'narrative', 'informative']
  },

  {
    id: 'us-g3-ela-w-1',
    parentId: 'us-g3-ela-w',
    nodeType: 'learning_objective',
    name: 'Write opinion pieces with supporting details',
    description: 'Write opinion pieces on topics or texts, supporting a point of view with reasons',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 60,
    tags: ['opinion_writing', 'supporting_details', 'point_of_view']
  },

  // --- Grade 4 ELA ---
  {
    id: 'us-g4-ela',
    parentId: 'us-ela',
    nodeType: 'grade_level',
    name: 'Grade 4 English Language Arts',
    description: 'Fourth grade English Language Arts curriculum',
    educationalLevel: '4',
    subject: NELIESubject.ENGLISH,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade4', 'elementary']
  },

  // 4.RL - Reading: Literature
  {
    id: 'us-g4-ela-rl',
    parentId: 'us-g4-ela',
    nodeType: 'domain',
    name: 'Reading: Literature',
    description: 'Key ideas and details, craft and structure, integration of knowledge and ideas',
    educationalLevel: '4',
    subject: NELIESubject.ENGLISH,
    tags: ['literature', 'theme', 'inference']
  },

  {
    id: 'us-g4-ela-rl-1',
    parentId: 'us-g4-ela-rl',
    nodeType: 'learning_objective',
    name: 'Refer to details and examples when explaining text',
    description: 'Refer to details and examples in a text when explaining what the text says explicitly and when drawing inferences',
    educationalLevel: '4',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 50,
    tags: ['inference', 'text_evidence', 'explicit_meaning']
  },

  // 4.W - Writing
  {
    id: 'us-g4-ela-w',
    parentId: 'us-g4-ela',
    nodeType: 'domain',
    name: 'Writing',
    description: 'Text types and purposes, production and distribution of writing, research to build knowledge',
    educationalLevel: '4',
    subject: NELIESubject.ENGLISH,
    tags: ['writing', 'research', 'revision']
  },

  {
    id: 'us-g4-ela-w-1',
    parentId: 'us-g4-ela-w',
    nodeType: 'learning_objective',
    name: 'Write opinion pieces with organized reasons',
    description: 'Write opinion pieces on topics or texts, supporting a point of view with reasons and information',
    educationalLevel: '4',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 60,
    tags: ['opinion_writing', 'organization', 'supporting_information']
  },

  // --- Grade 5 ELA ---
  {
    id: 'us-g5-ela',
    parentId: 'us-ela',
    nodeType: 'grade_level',
    name: 'Grade 5 English Language Arts',
    description: 'Fifth grade English Language Arts curriculum',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade5', 'elementary']
  },

  // 5.RL - Reading: Literature
  {
    id: 'us-g5-ela-rl',
    parentId: 'us-g5-ela',
    nodeType: 'domain',
    name: 'Reading: Literature',
    description: 'Key ideas and details, craft and structure, integration of knowledge and ideas',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    tags: ['literature', 'theme', 'character_development']
  },

  {
    id: 'us-g5-ela-rl-1',
    parentId: 'us-g5-ela-rl',
    nodeType: 'learning_objective',
    name: 'Quote accurately from text when explaining',
    description: 'Quote accurately from a text when explaining what the text says explicitly and when drawing inferences',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 50,
    tags: ['quoting', 'text_evidence', 'inference']
  },

  // 5.W - Writing
  {
    id: 'us-g5-ela-w',
    parentId: 'us-g5-ela',
    nodeType: 'domain',
    name: 'Writing',
    description: 'Text types and purposes, production and distribution of writing, research to build knowledge',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    tags: ['writing', 'research', 'multimedia']
  },

  {
    id: 'us-g5-ela-w-1',
    parentId: 'us-g5-ela-w',
    nodeType: 'learning_objective',
    name: 'Write opinion pieces with logically ordered reasons',
    description: 'Write opinion pieces on topics or texts, supporting a point of view with reasons and information',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 60,
    tags: ['opinion_writing', 'logical_order', 'supporting_evidence']
  }
];
