// TODO (Life Essentials): Content Review and Expansion:
// All placeholder content in the corresponding lesson factory (e.g., EnhancedLifeEssentialsLessonFactory.ts)
// MUST be replaced with accurate, engaging, age-appropriate, and expert-reviewed content
// for Life Essentials: Navigating Adulthood.

// src/components/education/EnhancedLifeEssentialsLearning.tsx
import React, { useState, useEffect } from 'react';
import { EnhancedLessonConfig } from './components/utils/EnhancedLessonGenerator';
import { LessonActivity } from './components/types/LessonTypes';
import { NELIEHelpers } from './components/utils/NELIESessionGenerator';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const fetchLessonForStudent = async (): Promise<EnhancedLessonConfig> => {
  // Call appropriate NELIEHelper for Life Essentials
  // Targeting higher grade like 10 for these topics
  const lessonContainer = NELIEHelpers.generateLifeEssentialsLesson(10, 'mixed', `session_le_${Date.now()}`);
  if (!lessonContainer || !lessonContainer.lesson) {
    throw new Error("Failed to generate lesson or lesson data is not in expected format.");
  }
  return lessonContainer.lesson as EnhancedLessonConfig;
};

const EnhancedLifeEssentialsLearning: React.FC = () => {
  const [lesson, setLesson] = useState<EnhancedLessonConfig | null>(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLessonForStudent().then(data => {
      setLesson(data);
      setIsLoading(false);
    }).catch(err => {
      console.error("Error fetching Life Essentials lesson:", err);
      setError("Failed to load lesson. Please try again later.");
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <div className="flex justify-center items-center h-screen bg-gray-900/50"><div className="text-center p-10 bg-gray-800 rounded-lg shadow-xl"><LoadingSpinner /><p className="mt-4 text-white">Loading Life Essentials Lesson...</p></div></div>;
  if (error) return <div className="text-red-400 text-center p-10 bg-gray-800 rounded-lg shadow-xl">{error}</div>;
  if (!lesson || !lesson.phases || lesson.phases.length === 0) return <div className="text-center p-10 text-white bg-gray-800 rounded-lg shadow-xl">No lesson data available for Life Essentials.</div>;

  const currentPhase = lesson.phases[currentPhaseIndex];
  if (!currentPhase) return <div className="text-center p-10 text-white bg-gray-800 rounded-lg shadow-xl">Invalid lesson phase.</div>;

  // TODO (Life Essentials): Integrate with Question Generation System:
  // When implementing interactive questions for this subject, use the useUnifiedQuestionGeneration hook.
  // Example for Life Essentials (e.g., a skill area like 'personalFinance'):
  // const { generateUniqueQuestion, currentQuestion } = useUnifiedQuestionGeneration({
  //   subject: 'lifeEssentials',
  //   skillArea: 'personalFinance',
  //   difficultyLevel: 4, // Adjust as needed, likely higher grades
  //   userId: user?.id || 'anonymous', // Ensure user object
  //   gradeLevel: lesson?.gradeLevel || 10, // Adjust as needed
  // });
  // Remember to handle question display, user interaction, and feedback.

  // TODO (Life Essentials): Design and Implement Subject-Specific Interactive Activities:
  // - For Life Essentials: Budgeting simulators, loan calculators, mock job application forms.
  // These should align with the 6-phase lesson structure's 'Interactive Learning Game/Activity' phase.

  const renderPhaseContent = (content?: LessonActivity['content']) => {
    if (!content || Object.keys(content).length === 0) return <p className="text-gray-400">No content for this phase.</p>;
    // TODO: Replace placeholder rendering with rich content display components.
    return (
      <div className="space-y-4 mt-4 text-left">
        {Object.entries(content).map(([key, value]) => {
          if (typeof value === 'string' && value.trim() !== '' && !key.startsWith('_') && key !== 'gameType' && key !== 'activityInstructions') {
            const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            return (
              <div key={key} className="p-4 bg-gray-700/70 border border-gray-600 rounded-lg shadow">
                <h4 className="font-semibold text-lg text-lime-300 capitalize mb-1">{displayKey}:</h4>
                <pre className="whitespace-pre-wrap text-gray-200 font-sans text-base">{value}</pre>
              </div>
            );
          }
          if (key === 'activityInstructions' && typeof value === 'string' && value.trim() !== '') {
             return (
              <div key={key} className="p-4 bg-purple-700/30 border border-purple-500 rounded-lg shadow">
                <h4 className="font-semibold text-lg text-purple-300 mb-1">Activity Instructions:</h4>
                <pre className="whitespace-pre-wrap text-gray-200 font-sans text-base">{value}</pre>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };
  // TODO: Implement actual interactive elements and question handling.

  return (
    <div className="w-full max-w-5xl p-6 md:p-8 bg-gray-800 text-white rounded-2xl shadow-2xl border border-gray-700">
      <header className="mb-6 pb-4 border-b border-gray-700">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-400">{lesson.title || "Life Essentials Lesson"}</h2>
        {lesson.overview && <p className="text-gray-300 mt-2 whitespace-pre-wrap text-sm">{lesson.overview}</p>}
        <p className="text-xs text-gray-400 mt-2">
          Grade: {lesson.gradeLevel} | Learning Style: {lesson.learningStyle || 'mixed'} | Current Phase: {currentPhaseIndex + 1} / {lesson.phases.length}
        </p>
      </header>

      <div className="mb-6 p-4 md:p-6 bg-gray-900/50 border border-slate-500/30 rounded-lg min-h-[300px]">
        <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-slate-300">{currentPhase.title}</h3>
        <p className="text-sm text-gray-400 mb-4">({currentPhase.phaseDescription || "Preparing for the future."})</p>
        {renderPhaseContent(currentPhase.content)}
      </div>

      <footer className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-4 border-t border-gray-700">
        <Button onClick={() => setCurrentPhaseIndex(prev => Math.max(0, prev - 1))} disabled={currentPhaseIndex === 0} variant="outline">
          Previous Phase
        </Button>
        <div className="text-sm text-gray-400 my-2 sm:my-0">
          Phase {currentPhaseIndex + 1} of {lesson.phases.length}
        </div>
        <Button onClick={() => setCurrentPhaseIndex(prev => Math.min(lesson.phases.length - 1, prev + 1))} disabled={currentPhaseIndex >= lesson.phases.length - 1}>
          Next Phase
        </Button>
      </footer>
    </div>
  );
};
export default EnhancedLifeEssentialsLearning;
