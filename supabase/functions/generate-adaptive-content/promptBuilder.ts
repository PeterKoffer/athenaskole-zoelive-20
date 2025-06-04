
import { getGradeDescriptor, getAgeRange } from './gradeAligment.ts';

export interface PromptConfig {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  previousQuestions: string[];
  diversityPrompt?: string;
  sessionId?: number;
  gradeLevel?: number;
  standardsAlignment?: any;
}

export function createGradeAlignedPrompt(config: PromptConfig): string {
  const {
    subject,
    skillArea,
    difficultyLevel,
    previousQuestions,
    diversityPrompt,
    sessionId,
    gradeLevel,
    standardsAlignment
  } = config;

  console.log('🎯 Creating grade-aligned prompt for Grade', gradeLevel, 'subject:', subject);
  
  const grade = gradeLevel || Math.min(12, Math.max(1, difficultyLevel));
  const currentGrade = getGradeDescriptor(gradeLevel, difficultyLevel);
  
  let basePrompt = '';
  
  if (subject === 'mathematics') {
    basePrompt = createMathematicsPrompt(grade, skillArea, currentGrade, standardsAlignment, diversityPrompt, sessionId);
  } else if (subject === 'english') {
    basePrompt = createEnglishPrompt(grade, currentGrade, standardsAlignment, diversityPrompt, sessionId);
  } else if (subject === 'science') {
    basePrompt = createSciencePrompt(grade, currentGrade, standardsAlignment, diversityPrompt, sessionId);
  } else {
    basePrompt = createGeneralPrompt(grade, subject, skillArea, currentGrade, sessionId, diversityPrompt);
  }

  // Add standards compliance
  basePrompt += createExampleStructure(grade);

  // Add anti-repetition for grade level
  if (previousQuestions.length > 0) {
    basePrompt += createAntiRepetitionSection(grade, subject, previousQuestions, sessionId);
  }

  console.log('📝 Grade-aligned prompt created for Grade', grade);
  return basePrompt;
}

function createMathematicsPrompt(
  grade: number, 
  skillArea: string, 
  currentGrade: any, 
  standardsAlignment: any, 
  diversityPrompt?: string, 
  sessionId?: number
): string {
  return `Generate a UNIQUE mathematics question for Grade ${grade} students about ${skillArea}.

GRADE ${grade} REQUIREMENTS:
- Use ${currentGrade.vocab}
- Create examples involving ${currentGrade.examples}
- Focus on ${currentGrade.cognitive}
- Age-appropriate complexity for ${getAgeRange(grade)}

${standardsAlignment ? `
STANDARDS ALIGNMENT:
- Standard: ${standardsAlignment.code}
- Focus: ${standardsAlignment.title}
- Description: ${standardsAlignment.description}
- Domain: ${standardsAlignment.domain}
` : ''}

CRITICAL REQUIREMENTS:
- Create a question that is appropriate for Grade ${grade} mathematics curriculum
- Use numbers and concepts suitable for this grade level
- ${diversityPrompt || 'Be extremely creative and unique'}
- Ensure mathematical accuracy
- Use fresh, age-appropriate examples

Session ID: ${sessionId} - This must be completely unique for Grade ${grade}.`;
}

function createEnglishPrompt(
  grade: number, 
  currentGrade: any, 
  standardsAlignment: any, 
  diversityPrompt?: string, 
  sessionId?: number
): string {
  return `Generate a UNIQUE English/Language Arts question for Grade ${grade} students.

GRADE ${grade} REQUIREMENTS:
- Reading level appropriate for Grade ${grade}
- Use ${currentGrade.vocab}
- Examples involving ${currentGrade.examples}
- Focus on ${currentGrade.cognitive}

${standardsAlignment ? `
STANDARDS ALIGNMENT:
- Standard: ${standardsAlignment.code}
- Focus: ${standardsAlignment.title}
- Description: ${standardsAlignment.description}
- Domain: ${standardsAlignment.domain}
` : ''}

CRITICAL REQUIREMENTS:
- Create content appropriate for Grade ${grade} reading and comprehension level
- Use age-appropriate themes and vocabulary
- ${diversityPrompt || 'Be extremely creative with scenarios and examples'}
- Focus on grade-level literacy skills

Session ID: ${sessionId} - This must be original Grade ${grade} content.`;
}

function createSciencePrompt(
  grade: number, 
  currentGrade: any, 
  standardsAlignment: any, 
  diversityPrompt?: string, 
  sessionId?: number
): string {
  return `Generate a UNIQUE science question for Grade ${grade} students.

GRADE ${grade} REQUIREMENTS:
- Scientific concepts appropriate for Grade ${grade}
- Use ${currentGrade.vocab}
- Examples involving ${currentGrade.examples}
- Focus on ${currentGrade.cognitive}

${standardsAlignment ? `
STANDARDS ALIGNMENT:
- Standard: ${standardsAlignment.code}
- Focus: ${standardsAlignment.title}
- Description: ${standardsAlignment.description}
- Domain: ${standardsAlignment.domain}
` : ''}

CRITICAL REQUIREMENTS:
- Create science content appropriate for Grade ${grade} understanding
- Use age-appropriate scientific concepts and terminology
- ${diversityPrompt || 'Explore diverse scientific topics appropriate for this grade'}
- Focus on grade-level scientific inquiry

Session ID: ${sessionId} - This must be original Grade ${grade} science content.`;
}

function createGeneralPrompt(
  grade: number, 
  subject: string, 
  skillArea: string, 
  currentGrade: any, 
  sessionId?: number, 
  diversityPrompt?: string
): string {
  return `Generate a UNIQUE educational question for Grade ${grade} students in ${subject} - ${skillArea}.

GRADE ${grade} REQUIREMENTS:
- Content appropriate for Grade ${grade} curriculum
- Use ${currentGrade.vocab}
- Examples involving ${currentGrade.examples}
- Focus on ${currentGrade.cognitive}

Session ID: ${sessionId} - Create grade-appropriate original content.
${diversityPrompt || 'Be maximally creative while maintaining grade-level appropriateness'}`;
}

function createExampleStructure(grade: number): string {
  return `

EXAMPLE STRUCTURE (create something completely different with appropriate grade level):
{
  "question": "Create a Grade ${grade} appropriate question here",
  "options": ["Grade ${grade} level option 1", "Grade ${grade} level option 2", "Grade ${grade} level option 3", "Grade ${grade} level option 4"],
  "correct": 0,
  "explanation": "Grade ${grade} appropriate explanation using suitable vocabulary",
  "learningObjectives": ["Grade ${grade} skill 1", "Grade ${grade} skill 2"]
}

RETURN ONLY valid JSON, no markdown formatting.`;
}

function createAntiRepetitionSection(
  grade: number, 
  subject: string, 
  previousQuestions: string[], 
  sessionId?: number
): string {
  return `\n\nCRITICAL: You MUST NOT create any question similar to these previous Grade ${grade} questions:
${previousQuestions.slice(0, 15).map((q, i) => `${i + 1}. ${q}`).join('\n')}

Your new Grade ${grade} question must be:
- About a completely different scenario appropriate for Grade ${grade}
- Using different numbers, examples, or concepts suitable for this grade
- Focusing on a different aspect of Grade ${grade} ${subject} curriculum
- Absolutely unique and never asked before at this grade level

Grade ${grade} Session ${sessionId}: Generate completely fresh, grade-appropriate content!`;
}
