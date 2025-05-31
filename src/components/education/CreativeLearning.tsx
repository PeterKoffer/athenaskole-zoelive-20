
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Palette, ArrowLeft, Save, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreativeLearning = () => {
  const navigate = useNavigate();
  const [currentActivity, setCurrentActivity] = useState(0);
  const [storyText, setStoryText] = useState("");
  const [drawing, setDrawing] = useState("");
  const [completed, setCompleted] = useState(false);

  const activities = [
    {
      title: "Write a Short Story",
      description: "Write a creative story about a magical forest. Use your imagination!",
      prompt: "Once upon a time, in a magical forest...",
      type: "story"
    },
    {
      title: "Describe Your Drawing",
      description: "Imagine you're drawing your dream house. Describe what it looks like!",
      prompt: "My dream house has...",
      type: "description"
    }
  ];

  const currentActivityData = activities[currentActivity];

  const handleSubmit = () => {
    setCompleted(true);
  };

  const handleNext = () => {
    if (currentActivity < activities.length - 1) {
      setCurrentActivity(currentActivity + 1);
      setStoryText("");
      setCompleted(false);
    } else {
      navigate('/daily-program');
    }
  };

  const generateIdeas = () => {
    const ideas = [
      "Add a talking animal character",
      "Include a mysterious door",
      "Describe colorful flowers",
      "Add a friendly dragon",
      "Include a hidden treasure",
      "Describe magical sounds"
    ];
    const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
    setStoryText(prev => prev + " " + randomIdea + "...");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/daily-program')}
            className="border-gray-600 text-white bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Program
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Palette className="w-5 h-5 text-pink-400" />
              <span>Creative Time - Stories & Art</span>
            </CardTitle>
            <p className="text-sm text-gray-400">
              Activity {currentActivity + 1} of {activities.length}
            </p>
          </CardHeader>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">
              {currentActivityData.title}
            </h3>
            
            <div className="bg-pink-900/20 border border-pink-700 rounded-lg p-4 mb-6">
              <p className="text-pink-200">{currentActivityData.description}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start your {currentActivityData.type} here:
              </label>
              <Textarea
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                placeholder={currentActivityData.prompt}
                className="min-h-[200px] bg-gray-700 border-gray-600 text-white placeholder-gray-400 resize-none"
                disabled={completed}
              />
            </div>

            <div className="flex gap-2 mb-6">
              <Button
                onClick={generateIdeas}
                variant="outline"
                size="sm"
                disabled={completed}
                className="border-pink-600 text-pink-400 bg-gray-800 hover:bg-pink-900/20"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Get Ideas
              </Button>
            </div>

            {completed && (
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-4">
                <p className="text-green-200 font-semibold">Wonderful creativity! 🎨</p>
                <p className="text-green-300 mt-1">
                  Your imagination is amazing. Keep being creative!
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              {!completed ? (
                <Button
                  onClick={handleSubmit}
                  disabled={storyText.trim().length < 10}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Work
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {currentActivity < activities.length - 1 ? 'Next Activity' : 'Complete Session'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreativeLearning;
