
import { LessonActivity } from '../types/LessonTypes';

interface UseVariedLessonGeneratorProps {
  subject: string;
  skillArea: string;
  sessionId: string;
}

export const useVariedLessonGenerator = ({ 
  subject, 
  skillArea, 
  sessionId 
}: UseVariedLessonGeneratorProps) => {

  const generateVariedLessonActivities = (): LessonActivity[] => {
    console.log(`🎨 Generating VARIED ${subject} lesson with games, simulations, and creative activities`);

    const activities: LessonActivity[] = [];

    // 1. Introduction Activity
    activities.push({
      id: `intro-${sessionId}`,
      type: 'introduction',
      phase: 'introduction',
      title: `Welcome to ${subject.charAt(0).toUpperCase() + subject.slice(1)}!`,
      content: {
        text: `Get ready for an amazing journey through ${subject}! Today we'll explore exciting concepts through games, simulations, and creative challenges.`,
        hook: `Let's dive into the wonderful world of ${subject}!`
      },
      duration: 2
    });

    // 2. Educational Game Activity
    activities.push({
      id: `game-${sessionId}-1`,
      type: 'educational-game',
      title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Adventure Game`,
      content: {
        gameType: 'adventure',
        description: `Embark on an exciting ${subject} adventure where you'll solve puzzles and overcome challenges!`,
        challenges: [
          'Solve the mystery puzzle',
          'Complete the challenge quest',
          'Master the final boss level'
        ]
      },
      duration: 6
    });

    // 3. Interactive Quiz
    activities.push({
      id: `quiz-${sessionId}-1`,
      type: 'interactive-game',
      phase: 'interactive-game',
      title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Challenge`,
      content: {
        question: `What's the most important concept in ${subject}?`,
        options: ['Understanding patterns', 'Solving problems', 'Creative thinking', 'All of the above'],
        correctAnswer: 3,
        explanation: `All of these are important aspects of ${subject}!`
      },
      duration: 4
    });

    // 4. Interactive Simulation
    activities.push({
      id: `simulation-${sessionId}-1`,
      type: 'simulation',
      title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Laboratory`,
      content: {
        simulationType: 'laboratory',
        scenario: `Welcome to the ${subject} laboratory! Here you can experiment and discover new concepts through interactive simulations.`
      },
      duration: 7
    });

    // 5. Creative Exploration
    activities.push({
      id: `creative-${sessionId}-1`,
      type: 'creative-exploration',
      phase: 'creative-exploration',
      title: `Creative ${subject.charAt(0).toUpperCase() + subject.slice(1)} Exploration`,
      content: {
        creativePrompt: `Let's think creatively about ${subject}! What unique connections can you make?`,
        whatIfScenario: `What if we approached ${subject} in a completely different way?`,
        explorationTask: `Explore the creative possibilities within ${subject}`
      },
      duration: 5
    });

    // 6. Content Delivery
    activities.push({
      id: `content-${sessionId}-1`,
      type: 'content-delivery',
      phase: 'content-delivery',
      title: `Understanding ${subject.charAt(0).toUpperCase() + subject.slice(1)}`,
      content: {
        text: `Let's explore the key concepts that make ${subject} so fascinating and important in our daily lives.`
      },
      duration: 4
    });

    // 7. Another Educational Game
    activities.push({
      id: `game-${sessionId}-2`,
      type: 'educational-game',
      title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Puzzle Master`,
      content: {
        gameType: 'puzzle',
        description: `Test your ${subject} skills with challenging puzzles and brain teasers!`,
        challenges: [
          'Solve the pattern puzzle',
          'Complete the logic challenge',
          'Master the final puzzle'
        ]
      },
      duration: 6
    });

    // 8. Application Activity
    activities.push({
      id: `application-${sessionId}-1`,
      type: 'application',
      phase: 'application',
      title: `Real-World ${subject.charAt(0).toUpperCase() + subject.slice(1)}`,
      content: {
        scenario: `Imagine you're using ${subject} to solve a real-world problem.`,
        task: `Apply what you've learned to create a solution.`
      },
      duration: 5
    });

    // 9. Summary Activity
    activities.push({
      id: `summary-${sessionId}`,
      type: 'summary',
      phase: 'summary',
      title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Mastery Celebration!`,
      content: {
        keyTakeaways: [
          `You've mastered key ${subject} concepts`,
          `You've completed engaging games and simulations`,
          `You've explored creative applications`,
          `You're ready for more advanced challenges`
        ],
        nextTopicSuggestion: `Continue your ${subject} journey with advanced topics!`
      },
      duration: 3
    });

    return activities;
  };

  return {
    generateVariedLessonActivities
  };
};
