
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, BookOpen, Gamepad2, Sparkles } from "lucide-react";
import TextWithSpeaker from '../education/components/shared/TextWithSpeaker';

const FeaturesSection = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Personal Dashboard",
      description: "Get an overview of your progress.",
      details: "Track your learning journey with detailed analytics and personalized insights."
    },
    {
      icon: BookOpen,
      title: "Interactive Lessons",
      description: "Engaging content that makes learning fun.",
      details: "Experience immersive lessons designed to adapt to your learning style."
    },
    {
      icon: Gamepad2,
      title: "Gamified Learning",
      description: "Earn points and badges while you learn.",
      details: "Stay motivated with rewards, achievements, and friendly competition."
    },
    {
      icon: Sparkles,
      title: "AI-Powered Tutor",
      description: "Get personalized help from our AI assistant.",
      details: "Receive instant feedback and guidance tailored to your needs."
    }
  ];

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <TextWithSpeaker 
            text="AI-Powered Personalization" 
            context="ai-personalization-title"
            showOnHover={false}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              AI-Powered Personalization
            </h2>
          </TextWithSpeaker>
          <TextWithSpeaker 
            text="Our advanced AI system continuously adapts to your learning patterns, ensuring optimal challenge levels, personalized content recommendations, and intelligent progress tracking across all subjects." 
            context="ai-personalization-description"
            className="mb-8"
          >
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              Our advanced AI system continuously adapts to your learning patterns, ensuring optimal 
              challenge levels, personalized content recommendations, and intelligent progress tracking 
              across all subjects.
            </p>
          </TextWithSpeaker>
        </div>

        <div className="mb-16">
          <TextWithSpeaker 
            text="Features" 
            context="features-title"
            showOnHover={false}
          >
            <h3 className="text-2xl font-bold text-white text-center mb-4">
              Features
            </h3>
          </TextWithSpeaker>
          <TextWithSpeaker 
            text="Experience the many ways Nelie can help you learn." 
            context="features-subtitle"
            showOnHover={false}
          >
            <p className="text-gray-400 text-center mb-8">
              Experience the many ways Nelie can help you learn.
            </p>
          </TextWithSpeaker>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <TextWithSpeaker
                key={index}
                text={`${feature.title}. ${feature.description}. ${feature.details}`}
                context={`feature-card-${index}`}
                position="corner"
                className="group h-full"
              >
                <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-3">
                      {feature.description}
                    </p>
                    
                    <p className="text-gray-300 text-xs leading-relaxed">
                      {feature.details}
                    </p>
                  </CardContent>
                </Card>
              </TextWithSpeaker>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
