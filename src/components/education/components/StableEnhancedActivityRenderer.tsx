
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
  console.log('🎯 StableEnhancedActivityRenderer rendering:', {
    activityId: activity.id,
    activityType: activity.type,
    activityPhase: activity.phase,
    isNelieReady
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
    return (
      <StableActivityInteractiveQuiz
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  // Handle introduction activities
  if (activity.type === 'introduction' || activity.phase === 'introduction') {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center text-white">
        <h3 className="text-2xl font-semibold mb-4">{activity.title}</h3>
        <div className="text-gray-300 mb-6 text-lg leading-relaxed">
          {activity.content?.text || activity.phaseDescription || "Welcome to your learning adventure!"}
        </div>
        <button
          onClick={() => onActivityComplete(true)}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded text-white font-bold text-lg"
        >
          Let's Begin!
        </button>
      </div>
    );
  }

  // Handle application activities
  if (activity.type === 'application' || activity.phase === 'application') {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-white">
        <h3 className="text-2xl font-semibold mb-4">{activity.title}</h3>
        <div className="text-gray-300 mb-6 text-lg leading-relaxed">
          {activity.content?.scenario && (
            <div className="mb-4">
              <h4 className="text-xl font-semibold text-lime-400 mb-2">Scenario:</h4>
              <p>{activity.content.scenario}</p>
            </div>
          )}
          {activity.content?.task && (
            <div className="mb-4">
              <h4 className="text-xl font-semibold text-blue-400 mb-2">Your Task:</h4>
              <p>{activity.content.task}</p>
            </div>
          )}
          {activity.content?.hint && (
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-yellow-400 mb-2">Hint:</h4>
              <p className="text-sm text-gray-400">{activity.content.hint}</p>
            </div>
          )}
          {activity.content?.text && !activity.content?.scenario && (
            <p>{activity.content.text}</p>
          )}
        </div>
        <button
          onClick={() => onActivityComplete(true)}
          className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded text-white font-bold text-lg"
        >
          Continue
        </button>
      </div>
    );
  }

  // Handle creative exploration activities
  if (activity.type === 'creative-exploration' || activity.phase === 'creative-exploration') {
    return (
      <div className="bg-gradient-to-br from-purple-800 to-indigo-800 rounded-lg p-8 text-white">
        <h3 className="text-2xl font-semibold mb-4">{activity.title}</h3>
        <div className="space-y-4 mb-6">
          {activity.content?.creativePrompt && (
            <div className="mb-4">
              <h4 className="text-xl font-semibold text-purple-300 mb-2">Creative Challenge:</h4>
              <p className="text-gray-200">{activity.content.creativePrompt}</p>
            </div>
          )}
          {activity.content?.whatIfScenario && (
            <div className="mb-4">
              <h4 className="text-xl font-semibold text-pink-300 mb-2">What If...?</h4>
              <p className="text-gray-200">{activity.content.whatIfScenario}</p>
            </div>
          )}
          {activity.content?.explorationTask && (
            <div className="mb-4">
              <h4 className="text-xl font-semibold text-yellow-300 mb-2">Exploration:</h4>
              <p className="text-gray-200">{activity.content.explorationTask}</p>
            </div>
          )}
          {activity.content?.text && !activity.content?.creativePrompt && (
            <p className="text-gray-200">{activity.content.text}</p>
          )}
        </div>
        <button
          onClick={() => onActivityComplete(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded text-white font-bold text-lg"
        >
          I'm Ready to Continue!
        </button>
      </div>
    );
  }

  // Handle summary activities
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
        <button
          onClick={() => onActivityComplete(true)}
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-8 py-4 rounded text-white font-bold text-lg"
        >
          Awesome, Let's Continue!
        </button>
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
