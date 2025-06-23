
import { useState, useCallback } from 'react';
import { LessonActivity } from '../types/LessonTypes';

interface UseVariedLessonGeneratorProps {
  subject: string;
  skillArea: string;
  sessionId: string;
}

export const useVariedLessonGenerator = ({ subject, skillArea, sessionId }: UseVariedLessonGeneratorProps) => {

  const generateVariedLessonActivities = useCallback((): LessonActivity[] => {
    const activities: LessonActivity[] = [];
    const lessonId = `varied-${subject}-${sessionId.substring(0,8)}-${Date.now()}`;
    const subjectTitle = subject.charAt(0).toUpperCase() + subject.slice(1);

    console.log(`🎯 Generating VARIED activities for ${subject} (session: ${sessionId})`);

    // 1. Welcome Introduction
    activities.push({
      id: `${lessonId}_welcome`,
      title: `Welcome to ${subjectTitle} Adventure!`,
      type: 'introduction',
      phase: 'introduction',
      duration: 120,
      phaseDescription: `Welcome to your exciting ${subjectTitle} learning journey`,
      metadata: { subject, skillArea: 'welcome' },
      content: {
        text: `Hello! Get ready for an amazing ${subjectTitle} adventure filled with games, challenges, and discoveries! We'll explore concepts through fun activities, interactive games, and creative challenges. Let's make learning exciting!`
      }
    });

    // 2. Educational Game
    activities.push({
      id: `${lessonId}_game_1`,
      title: `${subjectTitle} Challenge Arena`,
      type: 'educational-game',
      phase: 'interactive-game',
      duration: 300,
      phaseDescription: `Interactive ${subjectTitle} game challenge`,
      metadata: { subject, skillArea: 'educational-game' },
      content: {
        gameType: 'challenge-arena',
        description: `Test your ${subjectTitle} skills in this exciting challenge arena!`,
        challenges: [
          `Solve the ${subjectTitle} puzzle to unlock the first key!`,
          `Use your knowledge to overcome the second challenge!`,
          `Master the final challenge and claim victory!`
        ]
      }
    });

    // 3. Interactive Question
    activities.push({
      id: `${lessonId}_question_1`,
      title: `${subjectTitle} Knowledge Test`,
      type: 'interactive-game',
      phase: 'interactive-game',
      duration: 180,
      phaseDescription: `Test your ${subjectTitle} understanding`,
      metadata: { subject, skillArea: 'knowledge-test' },
      content: {
        question: `Ready to test your ${subjectTitle} knowledge? Let's see what you've learned!`,
        options: ['I\'m ready!', 'Give me a hint', 'Let\'s practice first', 'Show me examples'],
        correctAnswer: 0,
        explanation: 'Great attitude! Your enthusiasm will help you succeed!'
      }
    });

    // 4. Creative Exploration
    activities.push({
      id: `${lessonId}_creative`,
      title: `Creative ${subjectTitle} Workshop`,
      type: 'creative-exploration',
      phase: 'creative-exploration',
      duration: 360,
      phaseDescription: `Explore ${subjectTitle} creatively`,
      metadata: { subject, skillArea: 'creative-exploration' },
      content: {
        creativePrompt: `Let's think outside the box! How can we use ${subjectTitle} in creative and unexpected ways?`,
        whatIfScenario: `What if ${subjectTitle} worked differently in a magical world? How would that change everything?`,
        explorationTask: `Imagine you're a ${subjectTitle} detective solving mysteries. What tools would you use?`
      }
    });

    // 5. Interactive Simulation
    activities.push({
      id: `${lessonId}_simulation`,
      title: `${subjectTitle} Laboratory`,
      type: 'simulation',
      phase: 'application',
      duration: 240,
      phaseDescription: `Interactive ${subjectTitle} simulation`,
      metadata: { subject, skillArea: 'simulation' },
      content: {
        scenario: `Welcome to the ${subjectTitle} laboratory! Here you can experiment and discover how things work.`,
        simulationType: 'interactive-lab',
        task: `Run experiments and observe the results to deepen your understanding.`
      }
    });

    // 6. Another Educational Game
    activities.push({
      id: `${lessonId}_game_2`,
      title: `${subjectTitle} Adventure Quest`,
      type: 'educational-game',
      phase: 'interactive-game',
      duration: 300,
      phaseDescription: `Adventure quest with ${subjectTitle} challenges`,
      metadata: { subject, skillArea: 'adventure-quest' },
      content: {
        gameType: 'adventure-quest',
        description: `Embark on an epic ${subjectTitle} adventure quest!`,
        challenges: [
          `Navigate through the ${subjectTitle} forest using your skills!`,
          `Solve the ancient ${subjectTitle} riddle to unlock the treasure!`,
          `Use teamwork and ${subjectTitle} knowledge to complete your quest!`
        ]
      }
    });

    // 7. Real-World Application
    activities.push({
      id: `${lessonId}_application`,
      title: `Real-World ${subjectTitle}`,
      type: 'application',
      phase: 'application',
      duration: 240,
      phaseDescription: `Apply ${subjectTitle} to real situations`,
      metadata: { subject, skillArea: 'real-world' },
      content: {
        scenario: `Let's see how ${subjectTitle} is used in the real world! You'll discover amazing connections between what you're learning and everyday life.`,
        task: `Explore how professionals use ${subjectTitle} in their careers and daily activities.`,
        guidance: `Think about how this knowledge can help you in your own life and future goals!`
      }
    });

    // 8. Celebration Summary
    activities.push({
      id: `${lessonId}_celebration`,
      title: `🎉 Amazing ${subjectTitle} Achievements!`,
      type: 'summary',
      phase: 'summary',
      duration: 180,
      phaseDescription: 'Celebrate your learning journey',
      metadata: { subject, skillArea: 'celebration' },
      content: {
        keyTakeaways: [
          `🎮 You conquered exciting ${subjectTitle} games and challenges!`,
          `🎨 You explored creative ways to use ${subjectTitle} concepts!`,
          `🔬 You experimented with ${subjectTitle} in the virtual laboratory!`,
          `🌟 You discovered how ${subjectTitle} connects to the real world!`,
          `🏆 You've become a true ${subjectTitle} explorer and problem-solver!`
        ],
        nextTopicSuggestion: `Next time, we'll dive into even more exciting ${subjectTitle} adventures with new games, challenges, and discoveries!`
      }
    });

    console.log(`✅ Generated ${activities.length} VARIED activities for ${subject}:`, 
      activities.map(a => ({ title: a.title, type: a.type, hasGame: a.type === 'educational-game' })));
    
    return activities;
  }, [subject, skillArea, sessionId]);

  return {
    generateVariedLessonActivities
  };
};
