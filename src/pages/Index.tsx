import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { SparklesIcon } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/training-ground');
  };

  const handleTodaysProgram = () => {
    navigate('/daily-program');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Unlock Your Learning Potential with Nelie AI
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Personalized learning experiences powered by AI, tailored to your unique needs.
          </p>
          <Button size="lg" onClick={handleGetStarted} className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 text-lg font-semibold">
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-gray-900 rounded-lg shadow-md">
              <SparklesIcon className="w-6 h-6 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Adaptive Learning Paths</h3>
              <p className="text-gray-400">
                AI-driven personalized learning paths that adjust to your pace and knowledge level.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-gray-900 rounded-lg shadow-md">
              <SparklesIcon className="w-6 h-6 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Interactive Exercises</h3>
              <p className="text-gray-400">
                Engaging exercises and quizzes to reinforce your understanding and track progress.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-gray-900 rounded-lg shadow-md">
              <SparklesIcon className="w-6 h-6 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Tutoring</h3>
              <p className="text-gray-400">
                Get instant help and explanations from our AI tutor, available 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Updated CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of students already learning with Nelie AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleTodaysProgram}
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              📅 Today's Program
            </Button>
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold"
            >
              🏋️ Training Ground
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-center">
        <p className="text-gray-500">
          &copy; {new Date().getFullYear()} Nelie AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Index;
