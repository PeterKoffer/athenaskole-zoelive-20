import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to the <br />
            Future of <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Learning</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Meet <span className="text-cyan-400 font-semibold">Nelie</span>, your AI-powered learning companion. Experience personalized education that adapts to your unique learning style.
          </p>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900 font-semibold py-3 px-8 rounded-lg transition-all duration-300"
            >
              Start Today's Adventure
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;