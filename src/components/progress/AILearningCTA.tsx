
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AILearningCTA = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-r from-lime-900 via-lime-800 to-green-900 border-lime-400">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Brain className="w-12 h-12 text-lime-400" />
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Try Adaptive AI Learning!</h3>
              <p className="text-lime-200">
                Nelie automatically adjusts difficulty based on your performance
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/adaptive-learning')}
            className="bg-lime-400 hover:bg-lime-500 text-black font-semibold"
          >
            Start AI Learning
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AILearningCTA;
