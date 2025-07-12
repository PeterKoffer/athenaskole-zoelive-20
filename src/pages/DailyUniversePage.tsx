
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, BookOpen, Target, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TextWithSpeaker from "@/components/education/components/shared/TextWithSpeaker";

const DailyUniversePage = () => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    // Navigate to the main educational simulator or test page
    navigate('/simulator');
  };

  const handleExploreSubject = (subject: string) => {
    // Navigate to specific subject exploration
    navigate(`/simulator?subject=${subject.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="h-8 w-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">
              Daily Universe
            </h1>
          </div>
          <TextWithSpeaker
            text="Explore personalized learning objectives from our curriculum index. Discover new concepts and track your educational journey."
            context="daily-universe-description"
            position="inline"
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore personalized learning objectives from our curriculum index. 
              Discover new concepts and track your educational journey.
            </p>
          </TextWithSpeaker>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="h-5 w-5 text-green-400" />
                  Today's Learning Objectives
                </CardTitle>
                <TextWithSpeaker
                  text="Today's Learning Objectives. Personalized objectives based on your learning path."
                  context="todays-objectives-header"
                  position="corner"
                  showOnHover={true}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div></div>
                </TextWithSpeaker>
              </div>
              <CardDescription className="text-gray-400">
                Personalized objectives based on your learning path
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <TextWithSpeaker
                  text="Mathematics: Solve linear equations with variables"
                  context="math-objective"
                  position="corner"
                  className="relative group/item"
                >
                  <div className="p-3 bg-green-900/30 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-medium text-green-300">Mathematics</h4>
                    <p className="text-sm text-green-200">Solve linear equations with variables</p>
                  </div>
                </TextWithSpeaker>
                
                <TextWithSpeaker
                  text="Science: Understand photosynthesis process"
                  context="science-objective"
                  position="corner"
                  className="relative group/item"
                >
                  <div className="p-3 bg-blue-900/30 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-medium text-blue-300">Science</h4>
                    <p className="text-sm text-blue-200">Understand photosynthesis process</p>
                  </div>
                </TextWithSpeaker>
                
                <TextWithSpeaker
                  text="Literature: Analyze character development"
                  context="literature-objective"
                  position="corner"
                  className="relative group/item"
                >
                  <div className="p-3 bg-purple-900/30 rounded-lg border-l-4 border-purple-500">
                    <h4 className="font-medium text-purple-300">Literature</h4>
                    <p className="text-sm text-purple-200">Analyze character development</p>
                  </div>
                </TextWithSpeaker>
              </div>
              <Button 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleStartLearning}
              >
                Start Learning Journey
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                  Curriculum Index
                </CardTitle>
                <TextWithSpeaker
                  text="Curriculum Index. Browse available learning content and standards."
                  context="curriculum-index-header"
                  position="corner"
                  showOnHover={true}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div></div>
                </TextWithSpeaker>
              </div>
              <CardDescription className="text-gray-400">
                Browse available learning content and standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <TextWithSpeaker
                  text="Grade 8 Mathematics: 42 objectives available"
                  context="math-curriculum"
                  position="corner"
                  className="relative group/item"
                >
                  <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">Grade 8 Mathematics</h4>
                      <p className="text-sm text-gray-400">42 objectives available</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-600"
                      onClick={() => handleExploreSubject('Mathematics')}
                    >
                      Explore
                    </Button>
                  </div>
                </TextWithSpeaker>
                
                <TextWithSpeaker
                  text="Grade 8 Science: 38 objectives available"
                  context="science-curriculum"
                  position="corner"
                  className="relative group/item"
                >
                  <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">Grade 8 Science</h4>
                      <p className="text-sm text-gray-400">38 objectives available</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-600"
                      onClick={() => handleExploreSubject('Science')}
                    >
                      Explore
                    </Button>
                  </div>
                </TextWithSpeaker>
                
                <TextWithSpeaker
                  text="Grade 8 Literature: 29 objectives available"
                  context="literature-curriculum"
                  position="corner"
                  className="relative group/item"
                >
                  <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">Grade 8 Literature</h4>
                      <p className="text-sm text-gray-400">29 objectives available</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-600"
                      onClick={() => handleExploreSubject('Literature')}
                    >
                      Explore
                    </Button>
                  </div>
                </TextWithSpeaker>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-gray-700 group">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="h-5 w-5 text-orange-400" />
                Recent Activity
              </CardTitle>
              <TextWithSpeaker
                text="Recent Activity. Your latest learning progress and achievements."
                context="recent-activity-header"
                position="corner"
                showOnHover={true}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div></div>
              </TextWithSpeaker>
            </div>
            <CardDescription className="text-gray-400">
              Your latest learning progress and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <TextWithSpeaker
                text="Completed: Algebra Fundamentals 2 hours ago with 95% Score"
                context="recent-algebra"
                position="corner"
                className="relative group/item"
              >
                <div className="flex items-center justify-between p-3 bg-orange-900/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <div>
                      <p className="font-medium text-white">Completed: Algebra Fundamentals</p>
                      <p className="text-sm text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-orange-400">95% Score</span>
                </div>
              </TextWithSpeaker>
              
              <TextWithSpeaker
                text="Started: Cell Biology Basics Yesterday - In Progress"
                context="recent-biology"
                position="corner"
                className="relative group/item"
              >
                <div className="flex items-center justify-between p-3 bg-blue-900/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div>
                      <p className="font-medium text-white">Started: Cell Biology Basics</p>
                      <p className="text-sm text-gray-400">Yesterday</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-blue-400">In Progress</span>
                </div>
              </TextWithSpeaker>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyUniversePage;
