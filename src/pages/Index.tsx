
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BookOpen, Brain, Calendar, Gamepad2, Settings, TestTube2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Personalized education adapted to your learning style and pace"
    },
    {
      icon: BookOpen,
      title: "Comprehensive Curriculum",
      description: "From mathematics to creative arts, covering all essential subjects"
    },
    {
      icon: Gamepad2,
      title: "Interactive Games",
      description: "Learn through engaging games and interactive experiences"
    },
    {
      icon: Calendar,
      title: "Daily Programs",
      description: "Structured learning sessions tailored to your schedule"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            StudyPug Kids
          </div>
        </div>
        <div className="flex space-x-4">
          <Button variant="ghost" onClick={() => navigate('/auth')}>
            Sign In
          </Button>
          <Button onClick={() => navigate('/auth')}>
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            The Future of Learning
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover personalized, AI-powered education that adapts to every child's unique learning journey. 
            Make learning fun, engaging, and effective.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" onClick={() => navigate('/daily-program')} className="bg-purple-600 hover:bg-purple-700">
              Start Learning
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/enhanced-daily-program')} className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
              Enhanced Program
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/adaptive-learning-demo')} className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white">
              Try Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <feature.icon className="w-8 h-8 text-purple-400 mb-2" />
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-white mb-8">Quick Access</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="border-white/20 text-white hover:bg-white/10 h-16"
            >
              <Settings className="w-5 h-5 mr-2" />
              Dashboard
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/adaptive-integration-test')}
              className="border-green-400/50 text-green-400 hover:bg-green-400/10 h-16"
            >
              <TestTube2 className="w-5 h-5 mr-2" />
              Integration Tests
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/auth')}
              className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10 h-16"
            >
              <Brain className="w-5 h-5 mr-2" />
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-400">
          <p>&copy; 2024 StudyPug Kids. Empowering the next generation of learners.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
