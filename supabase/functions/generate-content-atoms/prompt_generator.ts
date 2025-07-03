// Assuming curriculumIntegration.ts is located at ../../src/services/curriculum/curriculumIntegration.ts
// This path will likely need adjustment based on the actual directory structure.
// For now, I will use a placeholder and we can refine it.
// import { CurriculumIntegrationService } from '../../src/services/curriculum/curriculumIntegration.ts';

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
  // Example kcId: "kc_math_g3_oa_1" should map to Grade 3, Operations and Algebraic Thinking, Standard 1
  const parts = kcId.toLowerCase().split('_');
  const gradeStr = parts[2]?.replace('g', '');
  const grade = parseInt(gradeStr || '4'); // Default to grade 4 if parsing fails
  
  // Parse the standard part (e.g., "oa_1 from "kc_math_g3_oa_1")
  const standardParts = parts.slice(3); // ["oa", "1"]
  const domain = standardParts[0]; // "oa" 
  const standardNum = standardParts[1]; // "1"
  
  console.log(`🎯 Creating REAL curriculum-enhanced prompt for kcId: ${kcId}`);
  console.log(`📚 Grade: ${grade}, Domain: "${domain}", Standard: "${standardNum}"`);

  // Get curriculum data using the integrated service
  const gradeTopics = CurriculumIntegrationService.getTopicsForGrade(grade);
  
  // Find the specific topic by mapping KC ID to curriculum ID
  // KC ID "kc_math_g3_oa_1" should map to curriculum ID "3-oa-1"
  const targetCurriculumId = `${grade}-${domain}-${standardNum}`;
  console.log(`🔍 Looking for curriculum ID: ${targetCurriculumId}`);
  
  let relevantTopic = gradeTopics.find(topic => topic.id === targetCurriculumId);

  if (!relevantTopic) {
    console.warn(`⚠️ Could not find specific topic for curriculum ID "${targetCurriculumId}" in grade ${grade}`);
    
    // Fallback: search by domain keywords
    const domainKeywords = {
      'oa': ['multiplication', 'division', 'operations', 'algebraic', 'thinking'],
      'nf': ['fraction', 'fractions', 'number'],
      'nbt': ['number', 'base', 'ten', 'place', 'value'],
      'md': ['measurement', 'data', 'area', 'perimeter'],
      'g': ['geometry', 'shape', 'shapes']
    };
    
    const keywords = domainKeywords[domain] || [domain];
    console.log(`🔍 Fallback search with keywords: ${keywords.join(', ')}`);
    
    relevantTopic = gradeTopics.find(topic => 
      keywords.some(keyword => 
        topic.name.toLowerCase().includes(keyword) || 
        topic.description.toLowerCase().includes(keyword)
      )
    );
  }

  if (relevantTopic) {
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

🔍 CRITICAL VALIDATION REQUIREMENTS:
- BEFORE finalizing your response, calculate the correct answer to each math problem
- Verify that the 'correctAnswer' index (0-based) points to the option containing the mathematically correct result
- Double-check your arithmetic: if 6×9=54, then correctAnswer should point to the index of "54"
- If 4×10=40, then correctAnswer should point to the index containing "40", NOT "50"

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

✅ FINAL QUALITY CHECKLIST - VERIFY EACH ITEM:
1. ✓ JSON structure matches specification exactly
2. ✓ All math calculations performed correctly (show your work!)
3. ✓ correctAnswer index points to the mathematically accurate option
4. ✓ Content targets Grade ${grade} and addresses "${relevantTopic.name}"
5. ✓ Difficulty level appropriate for ${relevantTopic.difficulty}/10 scale
6. ✓ Standards alignment: ${relevantTopic.standards ? relevantTopic.standards.join(', ') : 'Grade-appropriate'}

EXAMPLE VALIDATION:
- Question: "What is 3×4?" Options: ["10", "12", "14", "16"]
- Correct calculation: 3×4 = 12
- Find "12" in options: index 1 (0-based)
- Set correctAnswer: 1 ✓
`;
  }

  // Fallback to original prompt if no curriculum data found
  console.warn(`❌ No relevant curriculum data found for kcId: ${kcId}. Using fallback prompt generator.`);
  return fallbackCreateMathPrompt(kcId, userId, contentTypes, maxAtoms);
}
