
import { Question } from '../hooks/useReliableQuestionGeneration';

export const createFallbackQuestion = (): Question => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  
  const mathQuestions = [
    {
      question: `Calculate: What is 15 + 27? (Question ${randomNum})`,
      options: ["42", "52", "32", "41"],
      correct: 0,
      explanation: "15 + 27 = 42. When adding, we combine the numbers: 15 + 27 = 42",
      learningObjectives: ["Basic addition", "Two-digit addition"],
      estimatedTime: 20
    },
    {
      question: `Math Problem: What is 8 × 9? (ID: ${randomNum})`,
      options: ["72", "81", "63", "56"],
      correct: 0,
      explanation: "8 × 9 = 72. This is part of the multiplication table.",
      learningObjectives: ["Multiplication tables", "Mental math"],
      estimatedTime: 25
    },
    {
      question: `Calculate: What is 100 - 37? (Practice ${randomNum})`,
      options: ["63", "73", "53", "67"],
      correct: 0,
      explanation: "100 - 37 = 63. When subtracting from 100, think of what adds to 37 to make 100.",
      learningObjectives: ["Subtraction", "Mental calculation"],
      estimatedTime: 30
    }
  ];

  const englishQuestions = [
    {
      question: `Grammar: Choose the correct sentence (Version ${randomNum})`,
      options: ["She don't like apples", "She doesn't like apples", "She not like apples", "She no like apples"],
      correct: 1,
      explanation: "The correct form is 'She doesn't like apples' because we use 'doesn't' with third person singular subjects.",
      learningObjectives: ["Subject-verb agreement", "Negative sentences"],
      estimatedTime: 25
    },
    {
      question: `Reading: What does 'enormous' mean? (Question ${randomNum})`,
      options: ["Very small", "Very large", "Very fast", "Very slow"],
      correct: 1,
      explanation: "'Enormous' means very large or huge in size.",
      learningObjectives: ["Vocabulary", "Word meanings"],
      estimatedTime: 20
    },
    {
      question: `Spelling: Which word is spelled correctly? (ID: ${randomNum})`,
      options: ["recieve", "receive", "recive", "receave"],
      correct: 1,
      explanation: "The correct spelling is 'receive'. Remember: i before e except after c.",
      learningObjectives: ["Spelling rules", "Common words"],
      estimatedTime: 30
    }
  ];

  const scienceQuestions = [
    {
      question: `Science: What do plants need to make food? (Study ${randomNum})`,
      options: ["Sunlight and water", "Only water", "Only soil", "Only air"],
      correct: 0,
      explanation: "Plants need sunlight, water, and carbon dioxide to make food through photosynthesis.",
      learningObjectives: ["Photosynthesis", "Plant biology"],
      estimatedTime: 35
    }
  ];

  // Choose question type based on timestamp to add variety
  const questionTypes = [mathQuestions, englishQuestions, scienceQuestions];
  const selectedType = questionTypes[timestamp % questionTypes.length];
  const selectedQuestion = selectedType[Math.floor(Math.random() * selectedType.length)];

  return {
    ...selectedQuestion,
    // Add timestamp to make it absolutely unique
    question: `${selectedQuestion.question.replace(/\(.*\)/, '')}(Session: ${timestamp})`,
  };
};
