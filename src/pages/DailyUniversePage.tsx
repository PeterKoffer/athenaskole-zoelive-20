
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, BookOpen, Target, Clock } from "lucide-react";

const DailyUniversePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Daily Universe
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore personalized learning objectives from our curriculum index. 
            Discover new concepts and track your educational journey.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Today's Learning Objectives
              </CardTitle>
              <CardDescription>
                Personalized objectives based on your learning path
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-medium text-green-800">Mathematics</h4>
                  <p className="text-sm text-green-700">Solve linear equations with variables</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-medium text-blue-800">Science</h4>
                  <p className="text-sm text-blue-700">Understand photosynthesis process</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-medium text-purple-800">Literature</h4>
                  <p className="text-sm text-purple-700">Analyze character development</p>
                </div>
              </div>
              <Button className="w-full mt-4">
                Start Learning Journey
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Curriculum Index
              </CardTitle>
              <CardDescription>
                Browse available learning content and standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Grade 8 Mathematics</h4>
                    <p className="text-sm text-gray-600">42 objectives available</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Explore
                  </Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Grade 8 Science</h4>
                    <p className="text-sm text-gray-600">38 objectives available</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Explore
                  </Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Grade 8 Literature</h4>
                    <p className="text-sm text-gray-600">29 objectives available</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Explore
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest learning progress and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Completed: Algebra Fundamentals</p>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-orange-600">95% Score</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Started: Cell Biology Basics</p>
                    <p className="text-sm text-gray-600">Yesterday</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-blue-600">In Progress</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyUniversePage;
