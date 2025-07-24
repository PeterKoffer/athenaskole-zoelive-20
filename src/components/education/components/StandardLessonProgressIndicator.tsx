import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, Play } from 'lucide-react';
import { StandardLessonPhase } from './LessonStateManager';
import { DEFAULT_DAILY_UNIVERSE_SECONDS } from '@/constants/lesson';

interface StandardLessonProgressIndicatorProps {
  currentPhase: StandardLessonPhase;
  timeElapsed: number; // in seconds
  totalDuration?: number; // in seconds
  phaseProgress?: number; // percentage of current phase completed
}

const PHASE_INFO = {
  introduction: {
    title: "Introduction",
    description: "Hook & Real-World Connection",
    targetDuration: 150, // 2.5 minutes
    color: "bg-blue-500",
    order: 1
  },
  'content-delivery': {
    title: "Content Learning",
    description: "Core Concepts & Knowledge",
    targetDuration: 360, // 6 minutes  
    color: "bg-green-500",
    order: 2
  },
  'interactive-game': {
    title: "Interactive Game",
    description: "Fun Learning Activity",
    targetDuration: 270, // 4.5 minutes
    color: "bg-orange-500", 
    order: 3
  },
  application: {
    title: "Real-World Application",
    description: "Apply What You Learned",
    targetDuration: 210, // 3.5 minutes
    color: "bg-purple-500",
    order: 4
  },
  'creative-exploration': {
    title: "Creative Exploration",
    description: "Think Deeper & Explore",
    targetDuration: 150, // 2.5 minutes
    color: "bg-pink-500",
    order: 5
  },
  summary: {
    title: "Summary & Next Steps",
    description: "Review & Plan Ahead",
    targetDuration: 90, // 1.5 minutes
    color: "bg-indigo-500",
    order: 6
  }
} as const;

const StandardLessonProgressIndicator = ({
  currentPhase,
  timeElapsed,
  totalDuration = DEFAULT_DAILY_UNIVERSE_SECONDS,
  phaseProgress = 0
}: StandardLessonProgressIndicatorProps) => {
  const overallProgress = (timeElapsed / totalDuration) * 100;
  const phases = Object.entries(PHASE_INFO).sort(([, a], [, b]) => a.order - b.order);
  
  const getCurrentPhaseIndex = () => {
    return phases.findIndex(([phase]) => phase === currentPhase);
  };
  
  const currentPhaseIndex = getCurrentPhaseIndex();
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      {/* Overall Progress Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-400" />
          <span className="text-white font-medium">
            20-Minute Learning Journey
          </span>
        </div>
        <div className="text-sm text-gray-300">
          {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')} / 20:00
        </div>
      </div>
      
      {/* Overall Progress Bar */}
      <div className="mb-6">
        <Progress 
          value={Math.min(overallProgress, 100)} 
          className="h-2 bg-gray-700"
        />
        <div className="text-xs text-gray-400 mt-1 text-center">
          {Math.round(overallProgress)}% Complete
        </div>
      </div>
      
      {/* Phase Indicators */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
        {phases.map(([phaseKey, phaseInfo], index) => {
          const isCompleted = index < currentPhaseIndex;
          const isCurrent = phaseKey === currentPhase;
          // const isUpcoming = index > currentPhaseIndex;
          
          return (
            <div
              key={phaseKey}
              className={`
                relative p-3 rounded-lg border transition-all duration-200
                ${isCurrent 
                  ? 'border-white bg-gray-700 shadow-lg scale-105' 
                  : isCompleted 
                  ? 'border-green-400 bg-gray-800' 
                  : 'border-gray-600 bg-gray-800 opacity-75'
                }
              `}
            >
              {/* Phase Number & Status Icon */}
              <div className="flex items-center justify-between mb-2">
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                  ${isCurrent 
                    ? phaseInfo.color + ' text-white' 
                    : isCompleted 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-600 text-gray-300'
                  }
                `}>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : isCurrent ? (
                    <Play className="w-3 h-3" />
                  ) : (
                    phaseInfo.order
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {Math.floor(phaseInfo.targetDuration / 60)}:{(phaseInfo.targetDuration % 60).toString().padStart(2, '0')}
                </div>
              </div>
              
              {/* Phase Title */}
              <div className={`
                text-sm font-medium mb-1
                ${isCurrent ? 'text-white' : isCompleted ? 'text-green-300' : 'text-gray-400'}
              `}>
                {phaseInfo.title}
              </div>
              
              {/* Phase Description */}
              <div className="text-xs text-gray-400 leading-tight">
                {phaseInfo.description}
              </div>
              
              {/* Current Phase Progress */}
              {isCurrent && phaseProgress > 0 && (
                <div className="mt-2">
                  <Progress 
                    value={phaseProgress} 
                    className="h-1 bg-gray-600"
                  />
                  <div className="text-xs text-gray-400 mt-1 text-center">
                    {Math.round(phaseProgress)}%
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Current Phase Details */}
      {currentPhase && PHASE_INFO[currentPhase] && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg border border-gray-600">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${PHASE_INFO[currentPhase].color}`} />
            <span className="text-white font-medium">
              Currently: {PHASE_INFO[currentPhase].title}
            </span>
          </div>
          <p className="text-sm text-gray-300">
            {PHASE_INFO[currentPhase].description}
          </p>
        </div>
      )}
    </div>
  );
};

export default StandardLessonProgressIndicator;