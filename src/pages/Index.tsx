
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, TestTube, Shield, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to the Learning Platform
          </h1>
          <p className="text-xl text-gray-600">
            Explore our educational tools and curriculum system
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Daily Universe
              </CardTitle>
              <CardDescription>
                Explore personalized learning objectives from our curriculum index
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/universe">
                <Button className="w-full">
                  View Daily Universe
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5 text-green-600" />
                Test Page
              </CardTitle>
              <CardDescription>
                Test various system components and functionality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/test">
                <Button variant="outline" className="w-full">
                  Go to Tests
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-600" />
                Educational Simulator
              </CardTitle>
              <CardDescription>
                Interactive educational simulation environment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/educational-simulator">
                <Button variant="outline" className="w-full">
                  Launch Simulator
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                Stealth Assessment
              </CardTitle>
              <CardDescription>
                Advanced assessment and evaluation tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/stealth-assessment-test">
                <Button variant="outline" className="w-full">
                  Try Assessment
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
