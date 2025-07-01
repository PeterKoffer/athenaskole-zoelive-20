
// StudyPug Common Core Math Curriculum Structure
export interface CurriculumLevel {
  id: string;
  name: string;
  grade: number | string;
  url: string;
  description: string;
  subjects?: CurriculumSubject[];
}

export interface CurriculumSubject {
  id: string;
  name: string;
  url: string;
  description: string;
  topics: CurriculumTopic[];
}

export interface CurriculumTopic {
  id: string;
  name: string;
  description: string;
  difficulty: number;
  estimatedTime: number;
  prerequisites: string[];
  standards: string[];
}

// StudyPug Common Core Math Curriculum Data
export const studyPugMathCurriculum: CurriculumLevel[] = [
  {
    id: 'cc-math-k',
    name: 'Kindergarten Math',
    grade: 0,
    url: 'https://www.studypug.com/curriculum/us/common-core/math/kindergarten/',
    description: 'Foundation math skills for kindergarten students',
    subjects: [
      {
        id: 'k-counting-cardinality',
        name: 'Counting and Cardinality',
        url: 'kindergarten/counting-cardinality',
        description: 'Know number names and the count sequence',
        topics: [
          {
            id: 'k-cc-1',
            name: 'Count to 100 by ones and tens',
            description: 'Count forward beginning from any given number',
            difficulty: 1,
            estimatedTime: 15,
            prerequisites: [],
            standards: ['K.CC.1']
          },
          {
            id: 'k-cc-2',
            name: 'Count objects and understand cardinality',
            description: 'Count to tell the number of objects',
            difficulty: 2,
            estimatedTime: 20,
            prerequisites: ['k-cc-1'],
            standards: ['K.CC.4', 'K.CC.5']
          }
        ]
      },
      {
        id: 'k-operations',
        name: 'Operations and Algebraic Thinking',
        url: 'kindergarten/operations-algebraic-thinking',
        description: 'Understand addition and subtraction',
        topics: [
          {
            id: 'k-oa-1',
            name: 'Addition and subtraction within 5',
            description: 'Represent addition and subtraction with objects',
            difficulty: 2,
            estimatedTime: 25,
            prerequisites: ['k-cc-2'],
            standards: ['K.OA.1', 'K.OA.2']
          }
        ]
      }
    ]
  },
  {
    id: 'cc-math-1',
    name: 'Grade 1 Math',
    grade: 1,
    url: 'https://www.studypug.com/curriculum/us/common-core/math/grade1/',
    description: 'Building foundational math skills in first grade',
    subjects: [
      {
        id: '1-operations',
        name: 'Operations and Algebraic Thinking',
        url: 'grade1/operations-algebraic-thinking',
        description: 'Addition and subtraction within 20',
        topics: [
          {
            id: '1-oa-1',
            name: 'Addition and subtraction within 20',
            description: 'Use strategies to add and subtract within 20',
            difficulty: 2,
            estimatedTime: 30,
            prerequisites: ['k-oa-1'],
            standards: ['1.OA.1', '1.OA.2']
          }
        ]
      },
      {
        id: '1-nbt',
        name: 'Number and Operations in Base Ten',
        url: 'grade1/number-operations-base-ten',
        description: 'Understand place value and two-digit numbers',
        topics: [
          {
            id: '1-nbt-1',
            name: 'Count to 120',
            description: 'Count to 120, starting at any number',
            difficulty: 2,
            estimatedTime: 25,
            prerequisites: ['k-cc-1'],
            standards: ['1.NBT.1']
          }
        ]
      }
    ]
  },
  {
    id: 'cc-math-2',
    name: 'Grade 2 Math',
    grade: 2,
    url: 'https://www.studypug.com/curriculum/us/common-core/math/grade2/',
    description: 'Expanding mathematical understanding in second grade',
    subjects: [
      {
        id: '2-operations',
        name: 'Operations and Algebraic Thinking',
        url: 'grade2/operations-algebraic-thinking',
        description: 'Addition and subtraction within 100',
        topics: [
          {
            id: '2-oa-1',
            name: 'Addition and subtraction within 100',
            description: 'Use strategies to solve word problems',
            difficulty: 3,
            estimatedTime: 35,
            prerequisites: ['1-oa-1'],
            standards: ['2.OA.1']
          }
        ]
      }
    ]
  },
  {
    id: 'cc-math-3',
    name: 'Grade 3 Math',
    grade: 3,
    url: 'https://www.studypug.com/curriculum/us/common-core/math/grade3/',
    description: 'Introduction to multiplication, division, and fractions',
    subjects: [
      {
        id: '3-operations',
        name: 'Operations and Algebraic Thinking',
        url: 'grade3/operations-algebraic-thinking',
        description: 'Multiplication and division within 100',
        topics: [
          {
            id: '3-oa-1',
            name: 'Multiplication and division',
            description: 'Understand multiplication and division concepts',
            difficulty: 4,
            estimatedTime: 40,
            prerequisites: ['2-oa-1'],
            standards: ['3.OA.1', '3.OA.2']
          }
        ]
      },
      {
        id: '3-fractions',
        name: 'Number and Operations—Fractions',
        url: 'grade3/fractions',
        description: 'Introduction to fractions',
        topics: [
          {
            id: '3-nf-1',
            name: 'Understanding fractions',
            description: 'Understand fractions as numbers',
            difficulty: 4,
            estimatedTime: 45,
            prerequisites: ['3-oa-1'],
            standards: ['3.NF.1', '3.NF.2']
          }
        ]
      }
    ]
  },
  {
    id: 'cc-math-4',
    name: 'Grade 4 Math',
    grade: 4,
    url: 'https://www.studypug.com/curriculum/us/common-core/math/grade4/',
    description: 'Multi-digit arithmetic and fraction operations',
    subjects: [
      {
        id: '4-operations',
        name: 'Operations and Algebraic Thinking',
        url: 'grade4/operations-algebraic-thinking',
        description: 'Multi-step word problems and patterns',
        topics: [
          {
            id: '4-oa-1',
            name: 'Multi-step word problems',
            description: 'Solve multi-step word problems with whole numbers',
            difficulty: 5,
            estimatedTime: 45,
            prerequisites: ['3-oa-1'],
            standards: ['4.OA.1', '4.OA.2']
          }
        ]
      },
      {
        id: '4-fractions',
        name: 'Number and Operations—Fractions',
        url: 'grade4/fractions',
        description: 'Fraction equivalence and operations',
        topics: [
          {
            id: '4-nf-1',
            name: 'Fraction equivalence',
            description: 'Understand fraction equivalence and comparison',
            difficulty: 5,
            estimatedTime: 50,
            prerequisites: ['3-nf-1'],
            standards: ['4.NF.1', '4.NF.2']
          }
        ]
      }
    ]
  },
  {
    id: 'cc-math-5',
    name: 'Grade 5 Math',
    grade: 5,
    url: 'https://www.studypug.com/curriculum/us/common-core/math/grade5/',
    description: 'Decimal operations and advanced fractions',
    subjects: [
      {
        id: '5-nbt',
        name: 'Number and Operations in Base Ten',
        url: 'grade5/number-operations-base-ten',
        description: 'Decimal operations and place value',
        topics: [
          {
            id: '5-nbt-1',
            name: 'Decimal place value',
            description: 'Understand decimal place value system',
            difficulty: 6,
            estimatedTime: 40,
            prerequisites: ['4-nf-1'],
            standards: ['5.NBT.1', '5.NBT.3']
          }
        ]
      },
      {
        id: '5-fractions',
        name: 'Number and Operations—Fractions',
        url: 'grade5/fractions',
        description: 'Adding and subtracting fractions',
        topics: [
          {
            id: '5-nf-1',
            name: 'Adding and subtracting fractions',
            description: 'Add and subtract fractions with unlike denominators',
            difficulty: 6,
            estimatedTime: 50,
            prerequisites: ['4-nf-1'],
            standards: ['5.NF.1', '5.NF.2']
          }
        ]
      }
    ]
  },
  {
    id: 'cc-math-6',
    name: 'Grade 6 Math',
    grade: 6,
    url: 'https://www.studypug.com/curriculum/us/common-core/math/grade6/',
    description: 'Ratios, proportional relationships, and negative numbers',
    subjects: [
      {
        id: '6-ratios',
        name: 'Ratios and Proportional Relationships',
        url: 'grade6/ratios-proportional-relationships',
        description: 'Understanding ratios and proportional relationships',
        topics: [
          {
            id: '6-rp-1',
            name: 'Ratios and rates',
            description: 'Understand ratio concepts and use ratio language',
            difficulty: 7,
            estimatedTime: 45,
            prerequisites: ['5-nf-1'],
            standards: ['6.RP.1', '6.RP.2']
          }
        ]
      },
      {
        id: '6-ns',
        name: 'The Number System',
        url: 'grade6/number-system',
        description: 'Negative numbers and rational numbers',
        topics: [
          {
            id: '6-ns-1',
            name: 'Negative numbers',
            description: 'Understand and use positive and negative numbers',
            difficulty: 7,
            estimatedTime: 50,
            prerequisites: ['5-nbt-1'],
            standards: ['6.NS.5', '6.NS.6']
          }
        ]
      }
    ]
  },
  {
    id: 'cc-math-7',
    name: 'Grade 7 Math',
    grade: 7,
    url: 'https://www.studypug.com/curriculum/us/common-core/math/grade7/',
    description: 'Proportional relationships, operations with rational numbers',
    subjects: [
      {
        id: '7-ratios',
        name: 'Ratios and Proportional Relationships',
        url: 'grade7/ratios-proportional-relationships',
        description: 'Analyze proportional relationships',
        topics: [
          {
            id: '7-rp-1',
            name: 'Proportional relationships',
            description: 'Compute unit rates and analyze proportional relationships',
            difficulty: 8,
            estimatedTime: 50,
            prerequisites: ['6-rp-1'],
            standards: ['7.RP.1', '7.RP.2']
          }
        ]
      },
      {
        id: '7-ns',
        name: 'The Number System',
        url: 'grade7/number-system',
        description: 'Operations with rational numbers',
        topics: [
          {
            id: '7-ns-1',
            name: 'Operations with rational numbers',
            description: 'Apply properties of operations with rational numbers',
            difficulty: 8,
            estimatedTime: 55,
            prerequisites: ['6-ns-1'],
            standards: ['7.NS.1', '7.NS.2']
          }
        ]
      }
    ]
  },
  {
    id: 'cc-math-8',
    name: 'Grade 8 Math',
    grade: 8,
    url: 'https://www.studypug.com/curriculum/us/common-core/math/grade8/',
    description: 'Linear equations, functions, and the Pythagorean theorem',
    subjects: [
      {
        id: '8-expressions',
        name: 'Expressions and Equations',
        url: 'grade8/expressions-equations',
        description: 'Work with radicals and integer exponents',
        topics: [
          {
            id: '8-ee-1',
            name: 'Exponents and scientific notation',
            description: 'Work with integer exponents and scientific notation',
            difficulty: 9,
            estimatedTime: 55,
            prerequisites: ['7-ns-1'],
            standards: ['8.EE.1', '8.EE.3']
          }
        ]
      },
      {
        id: '8-functions',
        name: 'Functions',
        url: 'grade8/functions',
        description: 'Introduction to functions',
        topics: [
          {
            id: '8-f-1',
            name: 'Functions',
            description: 'Understand functions and function notation',
            difficulty: 9,
            estimatedTime: 60,
            prerequisites: ['8-ee-1'],
            standards: ['8.F.1', '8.F.2']
          }
        ]
      }
    ]
  }
];

// High School Math Curriculum
export const studyPugHighSchoolMath: CurriculumLevel[] = [
  {
    id: 'cc-hs-number-quantity',
    name: 'High School: Number and Quantity',
    grade: 'HS',
    url: 'https://www.studypug.com/curriculum/us/common-core/math/highschool/us-cc-high-school-number-quantity/',
    description: 'The Real Number System, Quantities, Complex Number System, Vector/Matrix Quantities',
    subjects: [
      {
        id: 'hs-rn',
        name: 'The Real Number System',
        url: 'highschool/real-number-system',
        description: 'Properties of exponents and radicals',
        topics: [
          {
            id: 'hs-rn-1',
            name: 'Properties of exponents',
            description: 'Explain how properties of exponents follow from arithmetic',
            difficulty: 10,
            estimatedTime: 60,
            prerequisites: ['8-ee-1'],
            standards: ['N-RN.1', 'N-RN.2']
          }
        ]
      },
      {
        id: 'hs-cn',
        name: 'The Complex Number System',
        url: 'highschool/complex-number-system',
        description: 'Perform arithmetic operations with complex numbers',
        topics: [
          {
            id: 'hs-cn-1',
            name: 'Complex numbers',
            description: 'Know there is a complex number i such that i² = -1',
            difficulty: 11,
            estimatedTime: 65,
            prerequisites: ['hs-rn-1'],
            standards: ['N-CN.1', 'N-CN.2']
          }
        ]
      }
    ]
  },
  {
    id: 'cc-hs-algebra',
    name: 'High School: Algebra',
    grade: 'HS',
    url: 'https://www.studypug.com/curriculum/us/common-core/math/highschool/us-cc-high-school-algebra/',
    description: 'Seeing Structure in Expressions, Arithmetic with Polynomials, Creating Equations, Reasoning with Equations',
    subjects: [
      {
        id: 'hs-sse',
        name: 'Seeing Structure in Expressions',
        url: 'highschool/seeing-structure-expressions',
        description: 'Interpret the structure of expressions',
        topics: [
          {
            id: 'hs-sse-1',
            name: 'Structure of expressions',
            description: 'Interpret expressions that represent a quantity',
            difficulty: 10,
            estimatedTime: 55,
            prerequisites: ['8-ee-1'],
            standards: ['A-SSE.1', 'A-SSE.2']
          }
        ]
      },
      {
        id: 'hs-apr',
        name: 'Arithmetic with Polynomials and Rational Expressions',
        url: 'highschool/arithmetic-polynomials',
        description: 'Perform arithmetic operations on polynomials',
        topics: [
          {
            id: 'hs-apr-1',
            name: 'Polynomial arithmetic',
            description: 'Understand that polynomials form a system',
            difficulty: 11,
            estimatedTime: 60,
            prerequisites: ['hs-sse-1'],
            standards: ['A-APR.1', 'A-APR.3']
          }
        ]
      }
    ]
  },
  {
    id: 'cc-hs-functions',
    name: 'High School: Functions',
    grade: 'HS',
    url: 'https://www.studypug.com/curriculum/us/common-core/math/highschool/us-cc-high-school-functions/',
    description: 'Interpreting Functions, Building Functions, Linear/Quadratic/Exponential Models, Trigonometric Functions',
    subjects: [
      {
        id: 'hs-if',
        name: 'Interpreting Functions',
        url: 'highschool/interpreting-functions',
        description: 'Understand the concept of a function',
        topics: [
          {
            id: 'hs-if-1',
            name: 'Function concepts',
            description: 'Understand that a function assigns exactly one output',
            difficulty: 10,
            estimatedTime: 55,
            prerequisites: ['8-f-1'],
            standards: ['F-IF.1', 'F-IF.2']
          }
        ]
      },
      {
        id: 'hs-bf',
        name: 'Building Functions',
        url: 'highschool/building-functions',
        description: 'Build a function that models a relationship',
        topics: [
          {
            id: 'hs-bf-1',
            name: 'Building functions',
            description: 'Write a function that describes a relationship',
            difficulty: 11,
            estimatedTime: 60,
            prerequisites: ['hs-if-1'],
            standards: ['F-BF.1', 'F-BF.3']
          }
        ]
      }
    ]
  },
  {
    id: 'cc-hs-geometry',
    name: 'High School: Geometry',
    grade: 'HS',
    url: 'https://www.studypug.com/curriculum/us/common-core/math/highschool/us-cc-high-school-geometry/',
    description: 'Congruence, Similarity/Right Triangles/Trigonometry, Circles, Expressing Geometric Properties, Geometric Measurement',
    subjects: [
      {
        id: 'hs-co',
        name: 'Congruence',
        url: 'highschool/congruence',
        description: 'Experiment with transformations in the plane',
        topics: [
          {
            id: 'hs-co-1',
            name: 'Transformations',
            description: 'Know precise definitions of transformations',
            difficulty: 10,
            estimatedTime: 50,
            prerequisites: ['8-g-1'],
            standards: ['G-CO.1', 'G-CO.2']
          }
        ]
      },
      {
        id: 'hs-srt',
        name: 'Similarity, Right Triangles, and Trigonometry',
        url: 'highschool/similarity-right-triangles',
        description: 'Understand similarity and prove geometric theorems',
        topics: [
          {
            id: 'hs-srt-1',
            name: 'Similarity',
            description: 'Verify experimentally the properties of dilations',
            difficulty: 11,
            estimatedTime: 60,
            prerequisites: ['hs-co-1'],
            standards: ['G-SRT.1', 'G-SRT.2']
          }
        ]
      }
    ]
  },
  {
    id: 'cc-hs-statistics-probability',
    name: 'High School: Statistics and Probability',
    grade: 'HS',
    url: 'https://www.studypug.com/curriculum/us/common-core/math/highschool/us-cc-high-school-statistics-probability/',
    description: 'Interpreting Categorical and Quantitative Data, Making Inferences, Conditional Probability',
    subjects: [
      {
        id: 'hs-id',
        name: 'Interpreting Categorical and Quantitative Data',
        url: 'highschool/interpreting-data',
        description: 'Summarize, represent, and interpret data',
        topics: [
          {
            id: 'hs-id-1',
            name: 'Data interpretation',
            description: 'Represent data with plots on the real number line',
            difficulty: 9,
            estimatedTime: 45,
            prerequisites: ['7-sp-1'],
            standards: ['S-ID.1', 'S-ID.2']
          }
        ]
      },
      {
        id: 'hs-ic',
        name: 'Making Inferences and Justifying Conclusions',
        url: 'highschool/making-inferences',
        description: 'Understand and evaluate random processes',
        topics: [
          {
            id: 'hs-ic-1',
            name: 'Statistical inferences',
            description: 'Understand statistics as a process for making inferences',
            difficulty: 11,
            estimatedTime: 55,
            prerequisites: ['hs-id-1'],
            standards: ['S-IC.1', 'S-IC.2']
          }
        ]
      }
    ]
  }
];

// Combined curriculum for easy access
export const completeStudyPugCurriculum = [
  ...studyPugMathCurriculum,
  ...studyPugHighSchoolMath
];
