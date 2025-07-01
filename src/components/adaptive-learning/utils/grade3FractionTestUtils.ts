
export const analyzeGradeLevel = (question: string): string => {
  const indicators = {
    appropriate: ['one half', '1/2', '1/3', '1/4', 'parts', 'whole', 'equal parts', 'shaded'],
    tooAdvanced: ['equivalent', 'compare', 'add', 'subtract', 'mixed number', 'improper']
  };
  
  const lowerQuestion = question.toLowerCase();
  const hasAppropriate = indicators.appropriate.some(term => lowerQuestion.includes(term));
  const hasTooAdvanced = indicators.tooAdvanced.some(term => lowerQuestion.includes(term));
  
  if (hasAppropriate && !hasTooAdvanced) return 'Grade 3 Appropriate';
  if (hasTooAdvanced) return 'Possibly Too Advanced';
  return 'Needs Analysis';
};

export const analyzeConceptualFocus = (question: string): string => {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('what fraction') || lowerQuestion.includes('which fraction')) {
    return 'Fraction Identification (Good)';
  }
  if (lowerQuestion.includes('shaded') || lowerQuestion.includes('colored')) {
    return 'Visual Representation (Excellent)';
  }
  if (lowerQuestion.includes('equal parts') || lowerQuestion.includes('divided')) {
    return 'Partitioning Concept (Excellent)';
  }
  if (lowerQuestion.includes('calculate') || lowerQuestion.includes('compute')) {
    return 'Computational (Not Ideal for Grade 3)';
  }
  
  return 'General Fraction Question';
};

export const getContentQualityBadge = (atoms: any[]) => {
  if (!atoms || atoms.length === 0) return null;
  
  const hasVisualQuestions = atoms.some(atom => 
    atom.content?.question?.toLowerCase().includes('shaded') ||
    atom.content?.question?.toLowerCase().includes('colored') ||
    atom.content?.question?.toLowerCase().includes('parts')
  );
  
  const hasUnitFractions = atoms.some(atom => 
    atom.content?.question?.includes('1/') ||
    atom.content?.question?.toLowerCase().includes('one half') ||
    atom.content?.question?.toLowerCase().includes('one third')
  );
  
  if (hasVisualQuestions && hasUnitFractions) {
    return { variant: 'default', text: 'Excellent for Grade 3', className: 'bg-green-100 text-green-800' };
  } else if (hasVisualQuestions || hasUnitFractions) {
    return { variant: 'secondary', text: 'Good for Grade 3', className: 'bg-yellow-100 text-yellow-800' };
  } else {
    return { variant: 'destructive', text: 'Needs Improvement', className: 'bg-red-100 text-red-800' };
  }
};
