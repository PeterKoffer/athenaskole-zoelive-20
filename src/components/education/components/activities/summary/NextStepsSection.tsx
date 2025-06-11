
import { ArrowRight } from 'lucide-react';

interface NextStepsSectionProps {
  whatNext?: string;
}

const NextStepsSection = ({ whatNext }: NextStepsSectionProps) => {
  const defaultContent = "Next, we'll explore the human body and discover how your heart, lungs, and brain work together to keep you healthy and active!";

  return (
    <div className="bg-emerald-700/30 rounded-lg p-4 sm:p-6">
      <h4 className="text-emerald-300 font-bold text-lg sm:text-xl mb-3 flex items-center">
        <ArrowRight className="w-5 h-5 mr-2" />
        What's Next?
      </h4>
      <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
        {whatNext || defaultContent}
      </p>
    </div>
  );
};

export default NextStepsSection;
