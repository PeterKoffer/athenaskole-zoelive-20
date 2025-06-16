import { useEffect } from 'react';
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
  useEffect(() => {
    const contentText = activity.content?.text || '';
    const wordCount = contentText.split(/\s+/).filter(Boolean).length;
    
    // 3 seconds base time + 300ms per word (rough equivalent of 200 WPM)
    const delay = 3000 + wordCount * 300;

    const timer = setTimeout(() => {
      onComplete();
    }, delay);

    return () => clearTimeout(timer);
  }, [activity, onComplete]);

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
    </Blackboard>
  );
};

export default MathLessonContentRenderer;
