
import AdaptiveLearningEngine from '@/components/adaptive-learning/AdaptiveLearningEngine';
import { useToast } from '@/hooks/use-toast';

const CSAdaptiveView = () => {
  const { toast } = useToast();

  return (
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
  );
};

export default CSAdaptiveView;
