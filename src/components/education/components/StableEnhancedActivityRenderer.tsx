
import { LessonActivity } from './types/LessonTypes';
import StableActivityInteractiveQuiz from './activities/StableActivityInteractiveQuiz';
import ActivityContentDelivery from './activities/ActivityContentDelivery';

interface StableEnhancedActivityRendererProps {
  activity: LessonActivity;
  onActivityComplete: (wasCorrect?: boolean) => void;
  isNelieReady?: boolean;
}

const StableEnhancedActivityRenderer = ({
  activity,
  onActivityComplete,
  isNelieReady = true
}: StableEnhancedActivityRendererProps) => {
  // Fallback if activity or activity.content is null (should ideally not happen if useUnifiedLessonTemplate guards it)
  if (!activity || !activity.content) {
     console.error("Error: Activity or activity content is null in StableEnhancedActivityRenderer:", activity);
     return <div className="text-red-500 p-4">Error: Unable to render activity due to missing data.</div>;
  }

  console.log('🎯 StableEnhancedActivityRenderer rendering:', {
    activityId: activity.id,
    activityType: activity.type,
    activityPhase: activity.phase,
    isNelieReady,
    hasQuestion: !!activity.content?.question,
    hasOptions: !!activity.content?.options
  });

  // Handle content-delivery activities
  if (activity.type === 'content-delivery' || activity.phase === 'content-delivery') {
    console.log('📚 Rendering content-delivery activity');
    return (
      <ActivityContentDelivery
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  // Handle interactive quiz activities
  if (activity.type === 'interactive-game' || activity.phase === 'interactive-game') {
    if (!activity.content || !activity.content.question || !activity.content.options) {
      console.error("Error: Missing essential content for interactive quiz activity:", activity);
      return <div className="text-red-500 p-4">Error: Activity content is missing for this quiz.</div>;
    }
    return (
      <StableActivityInteractiveQuiz
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  // Handle introduction activities with consistent button styling
  if (activity.type === 'introduction' || activity.phase === 'introduction') {
    const mainTitle = activity.title || 'Introduction';
    const mainText = activity.content?.text || activity.phaseDescription || "Welcome!";
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center text-white">
        <h3 className="text-2xl font-semibold mb-4">{mainTitle}</h3>
        <div className="text-gray-300 mb-6 text-lg leading-relaxed">
          {mainText}
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => onActivityComplete(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-lg text-white font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-105 min-w-[200px]"
          >
            Let's Begin!
          </button>
        </div>
      </div>
    );
  }

  // Handle application activities with consistent button styling
  if (activity.type === 'application' || activity.phase === 'application') {
    const scenarioText = activity.content?.scenario;
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-white">
        <h3 className="text-2xl font-semibold mb-4">{activity.title}</h3>
        <div className="text-gray-300 mb-6 text-lg leading-relaxed">
          {scenarioText && (
            <div className="mb-4">
              <h4 className="text-xl font-semibold text-lime-400 mb-2">Scenario:</h4>
              <p>{scenarioText}</p>
            </div>
          )}
          {activity.content?.task && (
            <div className="mb-4">
              <h4 className="text-xl font-semibold text-blue-400 mb-2">Your Task:</h4>
              <p>{activity.content.task}</p>
            </div>
          )}
          {activity.content?.text && !scenarioText && ( // Show generic text if no specific scenario
            <p>{activity.content.text}</p>
          )}
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => onActivityComplete(true)}
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-8 py-4 rounded-lg text-white font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-105 min-w-[200px]"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Handle creative exploration activities with consistent button styling
  if (activity.type === 'creative-exploration' || activity.phase === 'creative-exploration') {
    const baseCreativePrompt = activity.content?.creativePrompt || "Think creatively!";
    const whatIfScenarioText = activity.content?.whatIfScenario;

    return (
      <div className="bg-gradient-to-br from-purple-800 to-indigo-800 rounded-lg p-8 text-white">
        <h3 className="text-2xl font-semibold mb-4">{activity.title}</h3>
        <div className="space-y-4 mb-6">
          {activity.content?.creativePrompt && (
            <div className="mb-4">
              <h4 className="text-xl font-semibold text-purple-300 mb-2">Creative Challenge:</h4>
              <p className="text-gray-200">{baseCreativePrompt}</p>
            </div>
          )}
          {whatIfScenarioText && (
            <div className="mb-4">
              <h4 className="text-xl font-semibold text-pink-300 mb-2">What If...?</h4>
              <p className="text-gray-200">{whatIfScenarioText}</p>
            </div>
          )}
          {activity.content?.explorationTask && (
            <div className="mb-4">
              <h4 className="text-xl font-semibold text-yellow-300 mb-2">Exploration:</h4>
              <p className="text-gray-200">{activity.content.explorationTask}</p>
            </div>
          )}
          {activity.content?.text && !activity.content?.creativePrompt && !whatIfScenarioText && (
            <p className="text-gray-200">{activity.content.text}</p>
          )}
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => onActivityComplete(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-lg text-white font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-105 min-w-[200px]"
          >
            I'm Ready to Continue!
          </button>
        </div>
      </div>
    );
  }

  // Handle summary activities with consistent button styling
  if (activity.type === 'summary' || activity.phase === 'summary') {
    return (
      <div className="bg-gradient-to-br from-green-800 to-teal-800 rounded-lg p-8 text-white">
        <h3 className="text-2xl font-semibold mb-4">{activity.title}</h3>
        <div className="mb-6">
          {activity.content?.keyTakeaways && (
            <div className="mb-4">
              <h4 className="text-xl font-semibold text-green-300 mb-3">Key Takeaways:</h4>
              <ul className="space-y-2">
                {activity.content.keyTakeaways.map((takeaway: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-400 mr-2 text-lg">✓</span>
                    <span className="text-gray-200">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activity.content?.nextTopicSuggestion && (
            <div className="mb-4">
              <h4 className="text-xl font-semibold text-teal-300 mb-2">Coming Up Next:</h4>
              <p className="text-gray-200">{activity.content.nextTopicSuggestion}</p>
            </div>
          )}
          {activity.content?.text && !activity.content?.keyTakeaways && (
            <p className="text-gray-200">{activity.content.text}</p>
          )}
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => onActivityComplete(true)}
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-8 py-4 rounded-lg text-white font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-105 min-w-[200px]"
          >
            Awesome, Let's Continue!
          </button>
        </div>
      </div>
    );
  }

  // Fallback - convert any unsupported type to interactive quiz
  console.log('⚠️ Converting unsupported activity type to interactive quiz:', activity.type);
  return (
    <StableActivityInteractiveQuiz
      activity={activity}
      onActivityComplete={onActivityComplete}
    />
  );
};

export default StableEnhancedActivityRenderer;
