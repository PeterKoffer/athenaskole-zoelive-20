
import LearningHeader from "@/components/education/LearningHeader";
import AdaptiveLearningEngine from '@/components/adaptive-learning/AdaptiveLearningEngine';
import { useToast } from '@/hooks/use-toast';

interface CSAdaptiveViewProps {
  onModeChange: (mode: any) => void;
  selectedMode: string;
}

const CSAdaptiveView = ({ onModeChange, selectedMode }: CSAdaptiveViewProps) => {
  const { toast } = useToast();

  return (
    <div className="max-w-6xl mx-auto">
      <LearningHeader 
        title="Computer Science & AI Learning"
        backTo="/daily-program"
        backLabel="Back to Program"
        onModeChange={onModeChange}
        currentMode={selectedMode}
      />
      
      <div className="p-6">
        <AdaptiveLearningEngine 
          subject="Computer Science"
          skillArea="programming"
          onComplete={(score) => {
            toast({
              title: "Learning Session Completed!",
              description: `You scored ${score}% in this adaptive learning session.`,
              duration: 5000
            });
          }}
        />
      </div>
    </div>
  );
};

export default CSAdaptiveView;
