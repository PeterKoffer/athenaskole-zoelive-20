
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Users, BarChart3, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// This is the main landing page for the application.
// It serves as the entry point for both new and returning users.
const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Handle the "Get Started" button click.
  // If the user is logged in, they are redirected to the home page.
  // Otherwise, they are redirected to the authentication page.
  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold text-white">NELIE</div>
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-white">Welcome, {user.email}</span>
              <Button
                onClick={() => navigate("/home")}
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
              {" "}
              with AI
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            NELIE adapts to every student's learning style, providing real-time
            feedback and personalized educational experiences that help students
            excel.
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
          <FeatureCard
            icon={<BookOpen className="w-12 h-12 text-lime-400 mx-auto mb-4" />}
            title="Adaptive Content"
            description="Content that adjusts to your learning pace and style"
          />
          <FeatureCard
            icon={
              <BarChart3 className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            }
            title="Real-time Analytics"
            description="Track progress and identify areas for improvement"
          />
          <FeatureCard
            icon={<Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />}
            title="Collaborative Learning"
            description="Connect with peers and learn together"
          />
          <FeatureCard
            icon={<Shield className="w-12 h-12 text-orange-400 mx-auto mb-4" />}
            title="Safe Environment"
            description="GDPR-compliant and privacy-focused platform"
          />
        </div>

        {/* Quick Access Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <QuickAccessButton
            label="Daily Universe"
            onClick={() => navigate("/daily-universe")}
          />
          <QuickAccessButton
            label="Authentication"
            onClick={() => navigate("/auth")}
          />
          <QuickAccessButton
            label="Home Dashboard"
            onClick={() => navigate("/home")}
          />
        </div>
      </main>
    </div>
  );
};

// A reusable component for displaying a feature card.
const FeatureCard = ({ icon, title, description }) => (
  <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all">
    <CardHeader className="text-center">
      {icon}
      <CardTitle className="text-white">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-300 text-center">{description}</p>
    </CardContent>
  </Card>
);

// A reusable component for displaying a quick access button.
const QuickAccessButton = ({ label, onClick }) => (
  <Button
    onClick={onClick}
    variant="outline"
    className="border-white/20 text-white hover:bg-white/10"
  >
    {label}
  </Button>
);

export default Index;
