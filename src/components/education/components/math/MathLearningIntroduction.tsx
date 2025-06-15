
import { useAuth } from "@/hooks/useAuth";
import { Volume2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MathLearningIntroductionProps {
  onIntroductionComplete: () => void;
  isAdvancing?: boolean;
}

const MathLearningIntroduction = ({
  onIntroductionComplete,
  isAdvancing,
}: MathLearningIntroductionProps) => {
  const { user } = useAuth();

  // You can update these lines to dynamically pick heading/content if you wish
  const heading = "Welcome to Math Class";
  const content = "Welcome to your math lesson! Today we'll be exploring different mathematical concepts.";

  // Default to 'Student' if no name
  const displayName =
    user?.user_metadata?.name?.split(" ")[0] ||
    user?.user_metadata?.first_name ||
    user?.user_metadata?.full_name?.split(" ")[0] ||
    "Student";

  return (
    <div className="w-full max-w-3xl mx-auto px-2 py-12">
      <div className="rounded-xl bg-[#20273a] bg-opacity-95 shadow-lg border border-gray-700 p-8 relative flex flex-col gap-4">
        {/* Top-right icons */}
        <div className="absolute top-5 right-5 flex items-center gap-4">
          <Volume2 className="w-5 h-5 text-purple-300" />
          <MessageCircle className="w-5 h-5 text-purple-300" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{heading}</h2>
        <p className="text-base md:text-lg text-gray-100 mb-6">{content}</p>
        <div className="flex justify-center mt-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-2 rounded"
            onClick={onIntroductionComplete}
            disabled={isAdvancing}
            type="button"
          >
            Continue, {displayName}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MathLearningIntroduction;
