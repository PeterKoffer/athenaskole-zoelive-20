
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Cpu, Shield, Palette, Zap, Database, Brain, Binary } from "lucide-react";

const CSSkillAreasGrid = () => {
  const skillAreas = [
    {
      id: "programming",
      title: "Programming Basics",
      description: "Learn fundamental coding concepts through interactive challenges",
      icon: Code,
      games: ["Robot Programming Challenge", "Web Design Studio"],
      color: "bg-blue-900 text-blue-400 border-blue-400"
    },
    {
      id: "algorithms",
      title: "Algorithms & Logic",
      description: "Master problem-solving with algorithmic thinking",
      icon: Cpu,
      games: ["Algorithm Puzzle Palace", "Logic Gate Laboratory"],
      color: "bg-green-900 text-green-400 border-green-400"
    },
    {
      id: "cybersecurity",
      title: "Cybersecurity",
      description: "Protect digital systems and learn online safety",
      icon: Shield,
      games: ["Cybersecurity Defender"],
      color: "bg-red-900 text-red-400 border-red-400"
    },
    {
      id: "web-development",
      title: "Web Development",
      description: "Create websites and learn design principles",
      icon: Palette,
      games: ["Web Design Studio"],
      color: "bg-purple-900 text-purple-400 border-purple-400"
    },
    {
      id: "digital-systems",
      title: "Digital Systems",
      description: "Understand how computers work at the hardware level",
      icon: Zap,
      games: ["Logic Gate Laboratory", "Binary Adventure Quest"],
      color: "bg-yellow-900 text-yellow-400 border-yellow-400"
    },
    {
      id: "data-structures",
      title: "Data Structures",
      description: "Organize and manage information efficiently",
      icon: Database,
      games: ["Data Structure Builder"],
      color: "bg-indigo-900 text-indigo-400 border-indigo-400"
    },
    {
      id: "ai-ml",
      title: "AI & Machine Learning",
      description: "Explore artificial intelligence and pattern recognition",
      icon: Brain,
      games: ["AI Pattern Detective"],
      color: "bg-pink-900 text-pink-400 border-pink-400"
    },
    {
      id: "binary-systems",
      title: "Binary & Number Systems",
      description: "Understand how computers represent and process data",
      icon: Binary,
      games: ["Binary Adventure Quest"],
      color: "bg-orange-900 text-orange-400 border-orange-400"
    }
  ];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Computer Science Skill Areas</h3>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {skillAreas.map((area) => {
          const IconComponent = area.icon;
          
          return (
            <Card key={area.id} className="bg-gray-800 border-gray-700 hover:border-purple-400 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <IconComponent className="w-6 h-6 text-purple-400" />
                  <Badge variant="outline" className={area.color}>
                    {area.games.length} games
                  </Badge>
                </div>
                <CardTitle className="text-sm text-white">{area.title}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-xs text-gray-400 mb-3">{area.description}</p>
                
                <div className="space-y-2 mb-3">
                  {area.games.slice(0, 2).map((game, index) => (
                    <div key={index} className="text-xs text-gray-300 bg-gray-700 px-2 py-1 rounded">
                      🎮 {game}
                    </div>
                  ))}
                </div>
                
                <Button 
                  size="sm" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Explore Area
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CSSkillAreasGrid;
