
// UNESCO Curriculum Integration Service
// Based on UNESCO's Education 2030 Framework and ISCED levels

import { CurriculumTopic, CurriculumSubject, CurriculumLevel } from './curriculumData';

export interface UNESCOStandard {
  id: string;
  framework: 'UNESCO_SDG4' | 'ISCED' | 'GPE';
  level: string; // Primary, Lower Secondary, Upper Secondary
  domain: string;
  competency: string;
  description: string;
  ageRange: string;
  globalGoal: string;
}

export interface CountryCurriculum {
  countryCode: string; // ISO 3166-1 alpha-2
  countryName: string;
  educationSystem: string;
  gradeLevels: number[];
  subjects: CurriculumSubject[];
  unescoAlignment: UNESCOStandard[];
  languageOfInstruction: string[];
}

class UNESCOCurriculumService {
  private unescoStandards: UNESCOStandard[] = [];
  private countryCurricula: Map<string, CountryCurriculum> = new Map();

  constructor() {
    this.initializeUNESCOStandards();
    this.initializeCountryCurricula();
  }

  private initializeUNESCOStandards() {
    // UNESCO SDG 4.1 - Foundational Learning Standards
    this.unescoStandards = [
      {
        id: 'unesco-math-primary-numeracy',
        framework: 'UNESCO_SDG4',
        level: 'Primary',
        domain: 'Mathematics',
        competency: 'Foundational Numeracy',
        description: 'Basic arithmetic operations, number sense, and mathematical reasoning',
        ageRange: '6-11',
        globalGoal: 'SDG 4.1 - Quality Education'
      },
      {
        id: 'unesco-literacy-primary-reading',
        framework: 'UNESCO_SDG4',
        level: 'Primary',
        domain: 'Language Arts',
        competency: 'Foundational Literacy',
        description: 'Reading comprehension, writing skills, and communication',
        ageRange: '6-11',
        globalGoal: 'SDG 4.1 - Quality Education'
      },
      {
        id: 'unesco-science-inquiry',
        framework: 'UNESCO_SDG4',
        level: 'Lower Secondary',
        domain: 'Science',
        competency: 'Scientific Inquiry',
        description: 'Investigation, experimentation, and evidence-based reasoning',
        ageRange: '12-14',
        globalGoal: 'SDG 4.7 - Education for Sustainable Development'
      },
      {
        id: 'unesco-digital-literacy',
        framework: 'UNESCO_SDG4',
        level: 'Upper Secondary',
        domain: 'Digital Skills',
        competency: 'Digital Literacy',
        description: 'Critical evaluation of digital information and responsible technology use',
        ageRange: '15-17',
        globalGoal: 'SDG 4.4 - Technical and Vocational Skills'
      }
    ];
  }

  private initializeCountryCurricula() {
    // Initialize sample curricula for major education systems
    this.addCountryCurriculum(this.createUSCurriculum());
    this.addCountryCurriculum(this.createUKCurriculum());
    this.addCountryCurriculum(this.createCanadianCurriculum());
    this.addCountryCurriculum(this.createAustralianCurriculum());
    this.addCountryCurriculum(this.createSingaporeCurriculum());
  }

  private createUSCurriculum(): CountryCurriculum {
    return {
      countryCode: 'US',
      countryName: 'United States',
      educationSystem: 'Common Core State Standards',
      gradeLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      subjects: [
        {
          name: 'Mathematics',
          description: 'Common Core Mathematics Standards',
          topics: [
            {
              id: 'ccss-math-k-cc-1',
              name: 'Count to 100 by ones and tens',
              description: 'Count to 100 by ones and by tens',
              difficulty: 2,
              estimatedTime: 30,
              prerequisites: [],
              standards: ['CCSS.MATH.CONTENT.K.CC.A.1']
            }
          ]
        }
      ],
      unescoAlignment: ['unesco-math-primary-numeracy'],
      languageOfInstruction: ['en']
    };
  }

  private createUKCurriculum(): CountryCurriculum {
    return {
      countryCode: 'GB',
      countryName: 'United Kingdom',
      educationSystem: 'National Curriculum for England',
      gradeLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      subjects: [
        {
          name: 'Mathematics',
          description: 'National Curriculum Mathematics',
          topics: [
            {
              id: 'nc-math-ks1-number',
              name: 'Number and Place Value',
              description: 'Understanding numbers, counting, and place value',
              difficulty: 3,
              estimatedTime: 45,
              prerequisites: [],
              standards: ['NC-KS1-MATH-NPV']
            }
          ]
        }
      ],
      unescoAlignment: ['unesco-math-primary-numeracy'],
      languageOfInstruction: ['en']
    };
  }

  private createCanadianCurriculum(): CountryCurriculum {
    return {
      countryCode: 'CA',
      countryName: 'Canada',
      educationSystem: 'Provincial Curricula (Ontario Focus)',
      gradeLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      subjects: [
        {
          name: 'Mathematics',
          description: 'Ontario Mathematics Curriculum',
          topics: [
            {
              id: 'on-math-g1-number-sense',
              name: 'Number Sense and Numeration',
              description: 'Developing understanding of numbers and operations',
              difficulty: 3,
              estimatedTime: 40,
              prerequisites: [],
              standards: ['ON-MATH-G1-NSN']
            }
          ]
        }
      ],
      unescoAlignment: ['unesco-math-primary-numeracy'],
      languageOfInstruction: ['en', 'fr']
    };
  }

  private createAustralianCurriculum(): CountryCurriculum {
    return {
      countryCode: 'AU',
      countryName: 'Australia',
      educationSystem: 'Australian Curriculum',
      gradeLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      subjects: [
        {
          name: 'Mathematics',
          description: 'Australian Curriculum: Mathematics',
          topics: [
            {
              id: 'au-math-f-number',
              name: 'Number and Algebra',
              description: 'Foundation year number concepts',
              difficulty: 2,
              estimatedTime: 35,
              prerequisites: [],
              standards: ['ACMNA001']
            }
          ]
        }
      ],
      unescoAlignment: ['unesco-math-primary-numeracy'],
      languageOfInstruction: ['en']
    };
  }

  private createSingaporeCurriculum(): CountryCurriculum {
    return {
      countryCode: 'SG',
      countryName: 'Singapore',
      educationSystem: 'Singapore Mathematics Framework',
      gradeLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      subjects: [
        {
          name: 'Mathematics',
          description: 'Singapore Mathematics Syllabus',
          topics: [
            {
              id: 'sg-math-p1-whole-numbers',
              name: 'Whole Numbers',
              description: 'Understanding and working with whole numbers',
              difficulty: 4,
              estimatedTime: 50,
              prerequisites: [],
              standards: ['SG-MATH-P1-WN']
            }
          ]
        }
      ],
      unescoAlignment: ['unesco-math-primary-numeracy'],
      languageOfInstruction: ['en', 'zh', 'ms', 'ta']
    };
  }

  private addCountryCurriculum(curriculum: CountryCurriculum) {
    this.countryCurricula.set(curriculum.countryCode, curriculum);
  }

  // Public API methods
  getUNESCOStandards(): UNESCOStandard[] {
    return this.unescoStandards;
  }

  getCountryCurriculum(countryCode: string): CountryCurriculum | undefined {
    return this.countryCurricula.get(countryCode.toUpperCase());
  }

  getAllCountries(): string[] {
    return Array.from(this.countryCurricula.keys());
  }

  findTopicsByUNESCOStandard(unescoId: string): CurriculumTopic[] {
    const topics: CurriculumTopic[] = [];
    
    for (const [, curriculum] of this.countryCurricula) {
      if (curriculum.unescoAlignment.includes(unescoId)) {
        curriculum.subjects.forEach(subject => {
          topics.push(...subject.topics);
        });
      }
    }
    
    return topics;
  }

  alignTopicWithUNESCO(topicId: string, countryCode: string): UNESCOStandard[] {
    const curriculum = this.getCountryCurriculum(countryCode);
    if (!curriculum) return [];

    const alignedStandards: UNESCOStandard[] = [];
    
    curriculum.unescoAlignment.forEach(standardId => {
      const standard = this.unescoStandards.find(s => s.id === standardId);
      if (standard) {
        alignedStandards.push(standard);
      }
    });

    return alignedStandards;
  }

  generateCrossCountryComparison(topicName: string): Array<{
    country: string;
    approach: string;
    gradeLevel: number;
    standards: string[];
  }> {
    const comparisons: Array<{
      country: string;
      approach: string;
      gradeLevel: number;
      standards: string[];
    }> = [];

    for (const [countryCode, curriculum] of this.countryCurricula) {
      curriculum.subjects.forEach(subject => {
        const matchingTopics = subject.topics.filter(topic => 
          topic.name.toLowerCase().includes(topicName.toLowerCase()) ||
          topic.description.toLowerCase().includes(topicName.toLowerCase())
        );

        matchingTopics.forEach(topic => {
          comparisons.push({
            country: curriculum.countryName,
            approach: topic.description,
            gradeLevel: Math.floor(topic.difficulty / 2) + 1,
            standards: topic.standards
          });
        });
      });
    }

    return comparisons;
  }

  getRecommendedCountrySequence(userCountry: string, targetTopic: string): string[] {
    // Countries known for excellence in specific subjects
    const excellenceMap = {
      'mathematics': ['SG', 'FI', 'JP', 'KR'],
      'science': ['SG', 'FI', 'JP', 'CA'],
      'reading': ['FI', 'CA', 'IE', 'AU'],
      'problem-solving': ['SG', 'JP', 'FI', 'KR']
    };

    const topicLower = targetTopic.toLowerCase();
    for (const [subject, countries] of Object.entries(excellenceMap)) {
      if (topicLower.includes(subject)) {
        return [userCountry, ...countries.filter(c => c !== userCountry)].slice(0, 4);
      }
    }

    return [userCountry, 'US', 'GB', 'CA'];
  }
}

export default new UNESCOCurriculumService();
