import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const mockCurriculumData: CurriculumNode[] = [
  // Root countries
  {
    id: 'us',
    parentId: null,
    nodeType: 'country',
    name: 'United States',
    countryCode: 'US',
    languageCode: 'en'
  },
  {
    id: 'dk',
    parentId: null,
    nodeType: 'country',
    name: 'Denmark',
    countryCode: 'DK',
    languageCode: 'da'
  },

  // Grade levels for US - Expanded K-6
  {
    id: 'us-gk',
    parentId: 'us',
    nodeType: 'grade_level',
    name: 'Kindergarten',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K'
  },
  {
    id: 'us-g1',
    parentId: 'us',
    nodeType: 'grade_level',
    name: 'Grade 1',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1'
  },
  {
    id: 'us-g2',
    parentId: 'us',
    nodeType: 'grade_level',
    name: 'Grade 2',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2'
  },
  {
    id: 'us-g3',
    parentId: 'us',
    nodeType: 'grade_level',
    name: 'Grade 3',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3'
  },
  {
    id: 'us-g4',
    parentId: 'us',
    nodeType: 'grade_level',
    name: 'Grade 4',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4'
  },
  {
    id: 'us-g5',
    parentId: 'us',
    nodeType: 'grade_level',
    name: 'Grade 5',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5'
  },
  {
    id: 'us-g6',
    parentId: 'us',
    nodeType: 'grade_level',
    name: 'Grade 6',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6'
  },

  // Grade levels for Denmark
  {
    id: 'dk-g6',
    parentId: 'dk',
    nodeType: 'grade_level',
    name: '6. klasse',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6'
  },

  // ========== US MATHEMATICS K-2 DETAILED EXPANSION ==========

  // Kindergarten Math Subject
  {
    id: 'us-gk-math',
    parentId: 'us-gk',
    nodeType: 'subject',
    name: 'Mathematics',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH
  },

  // Kindergarten Math Domains
  {
    id: 'us-gk-math-cc',
    parentId: 'us-gk-math',
    nodeType: 'domain',
    name: 'Counting and Cardinality',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.K.CC'
  },
  {
    id: 'us-gk-math-oa',
    parentId: 'us-gk-math',
    nodeType: 'domain',
    name: 'Operations and Algebraic Thinking',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.K.OA'
  },

  // Kindergarten Counting and Cardinality Learning Objectives
  {
    id: 'us-gk-math-cc-1',
    parentId: 'us-gk-math-cc',
    nodeType: 'learning_objective',
    name: 'Count to 100 by ones and tens',
    description: 'Count to 100 by ones and by tens.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.K.CC.A.1',
    estimatedDuration: 30,
    tags: ['counting', 'foundational', 'number_sequence']
  },
  {
    id: 'us-gk-math-cc-3',
    parentId: 'us-gk-math-cc',
    nodeType: 'learning_objective',
    name: 'Write numbers 0-20',
    description: 'Write numbers from 0 to 20. Represent a number of objects with a written numeral 0-20.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.K.CC.A.3',
    estimatedDuration: 25,
    tags: ['number_writing', 'numerals', 'representation']
  },

  // Kindergarten Knowledge Components
  {
    id: 'us-gk-math-cc-1-kc1',
    parentId: 'us-gk-math-cc-1',
    nodeType: 'kc',
    name: 'Count by ones to 100',
    description: 'Recite counting sequence from 1 to 100',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    estimatedDuration: 15,
    tags: ['counting', 'sequence'],
    subjectSpecific: {
      mathDomain: 'arithmetic',
      problemType: 'computation'
    }
  },
  {
    id: 'us-gk-math-cc-1-kc2',
    parentId: 'us-gk-math-cc-1',
    nodeType: 'kc',
    name: 'Count by tens to 100',
    description: 'Skip count by tens: 10, 20, 30... 100',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    estimatedDuration: 15,
    tags: ['skip_counting', 'tens'],
    subjectSpecific: {
      mathDomain: 'arithmetic',
      problemType: 'computation'
    }
  },

  // Grade 1 Math Subject
  {
    id: 'us-g1-math',
    parentId: 'us-g1',
    nodeType: 'subject',
    name: 'Mathematics',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH
  },

  // Grade 1 Math Domains
  {
    id: 'us-g1-math-oa',
    parentId: 'us-g1-math',
    nodeType: 'domain',
    name: 'Operations and Algebraic Thinking',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.1.OA'
  },
  {
    id: 'us-g1-math-nbt',
    parentId: 'us-g1-math',
    nodeType: 'domain',
    name: 'Number and Operations in Base Ten',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.1.NBT'
  },

  // Grade 1 Learning Objectives
  {
    id: 'us-g1-math-oa-1',
    parentId: 'us-g1-math-oa',
    nodeType: 'learning_objective',
    name: 'Addition and subtraction within 20',
    description: 'Use addition and subtraction within 20 to solve word problems involving situations of adding to, taking from, putting together, taking apart, and comparing.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.1.OA.A.1',
    estimatedDuration: 40,
    tags: ['addition', 'subtraction', 'word_problems']
  },
  {
    id: 'us-g1-math-nbt-1',
    parentId: 'us-g1-math-nbt',
    nodeType: 'learning_objective',
    name: 'Count to 120',
    description: 'Count to 120, starting at any number less than 120. Read and write numerals and represent objects with numerals.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.1.NBT.A.1',
    estimatedDuration: 35,
    tags: ['counting', 'numerals', 'place_value']
  },

  // Grade 1 Knowledge Components
  {
    id: 'us-g1-math-oa-1-kc1',
    parentId: 'us-g1-math-oa-1',
    nodeType: 'kc',
    name: 'Addition within 10',
    description: 'Add two single-digit numbers with sum ≤ 10',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    estimatedDuration: 20,
    tags: ['addition', 'basic_facts'],
    subjectSpecific: {
      mathDomain: 'arithmetic',
      problemType: 'computation'
    }
  },
  {
    id: 'us-g1-math-oa-1-kc2',
    parentId: 'us-g1-math-oa-1',
    nodeType: 'kc',
    name: 'Subtraction within 10',
    description: 'Subtract single-digit numbers with minuend ≤ 10',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    estimatedDuration: 20,
    tags: ['subtraction', 'basic_facts'],
    subjectSpecific: {
      mathDomain: 'arithmetic',
      problemType: 'computation'
    }
  },

  // Grade 2 Math Subject
  {
    id: 'us-g2-math',
    parentId: 'us-g2',
    nodeType: 'subject',
    name: 'Mathematics',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH
  },

  // Grade 2 Math Domains
  {
    id: 'us-g2-math-oa',
    parentId: 'us-g2-math',
    nodeType: 'domain',
    name: 'Operations and Algebraic Thinking',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.2.OA'
  },
  {
    id: 'us-g2-math-nbt',
    parentId: 'us-g2-math',
    nodeType: 'domain',
    name: 'Number and Operations in Base Ten',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.2.NBT'
  },
  {
    id: 'us-g2-math-md',
    parentId: 'us-g2-math',
    nodeType: 'domain',
    name: 'Measurement and Data',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.2.MD'
  },

  // Grade 2 Learning Objectives
  {
    id: 'us-g2-math-oa-1',
    parentId: 'us-g2-math-oa',
    nodeType: 'learning_objective',
    name: 'Addition and subtraction within 100',
    description: 'Use addition and subtraction within 100 to solve one- and two-step word problems.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.2.OA.A.1',
    estimatedDuration: 45,
    tags: ['addition', 'subtraction', 'word_problems', 'two_step']
  },
  {
    id: 'us-g2-math-nbt-5',
    parentId: 'us-g2-math-nbt',
    nodeType: 'learning_objective',
    name: 'Fluently add and subtract within 100',
    description: 'Fluently add and subtract within 100 using strategies based on place value, properties of operations, and/or the relationship between addition and subtraction.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.2.NBT.B.5',
    estimatedDuration: 40,
    tags: ['fluency', 'place_value', 'strategies']
  },

  // Grade 2 Knowledge Components
  {
    id: 'us-g2-math-oa-1-kc1',
    parentId: 'us-g2-math-oa-1',
    nodeType: 'kc',
    name: 'Two-digit addition without regrouping',
    description: 'Add two-digit numbers without carrying/regrouping',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    estimatedDuration: 25,
    tags: ['addition', 'place_value'],
    subjectSpecific: {
      mathDomain: 'arithmetic',
      problemType: 'computation'
    }
  },
  {
    id: 'us-g2-math-oa-1-kc2',
    parentId: 'us-g2-math-oa-1',
    nodeType: 'kc',
    name: 'Two-digit addition with regrouping',
    description: 'Add two-digit numbers with carrying/regrouping',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    estimatedDuration: 30,
    tags: ['addition', 'regrouping', 'place_value'],
    subjectSpecific: {
      mathDomain: 'arithmetic',
      problemType: 'computation'
    }
  },

  // ========== CONTINUING WITH EXISTING GRADE 3+ DATA ==========

  // Subjects for US Grade 3
  {
    id: 'us-g3-math',
    parentId: 'us-g3',
    nodeType: 'subject',
    name: 'Mathematics',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH
  },

  // US Grade 3 ELA
  {
    id: 'us-g3-ela',
    parentId: 'us-g3',
    nodeType: 'subject',
    name: 'English Language Arts',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH
  },

  // US Grade 4 ELA
  {
    id: 'us-g4-ela',
    parentId: 'us-g4',
    nodeType: 'subject',
    name: 'English Language Arts',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH
  },

  // US Grade 5 ELA
  {
    id: 'us-g5-ela',
    parentId: 'us-g5',
    nodeType: 'subject',
    name: 'English Language Arts',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH
  },

  // Subjects for US Grade 6
  {
    id: 'us-g6-math',
    parentId: 'us-g6',
    nodeType: 'subject',
    name: 'Mathematics',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH
  },
  {
    id: 'us-g6-ela',
    parentId: 'us-g6',
    nodeType: 'subject',
    name: 'English Language Arts',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH
  },

  // ========== SCIENCE K-5 BASIC STRUCTURES ==========

  // Science subjects for each grade K-5
  {
    id: 'us-gk-science',
    parentId: 'us-gk',
    nodeType: 'subject',
    name: 'Science',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Science',
    subject: NELIESubject.SCIENCE
  },
  {
    id: 'us-g1-science',
    parentId: 'us-g1',
    nodeType: 'subject',
    name: 'Science',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'Science',
    subject: NELIESubject.SCIENCE
  },
  {
    id: 'us-g2-science',
    parentId: 'us-g2',
    nodeType: 'subject',
    name: 'Science',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Science',
    subject: NELIESubject.SCIENCE
  },
  {
    id: 'us-g3-science',
    parentId: 'us-g3',
    nodeType: 'subject',
    name: 'Science',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Science',
    subject: NELIESubject.SCIENCE
  },
  {
    id: 'us-g4-science',
    parentId: 'us-g4',
    nodeType: 'subject',
    name: 'Science',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'Science',
    subject: NELIESubject.SCIENCE
  },
  {
    id: 'us-g5-science',
    parentId: 'us-g5',
    nodeType: 'subject',
    name: 'Science',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'Science',
    subject: NELIESubject.SCIENCE
  },

  // Sample Science Domains (K-2 examples)
  {
    id: 'us-gk-science-ps',
    parentId: 'us-gk-science',
    nodeType: 'domain',
    name: 'Physical Sciences',
    description: 'Pushes and pulls, materials and properties',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Science',
    subject: NELIESubject.SCIENCE,
    sourceIdentifier: 'K-PS'
  },
  {
    id: 'us-g1-science-ls',
    parentId: 'us-g1-science',
    nodeType: 'domain',
    name: 'Life Sciences',
    description: 'Plant and animal structures and behaviors',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'Science',
    subject: NELIESubject.SCIENCE,
    sourceIdentifier: '1-LS'
  },

  // Sample Science Learning Objectives
  {
    id: 'us-gk-science-ps-lo1',
    parentId: 'us-gk-science-ps',
    nodeType: 'learning_objective',
    name: 'Pushes and pulls can change motion',
    description: 'Plan and conduct an investigation to compare the effects of different strengths or different directions of pushes and pulls on the motion of an object.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Science',
    subject: NELIESubject.SCIENCE,
    sourceIdentifier: 'K-PS2-1',
    estimatedDuration: 45,
    tags: ['forces', 'motion', 'investigation']
  },

  // ========== US ELA GRADES 3-5 DETAILED STRUCTURE ==========

  // Grade 3 ELA Domains
  {
    id: 'us-g3-ela-rl',
    parentId: 'us-g3-ela',
    nodeType: 'domain',
    name: 'Reading: Literature',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.3'
  },
  {
    id: 'us-g3-ela-ri',
    parentId: 'us-g3-ela',
    nodeType: 'domain',
    name: 'Reading: Informational Text',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RI.3'
  },
  {
    id: 'us-g3-ela-w',
    parentId: 'us-g3-ela',
    nodeType: 'domain',
    name: 'Writing',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.W.3'
  },
  {
    id: 'us-g3-ela-l',
    parentId: 'us-g3-ela',
    nodeType: 'domain',
    name: 'Language',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.L.3'
  },

  // Grade 3 ELA Learning Objective Example
  {
    id: 'us-g3-ela-rl-1',
    parentId: 'us-g3-ela-rl',
    nodeType: 'learning_objective',
    name: 'Ask and answer questions about text',
    description: 'Ask and answer questions to demonstrate understanding of a text, referring explicitly to the text as the basis for the answers.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.3.1',
    estimatedDuration: 40,
    tags: ['reading_comprehension', 'questioning', 'textual_evidence']
  },

  // Grade 3 ELA Knowledge Components
  {
    id: 'us-g3-ela-rl-1-kc1',
    parentId: 'us-g3-ela-rl-1',
    nodeType: 'kc',
    name: 'Generate questions about text',
    description: 'Create appropriate questions about story elements and details',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 20,
    tags: ['questioning'],
    subjectSpecific: {
      linguisticSkill: 'reading',
      textType: 'literary'
    }
  },
  {
    id: 'us-g3-ela-rl-1-kc2',
    parentId: 'us-g3-ela-rl-1',
    nodeType: 'kc',
    name: 'Find text evidence for answers',
    description: 'Locate specific details in text to support answers',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 20,
    tags: ['textual_evidence'],
    subjectSpecific: {
      linguisticSkill: 'reading',
      textType: 'literary'
    }
  },

  // Grade 4 ELA Domains (similar structure)
  {
    id: 'us-g4-ela-rl',
    parentId: 'us-g4-ela',
    nodeType: 'domain',
    name: 'Reading: Literature',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.4'
  },
  {
    id: 'us-g4-ela-ri',
    parentId: 'us-g4-ela',
    nodeType: 'domain',
    name: 'Reading: Informational Text',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RI.4'
  },
  {
    id: 'us-g4-ela-w',
    parentId: 'us-g4-ela',
    nodeType: 'domain',
    name: 'Writing',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.W.4'
  },
  {
    id: 'us-g4-ela-l',
    parentId: 'us-g4-ela',
    nodeType: 'domain',
    name: 'Language',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.L.4'
  },

  // Grade 4 ELA Learning Objective Example
  {
    id: 'us-g4-ela-rl-2',
    parentId: 'us-g4-ela-rl',
    nodeType: 'learning_objective',
    name: 'Determine theme and summarize',
    description: 'Determine a theme of a story, drama, or poem from details in the text; summarize the text.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.4.2',
    estimatedDuration: 45,
    tags: ['theme', 'summarizing', 'literary_analysis']
  },

  // Grade 4 ELA Knowledge Components
  {
    id: 'us-g4-ela-rl-2-kc1',
    parentId: 'us-g4-ela-rl-2',
    nodeType: 'kc',
    name: 'Identify theme in literature',
    description: 'Recognize the central message or lesson in stories and poems',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 25,
    tags: ['theme', 'main_idea'],
    subjectSpecific: {
      linguisticSkill: 'reading',
      textType: 'literary'
    }
  },
  {
    id: 'us-g4-ela-rl-2-kc2',
    parentId: 'us-g4-ela-rl-2',
    nodeType: 'kc',
    name: 'Summarize literary text',
    description: 'Provide concise summary of key events and details',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 20,
    tags: ['summarizing'],
    subjectSpecific: {
      linguisticSkill: 'reading',
      textType: 'literary'
    }
  },

  // Grade 5 ELA Domains (similar structure)
  {
    id: 'us-g5-ela-rl',
    parentId: 'us-g5-ela',
    nodeType: 'domain',
    name: 'Reading: Literature',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.5'
  },
  {
    id: 'us-g5-ela-ri',
    parentId: 'us-g5-ela',
    nodeType: 'domain',
    name: 'Reading: Informational Text',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RI.5'
  },
  {
    id: 'us-g5-ela-w',
    parentId: 'us-g5-ela',
    nodeType: 'domain',
    name: 'Writing',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.W.5'
  },
  {
    id: 'us-g5-ela-l',
    parentId: 'us-g5-ela',
    nodeType: 'domain',
    name: 'Language',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.L.5'
  },

  // Grade 5 ELA Learning Objective Example
  {
    id: 'us-g5-ela-rl-3',
    parentId: 'us-g5-ela-rl',
    nodeType: 'learning_objective',
    name: 'Compare and contrast characters',
    description: 'Compare and contrast two or more characters, settings, or events in a story or drama, drawing on specific details in the text.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.5.3',
    estimatedDuration: 50,
    tags: ['compare_contrast', 'character_analysis', 'textual_details']
  },

  // Grade 5 ELA Knowledge Components
  {
    id: 'us-g5-ela-rl-3-kc1',
    parentId: 'us-g5-ela-rl-3',
    nodeType: 'kc',
    name: 'Analyze character traits',
    description: 'Identify and describe character motivations, actions, and relationships',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 25,
    tags: ['character_analysis'],
    subjectSpecific: {
      linguisticSkill: 'reading',
      textType: 'literary'
    }
  },
  {
    id: 'us-g5-ela-rl-3-kc2',
    parentId: 'us-g5-ela-rl-3',
    nodeType: 'kc',
    name: 'Compare using text evidence',
    description: 'Use specific details from text to support comparisons',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 25,
    tags: ['textual_evidence', 'compare_contrast'],
    subjectSpecific: {
      linguisticSkill: 'reading',
      textType: 'literary'
    }
  },

  // ========== CONTINUING WITH EXISTING CURRICULUM ==========

  // Domains for US Grade 3 Math
  {
    id: 'us-g3-math-oa',
    parentId: 'us-g3-math',
    nodeType: 'domain',
    name: 'Operations and Algebraic Thinking',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.3.OA'
  },

  // Topics for US Grade 3 Math OA
  {
    id: 'us-g3-math-oa-1',
    parentId: 'us-g3-math-oa',
    nodeType: 'topic',
    name: 'Interpret products of whole numbers',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.3.OA.A.1'
  },

  // Learning objectives for US Grade 3 Math
  {
    id: 'us-g3-math-oa-1-obj1',
    parentId: 'us-g3-math-oa-1',
    nodeType: 'learning_objective',
    name: 'Interpret products of whole numbers',
    description: 'Interpret products of whole numbers, e.g., interpret 5 × 7 as the total number of objects in 5 groups of 7 objects each.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.3.OA.A.1',
    estimatedDuration: 45,
    tags: ['foundational', 'multiplication']
  },

  // Knowledge components for US Grade 3 Math
  {
    id: 'us-g3-math-oa-1-obj1-kc1',
    parentId: 'us-g3-math-oa-1-obj1',
    nodeType: 'kc',
    name: 'Understand multiplication as groups',
    description: 'Understand that multiplication represents equal groups',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    estimatedDuration: 20,
    tags: ['foundational'],
    subjectSpecific: {
      mathDomain: 'arithmetic',
      problemType: 'word_problem'
    }
  },
  {
    id: 'us-g3-math-oa-1-obj1-kc2',
    parentId: 'us-g3-math-oa-1-obj1',
    nodeType: 'kc',
    name: 'Count objects in equal groups',
    description: 'Count the total number of objects arranged in equal groups',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    estimatedDuration: 20,
    tags: ['foundational'],
    subjectSpecific: {
      mathDomain: 'arithmetic',
      problemType: 'computation'
    }
  },

  // Domains for US Grade 6 Math
  {
    id: 'us-g6-math-rp',
    parentId: 'us-g6-math',
    nodeType: 'domain',
    name: 'Ratios and Proportional Relationships',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.6.RP'
  },

  // Topics for US Grade 6 Math RP
  {
    id: 'us-g6-math-rp-1',
    parentId: 'us-g6-math-rp',
    nodeType: 'topic',
    name: 'Understand ratio concepts and use ratio reasoning',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.6.RP.A'
  },

  // Learning objectives for US Grade 6 Math
  {
    id: 'us-g6-math-rp-1-obj1',
    parentId: 'us-g6-math-rp-1',
    nodeType: 'learning_objective',
    name: 'Understand the concept of a ratio',
    description: 'Understand the concept of a ratio and use ratio language to describe a ratio relationship between two quantities.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH,
    sourceIdentifier: 'CCSS.Math.Content.6.RP.A.1',
    estimatedDuration: 50,
    tags: ['ratios', 'proportional_reasoning']
  },

  // Knowledge components for US Grade 6 Math
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
    subject: NELIESubject.MATH,
    estimatedDuration: 25,
    tags: ['definition'],
    subjectSpecific: {
      mathDomain: 'arithmetic',
      problemType: 'word_problem'
    }
  },

  // Domains for US Grade 6 ELA
  {
    id: 'us-g6-ela-rl',
    parentId: 'us-g6-ela',
    nodeType: 'domain',
    name: 'Reading: Literature',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.6'
  },

  // Learning objectives for US Grade 6 ELA
  {
    id: 'us-g6-ela-rl-1',
    parentId: 'us-g6-ela-rl',
    nodeType: 'learning_objective',
    name: 'Cite textual evidence',
    description: 'Cite textual evidence to support analysis of what the text says explicitly as well as inferences drawn from the text.',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    sourceIdentifier: 'CCSS.ELA-Literacy.RL.6.1',
    estimatedDuration: 45,
    tags: ['textual_evidence', 'analysis']
  },

  // Knowledge components for US Grade 6 ELA
  {
    id: 'us-g6-ela-rl-1-kc1',
    parentId: 'us-g6-ela-rl-1',
    nodeType: 'kc',
    name: 'Identify explicit textual evidence',
    description: 'Find direct statements in text that support analysis',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 20,
    tags: ['textual_evidence'],
    subjectSpecific: {
      linguisticSkill: 'reading',
      textType: 'literary'
    }
  },
  {
    id: 'us-g6-ela-rl-1-kc2',
    parentId: 'us-g6-ela-rl-1',
    nodeType: 'kc',
    name: 'Make inferences from text',
    description: 'Draw logical conclusions from textual evidence',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '6',
    subjectName: 'English Language Arts',
    subject: NELIESubject.ENGLISH,
    estimatedDuration: 25,
    tags: ['inference'],
    subjectSpecific: {
      linguisticSkill: 'reading',
      textType: 'literary'
    }
  },

  // Subjects for Denmark Grade 6
  {
    id: 'dk-g6-math',
    parentId: 'dk-g6',
    nodeType: 'subject',
    name: 'Matematik',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATH
  },
  {
    id: 'dk-g6-engelsk',
    parentId: 'dk-g6',
    nodeType: 'subject',
    name: 'Engelsk',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6',
    subjectName: 'World Languages',
    subject: NELIESubject.WORLD_LANGUAGES
  },

  // Danish curriculum content
  {
    id: 'dk-g6-engelsk-mundtlig',
    parentId: 'dk-g6-engelsk',
    nodeType: 'domain',
    name: 'Mundtlig kommunikation',
    description: 'Oral communication skills in English',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6',
    subjectName: 'World Languages',
    subject: NELIESubject.WORLD_LANGUAGES
  },

  // Learning objective for Danish English
  {
    id: 'dk-g6-engelsk-mundtlig-obj1',
    parentId: 'dk-g6-engelsk-mundtlig',
    nodeType: 'learning_objective',
    name: 'Deltage i samtaler',
    description: 'Participate in conversations and dialogues in English',
    countryCode: 'DK',
    languageCode: 'da',
    educationalLevel: '6',
    subjectName: 'World Languages',
    subject: NELIESubject.WORLD_LANGUAGES,
    estimatedDuration: 40,
    tags: ['speaking', 'conversation'],
    subjectSpecific: {
      linguisticSkill: 'speaking',
      interactionType: 'discussion'
    }
  }
];
