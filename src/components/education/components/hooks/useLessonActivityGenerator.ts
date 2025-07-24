
import { LessonActivity } from '../types/LessonTypes';
import { useSubjectQuestionGenerator } from './useSubjectQuestionGenerator';

interface UseLessonActivityGeneratorProps {
  subject: string;
  skillArea: string;
  sessionId: string;
}

export const useLessonActivityGenerator = ({ subject, skillArea, sessionId }: UseLessonActivityGeneratorProps) => {
  const { getSubjectQuestions, getSubjectScenario, getSubjectApplicationScenario } = useSubjectQuestionGenerator();

  const generateUnifiedLessonActivities = (): LessonActivity[] => {
    const activities: LessonActivity[] = [];
    const lessonId = `unified-${subject}-${sessionId.substring(0,8)}-${Date.now()}`; // Include sessionId in lessonId
    const subjectTitle = subject.charAt(0).toUpperCase() + subject.slice(1);

    console.log(`🎯 Generating activities for ${subject} (session: ${sessionId}) with skill area: ${skillArea}`);

    // 1. Welcome Introduction
    activities.push({
      id: `${lessonId}_welcome`,
      title: `Welcome to ${subjectTitle} with Nelie!`,
      type: 'introduction',
      phase: 'introduction', 
      duration: 180,
      phaseDescription: `Welcome to your ${subjectTitle} learning adventure`,
      metadata: { subject, skillArea: 'welcome' },
      content: {
        text: `Hello! I'm Nelie, and I'm so excited to learn ${subjectTitle} with you today! We'll explore amazing concepts, solve fun problems, play educational games, and discover how ${subjectTitle} connects to the real world. Are you ready for this adventure?`
      }
    });

    // 2-4. Interactive Questions (subject-specific) - PROPERLY MAPPED
    const questionTopics = getSubjectQuestions(subject, sessionId); // Pass sessionId
    console.log(`📚 Got ${questionTopics.length} ${subject} questions for session ${sessionId}:`, questionTopics.map(q => q.title));
    
    questionTopics.forEach((topic, index) => {
      // Create properly structured activity from question topic
      const questionActivity: LessonActivity = {
        id: `${lessonId}_question_${index + 1}`,
        title: topic.title,
        type: 'interactive-game',
        phase: 'interactive-game',
        duration: 240,
        phaseDescription: topic.description,
        metadata: { subject, skillArea: topic.skillArea },
        content: {
          // Essential question data
          question: topic.question,
          options: topic.options,
          choices: topic.options, // Alternative property name used by some renderers
          correctAnswer: topic.correctAnswer,
          explanation: topic.explanation,
          
          // Additional context
          text: topic.question,
          title: topic.title,
          
          // Battle/Arena context for engaging presentation
          battleScenario: `🎯 ${topic.title} Challenge: Test your ${topic.skillArea} knowledge!`,
          
          // Make sure we have all required properties
          activityId: `${lessonId}_question_${index + 1}`,
          
        }
      };
      
      console.log(`✅ Created ${subject} question activity:`, {
        title: questionActivity.title,
        hasQuestion: !!questionActivity.content.question,
        hasOptions: !!questionActivity.content.options,
        optionsCount: questionActivity.content.options?.length || 0,
        correctAnswer: questionActivity.content.correctAnswer
      });
      
      activities.push(questionActivity);
    });

    // 5. Educational Game/Assignment
    activities.push({
      id: `${lessonId}_game`,
      title: `${subjectTitle} Challenge Game`,
      type: 'creative-exploration',
      phase: 'creative-exploration',
      duration: 300,
      phaseDescription: `Interactive ${subjectTitle} challenge`,
      metadata: { subject, skillArea: 'game' },
      content: {
        creativePrompt: `Let's play a fun ${subjectTitle} game! I'll give you different scenarios where you can use your ${subjectTitle} skills creatively.`,
        whatIfScenario: getSubjectScenario(subject, sessionId), // Pass sessionId
        explorationTask: `Think about how ${subjectTitle} helps us solve real-world problems!`
      }
    });

    // 6. Application Assignment
    activities.push({
      id: `${lessonId}_assignment`,
      title: `Real-World ${subjectTitle}`,
      type: 'application',
      phase: 'application',
      duration: 240,
      phaseDescription: `Apply ${subjectTitle} to real situations`,
      metadata: { subject, skillArea: 'application' },
      content: {
        scenario: getSubjectApplicationScenario(subject, sessionId), // Pass sessionId
        task: `Use your ${subjectTitle} knowledge to solve this real-world challenge!`,
        guidance: `Take your time and think through each step. Remember what we've learned today!`
      }
    });

    // 7. Celebration Summary
    activities.push({
      id: `${lessonId}_celebration`,
      title: `Amazing Work in ${subjectTitle}!`,
      type: 'summary',
      phase: 'summary',
      duration: 180,
      phaseDescription: 'Celebrate your learning achievements',
      metadata: { subject, skillArea: 'celebration' },
      content: {
        keyTakeaways: [
          `You explored fascinating ${subjectTitle} concepts today!`,
          `You solved challenging problems with confidence!`,
          `You discovered how ${subjectTitle} connects to everyday life!`,
          `You're becoming an amazing ${subjectTitle} learner!`
        ],
        nextTopicSuggestion: `Next time, we'll dive even deeper into ${subjectTitle} and discover more exciting concepts!`
      }
    });

    console.log(`✅ Generated ${activities.length} activities for ${subject}:`, activities.map(a => ({ title: a.title, type: a.type, hasQuestion: !!a.content.question })));
    return activities;
  };

  return {
    generateUnifiedLessonActivities
  };
};
