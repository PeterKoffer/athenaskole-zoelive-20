
export function createGradeAlignedPrompt(requestData: any): string {
  const { subject, skillArea, difficultyLevel, gradeLevel, questionContext } = requestData;
  
  // Normalize and map subjects
  const subjectMapping: Record<string, string> = {
    'math': 'mathematics',
    'maths': 'mathematics',
    'english': 'english',
    'language_arts': 'english',
    'ela': 'english',
    'science': 'science',
    'biology': 'science',
    'chemistry': 'science',
    'physics': 'science',
    'creative_writing': 'creative_writing',
    'writing': 'creative_writing',
    'music': 'music',
    'art': 'creative_arts',
    'arts': 'creative_arts',
    'creative_arts': 'creative_arts',
    'computer_science': 'computer_science',
    'coding': 'computer_science',
    'programming': 'computer_science',
    'social_studies': 'social_studies',
    'history': 'social_studies',
    'geography': 'social_studies',
    'pe': 'physical_education',
    'physical_education': 'physical_education',
    'health': 'health_education',
    'foreign_language': 'foreign_language',
    'spanish': 'foreign_language',
    'french': 'foreign_language'
  };

  console.log('🔍 Subject mapping:', subject, '->', subjectMapping[subject.toLowerCase()] || subject);
  
  const normalizedSubject = subjectMapping[subject.toLowerCase()] || subject.toLowerCase();
  console.log('🔄 Normalized subject from', subject, 'to', normalizedSubject);

  const effectiveGradeLevel = gradeLevel || 5;
  console.log('🎯 Creating GRADE-ALIGNED prompt with teaching perspective for:', normalizedSubject, 'Grade:', effectiveGradeLevel);

  // Create subject-specific prompts
  const subjectPrompts: Record<string, string> = {
    mathematics: `Create an engaging Grade ${effectiveGradeLevel} mathematics question about ${skillArea}. 
    Focus on practical applications and real-world scenarios that ${effectiveGradeLevel}th graders can relate to.
    Use appropriate mathematical vocabulary for this grade level.`,

    english: `Generate a Grade ${effectiveGradeLevel} English Language Arts question focusing on ${skillArea}.
    Include age-appropriate vocabulary, reading comprehension, or language skills.
    Make it engaging with relatable scenarios for ${effectiveGradeLevel}th graders.`,

    science: `Create a Grade ${effectiveGradeLevel} science question about ${skillArea}.
    Focus on hands-on learning, observations, and scientific thinking appropriate for this grade.
    Use simple experiments or real-world examples.`,

    creative_writing: `Generate a Grade ${effectiveGradeLevel} creative writing prompt or question about ${skillArea}.
    Encourage imagination, storytelling, and age-appropriate creative expression.
    Include fun scenarios that inspire creativity.`,

    music: `Create an engaging Grade ${effectiveGradeLevel} music education question about ${skillArea}.
    Focus on musical concepts like rhythm, melody, instruments, composers, or music theory appropriate for this grade level.
    Include listening skills, musical notation basics, or music appreciation.
    Make it interactive and fun with examples students can relate to.`,

    creative_arts: `Generate a Grade ${effectiveGradeLevel} creative arts question about ${skillArea}.
    Focus on art techniques, famous artists, color theory, or creative expression.
    Include hands-on activities and visual learning appropriate for this grade.`,

    computer_science: `Create a Grade ${effectiveGradeLevel} computer science question about ${skillArea}.
    Focus on basic programming concepts, digital literacy, or computational thinking.
    Use age-appropriate examples and avoid complex syntax.`,

    social_studies: `Generate a Grade ${effectiveGradeLevel} social studies question about ${skillArea}.
    Focus on history, geography, civics, or cultural studies appropriate for this grade.
    Include engaging stories and relatable examples.`,

    physical_education: `Create a Grade ${effectiveGradeLevel} physical education question about ${skillArea}.
    Focus on health, fitness, sports skills, or teamwork concepts.
    Include active learning and body awareness appropriate for this age.`,

    health_education: `Generate a Grade ${effectiveGradeLevel} health education question about ${skillArea}.
    Focus on nutrition, wellness, safety, or personal health topics.
    Use age-appropriate language and relatable scenarios.`,

    foreign_language: `Create a Grade ${effectiveGradeLevel} foreign language question about ${skillArea}.
    Focus on basic vocabulary, phrases, or cultural concepts.
    Include interactive elements and practical usage.`
  };

  const basePrompt = subjectPrompts[normalizedSubject] || 
    `Create an educational Grade ${effectiveGradeLevel} question about ${subject} focusing on ${skillArea}.
    Make it engaging and appropriate for ${effectiveGradeLevel}th grade students.`;

  return `${basePrompt}

REQUIREMENTS:
- Create exactly 4 answer options (A, B, C, D)
- Mark one option as correct (0-3 index)
- Provide a clear, encouraging explanation
- Use Grade ${effectiveGradeLevel} appropriate language
- Make it educational and engaging
- Difficulty level: ${difficultyLevel}/5

RESPONSE FORMAT (JSON):
{
  "question": "Your question here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "Why this answer is correct and encouraging feedback"
}

${questionContext?.uniquenessInstructions || ''}`;
}
