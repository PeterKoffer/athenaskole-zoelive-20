
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface EnglishLearningTipsProps {
  skillArea?: string;
  currentActivity?: string;
}

const EnglishLearningTips = ({ skillArea = "general_english", currentActivity }: EnglishLearningTipsProps) => {
  const getEnglishTips = () => {
    // Generate tips based on skill area and current activity
    const tipSets = {
      reading: [
        "• Read aloud to improve pronunciation and fluency",
        "• Look for context clues when you encounter new words",
        "• Ask yourself questions about what you're reading",
        "• Visualize the story in your mind as you read"
      ],
      writing: [
        "• Start with a simple outline before writing",
        "• Use descriptive words to make your writing come alive", 
        "• Read your work aloud to catch mistakes",
        "• Don't worry about perfection - focus on expressing your ideas"
      ],
      vocabulary: [
        "• Try to use new words in sentences throughout the day",
        "• Connect new words to words you already know",
        "• Create word associations or mental pictures",
        "• Practice spelling new words by writing them multiple times"
      ],
      grammar: [
        "• Break complex sentences into smaller parts",
        "• Practice one grammar rule at a time",
        "• Use grammar in real sentences, not just exercises",
        "• Remember: grammar helps make your meaning clear"
      ],
      creative_writing: [
        "• Let your imagination run wild - there are no wrong ideas",
        "• Show, don't tell - use actions and details",
        "• Read your favorite authors for inspiration",
        "• Write a little bit every day to build the habit"
      ],
      general_english: [
        "• Take your time to understand each concept fully",
        "• Ask Nelie to repeat if you need to hear something again",
        "• Practice makes progress - every attempt helps you improve",
        "• Celebrate small victories in your learning journey"
      ]
    };

    // Determine which tips to show based on skill area
    const skillKey = skillArea.toLowerCase().replace(/[^a-z_]/g, '');
    return tipSets[skillKey as keyof typeof tipSets] || tipSets.general_english;
  };

  const tips = getEnglishTips();

  return (
    <Card className="bg-gradient-to-br from-amber-900 to-yellow-900 border-amber-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-amber-300" />
          <span>English Learning Tips</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-amber-100">
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default EnglishLearningTips;
