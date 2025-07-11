
import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const usElaCurriculumNodes: CurriculumNode[] = [
  // US ELA Root
  {
    id: 'us-ela',
    parentId: 'us',
    nodeType: 'subject',
    name: 'English Language Arts',
    description: 'K-12 English Language Arts curriculum following Common Core State Standards',
    countryCode: 'US',
    languageCode: 'en',
    subjectName: 'English Language Arts',
    tags: ['core_subject', 'literacy']
  },

  // Kindergarten ELA
  {
    id: 'us-k-ela',
    parentId: 'us-ela',
    nodeType: 'course',
    name: 'Kindergarten English Language Arts',
    description: 'Foundational literacy skills for kindergarten students',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH, // Added
    estimatedDuration: 150,
    tags: ['foundational', 'literacy', 'early_childhood']
  },

  // K.RF - Reading: Foundational Skills
  {
    id: 'k-rf',
    parentId: 'us-k-ela',
    nodeType: 'domain',
    name: 'Reading: Foundational Skills',
    description: 'Print concepts, phonological awareness, phonics and word recognition, and fluency',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH, // Added
    sourceIdentifier: 'K.RF',
    tags: ['reading', 'phonics', 'foundational']
  },

  {
    id: 'k-rf-1',
    parentId: 'k-rf',
    nodeType: 'learning_objective',
    name: 'Print concepts',
    description: 'Demonstrate understanding of the organization and basic features of print',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH, // Added
    sourceIdentifier: 'K.RF.A.1',
    estimatedDuration: 30,
    tags: ['print_concepts', 'reading_foundations']
  },

  // Grade 1 ELA
  {
    id: 'us-1-ela',
    parentId: 'us-ela',
    nodeType: 'course',
    name: 'Grade 1 English Language Arts',
    description: 'First grade literacy skills building on kindergarten foundations',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH, // Added
    estimatedDuration: 180,
    prerequisites: ['us-k-ela'],
    tags: ['elementary', 'literacy']
  },

  {
    id: '1-rf',
    parentId: 'us-1-ela',
    nodeType: 'domain',
    name: 'Reading: Foundational Skills',
    description: 'Phonological awareness, phonics and word recognition, and fluency',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH, // Added
    sourceIdentifier: '1.RF',
    tags: ['reading', 'phonics', 'fluency']
  },

  {
    id: '1-rf-1',
    parentId: '1-rf',
    nodeType: 'learning_objective',
    name: 'Phonological awareness',
    description: 'Demonstrate understanding of spoken words, syllables, and sounds (phonemes)',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH, // Added
    sourceIdentifier: '1.RF.B.2',
    estimatedDuration: 40,
    prerequisites: ['k-rf-1'],
    tags: ['phonological_awareness', 'phonemes']
  },

  // Grade 2 ELA
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

  // Grade 3 ELA
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

  // Grade 4 ELA
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
  // Grade 5 LOs (Sample 2-3 per domain)
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
    id: 'g5-ela-l-lo1',
    parentId: 'g5-ela-l',
    nodeType: 'learning_objective',
    name: 'Explain function of conjunctions, prepositions, interjections (L.5.1a)',
    description: 'Explain the function of conjunctions, prepositions, and interjections in general and their function in particular sentences.',
    educationalLevel: '5',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.L.5.1a',
    tags: ['grammar', 'parts_of_speech', 'conjunctions', 'prepositions', 'interjections']
  }
];
