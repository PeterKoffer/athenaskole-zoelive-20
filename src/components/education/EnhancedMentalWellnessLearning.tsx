import React, { useState, useEffect } from 'react';
// Ensure EnhancedLessonConfig is imported from its definition file
import { EnhancedLessonConfig } from './components/utils/EnhancedLessonGenerator';
import { LessonActivity } from './components/types/LessonTypes';
import { NELIEHelpers } from './components/utils/NELIESessionGenerator';
import { Button } from '@/components/ui/button'; // Assuming Button component exists

// Placeholder: This would ideally come from props or a global state/context
// For now, we generate a default lesson for testing.
const fetchLessonForStudent = async (): Promise<EnhancedLessonConfig> => {
  console.log("Attempting to generate Mental Wellness lesson via NELIEHelpers...");
  // Example: Generate a lesson for grade 5, mixed learning style
  // NELIEHelpers.generateMentalWellnessLesson returns an object: { lesson: EnhancedLessonConfig, validation: any, activities: LessonActivity[] }
  const lessonData = NELIEHelpers.generateMentalWellnessLesson(5, 'mixed', `session_mental_wellness_${Date.now()}`);
  if (!lessonData || !lessonData.lesson) {
    throw new Error("Failed to generate lesson or lesson data is not in expected format.");
  }
  console.log("Lesson generated:", lessonData.lesson);
  return lessonData.lesson as EnhancedLessonConfig; // The actual lesson object is within lessonData.lesson
};

interface EnhancedMentalWellnessLearningProps {
  // lesson?: EnhancedLessonConfig; // Future: pass lesson as prop
}

const EnhancedMentalWellnessLearning: React.FC<EnhancedMentalWellnessLearningProps> = (/*{ lesson: initialLesson }*/) => {
  const [lesson, setLesson] = useState<EnhancedLessonConfig | null>(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // if (initialLesson) {
    //   setLesson(initialLesson);
    //   setIsLoading(false);
    // } else {
      fetchLessonForStudent().then(data => {
        setLesson(data);
        setIsLoading(false);
      }).catch(err => {
        console.error("Error fetching/generating lesson:", err);
        setError(err.message || "Failed to load lesson.");
        setIsLoading(false);
      });
    // }
  }, [/*initialLesson*/]);

  if (isLoading) {
    return <div className="text-white text-center p-10">Loading lesson content... <div className="text-2xl mt-4">🧠</div></div>;
  }

  if (error) {
    return <div className="text-red-400 text-center p-10">Error: {error} <p>Please try refreshing the page.</p></div>;
  }

  if (!lesson || !lesson.phases || lesson.phases.length === 0) {
    return <div className="text-white text-center p-10">No lesson content available.</div>;
  }

  const currentPhase = lesson.phases[currentPhaseIndex];
  if (!currentPhase) {
    return <div className="text-white text-center p-10">Invalid lesson phase.</div>;
  }

   // TODO: Integrate with Question Generation System:
   // When implementing interactive questions for a phase, use the useUnifiedQuestionGeneration hook.
   // Example usage for a question related to 'Understanding Emotions' skill area:
   //
   // import { useUnifiedQuestionGeneration } from '@/hooks/useUnifiedQuestionGeneration'; // Ensure this import is added when implemented
   //
   // const {
   //   generateUniqueQuestion,
   //   currentQuestion,
   //   loading: questionLoading,
   //   error: questionError,
   // } = useUnifiedQuestionGeneration({
   //   subject: 'mentalHealth', // or the specific subject ID for Mental Wellness
   //   skillArea: 'understandingEmotions', // or another relevant skillArea like 'copingStrategies'
   //   difficultyLevel: 3, // Adjust as needed based on grade/context
   //   userId: user?.id || 'anonymous', // Pass the actual user ID (requires user object from useAuth or similar)
   //   gradeLevel: lesson?.gradeLevel || 5, // Pass the actual grade level
   // });
   //
   // // Then, call generateUniqueQuestion() when needed, and display currentQuestion.
   // // Handle questionLoading and questionError states.
   // // Ensure question content is displayed appropriately and user interaction is handled.

  const renderPhaseContent = (content: LessonActivity['content']) => {
    if (!content || Object.keys(content).length === 0) return <p className="text-gray-400">No content for this phase.</p>;

    // TODO: Replace placeholder rendering with rich content display components.
    // This current rendering is very basic and for placeholder display.
    return (
      <div className="space-y-4 mt-4">
        {Object.entries(content).map(([key, value]) => {
          // We only want to display string properties that are not empty
          if (typeof value === 'string' && value.trim() !== '') {
            // Attempt to make key more readable
            const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            return (
              <div key={key} className="p-4 bg-gray-700/70 border border-gray-600 rounded-lg shadow">
                <h4 className="font-semibold text-lg text-lime-300 capitalize mb-1">{displayKey}:</h4>
                {/* Using <pre> to respect newlines and whitespace in the placeholder content */}
                <pre className="whitespace-pre-wrap text-gray-200 font-sans text-base">{value}</pre>
              </div>
            );
          }
          // Later, add rendering for non-string types like 'options' for questions, 'segments', etc.
          return null;
        })}
      </div>
    );
  };

  // TODO: Implement actual interactive elements and question handling.
  // TODO: Add components for different content types (video, interactive quiz, etc.)

  return (
    <div className="w-full max-w-5xl p-6 md:p-8 bg-gray-800 text-white rounded-2xl shadow-2xl border border-gray-700">
      <header className="mb-6 pb-4 border-b border-gray-700">
        <h2 className="text-3xl md:text-4xl font-bold text-lime-400">{lesson.title || "Mental Wellness Lesson"}</h2>
        {lesson.overview && <p className="text-gray-300 mt-2 whitespace-pre-wrap">{lesson.overview}</p>}
        <p className="text-sm text-gray-400 mt-2">
          Grade: {lesson.gradeLevel} | Learning Style: {lesson.learningStyle || 'mixed'} | Current Phase: {currentPhaseIndex + 1} / {lesson.phases.length}
        </p>
      </header>

      <div className="mb-6 p-4 md:p-6 bg-gray-900/50 border border-lime-500/30 rounded-lg min-h-[300px]">
        <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-lime-300">{currentPhase.title}</h3>
        <p className="text-sm text-gray-400 mb-4">({currentPhase.phaseDescription || "Engaging with the current topic."})</p>
        {renderPhaseContent(currentPhase.content)}
      </div>

      <footer className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-4 border-t border-gray-700">
        <Button
          onClick={() => setCurrentPhaseIndex(prev => Math.max(0, prev - 1))}
          disabled={currentPhaseIndex === 0}
          variant="outline" // Assuming a variant prop for styling
          className="mb-2 sm:mb-0"
        >
          Previous Phase
        </Button>
        <div className="text-sm text-gray-400">
          Phase {currentPhaseIndex + 1} of {lesson.phases.length}
        </div>
        <Button
          onClick={() => setCurrentPhaseIndex(prev => Math.min(lesson.phases.length - 1, prev + 1))}
          disabled={currentPhaseIndex === lesson.phases.length - 1}
          variant="default" // Assuming a variant prop for styling
        >
          Next Phase
        </Button>
      </footer>
    </div>
  );
};

export default EnhancedMentalWellnessLearning;
