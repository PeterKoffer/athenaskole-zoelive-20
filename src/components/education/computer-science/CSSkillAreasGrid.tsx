
import { Card, CardContent } from "@/components/ui/card";
import { Code, Globe, Bot } from "lucide-react";

const CSSkillAreasGrid = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-3">
            <div className="p-3 bg-purple-900/40 rounded-xl">
              <Code className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Coding</h3>
              <p className="text-gray-400 text-sm">Programming fundamentals</p>
            </div>
          </div>
          <p className="text-gray-300 text-xs">Learn programming basics through visual coding challenges and algorithmic puzzles.</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-3">
            <div className="p-3 bg-blue-900/40 rounded-xl">
              <Globe className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Web & Data</h3>
              <p className="text-gray-400 text-sm">Web and data concepts</p>
            </div>
          </div>
          <p className="text-gray-300 text-xs">Discover how websites work and how data is analyzed in interactive exercises.</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700 hover:border-lime-500 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-3">
            <div className="p-3 bg-lime-900/40 rounded-xl">
              <Bot className="w-6 h-6 text-lime-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">AI & Machine Learning</h3>
              <p className="text-gray-400 text-sm">Intro to artificial intelligence</p>
            </div>
          </div>
          <p className="text-gray-300 text-xs">Learn how AI works through hands-on training exercises and model building.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CSSkillAreasGrid;
