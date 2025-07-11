import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const usMathCurriculumNodes: CurriculumNode[] = [
  // US Math Root
  {
    id: 'us-math',
    parentId: 'us',
    nodeType: 'subject',
    name: 'Mathematics',
    description: 'K-12 Mathematics curriculum following Common Core State Standards',
    countryCode: 'US',
    languageCode: 'en',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    tags: ['core_subject', 'stem']
  },

  // Kindergarten Math
  {
    id: 'us-k-math',
    parentId: 'us-math',
    nodeType: 'course',
    name: 'Kindergarten Mathematics',
    description: 'Foundational math concepts for kindergarten students',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    estimatedDuration: 180,
    tags: ['foundational', 'early_childhood']
  },

  // K.CC - Counting and Cardinality
  {
    id: 'k-cc',
    parentId: 'us-k-math',
    nodeType: 'domain',
    name: 'Counting and Cardinality',
    description: 'Understanding numbers and counting sequences',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: 'K.CC',
    tags: ['counting', 'numbers']
  },

  {
    id: 'k-cc-1',
    parentId: 'k-cc',
    nodeType: 'learning_objective',
    name: 'Count to 100 by ones and by tens',
    description: 'Count to 100 by ones and by tens',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: 'K.CC.A.1',
    estimatedDuration: 30,
    tags: ['counting', 'sequences']
  },

  {
    id: 'k-cc-2',
    parentId: 'k-cc',
    nodeType: 'learning_objective',
    name: 'Count forward beginning from a given number',
    description: 'Count forward beginning from a given number within the known sequence',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: 'K.CC.A.2',
    estimatedDuration: 25,
    tags: ['counting', 'number_sequence']
  },

  {
    id: 'k-cc-3',
    parentId: 'k-cc',
    nodeType: 'learning_objective',
    name: 'Write numbers from 0 to 20',
    description: 'Write numbers from 0 to 20. Represent a number of objects with a written numeral 0-20',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: 'K.CC.A.3',
    estimatedDuration: 35,
    tags: ['number_writing', 'representation']
  },

  // K.OA - Operations and Algebraic Thinking
  {
    id: 'k-oa',
    parentId: 'us-k-math',
    nodeType: 'domain',
    name: 'Operations and Algebraic Thinking',
    description: 'Understanding addition and subtraction with numbers 0-10',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: 'K.OA',
    tags: ['operations', 'addition', 'subtraction']
  },

  {
    id: 'k-oa-1',
    parentId: 'k-oa',
    nodeType: 'learning_objective',
    name: 'Represent addition and subtraction',
    description: 'Represent addition and subtraction with objects, fingers, mental images, drawings, sounds, acting out situations, verbal explanations, expressions, or equations',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: 'K',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: 'K.OA.A.1',
    estimatedDuration: 40,
    tags: ['addition', 'subtraction', 'representation']
  },

  // Grade 1 Math
  {
    id: 'us-1-math',
    parentId: 'us-math',
    nodeType: 'course',
    name: 'Grade 1 Mathematics',
    description: 'First grade mathematics building on kindergarten foundations',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    estimatedDuration: 200,
    prerequisites: ['us-k-math'],
    tags: ['elementary', 'foundational']
  },

  // 1.OA - Operations and Algebraic Thinking
  {
    id: '1-oa',
    parentId: 'us-1-math',
    nodeType: 'domain',
    name: 'Operations and Algebraic Thinking',
    description: 'Represent and solve problems involving addition and subtraction',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '1.OA',
    tags: ['operations', 'problem_solving']
  },

  {
    id: '1-oa-1',
    parentId: '1-oa',
    nodeType: 'learning_objective',
    name: 'Addition and subtraction word problems',
    description: 'Use addition and subtraction within 20 to solve word problems involving situations of adding to, taking from, putting together, taking apart, and comparing',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '1.OA.A.1',
    estimatedDuration: 45,
    prerequisites: ['k-oa-1'],
    tags: ['word_problems', 'addition', 'subtraction']
  },

  {
    id: '1-oa-2',
    parentId: '1-oa',
    nodeType: 'learning_objective',
    name: 'Three numbers addition and subtraction',
    description: 'Solve word problems that call for addition of three whole numbers whose sum is less than or equal to 20',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '1',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '1.OA.A.2',
    estimatedDuration: 35,
    prerequisites: ['1-oa-1'],
    tags: ['three_addends', 'word_problems']
  },

  // Grade 2 Math
  {
    id: 'us-2-math',
    parentId: 'us-math',
    nodeType: 'course',
    name: 'Grade 2 Mathematics',
    description: 'Second grade mathematics building on Grade 1 foundations',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    estimatedDuration: 220,
    prerequisites: ['us-1-math'],
    tags: ['elementary', 'foundational']
  },

  // 2.OA - Operations and Algebraic Thinking
  {
    id: '2-oa',
    parentId: 'us-2-math',
    nodeType: 'domain',
    name: 'Operations and Algebraic Thinking',
    description: 'Represent and solve problems involving addition and subtraction within 100',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '2.OA',
    tags: ['operations', 'problem_solving']
  },

  {
    id: '2-oa-1',
    parentId: '2-oa',
    nodeType: 'learning_objective',
    name: 'Addition and subtraction word problems within 100',
    description: 'Use addition and subtraction within 100 to solve one- and two-step word problems',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '2.OA.A.1',
    estimatedDuration: 50,
    prerequisites: ['1-oa-1'],
    tags: ['word_problems', 'two_step']
  },

  {
    id: '2-oa-2',
    parentId: '2-oa',
    nodeType: 'learning_objective',
    name: 'Mental addition and subtraction strategies',
    description: 'Fluently add and subtract within 20 using mental strategies',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '2.OA.B.2',
    estimatedDuration: 40,
    prerequisites: ['1-oa-2'],
    tags: ['mental_math', 'fluency']
  },

  {
    id: '2-oa-3',
    parentId: '2-oa',
    nodeType: 'learning_objective',
    name: 'Even and odd numbers',
    description: 'Determine whether a group of objects has an odd or even number of members',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '2.OA.C.3',
    estimatedDuration: 35,
    tags: ['number_properties', 'classification']
  },

  // 2.NBT - Number and Operations in Base Ten
  {
    id: '2-nbt',
    parentId: 'us-2-math',
    nodeType: 'domain',
    name: 'Number and Operations in Base Ten',
    description: 'Understand place value and use it to add and subtract',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '2.NBT',
    tags: ['place_value', 'base_ten']
  },

  {
    id: '2-nbt-1',
    parentId: '2-nbt',
    nodeType: 'learning_objective',
    name: 'Place value to 1000',
    description: 'Understand that three digits represent amounts of hundreds, tens, and ones',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '2.NBT.A.1',
    estimatedDuration: 45,
    tags: ['place_value', 'hundreds']
  },

  {
    id: '2-nbt-2',
    parentId: '2-nbt',
    nodeType: 'learning_objective',
    name: 'Skip counting patterns',
    description: 'Count within 1000; skip-count by 5s, 10s, and 100s',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '2.NBT.A.2',
    estimatedDuration: 35,
    tags: ['skip_counting', 'patterns']
  },

  {
    id: '2-nbt-3',
    parentId: '2-nbt',
    nodeType: 'learning_objective',
    name: 'Compare three-digit numbers',
    description: 'Read and write numbers to 1000 using base-ten numerals, number names, and expanded form',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '2.NBT.A.3',
    estimatedDuration: 40,
    tags: ['number_comparison', 'expanded_form']
  },

  // 2.MD - Measurement and Data
  {
    id: '2-md',
    parentId: 'us-2-math',
    nodeType: 'domain',
    name: 'Measurement and Data',
    description: 'Measure and estimate lengths, work with time and money, and represent data',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '2.MD',
    tags: ['measurement', 'data', 'time', 'money']
  },

  {
    id: '2-md-1',
    parentId: '2-md',
    nodeType: 'learning_objective',
    name: 'Measure length using standard units',
    description: 'Measure the length of an object using standard units',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '2.MD.A.1',
    estimatedDuration: 40,
    tags: ['measurement', 'standard_units']
  },

  {
    id: '2-md-2',
    parentId: '2-md',
    nodeType: 'learning_objective',
    name: 'Time to nearest five minutes',
    description: 'Tell and write time from analog and digital clocks to the nearest five minutes',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '2.MD.C.7',
    estimatedDuration: 35,
    tags: ['time', 'clocks']
  },

  {
    id: '2-md-3',
    parentId: '2-md',
    nodeType: 'learning_objective',
    name: 'Money problems',
    description: 'Solve word problems involving dollar bills, quarters, dimes, nickels, and pennies',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '2.MD.C.8',
    estimatedDuration: 45,
    tags: ['money', 'word_problems']
  },

  // 2.G - Geometry
  {
    id: '2-g',
    parentId: 'us-2-math',
    nodeType: 'domain',
    name: 'Geometry',
    description: 'Reason with shapes and their attributes',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '2.G',
    tags: ['geometry', 'shapes']
  },

  {
    id: '2-g-1',
    parentId: '2-g',
    nodeType: 'learning_objective',
    name: 'Recognize and draw shapes',
    description: 'Recognize and draw shapes having specified attributes',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '2.G.A.1',
    estimatedDuration: 30,
    tags: ['shape_recognition', 'drawing']
  },

  {
    id: '2-g-2',
    parentId: '2-g',
    nodeType: 'learning_objective',
    name: 'Partition shapes into equal parts',
    description: 'Partition a rectangle into rows and columns of same-size squares and count to find the total',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '2',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '2.G.A.2',
    estimatedDuration: 35,
    tags: ['partitioning', 'equal_parts']
  },

  // Grade 3 Math
  {
    id: 'us-3-math',
    parentId: 'us-math',
    nodeType: 'course',
    name: 'Grade 3 Mathematics',
    description: 'Third grade mathematics introducing multiplication, division, and fractions',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    estimatedDuration: 240,
    prerequisites: ['us-2-math'],
    tags: ['elementary', 'multiplication', 'fractions']
  },

  // 3.OA - Operations and Algebraic Thinking
  {
    id: '3-oa',
    parentId: 'us-3-math',
    nodeType: 'domain',
    name: 'Operations and Algebraic Thinking',
    description: 'Represent and solve problems involving multiplication and division',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '3.OA',
    tags: ['multiplication', 'division', 'problem_solving']
  },

  {
    id: '3-oa-1',
    parentId: '3-oa',
    nodeType: 'learning_objective',
    name: 'Multiplication word problems',
    description: 'Interpret products of whole numbers as equal groups or arrays',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '3.OA.A.1',
    estimatedDuration: 50,
    prerequisites: ['2-oa-1'],
    tags: ['multiplication', 'equal_groups', 'arrays']
  },

  {
    id: '3-oa-2',
    parentId: '3-oa',
    nodeType: 'learning_objective',
    name: 'Division word problems',
    description: 'Interpret whole-number quotients as sharing or grouping situations',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '3.OA.A.2',
    estimatedDuration: 50,
    prerequisites: ['3-oa-1'],
    tags: ['division', 'sharing', 'grouping']
  },

  {
    id: '3-oa-3',
    parentId: '3-oa',
    nodeType: 'learning_objective',
    name: 'Multiplication and division fact fluency',
    description: 'Fluently multiply and divide within 100, using strategies and properties',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '3.OA.C.7',
    estimatedDuration: 60,
    prerequisites: ['3-oa-2'],
    tags: ['fluency', 'fact_families']
  },

  // 3.NBT - Number and Operations in Base Ten
  {
    id: '3-nbt',
    parentId: 'us-3-math',
    nodeType: 'domain',
    name: 'Number and Operations in Base Ten',
    description: 'Use place value understanding for multi-digit arithmetic',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '3.NBT',
    tags: ['place_value', 'multi_digit']
  },

  {
    id: '3-nbt-1',
    parentId: '3-nbt',
    nodeType: 'learning_objective',
    name: 'Round whole numbers',
    description: 'Use place value understanding to round whole numbers to the nearest 10 or 100',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '3.NBT.A.1',
    estimatedDuration: 40,
    prerequisites: ['2-nbt-1'],
    tags: ['rounding', 'estimation']
  },

  {
    id: '3-nbt-2',
    parentId: '3-nbt',
    nodeType: 'learning_objective',
    name: 'Add and subtract within 1000',
    description: 'Fluently add and subtract within 1000 using strategies based on place value',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '3.NBT.A.2',
    estimatedDuration: 55,
    prerequisites: ['2-nbt-3'],
    tags: ['addition', 'subtraction', 'place_value_strategies']
  },

  {
    id: '3-nbt-3',
    parentId: '3-nbt',
    nodeType: 'learning_objective',
    name: 'Multiply one-digit by multiples of 10',
    description: 'Multiply one-digit whole numbers by multiples of 10 in the range 10-90',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '3.NBT.A.3',
    estimatedDuration: 45,
    prerequisites: ['3-oa-1'],
    tags: ['multiplication', 'multiples_of_ten']
  },

  // 3.NF - Number and Operations—Fractions
  {
    id: '3-nf',
    parentId: 'us-3-math',
    nodeType: 'domain',
    name: 'Number and Operations—Fractions',
    description: 'Develop understanding of fractions as numbers',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '3.NF',
    tags: ['fractions', 'unit_fractions']
  },

  {
    id: '3-nf-1',
    parentId: '3-nf',
    nodeType: 'learning_objective',
    name: 'Understand unit fractions',
    description: 'Understand a fraction 1/b as the quantity formed by 1 part when a whole is partitioned into b equal parts',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '3.NF.A.1',
    estimatedDuration: 50,
    prerequisites: ['2-g-2'],
    tags: ['unit_fractions', 'partitioning']
  },

  {
    id: '3-nf-2',
    parentId: '3-nf',
    nodeType: 'learning_objective',
    name: 'Fractions on number line',
    description: 'Understand a fraction as a number on the number line',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '3.NF.A.2',
    estimatedDuration: 45,
    prerequisites: ['3-nf-1'],
    tags: ['number_line', 'fraction_representation']
  },

  {
    id: '3-nf-3',
    parentId: '3-nf',
    nodeType: 'learning_objective',
    name: 'Compare fractions',
    description: 'Compare two fractions with the same numerator or denominator',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '3.NF.A.3',
    estimatedDuration: 40,
    prerequisites: ['3-nf-2'],
    tags: ['fraction_comparison', 'reasoning']
  },

  // 3.MD - Measurement and Data
  {
    id: '3-md',
    parentId: 'us-3-math',
    nodeType: 'domain',
    name: 'Measurement and Data',
    description: 'Solve problems involving measurement and represent data',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '3.MD',
    tags: ['measurement', 'data', 'time', 'area']
  },

  {
    id: '3-md-1',
    parentId: '3-md',
    nodeType: 'learning_objective',
    name: 'Time intervals',
    description: 'Tell and write time to the nearest minute and measure time intervals',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '3.MD.A.1',
    estimatedDuration: 45,
    prerequisites: ['2-md-2'],
    tags: ['time', 'intervals']
  },

  {
    id: '3-md-2',
    parentId: '3-md',
    nodeType: 'learning_objective',
    name: 'Liquid volume and mass',
    description: 'Measure and estimate liquid volumes and masses using standard units',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '3.MD.A.2',
    estimatedDuration: 50,
    prerequisites: ['2-md-1'],
    tags: ['volume', 'mass', 'measurement']
  },

  {
    id: '3-md-3',
    parentId: '3-md',
    nodeType: 'learning_objective',
    name: 'Area concepts',
    description: 'Recognize area as an attribute of plane figures and understand area measurement',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '3.MD.C.5',
    estimatedDuration: 55,
    prerequisites: ['2-g-1'],
    tags: ['area', 'plane_figures']
  },

  // 3.G - Geometry
  {
    id: '3-g',
    parentId: 'us-3-math',
    nodeType: 'domain',
    name: 'Geometry',
    description: 'Reason with shapes and their attributes',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '3.G',
    tags: ['geometry', 'attributes', 'categories']
  },

  {
    id: '3-g-1',
    parentId: '3-g',
    nodeType: 'learning_objective',
    name: 'Shape categories and attributes',
    description: 'Understand that shapes in different categories may share attributes',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '3.G.A.1',
    estimatedDuration: 40,
    prerequisites: ['2-g-1'],
    tags: ['shape_attributes', 'classification']
  },

  {
    id: '3-g-2',
    parentId: '3-g',
    nodeType: 'learning_objective',
    name: 'Partition shapes into equal areas',
    description: 'Partition shapes into parts with equal areas and express area as unit fractions',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '3',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '3.G.A.2',
    estimatedDuration: 45,
    prerequisites: ['3-nf-1', '2-g-2'],
    tags: ['partitioning', 'equal_areas', 'unit_fractions']
  },

  // Grade 4 Math
  {
    id: 'us-4-math',
    parentId: 'us-math',
    nodeType: 'course',
    name: 'Grade 4 Mathematics',
    description: 'Fourth grade mathematics with multi-digit operations and advanced fractions',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    estimatedDuration: 260,
    prerequisites: ['us-3-math'],
    tags: ['elementary', 'multi_digit', 'equivalent_fractions']
  },

  // 4.OA - Operations and Algebraic Thinking
  {
    id: '4-oa',
    parentId: 'us-4-math',
    nodeType: 'domain',
    name: 'Operations and Algebraic Thinking',
    description: 'Use four operations with whole numbers to solve problems',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '4.OA',
    tags: ['four_operations', 'factors', 'multiples']
  },

  {
    id: '4-oa-1',
    parentId: '4-oa',
    nodeType: 'learning_objective',
    name: 'Multi-step word problems',
    description: 'Interpret and solve multi-step word problems using the four operations',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '4.OA.A.2',
    estimatedDuration: 60,
    prerequisites: ['3-oa-2'],
    tags: ['multi_step', 'word_problems', 'four_operations']
  },

  {
    id: '4-oa-2',
    parentId: '4-oa',
    nodeType: 'learning_objective',
    name: 'Factors and multiples',
    description: 'Find all factor pairs for whole numbers 1-100 and identify multiples',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '4.OA.B.4',
    estimatedDuration: 50,
    prerequisites: ['3-oa-3'],
    tags: ['factors', 'multiples', 'number_theory']
  },

  {
    id: '4-oa-3',
    parentId: '4-oa',
    nodeType: 'learning_objective',
    name: 'Number patterns',
    description: 'Generate and analyze patterns following given rules',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '4.OA.C.5',
    estimatedDuration: 45,
    prerequisites: ['3-oa-3'],
    tags: ['patterns', 'rules', 'analysis']
  },

  // 4.NBT - Number and Operations in Base Ten
  {
    id: '4-nbt',
    parentId: 'us-4-math',
    nodeType: 'domain',
    name: 'Number and Operations in Base Ten',
    description: 'Generalize place value understanding for multi-digit whole numbers',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '4.NBT',
    tags: ['place_value', 'multi_digit_operations']
  },

  {
    id: '4-nbt-1',
    parentId: '4-nbt',
    nodeType: 'learning_objective',
    name: 'Place value to one million',
    description: 'Recognize that in multi-digit numbers, digits represent amounts based on place value',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '4.NBT.A.1',
    estimatedDuration: 50,
    prerequisites: ['3-nbt-1'],
    tags: ['place_value', 'large_numbers']
  },

  {
    id: '4-nbt-2',
    parentId: '4-nbt',
    nodeType: 'learning_objective',
    name: 'Multi-digit addition and subtraction',
    description: 'Fluently add and subtract multi-digit whole numbers using standard algorithm',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '4.NBT.B.4',
    estimatedDuration: 65,
    prerequisites: ['3-nbt-2'],
    tags: ['multi_digit', 'algorithms', 'fluency']
  },

  {
    id: '4-nbt-3',
    parentId: '4-nbt',
    nodeType: 'learning_objective',
    name: 'Multi-digit multiplication',
    description: 'Multiply a whole number up to four digits by a one-digit number',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '4.NBT.B.5',
    estimatedDuration: 70,
    prerequisites: ['3-nbt-3'],
    tags: ['multi_digit_multiplication', 'algorithms']
  },

  // 4.NF - Number and Operations—Fractions
  {
    id: '4-nf',
    parentId: 'us-4-math',
    nodeType: 'domain',
    name: 'Number and Operations—Fractions',
    description: 'Extend understanding of fraction equivalence and ordering',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '4.NF',
    tags: ['equivalent_fractions', 'fraction_operations']
  },

  {
    id: '4-nf-1',
    parentId: '4-nf',
    nodeType: 'learning_objective',
    name: 'Equivalent fractions',
    description: 'Explain why fractions are equivalent using visual models',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '4.NF.A.1',
    estimatedDuration: 55,
    prerequisites: ['3-nf-3'],
    tags: ['equivalent_fractions', 'visual_models']
  },

  {
    id: '4-nf-2',
    parentId: '4-nf',
    nodeType: 'learning_objective',
    name: 'Compare fractions with different denominators',
    description: 'Compare two fractions with different numerators and denominators',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '4.NF.A.2',
    estimatedDuration: 50,
    prerequisites: ['4-nf-1'],
    tags: ['fraction_comparison', 'different_denominators']
  },

  {
    id: '4-nf-3',
    parentId: '4-nf',
    nodeType: 'learning_objective',
    name: 'Add and subtract fractions',
    description: 'Understand addition and subtraction of fractions as joining and separating parts',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '4.NF.B.3',
    estimatedDuration: 65,
    prerequisites: ['4-nf-2'],
    tags: ['fraction_addition', 'fraction_subtraction']
  },

  // 4.MD - Measurement and Data
  {
    id: '4-md',
    parentId: 'us-4-math',
    nodeType: 'domain',
    name: 'Measurement and Data',
    description: 'Solve problems involving measurement and conversion of measurements',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '4.MD',
    tags: ['measurement', 'conversion', 'area', 'perimeter']
  },

  {
    id: '4-md-1',
    parentId: '4-md',
    nodeType: 'learning_objective',
    name: 'Convert measurements',
    description: 'Know relative sizes of measurement units and express measurements in larger units',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '4.MD.A.1',
    estimatedDuration: 50,
    prerequisites: ['3-md-2'],
    tags: ['measurement_conversion', 'relative_sizes']
  },

  {
    id: '4-md-2',
    parentId: '4-md',
    nodeType: 'learning_objective',
    name: 'Area and perimeter',
    description: 'Apply area and perimeter formulas for rectangles to solve problems',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '4.MD.A.3',
    estimatedDuration: 55,
    prerequisites: ['3-md-3'],
    tags: ['area', 'perimeter', 'formulas']
  },

  {
    id: '4-md-3',
    parentId: '4-md',
    nodeType: 'learning_objective',
    name: 'Line plots with fractions',
    description: 'Make line plots to display datasets of measurements in fractions of a unit',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '4.MD.B.4',
    estimatedDuration: 45,
    prerequisites: ['4-nf-1'],
    tags: ['line_plots', 'data_display', 'fractions']
  },

  // 4.G - Geometry
  {
    id: '4-g',
    parentId: 'us-4-math',
    nodeType: 'domain',
    name: 'Geometry',
    description: 'Draw and identify lines and angles, and classify shapes by properties',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '4.G',
    tags: ['geometry', 'lines', 'angles', 'classification']
  },

  {
    id: '4-g-1',
    parentId: '4-g',
    nodeType: 'learning_objective',
    name: 'Points, lines, and angles',
    description: 'Draw points, lines, line segments, rays, angles, and perpendicular and parallel lines',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '4.G.A.1',
    estimatedDuration: 50,
    prerequisites: ['3-g-1'],
    tags: ['geometric_elements', 'drawing', 'parallel_perpendicular']
  },

  {
    id: '4-g-2',
    parentId: '4-g',
    nodeType: 'learning_objective',
    name: 'Classify two-dimensional figures',
    description: 'Classify two-dimensional figures based on presence or absence of parallel or perpendicular lines',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '4.G.A.2',
    estimatedDuration: 45,
    prerequisites: ['4-g-1'],
    tags: ['classification', 'two_dimensional', 'properties']
  },

  {
    id: '4-g-3',
    parentId: '4-g',
    nodeType: 'learning_objective',
    name: 'Line symmetry',
    description: 'Recognize a line of symmetry for a two-dimensional figure',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '4',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '4.G.A.3',
    estimatedDuration: 40,
    prerequisites: ['4-g-2'],
    tags: ['symmetry', 'line_symmetry', 'geometric_properties']
  },

  // Grade 5 Math
  {
    id: 'us-5-math',
    parentId: 'us-math',
    nodeType: 'course',
    name: 'Grade 5 Mathematics',
    description: 'Fifth grade mathematics with decimal operations and advanced fractions',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    estimatedDuration: 280,
    prerequisites: ['us-4-math'],
    tags: ['elementary', 'decimals', 'volume', 'coordinate_plane']
  },

  // 5.OA - Operations and Algebraic Thinking
  {
    id: '5-oa',
    parentId: 'us-5-math',
    nodeType: 'domain',
    name: 'Operations and Algebraic Thinking',
    description: 'Write and interpret numerical expressions',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '5.OA',
    tags: ['expressions', 'patterns', 'coordinate_plane']
  },

  {
    id: '5-oa-1',
    parentId: '5-oa',
    nodeType: 'learning_objective',
    name: 'Numerical expressions',
    description: 'Use parentheses, brackets, or braces in numerical expressions and evaluate expressions',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '5.OA.A.1',
    estimatedDuration: 50,
    prerequisites: ['4-oa-1'],
    tags: ['expressions', 'order_of_operations', 'parentheses']
  },

  {
    id: '5-oa-2',
    parentId: '5-oa',
    nodeType: 'learning_objective',
    name: 'Interpret expressions',
    description: 'Write simple expressions and interpret numerical expressions without evaluating',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '5.OA.A.2',
    estimatedDuration: 45,
    prerequisites: ['5-oa-1'],
    tags: ['expression_interpretation', 'algebraic_thinking']
  },

  {
    id: '5-oa-3',
    parentId: '5-oa',
    nodeType: 'learning_objective',
    name: 'Coordinate plane',
    description: 'Use a pair of perpendicular number lines to define coordinate system',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '5.G.A.1',
    estimatedDuration: 55,
    prerequisites: ['4-g-1'],
    tags: ['coordinate_plane', 'ordered_pairs', 'graphing']
  },

  // 5.NBT - Number and Operations in Base Ten
  {
    id: '5-nbt',
    parentId: 'us-5-math',
    nodeType: 'domain',
    name: 'Number and Operations in Base Ten',
    description: 'Understand the place value system and perform operations with multi-digit numbers',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '5.NBT',
    tags: ['place_value', 'decimals', 'multi_digit_operations']
  },

  {
    id: '5-nbt-1',
    parentId: '5-nbt',
    nodeType: 'learning_objective',
    name: 'Place value with decimals',
    description: 'Recognize that in multi-digit numbers, digits in one place represent 10 times as much as the same digit in the place to its right',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '5.NBT.A.1',
    estimatedDuration: 50,
    prerequisites: ['4-nbt-1'],
    tags: ['place_value', 'decimals', 'base_ten']
  },

  {
    id: '5-nbt-2',
    parentId: '5-nbt',
    nodeType: 'learning_objective',
    name: 'Read and write decimals',
    description: 'Read, write, and compare decimals to thousandths',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '5.NBT.A.3',
    estimatedDuration: 55,
    prerequisites: ['5-nbt-1'],
    tags: ['decimal_notation', 'comparison', 'thousandths']
  },

  {
    id: '5-nbt-3',
    parentId: '5-nbt',
    nodeType: 'learning_objective',
    name: 'Operations with decimals',
    description: 'Add, subtract, multiply, and divide decimals to hundredths',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '5.NBT.B.7',
    estimatedDuration: 70,
    prerequisites: ['5-nbt-2'],
    tags: ['decimal_operations', 'algorithms', 'hundredths']
  },

  // 5.NF - Number and Operations—Fractions
  {
    id: '5-nf',
    parentId: 'us-5-math',
    nodeType: 'domain',
    name: 'Number and Operations—Fractions',
    description: 'Use equivalent fractions to add and subtract, and apply understanding of multiplication and division to fractions',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '5.NF',
    tags: ['fraction_operations', 'multiplication', 'division']
  },

  {
    id: '5-nf-1',
    parentId: '5-nf',
    nodeType: 'learning_objective',
    name: 'Add and subtract fractions',
    description: 'Add and subtract fractions with unlike denominators',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '5.NF.A.1',
    estimatedDuration: 60,
    prerequisites: ['4-nf-3'],
    tags: ['fraction_addition', 'fraction_subtraction', 'unlike_denominators']
  },

  {
    id: '5-nf-2',
    parentId: '5-nf',
    nodeType: 'learning_objective',
    name: 'Multiply fractions',
    description: 'Interpret multiplication of a fraction by a whole number and by a fraction',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '5.NF.B.4',
    estimatedDuration: 65,
    prerequisites: ['5-nf-1'],
    tags: ['fraction_multiplication', 'scaling', 'interpretation']
  },

  {
    id: '5-nf-3',
    parentId: '5-nf',
    nodeType: 'learning_objective',
    name: 'Divide with unit fractions',
    description: 'Interpret division of a unit fraction by a non-zero whole number and vice versa',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '5.NF.B.7',
    estimatedDuration: 55,
    prerequisites: ['5-nf-2'],
    tags: ['unit_fractions', 'division', 'interpretation']
  },

  // 5.MD - Measurement and Data
  {
    id: '5-md',
    parentId: 'us-5-math',
    nodeType: 'domain',
    name: 'Measurement and Data',
    description: 'Convert measurements and understand concepts of volume',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '5.MD',
    tags: ['measurement', 'conversion', 'volume']
  },

  {
    id: '5-md-1',
    parentId: '5-md',
    nodeType: 'learning_objective',
    name: 'Convert measurements within systems',
    description: 'Convert among different-sized standard measurement units within a given system',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '5.MD.A.1',
    estimatedDuration: 50,
    prerequisites: ['4-md-1'],
    tags: ['measurement_conversion', 'standard_units', 'multi_step']
  },

  {
    id: '5-md-2',
    parentId: '5-md',
    nodeType: 'learning_objective',
    name: 'Volume concepts',
    description: 'Recognize volume as an attribute of solid figures and understand volume measurement',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '5.MD.C.3',
    estimatedDuration: 60,
    prerequisites: ['4-md-2'],
    tags: ['volume', 'solid_figures', 'cubic_units']
  },

  {
    id: '5-md-3',
    parentId: '5-md',
    nodeType: 'learning_objective',
    name: 'Volume formulas',
    description: 'Relate volume to multiplication and addition and apply formulas',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '5.MD.C.5',
    estimatedDuration: 55,
    prerequisites: ['5-md-2'],
    tags: ['volume_formulas', 'multiplication', 'rectangular_prisms']
  },

  // 5.G - Geometry
  {
    id: '5-g',
    parentId: 'us-5-math',
    nodeType: 'domain',
    name: 'Geometry',
    description: 'Graph points on coordinate plane and classify two-dimensional figures',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '5.G',
    tags: ['coordinate_plane', 'classification', 'hierarchies']
  },

  {
    id: '5-g-1',
    parentId: '5-g',
    nodeType: 'learning_objective',
    name: 'Graph coordinate pairs',
    description: 'Graph points in the first quadrant and interpret coordinate values',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '5.G.A.2',
    estimatedDuration: 50,
    prerequisites: ['5-oa-3'],
    tags: ['graphing', 'first_quadrant', 'coordinate_interpretation']
  },

  {
    id: '5-g-2',
    parentId: '5-g',
    nodeType: 'learning_objective',
    name: 'Classify two-dimensional figures in hierarchy',
    description: 'Understand that attributes belonging to a category also belong to subcategories',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '5.G.B.3',
    estimatedDuration: 45,
    prerequisites: ['4-g-2'],
    tags: ['classification', 'hierarchies', 'attributes']
  },

  {
    id: '5-g-3',
    parentId: '5-g',
    nodeType: 'learning_objective',
    name: 'Real-world coordinate problems',
    description: 'Solve real-world problems by graphing points in the first quadrant',
    countryCode: 'US',
    languageCode: 'en',
    educationalLevel: '5',
    subjectName: 'Mathematics',
    subject: NELIESubject.MATHEMATICS,
    sourceIdentifier: '5.G.A.1',
    estimatedDuration: 55,
    prerequisites: ['5-g-1'],
    tags: ['real_world_applications', 'coordinate_plane', 'problem_solving']
  }
];
