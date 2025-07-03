
// Curriculum type definitions
export interface CurriculumTopic {
  id: string;
  name: string;
  description: string;
  difficulty: number; // 1-10 scale
  estimatedTime: number; // minutes
  prerequisites: string[];
  standards: string[];
}

export interface CurriculumSubject {
  name: string;
  description: string;
  topics: CurriculumTopic[];
}

export interface CurriculumLevel {
  grade: number | string;
  description: string;
  subjects?: CurriculumSubject[];
}

// Complete StudyPug Curriculum Data
// This is a subset focused on key math topics for demonstration
// In production, this would be the complete curriculum from your StudyPug integration
export const completeStudyPugCurriculum: CurriculumLevel[] = [
  {
    grade: 3,
    description: "Grade 3 Mathematics",
    subjects: [
      {
        name: "Operations and Algebraic Thinking",
        description: "Represent and solve problems involving multiplication and division",
        topics: [
          {
            id: "3-oa-1",
            name: "Interpret products of whole numbers",
            description: "Interpret products of whole numbers, e.g., interpret 5 × 7 as the total number of objects in 5 groups of 7 objects each. For example: 3 × 4 can be thought of as 3 groups of 4 objects, or 4 groups of 3 objects.",
            difficulty: 4,
            estimatedTime: 40,
            prerequisites: [],
            standards: ["3.OA.A.1"]
          },
          {
            id: "3-oa-2", 
            name: "Interpret whole-number quotients",
            description: "Interpret whole-number quotients of whole numbers, e.g., interpret 56 ÷ 8 as the number of objects in each share when 56 objects are partitioned equally into 8 shares",
            difficulty: 5,
            estimatedTime: 45,
            prerequisites: ["3-oa-1"],
            standards: ["3.OA.A.2"]
          }
        ]
      },
      {
        name: "Number and Operations - Fractions",
        description: "Understanding fractions as numbers",
        topics: [
          {
            id: "3-nf-1",
            name: "Understand fractions as numbers",
            description: "Understand a fraction 1/b as the quantity formed by 1 part when a whole is partitioned into b equal parts",
            difficulty: 4,
            estimatedTime: 45,
            prerequisites: [],
            standards: ["3.NF.A.1"]
          }
        ]
      }
    ]
  },
  {
    grade: 4,
    description: "Grade 4 Mathematics",
    subjects: [
      {
        name: "Number and Operations - Fractions",
        description: "Extend understanding of fraction equivalence and ordering",
        topics: [
          {
            id: "4-nf-1",
            name: "Fraction equivalence",
            description: "Explain why a fraction a/b is equivalent to a fraction (n×a)/(n×b)",
            difficulty: 5,
            estimatedTime: 50,
            prerequisites: ["3-nf-1"],
            standards: ["4.NF.A.1"]
          },
          {
            id: "4-nf-2",
            name: "Compare fractions",
            description: "Compare two fractions with different numerators and denominators",
            difficulty: 6,
            estimatedTime: 55,
            prerequisites: ["4-nf-1"],
            standards: ["4.NF.A.2"]
          },
          {
            id: "4-nf-3",
            name: "Add and subtract fractions",
            description: "Understand addition and subtraction of fractions as joining and separating parts",
            difficulty: 7,
            estimatedTime: 60,
            prerequisites: ["4-nf-1", "4-nf-2"],
            standards: ["4.NF.B.3", "4.NF.B.3a", "4.NF.B.3b", "4.NF.B.3c", "4.NF.B.3d"]
          }
        ]
      },
      {
        name: "Operations and Algebraic Thinking",
        description: "Use the four operations with whole numbers to solve problems",
        topics: [
          {
            id: "4-oa-1",
            name: "Multiplicative comparisons",
            description: "Interpret multiplication equations as comparisons",
            difficulty: 4,
            estimatedTime: 40,
            prerequisites: ["3-oa-1"],
            standards: ["4.OA.A.1"]
          },
          {
            id: "4-oa-2",
            name: "Word problems with multiplication and division",
            description: "Multiply or divide to solve word problems involving multiplicative comparison",
            difficulty: 6,
            estimatedTime: 50,
            prerequisites: ["4-oa-1"],
            standards: ["4.OA.A.2"]
          }
        ]
      },
      {
        name: "Measurement and Data",
        description: "Solve problems involving measurement and conversion of measurements",
        topics: [
          {
            id: "4-md-3",
            name: "Area and perimeter",
            description: "Apply the area and perimeter formulas for rectangles in real world problems",
            difficulty: 5,
            estimatedTime: 45,
            prerequisites: [],
            standards: ["4.MD.A.3"]
          }
        ]
      }
    ]
  },
  {
    grade: 5,
    description: "Grade 5 Mathematics",
    subjects: [
      {
        name: "Number and Operations - Fractions",
        description: "Use equivalent fractions as a strategy to add and subtract fractions",
        topics: [
          {
            id: "5-nf-1",
            name: "Add and subtract fractions with unlike denominators",
            description: "Add and subtract fractions with unlike denominators by replacing given fractions with equivalent fractions",
            difficulty: 7,
            estimatedTime: 65,
            prerequisites: ["4-nf-3"],
            standards: ["5.NF.A.1"]
          },
          {
            id: "5-nf-4",
            name: "Multiply fractions",
            description: "Apply and extend previous understandings of multiplication to multiply a fraction by a whole number",
            difficulty: 8,
            estimatedTime: 70,
            prerequisites: ["4-nf-3"],
            standards: ["5.NF.B.4", "5.NF.B.4a", "5.NF.B.4b"]
          }
        ]
      },
      {
        name: "Number and Operations in Base Ten",
        description: "Understand the place value system and perform operations with multi-digit whole numbers and decimals",
        topics: [
          {
            id: "5-nbt-7-add-subtract",
            name: "Add and subtract decimals",
            description: "Add, subtract, multiply, and divide decimals to hundredths, using concrete models or drawings and strategies based on place value",
            difficulty: 6,
            estimatedTime: 55,
            prerequisites: [],
            standards: ["5.NBT.B.7"]
          },
          {
            id: "5-nbt-7-multiply",
            name: "Multiply decimals",
            description: "Multiply decimals to hundredths using concrete models, drawings, and strategies based on place value and properties of operations",
            difficulty: 7,
            estimatedTime: 60,
            prerequisites: ["5-nbt-7-add-subtract"],
            standards: ["5.NBT.B.7"]
          },
          {
            id: "5-nbt-7-divide",
            name: "Divide decimals",
            description: "Divide decimals to hundredths using concrete models, drawings, and strategies based on place value and properties of operations",
            difficulty: 8,
            estimatedTime: 65,
            prerequisites: ["5-nbt-7-multiply"],
            standards: ["5.NBT.B.7"]
          }
        ]
      }
    ]
  },
  {
    grade: 6,
    description: "Grade 6 Mathematics",
    subjects: [
      {
        name: "Ratios and Proportional Relationships",
        description: "Understand ratio concepts and use ratio reasoning to solve problems",
        topics: [
          {
            id: "6-rp-1",
            name: "Ratios and rates",
            description: "Understand the concept of a ratio and use ratio language to describe a ratio relationship between two quantities",
            difficulty: 6,
            estimatedTime: 50,
            prerequisites: ["5-nf-4"],
            standards: ["6.RP.A.1"]
          },
          {
            id: "6-rp-2",
            name: "Unit rates",
            description: "Understand the concept of a unit rate a/b associated with a ratio a:b with b ≠ 0, and use rate language in the context of a ratio relationship",
            difficulty: 7,
            estimatedTime: 55,
            prerequisites: ["6-rp-1"],
            standards: ["6.RP.A.2"]
          }
        ]
      },
      {
        name: "The Number System",
        description: "Apply and extend previous understandings of numbers to the system of rational numbers",
        topics: [
          {
            id: "6-ns-5",
            name: "Positive and negative numbers",
            description: "Understand that positive and negative numbers are used together to describe quantities having opposite directions or values",
            difficulty: 6,
            estimatedTime: 45,
            prerequisites: ["5-nbt-7-divide"],
            standards: ["6.NS.C.5"]
          }
        ]
      }
    ]
  }
];
