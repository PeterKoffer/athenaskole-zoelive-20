
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface UnifiedLessonNavigationProps {
  onBack: () => void;
  onForward?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  backLabel?: string;
  forwardLabel?: string;
}

const UnifiedLessonNavigation = ({
  onBack,
  onForward,
  canGoBack = true,
  canGoForward = false,
  backLabel = "Previous",
  forwardLabel = "Next"
}: UnifiedLessonNavigationProps) => {
  return (
    <div className="flex items-center justify-between w-full">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={!canGoBack}
        className="border-gray-600 text-white bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {backLabel}
      </Button>
      
      {onForward && (
        <Button
          variant="outline"
          onClick={onForward}
          disabled={!canGoForward}
          className="border-gray-600 text-white bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        >
          {forwardLabel}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
};

export default UnifiedLessonNavigation;
