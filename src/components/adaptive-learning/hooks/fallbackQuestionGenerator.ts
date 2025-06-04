
import { Question } from './useDiverseQuestionGeneration';

export const generateFallbackQuestion = (
  subject: string,
  skillArea: string,
  difficultyLevel: number,
  gradeLevel: number = 6
): Question => {
  
  if (subject === 'music') {
    return generateMusicQuestion(skillArea, difficultyLevel, gradeLevel);
  }
  
  if (subject === 'mathematics' || subject === 'math') {
    return generateMathQuestion(skillArea, difficultyLevel, gradeLevel);
  }
  
  if (subject === 'science') {
    return generateScienceQuestion(skillArea, difficultyLevel, gradeLevel);
  }
  
  if (subject === 'english') {
    return generateEnglishQuestion(skillArea, difficultyLevel, gradeLevel);
  }
  
  // Generic fallback
  return {
    question: `What is an important concept in ${subject}?`,
    options: [
      'Understanding the basics',
      'Practicing regularly',
      'Learning from examples',
      'All of the above'
    ],
    correct: 3,
    explanation: `All of these are important when learning ${subject}.`,
    difficulty: difficultyLevel,
    standard: null
  };
};

const generateMusicQuestion = (skillArea: string, difficultyLevel: number, gradeLevel: number): Question => {
  const musicQuestions = {
    music_theory: [
      {
        question: "Which of the following is a major scale pattern?",
        options: [
          "Whole-Half-Whole-Whole-Half-Whole-Whole",
          "Whole-Whole-Half-Whole-Whole-Whole-Half",
          "Half-Whole-Whole-Half-Whole-Whole-Whole",
          "Whole-Whole-Whole-Half-Whole-Whole-Half"
        ],
        correct: 1,
        explanation: "The major scale pattern is Whole-Whole-Half-Whole-Whole-Whole-Half, which creates the familiar 'Do-Re-Mi' sound."
      },
      {
        question: "How many beats does a whole note get in 4/4 time?",
        options: ["1 beat", "2 beats", "3 beats", "4 beats"],
        correct: 3,
        explanation: "In 4/4 time, a whole note gets 4 beats, filling the entire measure."
      },
      {
        question: "What is the distance between C and E called?",
        options: ["Minor third", "Major third", "Perfect fourth", "Perfect fifth"],
        correct: 1,
        explanation: "The distance between C and E is a major third, consisting of 4 half steps."
      }
    ],
    rhythm: [
      {
        question: "In 4/4 time, how many quarter notes fit in one measure?",
        options: ["2", "3", "4", "8"],
        correct: 2,
        explanation: "In 4/4 time signature, there are 4 quarter note beats per measure."
      },
      {
        question: "What type of note gets half a beat in 4/4 time?",
        options: ["Whole note", "Half note", "Quarter note", "Eighth note"],
        correct: 3,
        explanation: "An eighth note gets half a beat in 4/4 time."
      }
    ]
  };

  const questions = musicQuestions[skillArea as keyof typeof musicQuestions] || musicQuestions.music_theory;
  const selectedQuestion = questions[Math.floor(Math.random() * questions.length)];

  return {
    question: selectedQuestion.question,
    options: selectedQuestion.options,
    correct: selectedQuestion.correct,
    explanation: selectedQuestion.explanation,
    difficulty: difficultyLevel,
    standard: {
      code: `GRADE${gradeLevel}.MUSIC`,
      title: `Grade ${gradeLevel} Music`,
      description: `${skillArea} practice for Grade ${gradeLevel}`
    }
  };
};

const generateMathQuestion = (skillArea: string, difficultyLevel: number, gradeLevel: number): Question => {
  return {
    question: "What is 15 + 8?",
    options: ["21", "22", "23", "24"],
    correct: 2,
    explanation: "15 + 8 = 23",
    difficulty: difficultyLevel,
    standard: null
  };
};

const generateScienceQuestion = (skillArea: string, difficultyLevel: number, gradeLevel: number): Question => {
  return {
    question: "What is the chemical symbol for water?",
    options: ["H2O", "CO2", "NaCl", "O2"],
    correct: 0,
    explanation: "Water's chemical formula is H2O - two hydrogen atoms and one oxygen atom.",
    difficulty: difficultyLevel,
    standard: null
  };
};

const generateEnglishQuestion = (skillArea: string, difficultyLevel: number, gradeLevel: number): Question => {
  return {
    question: "Which word is a noun?",
    options: ["run", "quickly", "beautiful", "house"],
    correct: 3,
    explanation: "A noun is a person, place, or thing. 'House' is a thing, so it's a noun.",
    difficulty: difficultyLevel,
    standard: null
  };
};
