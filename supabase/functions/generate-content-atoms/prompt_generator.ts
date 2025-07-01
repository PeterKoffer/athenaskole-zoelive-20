
// Assuming curriculumIntegration.ts is located at ../../src/services/curriculum/curriculumIntegration.ts
// This path will likely need adjustment based on the actual directory structure.
// For now, I will use a placeholder and we can refine it.
// import { CurriculumIntegrationService } from '../../src/services/curriculum/curriculumIntegration.ts';

// Placeholder for CurriculumIntegrationService and its types until the actual import path is confirmed
// and I can verify its structure. For development, I'll mock its expected behavior.
const CurriculumIntegrationService = {
  searchTopics: (keyword: string): any[] => {
    console.log(`Mock CurriculumIntegrationService.searchTopics called with: ${keyword}`);
    if (keyword.includes("fraction equivalence")) {
      return [{ id: "4-nf-1", name: "Fraction equivalence", description: "Understand fraction equivalence and comparison", difficulty: 5, estimatedTime: 50, prerequisites: ["3-nf-1"], standards: ["4.NF.1", "4.NF.2"] }];
    }
    return [];
  },
  getTopicsForGrade: (grade: number): any[] => {
    console.log(`Mock CurriculumIntegrationService.getTopicsForGrade called with: ${grade}`);
    if (grade === 4) {
      return [{ id: "4-nf-1", name: "Fraction equivalence", description: "Understand fraction equivalence and comparison", difficulty: 5, estimatedTime: 50, prerequisites: ["3-nf-1"], standards: ["4.NF.1", "4.NF.2"] }, {id: "4-oa-1", name: "Operations and Algebraic Thinking", description: "Use the four operations with whole numbers to solve problems.", difficulty: 4, standards: ["4.OA.A.1"] }];
    }
    return [];
  },
  getPrerequisiteTopics: (topicId: string): any[] => {
    console.log(`Mock CurriculumIntegrationService.getPrerequisiteTopics called with: ${topicId}`);
    if (topicId === "4-nf-1") {
      return [{ id: "3-nf-1", name: "Understand fractions as numbers" }];
    }
    return [];
  }
};
// Import the curriculum data and service logic directly
import { completeStudyPugCurriculum, CurriculumLevel, CurriculumSubject, CurriculumTopic } from './curriculumData.ts';

// Integrated CurriculumIntegrationService functionality
class CurriculumIntegrationService {
  // Get curriculum by grade level
  static getCurriculumByGrade(grade: number | string): CurriculumLevel | undefined {
    return completeStudyPugCurriculum.find(level => level.grade === grade);
  }

  // Get all topics for a specific grade
  static getTopicsForGrade(grade: number | string): CurriculumTopic[] {
    const curriculum = this.getCurriculumByGrade(grade);
    if (!curriculum || !curriculum.subjects) return [];

    return curriculum.subjects.flatMap(subject => subject.topics);
  }

  // Search topics by keyword
  static searchTopics(keyword: string): CurriculumTopic[] {
    const allTopics = completeStudyPugCurriculum.flatMap(level => 
      level.subjects?.flatMap(subject => subject.topics) || []
    );

    const searchTerm = keyword.toLowerCase();
    return allTopics.filter(topic => 
      topic.name.toLowerCase().includes(searchTerm) ||
      topic.description.toLowerCase().includes(searchTerm) ||
      topic.standards.some(standard => standard.toLowerCase().includes(searchTerm))
    );
  }

  // Get prerequisite topics for a given topic
  static getPrerequisiteTopics(topicId: string): CurriculumTopic[] {
    const allTopics = completeStudyPugCurriculum.flatMap(level => 
      level.subjects?.flatMap(subject => subject.topics) || []
    );

    const topic = allTopics.find(t => t.id === topicId);
    if (!topic) return [];

    return allTopics.filter(t => topic.prerequisites.includes(t.id));
  }
}

// Original createMathPrompt - will serve as a fallback, renamed to avoid conflict
function fallbackCreateMathPrompt(kcId: string, userId: string, contentTypes: string[], maxAtoms: number): string {
  console.log(`Using fallbackCreateMathPrompt for kcId: ${kcId}`);
  // Extract math topic from KC ID
  const kcParts = kcId.toLowerCase().split('_');
  const subject = kcParts[1] || 'math';
  const grade = kcParts[2] || 'g4';
  const gradeNumber = grade.replace('g', '');
  const topic = kcParts.slice(3).join(' ').replace(/_/g, ' ');

  let specificInstructions = "";

  if (topic.includes('equivalent_fractions')) {
    specificInstructions = `Create questions about equivalent fractions like "Which fraction is equivalent to 2/4?" with options like "1/2", "3/6", "4/8", "All of the above" (correct: All of the above)`;
  } else if (topic.includes('multiply_decimals')) {
    specificInstructions = `Create decimal multiplication questions like "What is 2.5 × 1.6?" with numerical answer choices`;
  } else if (topic.includes('area_rectangles')) {
    specificInstructions = `Create area questions like "A rectangle has length 8 units and width 5 units. What is its area?" with options like "40 square units", "13 square units", "26 square units", "35 square units"`;
  } else if (topic.includes('add_fractions')) {
    specificInstructions = `Create fraction addition questions like "What is 2/5 + 1/5?" with fraction answer options. CRITICAL: Make sure the correctAnswer index points to the mathematically correct sum.`;
  } else if (topic.includes('basic_division')) {
    specificInstructions = `Create basic division questions like "What is 24 ÷ 6?" with numerical answer choices. MAKE SURE the correctAnswer index points to the mathematically correct result.`;
  } else {
    specificInstructions = `Create grade ${gradeNumber} math questions about ${topic} with numerical problems and calculations`;
  }

  return `You are a Grade ${gradeNumber} math teacher creating educational content about ${topic}.

Generate ${maxAtoms} educational atoms with these exact types: ${contentTypes.join(', ')}.

${specificInstructions}

For TEXT_EXPLANATION atoms, explain the math concept clearly with examples.
For QUESTION_MULTIPLE_CHOICE atoms, create ACTUAL MATH PROBLEMS with numbers, not generic questions about concepts.

CRITICAL: For multiple choice questions, you MUST ensure the correctAnswer index points to the option that contains the mathematically correct answer.

Example for fraction addition: If the question is "What is 2/5 + 3/5?" and your options are ["4/5", "5/5", "1/2", "1/5"], then correctAnswer should be 1 (because "5/5" is at index 1 and 2/5 + 3/5 = 5/5).

Return JSON with this exact structure:
{
  "atoms": [
    {
      "atom_type": "TEXT_EXPLANATION",
      "content": {
        "title": "Understanding ${topic}",
        "explanation": "Clear explanation of the math concept with step-by-step process",
        "examples": ["Example: 3 × 4 = 12", "Example: Area = length × width"]
      }
    },
    {
      "atom_type": "QUESTION_MULTIPLE_CHOICE",
      "content": {
        "question": "What is 12 × 15?",
        "options": ["180", "170", "190", "200"],
        "correctAnswer": 0,
        "explanation": "12 × 15 = 180. You can solve this by multiplying 12 × 10 = 120, then 12 × 5 = 60, so 120 + 60 = 180."
      }
    }
  ]
}

DOUBLE-CHECK: Before finalizing your response, verify that the correctAnswer index matches the position of the mathematically correct answer in the options array. This is CRITICAL for the learning system to work properly.

IMPORTANT: Create real mathematical calculations, not questions about concepts. Use actual numbers and math problems appropriate for Grade ${gradeNumber}.`;
}

export function createMathPrompt(kcId: string, userId: string, contentTypes: string[], maxAtoms: number): string {
  // Extract grade and topic from KC ID
  // Example kcId: "kc_math_g4_fraction_equivalence"
  const parts = kcId.toLowerCase().split('_');
  const gradeStr = parts[2]?.replace('g', '');
  const grade = parseInt(gradeStr || '4'); // Default to grade 4 if parsing fails
  const topicKeyword = parts.slice(3).join(' ').replace(/-/g, ' '); // e.g., "fraction equivalence"

  console.log(`Creating enhanced prompt for kcId: ${kcId}, Grade: ${grade}, Topic Keyword: "${topicKeyword}"`);

  // Get curriculum data
  const matchingTopics = CurriculumIntegrationService.searchTopics(topicKeyword);
  const gradeTopics = CurriculumIntegrationService.getTopicsForGrade(grade);

  console.log(`🎯 Creating REAL curriculum-enhanced prompt for kcId: ${kcId}`);
  console.log(`📚 Grade: ${grade}, Topic Keyword: "${topicKeyword}"`);

  // Get curriculum data using the integrated service
  const matchingTopics = CurriculumIntegrationService.searchTopics(topicKeyword);
  const gradeTopics = CurriculumIntegrationService.getTopicsForGrade(grade);

  console.log(`🔍 Found ${matchingTopics.length} matching topics and ${gradeTopics.length} grade topics`);
  // Find the most relevant topic
  // Prioritize topics that are in the specified grade and match the keyword.
  let relevantTopic = null;
  if (matchingTopics.length > 0 && gradeTopics.length > 0) {
    relevantTopic = matchingTopics.find(t =>
      gradeTopics.some(gt => gt.id === t.id && t.name.toLowerCase().includes(topicKeyword)) // Check name match too
      gradeTopics.some(gt => gt.id === t.id && t.name.toLowerCase().includes(topicKeyword))
    );
  }

  // If no exact match by keyword search within grade, try finding first topic in grade that loosely matches
  if (!relevantTopic && gradeTopics.length > 0) {
    relevantTopic = gradeTopics.find(gt => gt.name.toLowerCase().includes(topicKeyword));
  }

  // As a final fallback, if still no relevant topic, use the first topic of the grade.
  if (!relevantTopic && gradeTopics.length > 0) {
    console.warn(`Could not find specific topic for "${topicKeyword}" in grade ${grade}. Using first topic of the grade: ${gradeTopics[0].name}`);
    console.warn(`⚠️ Could not find specific topic for "${topicKeyword}" in grade ${grade}. Using first topic of the grade: ${gradeTopics[0].name}`);
    relevantTopic = gradeTopics[0];
  }

  if (relevantTopic) {
    console.log(`Found relevant topic: ${relevantTopic.name} (ID: ${relevantTopic.id})`);
    // Get prerequisites for context
    const prerequisites = CurriculumIntegrationService.getPrerequisiteTopics(relevantTopic.id);
    const prerequisiteNames = prerequisites.map((p:any) => p.name).join(', ') || 'None';

    // Constructing the detailed prompt
    // Base structure from your example, enhanced with curriculum data
    return `You are a Grade ${grade} math teacher. Your task is to create educational content.

Topic Details to Focus On:
- Name: ${relevantTopic.name}
- Description: ${relevantTopic.description}
- Target Difficulty Level (1-10 scale, aim for this): ${relevantTopic.difficulty}
- Relevant Common Core Standards: ${relevantTopic.standards ? relevantTopic.standards.join(', ') : 'N/A'}
- Important Prerequisites to consider: ${prerequisiteNames}

Generate ${maxAtoms} educational atoms with these exact types: ${contentTypes.join(', ')}.
The atoms should be about "${relevantTopic.name}".

For TEXT_EXPLANATION atoms:
- Provide a clear explanation of the concept: "${relevantTopic.description}".
- Include step-by-step processes if applicable.
- Offer 1-2 illustrative examples.

For QUESTION_MULTIPLE_CHOICE atoms:
- Create ACTUAL MATH PROBLEMS directly related to "${relevantTopic.name}" using numbers and scenarios appropriate for Grade ${grade}.
- Ensure questions align with the specified Common Core Standards: ${relevantTopic.standards ? relevantTopic.standards.join(', ') : 'N/A'}.
- The question difficulty should be around ${relevantTopic.difficulty} on a 1-10 scale.
- CRITICAL: The 'correctAnswer' field in your JSON response MUST be the 0-based index of the mathematically correct option in the 'options' array.

Return JSON with this exact structure:
{
  "atoms": [
    // Example TEXT_EXPLANATION atom:
    // {
    //   "atom_type": "TEXT_EXPLANATION",
    //   "content": {
    //     "title": "Understanding ${relevantTopic.name}",
    //     "explanation": "Detailed explanation relevant to ${relevantTopic.description}...",
    //     "examples": ["Example 1 related to ${relevantTopic.name}", "Example 2 related to ${relevantTopic.name}"]
    //   }
    // },
    // Example QUESTION_MULTIPLE_CHOICE atom:
    // {
    //   "atom_type": "QUESTION_MULTIPLE_CHOICE",
    //   "content": {
    //     "question": "A specific math problem about ${relevantTopic.name} for Grade ${grade}...",
    //     "options": ["Option A", "Option B (Correct)", "Option C", "Option D"],
    //     "correctAnswer": 1, // Index of "Option B (Correct)"
    //     "explanation": "Step-by-step solution and explanation for this problem."
    //   }
    // }
  ]
}

DOUBLE-CHECK your response:
1. The JSON structure is exactly as specified.
2. The 'correctAnswer' index is accurate for all multiple-choice questions.
3. The content is appropriate for Grade ${grade} and targets "${relevantTopic.name}" and its standards.
`;
  }

  // Fallback to original prompt if no curriculum data found at all
  console.warn(`No relevant curriculum data found for kcId: ${kcId}. Using fallback prompt generator.`);
    console.log(`✅ Found relevant curriculum topic: ${relevantTopic.name} (ID: ${relevantTopic.id})`);
    console.log(`📊 Topic difficulty: ${relevantTopic.difficulty}, Standards: ${relevantTopic.standards?.join(', ') || 'N/A'}`);
    
    // Get prerequisites for context
    const prerequisites = CurriculumIntegrationService.getPrerequisiteTopics(relevantTopic.id);
    const prerequisiteNames = prerequisites.map((p: any) => p.name).join(', ') || 'None';

    // Constructing the detailed curriculum-enhanced prompt
    return `You are a Grade ${grade} math teacher creating educational content aligned with Common Core Standards.

📚 CURRICULUM ALIGNMENT:
- Topic: ${relevantTopic.name}
- Description: ${relevantTopic.description}
- Target Difficulty Level (1-10): ${relevantTopic.difficulty}
- Common Core Standards: ${relevantTopic.standards ? relevantTopic.standards.join(', ') : 'N/A'}
- Prerequisites: ${prerequisiteNames}
- Estimated Learning Time: ${relevantTopic.estimatedTime || 'N/A'} minutes

🎯 CONTENT GENERATION REQUIREMENTS:
Generate ${maxAtoms} educational atoms with these exact types: ${contentTypes.join(', ')}.
All content must be directly related to "${relevantTopic.name}" and appropriate for Grade ${grade} students.

For TEXT_EXPLANATION atoms:
- Provide clear explanation of "${relevantTopic.description}"
- Include step-by-step processes aligned with the difficulty level ${relevantTopic.difficulty}
- Offer 1-2 practical examples that students can relate to
- Reference the prerequisite knowledge: ${prerequisiteNames}

For QUESTION_MULTIPLE_CHOICE atoms:
- Create ACTUAL MATH PROBLEMS using numbers and real-world scenarios
- Ensure questions directly assess understanding of "${relevantTopic.name}"
- Align difficulty with level ${relevantTopic.difficulty} on a 1-10 scale
- Target the specific Common Core Standards: ${relevantTopic.standards ? relevantTopic.standards.join(', ') : 'Grade-appropriate standards'}
- CRITICAL: The 'correctAnswer' field MUST be the 0-based index of the mathematically correct option

🏗️ RESPONSE STRUCTURE:
Return JSON with this exact structure:
{
  "atoms": [
    {
      "atom_type": "TEXT_EXPLANATION",
      "content": {
        "title": "Understanding ${relevantTopic.name}",
        "explanation": "Detailed explanation aligned with ${relevantTopic.description} and Common Core Standards ${relevantTopic.standards ? relevantTopic.standards.join(', ') : ''}...",
        "examples": ["Real-world example 1 for ${relevantTopic.name}", "Practical example 2 showing ${relevantTopic.name}"]
      }
    },
    {
      "atom_type": "QUESTION_MULTIPLE_CHOICE",
      "content": {
        "question": "Grade ${grade} math problem specifically about ${relevantTopic.name}...",
        "options": ["Option A", "Correct Option B", "Option C", "Option D"],
        "correctAnswer": 1,
        "explanation": "Step-by-step solution explaining the concept from ${relevantTopic.description}"
      }
    }
  ]
}

✅ QUALITY CHECKLIST:
1. JSON structure matches specification exactly
2. correctAnswer index is mathematically accurate for all questions
3. Content targets Grade ${grade} and addresses "${relevantTopic.name}"
4. Difficulty level appropriate for ${relevantTopic.difficulty}/10 scale
5. Standards alignment: ${relevantTopic.standards ? relevantTopic.standards.join(', ') : 'Grade-appropriate'}
`;
  }

  // Fallback to original prompt if no curriculum data found
  console.warn(`❌ No relevant curriculum data found for kcId: ${kcId}. Using fallback prompt generator.`);
  return fallbackCreateMathPrompt(kcId, userId, contentTypes, maxAtoms);
}
