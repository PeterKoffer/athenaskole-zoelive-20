
import { useEffect } from 'react';
import AskNelieButtons from '../shared/AskNelieButtons';
import { LessonActivity } from '../types/LessonTypes';
import Blackboard from '../shared/Blackboard';
import TextWithSpeaker from '../shared/TextWithSpeaker';

interface EnglishLessonContentRendererProps {
  activity: LessonActivity;
  studentName: string;
  onComplete: () => void;
}

const EnglishLessonContentRenderer = ({
  activity,
  studentName,
  onComplete
}: EnglishLessonContentRendererProps) => {
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
          <TextWithSpeaker
            text={activity.content.text}
            context="english-lesson-content"
            position="corner"
            showOnHover={false}
          >
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-lg leading-relaxed">{activity.content.text}</p>
            </div>
          </TextWithSpeaker>
        )}
        
        {activity.content?.examples && (
          <TextWithSpeaker
            text={`Here are some examples: ${activity.content.examples.join('. ')}`}
            context="english-lesson-examples"
            position="corner"
            showOnHover={false}
          >
            <div className="bg-blue-900/30 rounded-lg p-4">
              <h4 className="font-semibold text-blue-200">Examples:</h4>
              <ul className="space-y-2 mt-2">
                {activity.content.examples.map((example: string, index: number) => (
                  <li key={index} className="text-blue-100">• {example}</li>
                ))}
              </ul>
            </div>
          </TextWithSpeaker>
        )}
      </div>
    </Blackboard>
  );
};

export default EnglishLessonContentRenderer;
