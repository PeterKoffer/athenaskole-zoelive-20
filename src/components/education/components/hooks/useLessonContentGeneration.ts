
import { useState, useCallback } from 'react';
import { LessonActivity } from '../types/LessonTypes';

interface UseLessonContentGenerationProps {
  subject: string;
  skillArea: string;
}

export const useLessonContentGeneration = (subject: string, skillArea: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateIntroductionActivity = useCallback((): LessonActivity => {
    const introContent = `Welcome to the ${subject} lesson! Today, we'll be exploring ${skillArea}. Get ready for an exciting learning experience!`;

    return {
      id: `intro_${Date.now()}`,
      title: `Welcome to ${subject}!`,
      type: 'introduction',
      phase: 'introduction',
      duration: 180,
      phaseDescription: `Introduction to ${subject} lesson`,
      metadata: {
        subject,
        skillArea
      },
      content: {
        text: introContent
      }
    };
  }, [subject, skillArea]);

  const generateContentDeliveryActivity = useCallback((): LessonActivity => {
    const content = `In this section, we'll cover the basics of ${skillArea}. Make sure to take notes and ask questions if anything is unclear.`;

    return {
      id: `content_${Date.now()}`,
      title: `Learning ${skillArea}`,
      type: 'content-delivery',
      phase: 'content-delivery',
      duration: 300,
      phaseDescription: `Content delivery for ${skillArea}`,
      metadata: {
        subject,
        skillArea
      },
      content: {
        text: content
      }
    };
  }, [skillArea, subject]);

  const generateInteractiveGameActivity = useCallback((): LessonActivity => {
    const question = `What is a key concept in ${skillArea}?`;
    const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
    const correctAnswer = 0;
    const explanation = 'The correct answer is Option 1 because...';

    return {
      id: `game_${Date.now()}`,
      title: `Interactive ${skillArea} Game`,
      type: 'interactive-game',
      phase: 'interactive-game',
      duration: 240,
      phaseDescription: `Interactive game for ${skillArea}`,
      metadata: {
        subject,
        skillArea
      },
      content: {
        question,
        options,
        correctAnswer,
        explanation
      }
    };
  }, [skillArea, subject]);

  const generateApplicationActivity = useCallback((): LessonActivity => {
    const scenario = `Imagine you are using ${skillArea} in a real-world situation...`;
    const task = 'Describe how you would apply what you learned.';

    return {
      id: `application_${Date.now()}`,
      title: `Applying ${skillArea}`,
      type: 'application',
      phase: 'application',
      duration: 300,
      phaseDescription: `Application of ${skillArea} concepts`,
      metadata: {
        subject,
        skillArea
      },
      content: {
        scenario,
        task
      }
    };
  }, [skillArea, subject]);

  const generateCreativeExplorationActivity = useCallback((): LessonActivity => {
    const creativePrompt = `Create a project that demonstrates your understanding of ${skillArea}.`;

    return {
      id: `creative_${Date.now()}`,
      title: `Creative Exploration of ${skillArea}`,
      type: 'creative-exploration',
      phase: 'creative-exploration',
      duration: 360,
      phaseDescription: `Creative exploration activity for ${skillArea}`,
      metadata: {
        subject,
        skillArea
      },
      content: {
        creativePrompt
      }
    };
  }, [skillArea, subject]);

  const generateSummaryActivity = useCallback((): LessonActivity => {
    const keyTakeaways = [
      `Key takeaway 1 from ${skillArea}`,
      `Key takeaway 2 from ${skillArea}`,
      `Key takeaway 3 from ${skillArea}`
    ];

    return {
      id: `summary_${Date.now()}`,
      title: `Summary of ${subject} - ${skillArea}`,
      type: 'summary',
      phase: 'summary',
      duration: 180,
      phaseDescription: `Summary of key concepts in ${skillArea}`,
      metadata: {
        subject,
        skillArea
      },
      content: {
        keyTakeaways
      }
    };
  }, [subject, skillArea]);

  return {
    isLoading,
    error,
    generateIntroductionActivity,
    generateContentDeliveryActivity,
    generateInteractiveGameActivity,
    generateApplicationActivity,
    generateCreativeExplorationActivity,
    generateSummaryActivity
  };
};

