
import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";

interface Child {
  id: number;
  name: string;
  class: string;
  avatar: string;
  streak: number;
}

interface ChildSelectorProps {
  selectedChild: Child;
}

const ChildSelector = ({ selectedChild }: ChildSelectorProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <span className="text-3xl">{selectedChild.avatar}</span>
          <div>
            <h2 className="text-xl font-bold text-white">{selectedChild.name}</h2>
            <p className="text-gray-400">{selectedChild.class} • Aarhus West School</p>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <div className="text-center">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span className="text-white font-semibold">{selectedChild.streak} days</span>
              </div>
              <p className="text-gray-400 text-sm">Streak</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChildSelector;
