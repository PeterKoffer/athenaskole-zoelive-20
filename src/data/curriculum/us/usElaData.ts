
import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const usElaCurriculumNodes: CurriculumNode[] = [
  // US English Language Arts Subject Node
  {
    id: 'us-ela',
    parentId: 'us',
    nodeType: 'subject',
    name: 'English Language Arts',
    description: 'United States English Language Arts curriculum covering reading, writing, speaking, listening, and language skills from K-12.',
    educationalLevel: 'K-12',
    subject: NELIESubject.ENGLISH,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['english', 'language_arts', 'core_subject', 'united_states'],
  },

  // Kindergarten ELA
  {
    id: 'us-ela-k-reading-foundational',
    parentId: 'us-ela',
    nodeType: 'learning_objective',
    name: 'Reading Foundational Skills',
    description: 'Demonstrate understanding of the organization and basic features of print, phonological awareness, phonics and word recognition.',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    countryCode: 'US',
    languageCode: 'en',
    estimatedDuration: 30,
    tags: ['phonics', 'phonological_awareness', 'print_concepts', 'kindergarten'],
  },
  {
    id: 'us-ela-k-reading-literature',
    parentId: 'us-ela',
    nodeType: 'learning_objective',
    name: 'Reading Literature',
    description: 'Ask and answer questions about key details in a text and identify characters, settings, and major events.',
    educationalLevel: 'K',

    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH, // Added
    estimatedDuration: 150,
    tags: ['foundational', 'literacy', 'early_childhood']
  },
  {
    id: 'us-ela-k-reading-informational',
    parentId: 'us-ela',
    nodeType: 'learning_objective',
    name: 'Reading Informational Text',
    description: 'Ask and answer questions about key details in informational texts.',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    countryCode: 'US',
    languageCode: 'en',
    estimatedDuration: 20,
    tags: ['informational_text', 'comprehension', 'nonfiction', 'kindergarten'],
  },
  {
    id: 'us-ela-k-writing',
    parentId: 'us-ela',
    nodeType: 'learning_objective',
    name: 'Writing',
    description: 'Use a combination of drawing, dictating, and writing to compose texts.',
    educationalLevel: 'K',

    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH, // Added
    sourceIdentifier: 'K.RF',
    tags: ['reading', 'phonics', 'foundational'],
    subject: NELIESubject.ENGLISH // Ensured subject field
  },
  // K ELA: Reading Literature (RL) Domain
  {
    id: 'k-ela-rl',
    parentId: 'us-k-ela',
    nodeType: 'domain',
    name: 'Reading: Literature (RL)',
    description: 'Key Ideas and Details, Craft and Structure, Integration of Knowledge and Ideas for Kindergarten literature.',
    educationalLevel: 'K',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    tags: ['reading', 'literature', 'kindergarten']
  },
  // K ELA: Reading Informational Text (RI) Domain
  {
    id: 'k-ela-ri',
    parentId: 'us-k-ela',
    nodeType: 'domain',
    name: 'Reading: Informational Text (RI)',
    description: 'Key Ideas and Details, Craft and Structure, Integration of Knowledge and Ideas for Kindergarten informational text.',
    educationalLevel: 'K',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    tags: ['reading', 'informational_text', 'kindergarten']
  },
  // K ELA: Writing (W) Domain
  {
    id: 'k-ela-w',
    parentId: 'us-k-ela',
    nodeType: 'domain',
    name: 'Writing (W)',
    description: 'Text Types and Purposes, Production and Distribution of Writing, Research to Build and Present Knowledge for Kindergarten.',
    educationalLevel: 'K',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    tags: ['writing', 'composition', 'kindergarten']
  },
  // K ELA: Speaking & Listening (SL) Domain
  {
    id: 'k-ela-sl',
    parentId: 'us-k-ela',
    nodeType: 'domain',
    name: 'Speaking & Listening (SL)',
    description: 'Comprehension and Collaboration, Presentation of Knowledge and Ideas for Kindergarten.',
    educationalLevel: 'K',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    tags: ['speaking', 'listening', 'communication', 'kindergarten']
  },
  // K ELA: Language (L) Domain
  {
    id: 'k-ela-l',
    parentId: 'us-k-ela',
    nodeType: 'domain',
    name: 'Language (L)',
    description: 'Conventions of Standard English, Knowledge of Language, Vocabulary Acquisition and Use for Kindergarten.',
    educationalLevel: 'K',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    tags: ['language', 'grammar', 'vocabulary', 'kindergarten']
  },
  // K LOs for RL
  {
    id: 'k-ela-rl-lo1',
    parentId: 'k-ela-rl',
    nodeType: 'learning_objective',
    name: 'With prompting and support, ask and answer questions about key details in a text. (RL.K.1)',
    description: 'With prompting and support, ask and answer questions about key details in a text.',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.K.1',
    tags: ['reading_comprehension', 'questioning', 'key_details']
  },
  {
    id: 'k-ela-rl-lo2',
    parentId: 'k-ela-rl',
    nodeType: 'learning_objective',
    name: 'With prompting and support, retell familiar stories. (RL.K.2)',
    description: 'With prompting and support, retell familiar stories, including key details.',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.K.2',
    tags: ['story_retelling', 'key_details']
  },
  {
    id: 'k-ela-rl-lo3',
    parentId: 'k-ela-rl',
    nodeType: 'learning_objective',
    name: 'Identify characters, settings, and major events. (RL.K.3)',
    description: 'With prompting and support, identify characters, settings, and major events in a story.',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.K.3',
    tags: ['story_elements', 'characters', 'settings', 'events']
  },
  // K LOs for RI
  {
    id: 'k-ela-ri-lo1',
    parentId: 'k-ela-ri',
    nodeType: 'learning_objective',
    name: 'Ask and answer questions about key details in an informational text. (RI.K.1)',
    description: 'With prompting and support, ask and answer questions about key details in a text.',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RI.K.1',
    tags: ['informational_text', 'questioning', 'key_details']
  },
  {
    id: 'k-ela-ri-lo2',
    parentId: 'k-ela-ri',
    nodeType: 'learning_objective',
    name: 'Identify the main topic and retell key details of a text. (RI.K.2)',
    description: 'With prompting and support, identify the main topic and retell key details of a text.',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RI.K.2',
    tags: ['main_topic', 'key_details', 'retelling']
  },
  // K LOs for RF (adding to existing k-rf-1)
  {
    id: 'k-rf-1', // Existing LO, parent 'k-rf'
    parentId: 'k-rf',
    nodeType: 'learning_objective',
    name: 'Demonstrate understanding of print features (RF.K.1)',
    description: 'Demonstrate understanding of the organization and basic features of print. (e.g., follow words left to right, top to bottom, page by page).',
    countryCode: 'US',
    languageCode: 'en',
    estimatedDuration: 20,
    tags: ['speaking', 'listening', 'collaboration', 'kindergarten'],
  },
  {
    id: 'us-ela-k-language',
    parentId: 'us-ela',
    nodeType: 'learning_objective',
    name: 'Language',
    description: 'Demonstrate command of the conventions of standard English grammar and usage.',
    educationalLevel: 'K',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RF.K.1',
    tags: ['print_concepts', 'reading_directionality']
  },
  {
    id: 'k-rf-lo2',
    parentId: 'k-rf',
    nodeType: 'learning_objective',
    name: 'Recognize and name all upper- and lowercase letters (RF.K.1d)',
    description: 'Recognize and name all upper- and lowercase letters of the alphabet.',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RF.K.1d',
    tags: ['alphabet_knowledge', 'letter_recognition']
  },
  {
    id: 'k-rf-lo3',
    parentId: 'k-rf',
    nodeType: 'learning_objective',
    name: 'Isolate and pronounce initial, medial vowel, and final sounds (RF.K.2d)',
    description: 'Isolate and pronounce the initial, medial vowel, and final sounds (phonemes) in three-phoneme (consonant-vowel-consonant, or CVC) words.',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RF.K.2d',
    tags: ['phonological_awareness', 'cvc_words', 'phoneme_isolation']
  },
  {
    id: 'k-rf-lo4',
    parentId: 'k-rf',
    nodeType: 'learning_objective',
    name: 'Read common high-frequency words by sight (RF.K.3c)',
    description: 'Read common high-frequency words by sight (e.g., the, of, to, you, she, my, is, are, do, does).',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RF.K.3c',
    tags: ['sight_words', 'high_frequency_words', 'reading_fluency']
  },
  // K LOs for W
  {
    id: 'k-ela-w-lo1',
    parentId: 'k-ela-w',
    nodeType: 'learning_objective',
    name: 'Use drawing, dictating, and writing for different purposes (W.K.1-3)',
    description: 'Use a combination of drawing, dictating, and writing to compose opinion pieces, informative/explanatory texts, and narrative texts.',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.W.K.1-3',
    tags: ['writing_process', 'opinion_writing', 'informative_writing', 'narrative_writing']
  },
  {
    id: 'k-ela-w-lo2',
    parentId: 'k-ela-w',
    nodeType: 'learning_objective',
    name: 'Respond to questions and suggestions from peers (W.K.5)',
    description: 'With guidance and support from adults, respond to questions and suggestions from peers and add details to strengthen writing as needed.',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.W.K.5',
    tags: ['writing_revision', 'peer_feedback', 'collaboration']
  },
  // K LOs for SL
  {
    id: 'k-ela-sl-lo1',
    parentId: 'k-ela-sl',
    nodeType: 'learning_objective',
    name: 'Participate in collaborative conversations (SL.K.1)',
    description: 'Participate in collaborative conversations with diverse partners about kindergarten topics and texts with peers and adults in small and larger groups.',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.SL.K.1',
    tags: ['collaborative_discussion', 'active_listening', 'turn_taking']
  },
  {
    id: 'k-ela-sl-lo2',
    parentId: 'k-ela-sl',
    nodeType: 'learning_objective',
    name: 'Ask and answer questions about information from a speaker (SL.K.3)',
    description: 'Ask and answer questions in order to seek help, get information, or clarify something that is not understood.',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.SL.K.3',
    tags: ['questioning_skills', 'clarification', 'information_seeking']
  },
  // K LOs for L
  {
    id: 'k-ela-l-lo1',
    parentId: 'k-ela-l',
    nodeType: 'learning_objective',
    name: 'Print many upper- and lowercase letters (L.K.1a)',
    description: 'Print many upper- and lowercase letters.',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.L.K.1a',
    tags: ['handwriting', 'letter_formation', 'alphabet']
  },
  {
    id: 'k-ela-l-lo2',
    parentId: 'k-ela-l',
    nodeType: 'learning_objective',
    name: 'Understand and use question words (L.K.1d)',
    description: 'Understand and use question words (interrogatives) (e.g., who, what, where, when, why, how).',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.L.K.1d',
    tags: ['grammar', 'question_words', 'vocabulary']
  },
  {
    id: 'k-ela-l-lo3',
    parentId: 'k-ela-l',
    nodeType: 'learning_objective',
    name: 'Sort common objects into categories (L.K.5a)',
    description: 'Sort common objects into categories (e.g., shapes, foods) to gain a sense of the concepts the categories represent.',
    educationalLevel: 'K',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.L.K.5a',
    tags: ['vocabulary', 'categorization', 'concept_development']
  },

  // Grade 1 ELA
  {
    id: 'us-ela-1-reading-foundational',
    parentId: 'us-ela',
    nodeType: 'learning_objective',
    name: 'Reading Foundational Skills',
    description: 'Demonstrate understanding of phonological awareness, phonics and word recognition, and fluency.',
    educationalLevel: '1',
    subject: NELIESubject.ENGLISH,
    countryCode: 'US',
    languageCode: 'en',
    estimatedDuration: 35,
    tags: ['phonics', 'fluency', 'decoding', 'grade_1'],
  },
  {
    id: 'us-ela-1-reading-literature',
    parentId: 'us-ela',
    nodeType: 'learning_objective',
    name: 'Reading Literature',
    description: 'Ask and answer questions about key details and retell stories including key details.',
    educationalLevel: '1',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 180,
    prerequisites: ['us-k-ela'],
    tags: ['elementary', 'literacy', 'grade1'] // Added grade1 tag
  },
  // G1 ELA: Reading Literature (RL) Domain
  {
    id: 'g1-ela-rl',
    parentId: 'us-1-ela',
    nodeType: 'domain',
    name: 'Reading: Literature (RL)',
    description: 'Key Ideas and Details, Craft and Structure, Integration of Knowledge and Ideas for Grade 1 literature.',
    educationalLevel: '1',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    tags: ['reading', 'literature', 'grade1']
  },
  // G1 ELA: Reading Informational Text (RI) Domain
  {
    id: 'g1-ela-ri',
    parentId: 'us-1-ela',
    nodeType: 'domain',
    name: 'Reading: Informational Text (RI)',
    description: 'Key Ideas and Details, Craft and Structure, Integration of Knowledge and Ideas for Grade 1 informational text.',
    educationalLevel: '1',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    tags: ['reading', 'informational_text', 'grade1']
  },
  {
    id: '1-rf', // Existing domain, ensure subject field
    parentId: 'us-1-ela',
    nodeType: 'domain',
    name: 'Reading: Foundational Skills (RF)',
    description: 'Phonological awareness, phonics and word recognition, and fluency for Grade 1.',
    countryCode: 'US',
    languageCode: 'en',
    estimatedDuration: 25,
    tags: ['informational_text', 'main_topic', 'details', 'grade_1'],
  },
  {
    id: 'us-ela-1-writing',
    parentId: 'us-ela',
    nodeType: 'learning_objective',
    name: 'Writing',
    description: 'Write opinion pieces, informative/explanatory texts, and narratives.',
    educationalLevel: '1',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: '1.RF',
    tags: ['reading', 'phonics', 'fluency', 'grade1']
  },
   // G1 ELA: Writing (W) Domain
  {
    id: 'g1-ela-w',
    parentId: 'us-1-ela',
    nodeType: 'domain',
    name: 'Writing (W)',
    description: 'Text Types and Purposes, Production and Distribution of Writing, Research to Build and Present Knowledge for Grade 1.',
    educationalLevel: '1',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    tags: ['writing', 'composition', 'grade1']
  },
  // G1 ELA: Speaking & Listening (SL) Domain
  {
    id: 'g1-ela-sl',
    parentId: 'us-1-ela',
    nodeType: 'domain',
    name: 'Speaking & Listening (SL)',
    description: 'Comprehension and Collaboration, Presentation of Knowledge and Ideas for Grade 1.',
    educationalLevel: '1',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    tags: ['speaking', 'listening', 'communication', 'grade1']
  },
  // G1 ELA: Language (L) Domain
  {
    id: 'g1-ela-l',
    parentId: 'us-1-ela',
    nodeType: 'domain',
    name: 'Language (L)',
    description: 'Conventions of Standard English, Knowledge of Language, Vocabulary Acquisition and Use for Grade 1.',
    educationalLevel: '1',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    tags: ['language', 'grammar', 'vocabulary', 'grade1']
  },
  // G1 LOs for RL
  {
    id: 'g1-ela-rl-lo1',
    parentId: 'g1-ela-rl',
    nodeType: 'learning_objective',
    name: 'Ask and answer questions about key details in a text. (RL.1.1)',
    description: 'Ask and answer questions about key details in a text.',
    educationalLevel: '1',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.1.1',
    tags: ['reading_comprehension', 'questioning', 'key_details']
  },
  {
    id: 'g1-ela-rl-lo2',
    parentId: 'g1-ela-rl',
    nodeType: 'learning_objective',
    name: 'Retell stories, including key details (RL.1.2)',
    description: 'Retell stories, including key details, and demonstrate understanding of their central message or lesson.',
    educationalLevel: '1',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.1.2',
    tags: ['story_retelling', 'central_message']
  },
  // G1 LOs for RI
  {
  {
    id: 'g1-ela-sl',
    parentId: 'us-1-ela',
    nodeType: 'domain',
    name: 'Speaking & Listening (SL)',
    description: 'Comprehension and Collaboration, Presentation of Knowledge and Ideas for Grade 1.',
    educationalLevel: '1',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    tags: ['speaking', 'listening', 'communication', 'grade1']
  },
  // G1 ELA: Language (L) Domain
  {
    id: 'g1-ela-l',
    parentId: 'us-1-ela',
    nodeType: 'domain',
    name: 'Language (L)',
    description: 'Conventions of Standard English, Knowledge of Language, Vocabulary Acquisition and Use for Grade 1.',
    educationalLevel: '1',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    tags: ['language', 'grammar', 'vocabulary', 'grade1']
  },
  // G1 LOs for RL
  {
    id: 'g1-ela-rl-lo1',
    parentId: 'g1-ela-rl',
    nodeType: 'learning_objective',
    name: 'Ask and answer questions about key details in a text. (RL.1.1)',
    description: 'Ask and answer questions about key details in a text.',
    educationalLevel: '1',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.1.1',
    tags: ['reading_comprehension', 'questioning', 'key_details']
  },
  {
    id: 'g1-ela-rl-lo2',
    parentId: 'g1-ela-rl',
    nodeType: 'learning_objective',
    name: 'Retell stories, including key details (RL.1.2)',
    description: 'Retell stories, including key details, and demonstrate understanding of their central message or lesson.',
    educationalLevel: '1',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.1.2',
    tags: ['story_retelling', 'central_message']
  },
  // G1 LOs for RI
  {
    id: 'g1-ela-ri-lo1',
    parentId: 'g1-ela-ri',
    nodeType: 'learning_objective',
    name: 'Ask and answer questions about key details in an informational text. (RI.1.1)',
    description: 'Ask and answer questions about key details in a text.',
    educationalLevel: '1',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RI.1.1',
    tags: ['informational_text', 'questioning', 'key_details']
  },
  // G1 LOs for RF (adding to existing 1-rf-1)
  {
    id: '1-rf-1', // Existing LO
    parentId: '1-rf',
    nodeType: 'learning_objective',
    name: 'Demonstrate understanding of spoken words, syllables, and sounds (phonemes). (RF.1.2)',
    description: 'Demonstrate understanding of spoken words, syllables, and sounds (phonemes).',
    countryCode: 'US',
    languageCode: 'en',
    estimatedDuration: 25,
    tags: ['speaking', 'listening', 'collaboration', 'grade_1'],
  },
  {
    id: 'us-ela-1-language',
    parentId: 'us-ela',
    nodeType: 'learning_objective',
    name: 'Language',
    description: 'Demonstrate command of the conventions of standard English grammar and usage.',
    educationalLevel: '1',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RF.1.2', // Corrected standard
    tags: ['phonological_awareness', 'phonemes', 'syllables']
  },
  {
    id: 'g1-rf-lo2',
    parentId: '1-rf',
    nodeType: 'learning_objective',
    name: 'Know and apply grade-level phonics and word analysis skills in decoding words. (RF.1.3)',
    description: 'Know and apply grade-level phonics and word analysis skills in decoding words.',
    educationalLevel: '1',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RF.1.3',
    tags: ['phonics', 'word_analysis', 'decoding']
  },
  // G1 LOs for W
  {
    id: 'g1-ela-w-lo1',
    parentId: 'g1-ela-w',
    nodeType: 'learning_objective',
    name: 'Write opinion pieces with a reason and sense of closure. (W.1.1)',
    description: 'Write opinion pieces in which they introduce the topic or name the book they are writing about, state an opinion, supply a reason for the opinion, and provide some sense of closure.',
    educationalLevel: '1',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.W.1.1',
    tags: ['opinion_writing', 'reasons', 'closure']
  },
  // G1 LOs for SL
  {
    id: 'g1-ela-sl-lo1',
    parentId: 'g1-ela-sl',
    nodeType: 'learning_objective',
    name: 'Participate in collaborative conversations, building on others\' talk. (SL.1.1)',
    description: 'Participate in collaborative conversations with diverse partners about grade 1 topics and texts with peers and adults in small and larger groups, building on others\' talk in conversations by responding to the comments of others through multiple exchanges.',
    educationalLevel: '1',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.SL.1.1',
    tags: ['collaborative_discussion', 'active_listening', 'conversation_skills']
  },
  // G1 LOs for L
  {
    id: 'g1-ela-l-lo1',
    parentId: 'g1-ela-l',
    nodeType: 'learning_objective',
    name: 'Use common, proper, and possessive nouns. (L.1.1b)',
    description: 'Use common, proper, and possessive nouns.',
    educationalLevel: '1',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.L.1.1b',
    tags: ['grammar', 'nouns', 'possessives']
  },
  {
    id: 'g1-ela-l-lo2',
    parentId: 'g1-ela-l',
    nodeType: 'learning_objective',
    name: 'Use singular and plural nouns with matching verbs. (L.1.1c)',
    description: 'Use singular and plural nouns with matching verbs in basic sentences (e.g., He hops; We hop).',
    educationalLevel: '1',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.L.1.1c',
    tags: ['grammar', 'subject_verb_agreement', 'nouns', 'verbs']
  },

  // Grade 2 ELA - Reviewing and expanding existing G2 ELA data
  {
    id: 'us-g2-ela',
    parentId: 'us-ela',
    nodeType: 'course',
    name: 'Grade 2 English Language Arts',
    description: 'Grade 2 literacy skills, building on Grade 1.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 180,
    prerequisites: ['us-1-ela'],
    tags: ['elementary', 'literacy', 'grade2']
  },
  // Grade 2 Domains
  {
    id: 'g2-ela-rl',
    parentId: 'us-g2-ela',
    nodeType: 'domain',
    name: 'Reading: Literature (RL)',
    description: 'Key Ideas and Details, Craft and Structure, Integration of Knowledge and Ideas, Range of Reading and Level of Text Complexity.',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    tags: ['reading', 'literature']
  },
  {
    id: 'g2-ela-ri',
    parentId: 'us-g2-ela',
    nodeType: 'domain',
    name: 'Reading: Informational Text (RI)',
    description: 'Key Ideas and Details, Craft and Structure, Integration of Knowledge and Ideas, Range of Reading and Level of Text Complexity.',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    tags: ['reading', 'informational_text']
  },
  {
    id: 'g2-ela-rf',
    parentId: 'us-g2-ela',
    nodeType: 'domain',
    name: 'Reading: Foundational Skills (RF)',
    description: 'Print Concepts, Phonological Awareness, Phonics and Word Recognition, Fluency.',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    tags: ['reading', 'foundational_skills', 'phonics', 'fluency']
  },
  {
    id: 'g2-ela-w',
    parentId: 'us-g2-ela',
    nodeType: 'domain',
    name: 'Writing (W)',
    description: 'Text Types and Purposes, Production and Distribution of Writing, Research to Build and Present Knowledge, Range of Writing.',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    tags: ['writing', 'composition']
  },
  {
    id: 'g2-ela-sl',
    parentId: 'us-g2-ela',
    nodeType: 'domain',
    name: 'Speaking & Listening (SL)',
    description: 'Comprehension and Collaboration, Presentation of Knowledge and Ideas.',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    tags: ['speaking', 'listening', 'communication']
  },
  {
    id: 'g2-ela-l',
    parentId: 'us-g2-ela',
    nodeType: 'domain',
    name: 'Language (L)',
    description: 'Conventions of Standard English, Knowledge of Language, Vocabulary Acquisition and Use.',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    tags: ['language', 'grammar', 'vocabulary']
  },
  // Grade 2 LOs (Sample 2-3 per domain)
  {
    id: 'g2-ela-rl-lo1',
    parentId: 'g2-ela-rl',
    nodeType: 'learning_objective',
    name: 'Ask and answer questions about key details in a text (RL.2.1)',
    description: 'Ask and answer such questions as who, what, where, when, why, and how to demonstrate understanding of key details in a text.',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.2.1',
    tags: ['reading_comprehension', 'questioning', 'key_details']
  },
  {
    id: 'g2-ela-rl-lo2',
    parentId: 'g2-ela-rl',
    nodeType: 'learning_objective',
    name: 'Recount stories and determine their central message (RL.2.2)',
    description: 'Recount stories, including fables and folktales from diverse cultures, and determine their central message, lesson, or moral.',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.2.2',
    tags: ['story_retelling', 'central_message', 'fables', 'folktales']
  },
  {
    id: 'g2-ela-rf-lo1',
    parentId: 'g2-ela-rf',
    nodeType: 'learning_objective',
    name: 'Distinguish long and short vowels in one-syllable words (RF.2.3a)',
    description: 'Distinguish long and short vowels when reading regularly spelled one-syllable words.',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RF.2.3a',
    tags: ['phonics', 'vowels', 'decoding']
  },
  {
    id: 'g2-ela-w-lo1',
    parentId: 'g2-ela-w',
    nodeType: 'learning_objective',
    name: 'Write opinion pieces with reasons (W.2.1)',
    description: 'Write opinion pieces in which they introduce the topic or book they are writing about, state an opinion, supply reasons that support the opinion, use linking words (e.g., because, and, also) to connect opinion and reasons, and provide a concluding statement or section.',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.W.2.1',
    tags: ['opinion_writing', 'persuasive_writing', 'reasons', 'linking_words']
  },
  {
    id: 'g2-ela-l-lo1',
    parentId: 'g2-ela-l',
    nodeType: 'learning_objective',
    name: 'Use collective nouns (L.2.1a)',
    description: 'Use collective nouns (e.g., group).',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.L.2.1a',
    tags: ['grammar', 'nouns', 'collective_nouns']
  },
  {
    id: 'g2-ela-sl-lo1',
    parentId: 'g2-ela-sl',
    nodeType: 'learning_objective',
    name: 'Participate in collaborative conversations (SL.2.1)',
    description: 'Participate in collaborative conversations with diverse partners about grade 2 topics and texts with peers and adults in small and larger groups.',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.SL.2.1',
    tags: ['collaboration', 'conversation', 'discussion_skills']
  },

  // Grade 3 ELA - Reviewing and expanding existing G3 ELA data
  {
    id: 'us-g3-ela',
    parentId: 'us-ela',
    nodeType: 'course',
    name: 'Grade 3 English Language Arts',
    description: 'Grade 3 literacy skills.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 180,
    prerequisites: ['us-g2-ela'],
    tags: ['elementary', 'literacy', 'grade3']
  },
  // Grade 3 Domains
  {
    id: 'g3-ela-rl',
    parentId: 'us-g3-ela',
    nodeType: 'domain',
    name: 'Reading: Literature (RL)',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    tags: ['reading', 'literature']
  },
  {
    id: 'g3-ela-ri',
    parentId: 'us-g3-ela',
    nodeType: 'domain',
    name: 'Reading: Informational Text (RI)',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    tags: ['reading', 'informational_text']
  },
  {
    id: 'g3-ela-rf',
    parentId: 'us-g3-ela',
    nodeType: 'domain',
    name: 'Reading: Foundational Skills (RF)',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    tags: ['reading', 'foundational_skills', 'phonics', 'fluency']
  },
  {
    id: 'g3-ela-w',
    parentId: 'us-g3-ela',
    nodeType: 'domain',
    name: 'Writing (W)',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    tags: ['writing', 'composition']
  },
  {
    id: 'g3-ela-sl',
    parentId: 'us-g3-ela',
    nodeType: 'domain',
    name: 'Speaking & Listening (SL)',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    tags: ['speaking', 'listening', 'communication']
  },
  {
    id: 'g3-ela-l',
    parentId: 'us-g3-ela',
    nodeType: 'domain',
    name: 'Language (L)',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    tags: ['language', 'grammar', 'vocabulary']
  },
  // Grade 3 LOs (Sample 2-3 per domain)
  {
    id: 'g3-ela-rl-lo1',
    parentId: 'g3-ela-rl',
    nodeType: 'learning_objective',
    name: 'Ask and answer questions, referring to text (RL.3.1)',
    description: 'Ask and answer questions to demonstrate understanding of a text, referring explicitly to the text as the basis for the answers.',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.3.1',
    tags: ['reading_comprehension', 'textual_evidence']
  },
  {
    id: 'g3-ela-ri-lo1',
    parentId: 'g3-ela-ri',
    nodeType: 'learning_objective',
    name: 'Determine the main idea of a text (RI.3.2)',
    description: 'Determine the main idea of a text; recount the key details and explain how they support the main idea.',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RI.3.2',
    tags: ['main_idea', 'key_details', 'informational_text']
  },
  {
    id: 'g3-ela-rf-lo1',
    parentId: 'g3-ela-rf',
    nodeType: 'learning_objective',
    name: 'Decode multisyllable words (RF.3.3c)',
    description: 'Decode multisyllable words.',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RF.3.3c',
    tags: ['phonics', 'decoding', 'multisyllable_words']
  },
  {
    id: 'g3-ela-w-lo1',
    parentId: 'g3-ela-w',
    nodeType: 'learning_objective',
    name: 'Write opinion pieces with reasons and linking words (W.3.1)',
    description: 'Write opinion pieces on topics or texts, supporting a point of view with reasons. Use linking words and phrases (e.g., because, therefore, since, for example) to connect opinion and reasons.',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.W.3.1',
    tags: ['opinion_writing', 'linking_words', 'reasons']
  },
  {
    id: 'g3-ela-sl-lo1',
    parentId: 'g3-ela-sl',
    nodeType: 'learning_objective',
    name: 'Engage effectively in collaborative discussions (SL.3.1)',
    description: 'Engage effectively in a range of collaborative discussions (one-on-one, in groups, and teacher-led) with diverse partners on grade 3 topics and texts, building on others’ ideas and expressing their own clearly.',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.SL.3.1',
    tags: ['collaborative_discussion', 'communication_skills']
  },
  {
    id: 'g3-ela-l-lo1',
    parentId: 'g3-ela-l',
    nodeType: 'learning_objective',
    name: 'Explain function of nouns, pronouns, verbs, adjectives, adverbs (L.3.1a)',
    description: 'Explain the function of nouns, pronouns, verbs, adjectives, and adverbs in general and their functions in particular sentences.',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.L.3.1a',
    tags: ['grammar', 'parts_of_speech']
  },

  // Grade 4 ELA - Reviewing and expanding existing G4 ELA data
  {
    id: 'us-g4-ela',
    parentId: 'us-ela',
    nodeType: 'course',
    name: 'Grade 4 English Language Arts',
    description: 'Grade 4 literacy skills.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RF.1.2', // Corrected standard
    tags: ['phonological_awareness', 'phonemes', 'syllables']
  },
  {
    id: 'g1-rf-lo2',
    parentId: '1-rf',
    nodeType: 'learning_objective',
    name: 'Know and apply grade-level phonics and word analysis skills in decoding words. (RF.1.3)',
    description: 'Know and apply grade-level phonics and word analysis skills in decoding words.',
    educationalLevel: '1',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RF.1.3',
    tags: ['phonics', 'word_analysis', 'decoding']
  },
  // G1 LOs for W
  {
    id: 'g1-ela-w-lo1',
    parentId: 'g1-ela-w',
    nodeType: 'learning_objective',
    name: 'Write opinion pieces with a reason and sense of closure. (W.1.1)',
    description: 'Write opinion pieces in which they introduce the topic or name the book they are writing about, state an opinion, supply a reason for the opinion, and provide some sense of closure.',
    educationalLevel: '1',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.W.1.1',
    tags: ['opinion_writing', 'reasons', 'closure']
  },
  // G1 LOs for SL
  {
    id: 'g1-ela-sl-lo1',
    parentId: 'g1-ela-sl',
    nodeType: 'learning_objective',
    name: 'Participate in collaborative conversations, building on others\' talk. (SL.1.1)',
    description: 'Participate in collaborative conversations with diverse partners about grade 1 topics and texts with peers and adults in small and larger groups, building on others\' talk in conversations by responding to the comments of others through multiple exchanges.',
    educationalLevel: '1',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.SL.1.1',
    tags: ['collaborative_discussion', 'active_listening', 'conversation_skills']
  },
  // G1 LOs for L
  {
    id: 'g1-ela-l-lo1',
    parentId: 'g1-ela-l',
    nodeType: 'learning_objective',
    name: 'Use common, proper, and possessive nouns. (L.1.1b)',
    description: 'Use common, proper, and possessive nouns.',
    educationalLevel: '1',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.L.1.1b',
    tags: ['grammar', 'nouns', 'possessives']
  },
  {
    id: 'g1-ela-l-lo2',
    parentId: 'g1-ela-l',
    nodeType: 'learning_objective',
    name: 'Use singular and plural nouns with matching verbs. (L.1.1c)',
    description: 'Use singular and plural nouns with matching verbs in basic sentences (e.g., He hops; We hop).',
    educationalLevel: '1',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.L.1.1c',
    tags: ['grammar', 'subject_verb_agreement', 'nouns', 'verbs']
  },

  // Grade 2 ELA - Reviewing and expanding existing G2 ELA data
  {
    id: 'us-g2-ela',
    parentId: 'us-ela',
    nodeType: 'course',
    name: 'Grade 2 English Language Arts',
    description: 'Grade 2 literacy skills, building on Grade 1.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 180,
    prerequisites: ['us-1-ela'],
    tags: ['elementary', 'literacy', 'grade2']
  },
  // Grade 2 Domains
  {
    id: 'g2-ela-rl',
    parentId: 'us-g2-ela',
    nodeType: 'domain',
    name: 'Reading: Literature (RL)',
    description: 'Key Ideas and Details, Craft and Structure, Integration of Knowledge and Ideas, Range of Reading and Level of Text Complexity.',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    tags: ['reading', 'literature']
  },
  {
    id: 'g2-ela-ri',
    parentId: 'us-g2-ela',
    nodeType: 'domain',
    name: 'Reading: Informational Text (RI)',
    description: 'Key Ideas and Details, Craft and Structure, Integration of Knowledge and Ideas, Range of Reading and Level of Text Complexity.',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    tags: ['reading', 'informational_text']
  },
  {
    id: 'g2-ela-rf',
    parentId: 'us-g2-ela',
    nodeType: 'domain',
    name: 'Reading: Foundational Skills (RF)',
    description: 'Print Concepts, Phonological Awareness, Phonics and Word Recognition, Fluency.',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    tags: ['reading', 'foundational_skills', 'phonics', 'fluency']
  },
  {
    id: 'g2-ela-w',
    parentId: 'us-g2-ela',
    nodeType: 'domain',
    name: 'Writing (W)',
    description: 'Text Types and Purposes, Production and Distribution of Writing, Research to Build and Present Knowledge, Range of Writing.',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    tags: ['writing', 'composition']
  },
  {
    id: 'g2-ela-sl',
    parentId: 'us-g2-ela',
    nodeType: 'domain',
    name: 'Speaking & Listening (SL)',
    description: 'Comprehension and Collaboration, Presentation of Knowledge and Ideas.',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    tags: ['speaking', 'listening', 'communication']
  },
  {
    id: 'g2-ela-l',
    parentId: 'us-g2-ela',
    nodeType: 'domain',
    name: 'Language (L)',
    description: 'Conventions of Standard English, Knowledge of Language, Vocabulary Acquisition and Use.',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    tags: ['language', 'grammar', 'vocabulary']
  },
  // Grade 2 LOs (Sample 2-3 per domain)
  {
    id: 'g2-ela-rl-lo1',
    parentId: 'g2-ela-rl',
    nodeType: 'learning_objective',
    name: 'Ask and answer questions about key details in a text (RL.2.1)',
    description: 'Ask and answer such questions as who, what, where, when, why, and how to demonstrate understanding of key details in a text.',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.2.1',
    tags: ['reading_comprehension', 'questioning', 'key_details']
  },
  {
    id: 'g2-ela-rl-lo2',
    parentId: 'g2-ela-rl',
    nodeType: 'learning_objective',
    name: 'Recount stories and determine their central message (RL.2.2)',
    description: 'Recount stories, including fables and folktales from diverse cultures, and determine their central message, lesson, or moral.',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.2.2',
    tags: ['story_retelling', 'central_message', 'fables', 'folktales']
  },
  {
    id: 'g2-ela-rf-lo1',
    parentId: 'g2-ela-rf',
    nodeType: 'learning_objective',
    name: 'Distinguish long and short vowels in one-syllable words (RF.2.3a)',
    description: 'Distinguish long and short vowels when reading regularly spelled one-syllable words.',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RF.2.3a',
    tags: ['phonics', 'vowels', 'decoding']
  },
  {
    id: 'g2-ela-w-lo1',
    parentId: 'g2-ela-w',
    nodeType: 'learning_objective',
    name: 'Write opinion pieces with reasons (W.2.1)',
    description: 'Write opinion pieces in which they introduce the topic or book they are writing about, state an opinion, supply reasons that support the opinion, use linking words (e.g., because, and, also) to connect opinion and reasons, and provide a concluding statement or section.',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.W.2.1',
    tags: ['opinion_writing', 'persuasive_writing', 'reasons', 'linking_words']
  },
  {
    id: 'g2-ela-l-lo1',
    parentId: 'g2-ela-l',
    nodeType: 'learning_objective',
    name: 'Use collective nouns (L.2.1a)',
    description: 'Use collective nouns (e.g., group).',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.L.2.1a',
    tags: ['grammar', 'nouns', 'collective_nouns']
  },
  {
    id: 'g2-ela-sl-lo1',
    parentId: 'g2-ela-sl',
    nodeType: 'learning_objective',
    name: 'Participate in collaborative conversations (SL.2.1)',
    description: 'Participate in collaborative conversations with diverse partners about grade 2 topics and texts with peers and adults in small and larger groups.',
    educationalLevel: '2',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.SL.2.1',
    tags: ['collaboration', 'conversation', 'discussion_skills']
  },

  // Grade 3 ELA - Reviewing and expanding existing G3 ELA data
  {
    id: 'us-g3-ela',
    parentId: 'us-ela',
    nodeType: 'course',
    name: 'Grade 3 English Language Arts',
    description: 'Grade 3 literacy skills.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 180,
    prerequisites: ['us-g2-ela'],
    tags: ['elementary', 'literacy', 'grade3']
  },
  // Grade 3 Domains
  {
    id: 'g3-ela-rl',
    parentId: 'us-g3-ela',
    nodeType: 'domain',
    name: 'Reading: Literature (RL)',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    tags: ['reading', 'literature']
  },
  {
    id: 'g3-ela-ri',
    parentId: 'us-g3-ela',
    nodeType: 'domain',
    name: 'Reading: Informational Text (RI)',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    tags: ['reading', 'informational_text']
  },
  {
    id: 'g3-ela-rf',
    parentId: 'us-g3-ela',
    nodeType: 'domain',
    name: 'Reading: Foundational Skills (RF)',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    tags: ['reading', 'foundational_skills', 'phonics', 'fluency']
  },
  {
    id: 'g3-ela-w',
    parentId: 'us-g3-ela',
    nodeType: 'domain',
    name: 'Writing (W)',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    tags: ['writing', 'composition']
  },
  {
    id: 'g3-ela-sl',
    parentId: 'us-g3-ela',
    nodeType: 'domain',
    name: 'Speaking & Listening (SL)',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    tags: ['speaking', 'listening', 'communication']
  },
  {
    id: 'g3-ela-l',
    parentId: 'us-g3-ela',
    nodeType: 'domain',
    name: 'Language (L)',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    tags: ['language', 'grammar', 'vocabulary']
  },
  // Grade 3 LOs (Sample 2-3 per domain)
  {
    id: 'g3-ela-rl-lo1',
    parentId: 'g3-ela-rl',
    nodeType: 'learning_objective',
    name: 'Ask and answer questions, referring to text (RL.3.1)',
    description: 'Ask and answer questions to demonstrate understanding of a text, referring explicitly to the text as the basis for the answers.',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.3.1',
    tags: ['reading_comprehension', 'textual_evidence']
  },
  {
    id: 'g3-ela-ri-lo1',
    parentId: 'g3-ela-ri',
    nodeType: 'learning_objective',
    name: 'Determine the main idea of a text (RI.3.2)',
    description: 'Determine the main idea of a text; recount the key details and explain how they support the main idea.',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RI.3.2',
    tags: ['main_idea', 'key_details', 'informational_text']
  },
  {
    id: 'g3-ela-rf-lo1',
    parentId: 'g3-ela-rf',
    nodeType: 'learning_objective',
    name: 'Decode multisyllable words (RF.3.3c)',
    description: 'Decode multisyllable words.',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RF.3.3c',
    tags: ['phonics', 'decoding', 'multisyllable_words']
  },
  {
    id: 'g3-ela-w-lo1',
    parentId: 'g3-ela-w',
    nodeType: 'learning_objective',
    name: 'Write opinion pieces with reasons and linking words (W.3.1)',
    description: 'Write opinion pieces on topics or texts, supporting a point of view with reasons. Use linking words and phrases (e.g., because, therefore, since, for example) to connect opinion and reasons.',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.W.3.1',
    tags: ['opinion_writing', 'linking_words', 'reasons']
  },
  {
    id: 'g3-ela-sl-lo1',
    parentId: 'g3-ela-sl',
    nodeType: 'learning_objective',
    name: 'Engage effectively in collaborative discussions (SL.3.1)',
    description: 'Engage effectively in a range of collaborative discussions (one-on-one, in groups, and teacher-led) with diverse partners on grade 3 topics and texts, building on others’ ideas and expressing their own clearly.',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.SL.3.1',
    tags: ['collaborative_discussion', 'communication_skills']
  },
  {
    id: 'g3-ela-l-lo1',
    parentId: 'g3-ela-l',
    nodeType: 'learning_objective',
    name: 'Explain function of nouns, pronouns, verbs, adjectives, adverbs (L.3.1a)',
    description: 'Explain the function of nouns, pronouns, verbs, adjectives, and adverbs in general and their functions in particular sentences.',
    educationalLevel: '3',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.L.3.1a',
    tags: ['grammar', 'parts_of_speech']
  },

  // Grade 4 ELA - Reviewing and expanding existing G4 ELA data
  {
    id: 'us-g4-ela',
    parentId: 'us-ela',
    nodeType: 'course',
    name: 'Grade 4 English Language Arts',
    description: 'Grade 4 literacy skills.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 180,
    prerequisites: ['us-g3-ela'],
    tags: ['elementary', 'literacy', 'grade4']
  },
  // Grade 4 Domains
  {
    id: 'g4-ela-rl',
    parentId: 'us-g4-ela',
    nodeType: 'domain',
    name: 'Reading: Literature (RL)',
    educationalLevel: '4',
    subject: NELIESubject.ENGLISH,
    tags: ['reading', 'literature']
  },
  {
    id: 'g4-ela-ri',
    parentId: 'us-g4-ela',
    nodeType: 'domain',
    name: 'Reading: Informational Text (RI)',
    educationalLevel: '4',
    subject: NELIESubject.ENGLISH,
    tags: ['reading', 'informational_text']
  },
  {
    id: 'g4-ela-rf',
    parentId: 'us-g4-ela',
    nodeType: 'domain',
    name: 'Reading: Foundational Skills (RF)',
    educationalLevel: '4',
    subject: NELIESubject.ENGLISH,
    tags: ['reading', 'foundational_skills', 'phonics', 'fluency']
  },
  {
    id: 'g4-ela-w',
    parentId: 'us-g4-ela',
    nodeType: 'domain',
    name: 'Writing (W)',
    educationalLevel: '4',
    subject: NELIESubject.ENGLISH,
    tags: ['writing', 'composition']
  },
  {
    id: 'g4-ela-sl',
    parentId: 'us-g4-ela',
    nodeType: 'domain',
    name: 'Speaking & Listening (SL)',
    educationalLevel: '4',
    subject: NELIESubject.ENGLISH,
    tags: ['speaking', 'listening', 'communication']
  },
  {
    id: 'g4-ela-l',
    parentId: 'us-g4-ela',
    nodeType: 'domain',
    name: 'Language (L)',
    educationalLevel: '4',
    subject: NELIESubject.ENGLISH,
    tags: ['language', 'grammar', 'vocabulary']
  },
  // Grade 4 LOs (Sample 2-3 per domain)
  {
    id: 'g4-ela-rl-lo1',
    parentId: 'g4-ela-rl',
    nodeType: 'learning_objective',
    name: 'Refer to details/examples when explaining text/inferences (RL.4.1)',
    description: 'Refer to details and examples in a text when explaining what the text says explicitly and when drawing inferences from the text.',
    educationalLevel: '4',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.4.1',
    tags: ['reading_comprehension', 'textual_evidence', 'inference']
  },
  {
    id: 'g4-ela-ri-lo1',
    parentId: 'g4-ela-ri',
    nodeType: 'learning_objective',
    name: 'Determine main idea and explain its support by key details (RI.4.2)',
    description: 'Determine the main idea of a text and explain how it is supported by key details; summarize the text.',
    educationalLevel: '4',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RI.4.2',
    tags: ['main_idea', 'key_details', 'summarizing', 'informational_text']
  },
  {
    id: 'g4-ela-w-lo1',
    parentId: 'g4-ela-w',
    nodeType: 'learning_objective',
    name: 'Write opinion pieces with reasons and information (W.4.1)',
    description: 'Write opinion pieces on topics or texts, supporting a point of view with reasons and information.',
    educationalLevel: '4',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.W.4.1',
    tags: ['opinion_writing', 'supporting_reasons', 'information_gathering']
  },
  {
    id: 'g4-ela-l-lo1',
    parentId: 'g4-ela-l',
    nodeType: 'learning_objective',
    name: 'Use relative pronouns and adverbs (L.4.1a)',
    description: 'Use relative pronouns (who, whose, whom, which, that) and relative adverbs (where, when, why).',
    educationalLevel: '4',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.L.4.1a',
    tags: ['grammar', 'pronouns', 'adverbs', 'sentence_structure']
  },

  // Grade 5 ELA
  {
    id: 'us-g5-ela',
    parentId: 'us-ela',
    nodeType: 'course',
    name: 'Grade 5 English Language Arts',
    description: 'Grade 5 literacy skills, preparing for middle school.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 180,
    prerequisites: ['us-g4-ela'],
    tags: ['elementary', 'literacy', 'grade5', 'transition_to_middle_school']
  },
  // Grade 5 Domains
  {
    id: 'g5-ela-rl',
    parentId: 'us-g5-ela',
    nodeType: 'domain',
    name: 'Reading: Literature (RL)',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    tags: ['reading', 'literature', 'analysis']
  },
  {
    id: 'g5-ela-ri',
    parentId: 'us-g5-ela',
    nodeType: 'domain',
    name: 'Reading: Informational Text (RI)',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    tags: ['reading', 'informational_text', 'research_skills']
  },
  {
    id: 'g5-ela-rf',
    parentId: 'us-g5-ela',
    nodeType: 'domain',
    name: 'Reading: Foundational Skills (RF)',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    tags: ['reading', 'foundational_skills', 'fluency', 'word_analysis']
  },
  {
    id: 'g5-ela-w',
    parentId: 'us-g5-ela',
    nodeType: 'domain',
    name: 'Writing (W)',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    tags: ['writing', 'composition', 'argumentation', 'research_writing']
  },
  {
    id: 'g5-ela-sl',
    parentId: 'us-g5-ela',
    nodeType: 'domain',
    name: 'Speaking & Listening (SL)',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    tags: ['speaking', 'listening', 'presentation_skills', 'discussion']
  },
  {
    id: 'g5-ela-l',
    parentId: 'us-g5-ela',
    nodeType: 'domain',
    name: 'Language (L)',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    tags: ['language', 'grammar', 'vocabulary', 'conventions']
  },
  // Grade 5 LOs (Expanded to 3-5 per domain)
  {
    id: 'g5-ela-rl-lo1',
    parentId: 'g5-ela-rl',
    nodeType: 'learning_objective',
    name: 'Quote accurately from text for explanations/inferences (RL.5.1)',
    description: 'Quote accurately from a text when explaining what the text says explicitly and when drawing inferences from the text.',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.5.1',
    tags: ['reading_comprehension', 'textual_evidence', 'quoting', 'inference']
  },
  {
    id: 'g5-ela-rl-lo2',
    parentId: 'g5-ela-rl',
    nodeType: 'learning_objective',
    name: 'Determine a theme from details in text (RL.5.2)',
    description: 'Determine a theme of a story, drama, or poem from details in the text, including how characters in a story or drama respond to challenges or how the speaker in a poem reflects upon a topic; summarize the text.',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.5.2',
    tags: ['theme', 'summarizing', 'character_response']
  },
  {
    id: 'g5-ela-rl-lo3',
    parentId: 'g5-ela-rl',
    nodeType: 'learning_objective',
    name: 'Compare and contrast stories in the same genre (RL.5.9)',
    description: 'Compare and contrast stories in the same genre (e.g., mysteries, adventure stories) on their approaches to similar themes and topics.',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.5.9',
    tags: ['genre_comparison', 'theme_analysis', 'text_comparison']
  },
  {
    id: 'g5-ela-ri-lo1',
    parentId: 'g5-ela-ri',
    nodeType: 'learning_objective',
    name: 'Determine two or more main ideas and their support (RI.5.2)',
    description: 'Determine two or more main ideas of a text and explain how they are supported by key details; summarize the text.',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RI.5.2',
    tags: ['main_idea', 'multiple_main_ideas', 'key_details', 'summarizing']
  },
  {
    id: 'g5-ela-ri-lo2',
    parentId: 'g5-ela-ri',
    nodeType: 'learning_objective',
    name: 'Explain relationships between individuals, events, ideas in a text (RI.5.3)',
    description: 'Explain the relationships or interactions between two or more individuals, events, ideas, or concepts in a historical, scientific, or technical text based on specific information in the text.',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RI.5.3',
    tags: ['text_relationships', 'cause_effect', 'compare_contrast']
  },
  {
    id: 'g5-ela-rf-lo1',
    parentId: 'g5-ela-rf',
    nodeType: 'learning_objective',
    name: 'Use phonics & word analysis for multisyllabic words (RF.5.3a)',
    description: 'Use combined knowledge of all letter-sound correspondences, syllabication patterns, and morphology (e.g., roots and affixes) to read accurately unfamiliar multisyllabic words in context and out of context.',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RF.5.3a',
    tags: ['phonics', 'word_analysis', 'multisyllabic_words', 'decoding']
  },
  {
    id: 'g5-ela-rf-lo2',
    parentId: 'g5-ela-rf',
    nodeType: 'learning_objective',
    name: 'Read with sufficient accuracy and fluency (RF.5.4)',
    description: 'Read with sufficient accuracy and fluency to support comprehension.',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RF.5.4',
    tags: ['reading_fluency', 'accuracy', 'comprehension_support']
  },
  {
    id: 'g5-ela-w-lo1',
    parentId: 'g5-ela-w',
    nodeType: 'learning_objective',
    name: 'Write opinion pieces with logically grouped reasons (W.5.1)',
    description: 'Write opinion pieces on topics or texts, supporting a point of view with reasons and information. Introduce a topic or text clearly, state an opinion, and create an organizational structure in which ideas are logically grouped to support the writer’s purpose.',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.W.5.1',
    tags: ['opinion_writing', 'logical_reasoning', 'organizational_structure']
  },
  {
    id: 'g5-ela-w-lo2',
    parentId: 'g5-ela-w',
    nodeType: 'learning_objective',
    name: 'Write informative texts to examine a topic (W.5.2)',
    description: 'Write informative/explanatory texts to examine a topic and convey ideas and information clearly.',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.W.5.2',
    tags: ['informative_writing', 'explanatory_writing', 'topic_examination']
  },
  {
    id: 'g5-ela-sl-lo1',
    parentId: 'g5-ela-sl',
    nodeType: 'learning_objective',
    name: 'Engage effectively in collaborative discussions (SL.5.1)',
    description: 'Engage effectively in a range of collaborative discussions (one-on-one, in groups, and teacher-led) with diverse partners on grade 5 topics and texts, building on others’ ideas and expressing their own clearly.',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.SL.5.1',
    tags: ['collaborative_discussion', 'active_listening', 'expressing_ideas']
  },
  {
    id: 'g5-ela-l-lo1',
    parentId: 'g5-ela-l',
    nodeType: 'learning_objective',
    name: 'Use verb tenses, including perfect tenses (L.5.1b-d)',
    description: 'Form and use the perfect (e.g., I had walked; I have walked; I will have walked) verb tenses. Use verb tense to convey various times, sequences, states, and conditions. Recognize and correct inappropriate shifts in verb tense.',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.L.5.1b-d',
    tags: ['grammar', 'verb_tenses', 'perfect_tenses', 'verb_shifts']
  },
  {
    id: 'g5-ela-l-lo2',
    parentId: 'g5-ela-l',
    nodeType: 'learning_objective',
    name: 'Use correlative conjunctions (L.5.1e)',
    description: 'Use correlative conjunctions (e.g., either/or, neither/nor).',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.L.5.1e',
    tags: ['grammar', 'conjunctions', 'correlative_conjunctions']
  }
];
