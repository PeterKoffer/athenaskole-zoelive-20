
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Users, BarChart3, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  console.log('Index page render:', { user: user?.email });

  const handleGetStarted = () => {
    if (user) {
      navigate('/home');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold text-white">
          NELIE
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-white">Welcome, {user.email}</span>
              <Button
                onClick={() => navigate('/home')}
                className="bg-gradient-to-r from-lime-400 to-lime-600 hover:opacity-90 text-gray-900 font-semibold"
              >
                Dashboard
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-lime-400 to-lime-600 hover:opacity-90 text-gray-900 font-semibold"
            >
              Get Started
            </Button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Personalized Learning
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400">
              {" "}with AI
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            NELIE adapts to every student's learning style, providing real-time feedback
            and personalized educational experiences that help students excel.
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-gradient-to-r from-lime-400 to-lime-600 hover:opacity-90 text-gray-900 font-semibold text-lg px-8 py-4 border-none"
          >
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all">
            <CardHeader className="text-center">
              <BookOpen className="w-12 h-12 text-lime-400 mx-auto mb-4" />
              <CardTitle className="text-white">Adaptive Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-center">
                Content that adjusts to your learning pace and style
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all">
            <CardHeader className="text-center">
              <BarChart3 className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <CardTitle className="text-white">Real-time Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-center">
                Track progress and identify areas for improvement
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all">
            <CardHeader className="text-center">
              <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <CardTitle className="text-white">Collaborative Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-center">
                Connect with peers and learn together
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all">
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <CardTitle className="text-white">Safe Environment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-center">
                GDPR-compliant and privacy-focused platform
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <Button
            onClick={() => navigate('/daily-universe')}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Daily Universe
          </Button>
          <Button
            onClick={() => navigate('/auth')}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Authentication
          </Button>
          <Button
            onClick={() => navigate('/home')}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Home Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
