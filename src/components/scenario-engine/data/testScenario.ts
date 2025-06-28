
import { ScenarioDefinition } from '@/types/scenario';

export const testScenario: ScenarioDefinition = {
  id: "test-math-scenario-1",
  title: "Basic Addition Adventure",
  description: "Learn addition through an interactive story scenario",
  educational: {
    subject: "mathematics",
    gradeLevel: 2,
    difficulty: 3,
    estimatedDuration: 15,
    learningOutcomes: [
      "Understand basic addition concepts",
      "Apply addition in real-world scenarios",
      "Build confidence with numbers"
    ],
    prerequisites: ["Counting to 20", "Number recognition"]
  },
  nodes: [
    {
      id: "welcome-node",
      type: "explanation",
      title: "Welcome to Math Adventure!",
      content: "Hi there! I'm Nelie, and I'm excited to go on a math adventure with you. Today we're going to help a baker solve some addition problems!",
      educational: {
        subject: "mathematics",
        skillArea: "addition",
        difficultyLevel: 1,
        estimatedDuration: 2,
        learningObjectives: ["Introduce the scenario", "Set expectations"]
      },
      connections: {
        next: "problem-1"
      },
      config: {
        required: true,
        allowHints: false
      }
    },
    {
      id: "problem-1",
      type: "question",
      title: "The Baker's First Challenge",
      content: "The baker has 3 chocolate cookies and 2 vanilla cookies. How many cookies does the baker have in total?",
      educational: {
        subject: "mathematics",
        skillArea: "addition",
        difficultyLevel: 2,
        estimatedDuration: 3,
        learningObjectives: ["Practice basic addition", "Apply math to real scenarios"]
      },
      connections: {
        branches: [
          {
            condition: "correct",
            targetNodeId: "problem-2",
            reason: "Great job! Let's try another problem."
          },
          {
            condition: "incorrect",
            targetNodeId: "hint-1",
            reason: "Let me give you a hint to help you solve this."
          }
        ],
        fallback: "hint-1"
      },
      config: {
        required: true,
        maxAttempts: 3,
        allowHints: true,
        customProperties: {
          options: ["4", "5", "6", "7"],
          correctAnswer: "5",
          questionType: "multiple_choice"
        }
      }
    },
    {
      id: "hint-1",
      type: "explanation",
      title: "Let's Think About This Together",
      content: "When we want to find the total, we add the numbers together. Try counting: 3 cookies + 2 cookies. You can count on your fingers: 1, 2, 3... then 4, 5!",
      educational: {
        subject: "mathematics",
        skillArea: "addition",
        difficultyLevel: 1,
        estimatedDuration: 2,
        learningObjectives: ["Provide scaffolding", "Reinforce counting strategy"]
      },
      connections: {
        next: "problem-1"
      },
      config: {
        required: false,
        allowHints: false
      }
    },
    {
      id: "problem-2",
      type: "question",
      title: "More Cookies to Count!",
      content: "Excellent! Now the baker makes 4 more cookies. If the baker had 5 cookies before and makes 4 more, how many cookies are there now?",
      educational: {
        subject: "mathematics",
        skillArea: "addition",
        difficultyLevel: 3,
        estimatedDuration: 4,
        learningObjectives: ["Practice larger addition", "Build on previous success"]
      },
      connections: {
        branches: [
          {
            condition: "correct",
            targetNodeId: "celebration",
            reason: "Amazing work! You're a math superstar!"
          },
          {
            condition: "incorrect",
            targetNodeId: "hint-2",
            reason: "Let's work through this step by step."
          }
        ],
        fallback: "hint-2"
      },
      config: {
        required: true,
        maxAttempts: 3,
        allowHints: true,
        customProperties: {
          options: ["8", "9", "10", "11"],
          correctAnswer: "9",
          questionType: "multiple_choice"
        }
      }
    },
    {
      id: "hint-2",
      type: "explanation",
      title: "Let's Break It Down",
      content: "We had 5 cookies, and we're adding 4 more. Try counting from 5: 6, 7, 8, 9! So 5 + 4 = 9.",
      educational: {
        subject: "mathematics",
        skillArea: "addition",
        difficultyLevel: 2,
        estimatedDuration: 2,
        learningObjectives: ["Teach counting on strategy", "Support problem solving"]
      },
      connections: {
        next: "problem-2"
      },
      config: {
        required: false,
        allowHints: false
      }
    },
    {
      id: "celebration",
      type: "summary",
      title: "Congratulations, Math Hero!",
      content: "You did an amazing job helping the baker with addition! You learned how to add small numbers together and used counting strategies. The baker is so happy with your help!",
      educational: {
        subject: "mathematics",
        skillArea: "addition",
        difficultyLevel: 1,
        estimatedDuration: 2,
        learningObjectives: ["Celebrate success", "Reinforce learning", "Build confidence"]
      },
      connections: {},
      config: {
        required: true,
        allowHints: false
      }
    }
  ],
  entryNodeId: "welcome-node",
  exitNodeIds: ["celebration"],
  config: {
    allowRevisit: false,
    autoSave: true,
    maxDuration: 20,
    passingCriteria: {
      minScore: 70,
      requiredNodes: ["problem-1", "problem-2"]
    }
  },
  metadata: {
    author: "Nelie AI Tutor",
    createdAt: new Date(),
    updatedAt: new Date(),
    version: "1.0.0",
    status: "published",
    tags: ["math", "addition", "elementary", "interactive"],
    usage: {
      timesUsed: 0,
      avgCompletionRate: 0,
      avgRating: 5
    }
  }
};
