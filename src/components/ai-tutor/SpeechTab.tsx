
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SpeechRecognition from "./SpeechRecognition";

interface SpeechTabProps {
  currentPracticeText: string;
  onPracticeTextChange: (text: string) => void;
  onScoreUpdate: (score: number) => void;
}

const SpeechTab = ({ currentPracticeText, onPracticeTextChange, onScoreUpdate }: SpeechTabProps) => {
  const practiceTexts = [
    "Hello, my name is Emma",
    "I love reading books",
    "The United States is a beautiful country",
    "I eat cereal for breakfast",
    "Learning is very important for students"
  ];

  return (
    <div className="space-y-6">
      <SpeechRecognition
        targetText={currentPracticeText}
        language="english"
        onScoreUpdate={onScoreUpdate}
      />
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Practice Texts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {practiceTexts.map((text, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => onPracticeTextChange(text)}
                className={`text-left justify-start ${
                  currentPracticeText === text
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'text-gray-300 border-gray-600 hover:bg-gray-600'
                }`}
              >
                {text}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpeechTab;
