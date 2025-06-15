
import { Button } from '@/components/ui/button';
import AskNelieButtons from '../shared/AskNelieButtons';
import { LessonActivity } from '../types/LessonTypes';
import Blackboard from '../shared/Blackboard';

interface MathLessonContentRendererProps {
  activity: LessonActivity;
  studentName: string;
  onComplete: () => void;
}

const MathLessonContentRenderer = ({
  activity,
  studentName,
  onComplete
}: MathLessonContentRendererProps) => {
  return (
    <Blackboard>
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-white">{activity.title}</h2>
        <AskNelieButtons 
          content={activity.content?.text || activity.title || ''}
          context="lesson-content"
        />
      </div>
      
      <div className="text-gray-300 space-y-4">
        {activity.content?.text && (
          <p className="text-lg leading-relaxed">{activity.content.text}</p>
        )}
        
        {activity.content?.examples && (
          <div className="bg-blue-900/30 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-blue-200">Examples for {studentName}:</h4>
              <AskNelieButtons 
                content={`Here are some examples: ${activity.content.examples.join('. ')}`}
                context="examples"
              />
            </div>
            <ul className="space-y-2">
              {activity.content.examples.map((example: string, index: number) => (
                <li key={index} className="text-blue-100">• {example}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-center">
        <Button
          onClick={onComplete}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8"
        >
          Continue, {studentName}
        </Button>
      </div>
    </Blackboard>
  );
};

export default MathLessonContentRenderer;
