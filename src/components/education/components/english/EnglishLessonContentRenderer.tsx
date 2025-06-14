
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LessonActivity } from '../types/LessonTypes';
import AskNelieButtons from '../shared/AskNelieButtons';

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
  const renderContent = () => {
    if (activity.phase === 'content-delivery') {
      return (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">{activity.title}</h3>
              <AskNelieButtons 
                content={activity.content.text || activity.content.segments?.[0]?.explanation || ''}
                context="lesson content"
              />
            </div>
            
            {activity.content.segments ? (
              <div className="space-y-6">
                {activity.content.segments.map((segment, index) => (
                  <div key={index} className="space-y-4">
                    <h4 className="text-lg font-medium text-blue-300">{segment.concept}</h4>
                    <p className="text-gray-300 leading-relaxed">{segment.explanation}</p>
                    
                    {segment.checkQuestion && (
                      <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4">
                        <p className="text-white font-medium mb-3">{segment.checkQuestion.question}</p>
                        <div className="space-y-2">
                          {segment.checkQuestion.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="text-gray-300">
                              {String.fromCharCode(65 + optionIndex)}. {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-300 leading-relaxed mb-6">{activity.content.text}</p>
            )}
            
            <div className="flex justify-center mt-6">
              <Button
                onClick={onComplete}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Default content rendering
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">{activity.title}</h3>
          <p className="text-gray-300 mb-6">
            {activity.content.hook || activity.content.text || 'Learning content will appear here'}
          </p>
          <Button
            onClick={onComplete}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2"
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
};

export default EnglishLessonContentRenderer;
