
import { Badge } from "@/components/ui/badge";

interface PronunciationFeedbackBadgeProps {
  score: number | null;
  feedback: string;
}

const getBadgeStyle = (score: number | null) => {
  if (score === null) return "bg-gray-400 text-white border-gray-400";
  if (score >= 90) return "bg-green-600 text-white border-green-600";
  if (score >= 75) return "bg-blue-600 text-white border-blue-600";
  if (score >= 60) return "bg-yellow-600 text-white border-yellow-600";
  return "bg-orange-600 text-white border-orange-600";
};

export const PronunciationFeedbackBadge = ({
  score,
  feedback,
}: PronunciationFeedbackBadgeProps) => {
  if (score === null) return null;
  return (
    <div className="text-center space-y-2">
      <Badge
        variant="outline"
        className={`text-lg px-4 py-2 ${getBadgeStyle(score)}`}
      >
        {score}% accuracy
      </Badge>
      <p className="text-gray-300">{feedback}</p>
    </div>
  );
};
