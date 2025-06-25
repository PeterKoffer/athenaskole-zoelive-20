
import { CardContent } from "@/components/ui/card";
import { SpeakableCard } from "@/components/ui/speakable-card";
import { BarChart3, BookOpen, Gamepad2, Sparkles, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';

const FeaturesSection = () => {
  const navigate = useNavigate();
  const { speakAsNelie } = useUnifiedSpeech();

  const features = [
    {
      icon: BarChart3,
      title: "Personal Dashboard",
      description: "Get an overview of your progress.",
      details: "Track your learning journey with detailed analytics and personalized insights.",
      gradient: "bg-gradient-to-br from-orange-300/70 to-red-400/70",
      buttonGradient: "bg-gradient-to-br from-orange-300/80 to-red-500/80",
      navigationPath: "/progress"
    },
    {
      icon: BookOpen,
      title: "Interactive Lessons",
      description: "Engaging content that makes learning fun.",
      details: "Experience immersive lessons designed to adapt to your learning style.",
      gradient: "bg-gradient-to-br from-blue-300/70 to-indigo-400/70",
      buttonGradient: "bg-gradient-to-br from-blue-300/80 to-indigo-500/80",
      navigationPath: "/learn/mathematics"
    },
    {
      icon: Gamepad2,
      title: "Gamified Learning",
      description: "Earn points and badges while you learn.",
      details: "Stay motivated with rewards, achievements, and friendly competition.",
      gradient: "bg-gradient-to-br from-green-300/70 to-emerald-400/70",
      buttonGradient: "bg-gradient-to-br from-green-300/80 to-emerald-500/80",
      navigationPath: "/game-hub"
    },
    {
      icon: Sparkles,
      title: "AI-Powered Tutor",
      description: "Get personalized help from our AI assistant.",
      details: "Receive instant feedback and guidance tailored to your needs.",
      gradient: "bg-gradient-to-br from-purple-300/70 to-violet-400/70",
      buttonGradient: "bg-gradient-to-br from-purple-300/80 to-violet-500/80",
      navigationPath: "/ai-learning"
    }
  ];

  const handleLearnMore = (path: string) => {
    navigate(path);
  };

  const handleSpeakerClick = (e: React.MouseEvent, feature: typeof features[0]) => {
    e.stopPropagation();
    const speechText = `Let me tell you about ${feature.title}. ${feature.description} ${feature.details}`;
    speakAsNelie(speechText, true, 'feature-introduction');
  };

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            AI-Powered Personalization
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            Our advanced AI system continuously adapts to your learning patterns, ensuring optimal 
            challenge levels, personalized content recommendations, and intelligent progress tracking 
            across all subjects.
          </p>
        </div>

        {/* Updated grid to match subject cards alignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="relative group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 h-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Main Dark Card with Enhanced 3D Effects */}
                <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-3xl p-6 relative overflow-hidden h-full flex flex-col
                  shadow-[0_15px_50px_rgba(0,0,0,0.4),0_8px_25px_rgba(0,0,0,0.3)] 
                  hover:shadow-[0_30px_100px_rgba(0,0,0,0.5),0_20px_50px_rgba(0,0,0,0.4)]
                  before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:rounded-3xl before:pointer-events-none">
                  
                  {/* Subtle cosmic background effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/3 to-pink-500/5 opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                  
                  {/* Floating cosmic particles */}
                  <div className="absolute top-4 left-4 w-1 h-1 bg-yellow-300/30 rounded-full animate-pulse"></div>
                  <div className="absolute top-12 right-8 w-0.5 h-0.5 bg-blue-300/40 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute bottom-16 left-8 w-1 h-1 bg-purple-300/35 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>

                  {/* Speaker Icon - top right corner */}
                  <button
                    onClick={(e) => handleSpeakerClick(e, feature)}
                    className="absolute top-3 right-3 p-2 bg-gradient-to-br from-blue-300/80 via-purple-400/80 to-pink-400/80 rounded-xl transition-all duration-200 backdrop-blur-sm hover:scale-125 hover:rotate-12 z-10
                      shadow-[0_8px_20px_rgba(0,0,0,0.25),inset_0_2px_0_rgba(255,255,255,0.2)]
                      before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:rounded-xl before:pointer-events-none"
                    title="Ask Nelie to explain this feature"
                  >
                    <Volume2 size={14} className="text-white drop-shadow-lg" />
                  </button>

                  {/* Icon Container */}
                  <div className="relative z-10 mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 transform-gpu perspective-1000 relative">
                      <div className={`w-full h-full ${feature.gradient} rounded-2xl flex items-center justify-center transform transition-all duration-700 group-hover:scale-110 border-2 border-white/30 relative
                        shadow-[0_15px_30px_rgba(0,0,0,0.25),inset_0_2px_0_rgba(255,255,255,0.3)]
                        before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:rounded-2xl`}>
                        
                        <IconComponent size={28} className="text-white drop-shadow-xl relative z-10" />
                        
                        {/* Shine effects */}
                        <div className="absolute top-2 left-2 w-4 h-4 bg-white/40 rounded-full blur-sm"></div>
                        <div className="absolute top-3 left-3 w-2 h-2 bg-white/20 rounded-full blur-xs"></div>
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-white text-lg font-bold text-center mb-3 group-hover:text-gray-100 transition-colors font-sans tracking-wide 
                      drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] min-h-[1.75rem]">
                      {feature.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-400 text-sm text-center mb-3 min-h-[2.5rem] flex items-center justify-center">
                      {feature.description}
                    </p>
                    
                    {/* Details */}
                    <p className="text-gray-300 text-xs leading-relaxed text-center mb-6 min-h-[3rem] flex items-center justify-center">
                      {feature.details}
                    </p>
                  </div>
                  
                  {/* Learn More Button - pushed to bottom */}
                  <div className="mt-auto">
                    <button 
                      onClick={() => handleLearnMore(feature.navigationPath)}
                      className={`w-full py-3 px-4 ${feature.buttonGradient} text-white font-semibold rounded-xl transform transition-all duration-300 relative overflow-hidden group-hover:scale-105 border-2 border-white/20 text-sm
                        shadow-[0_8px_20px_rgba(0,0,0,0.25),inset_0_2px_0_rgba(255,255,255,0.2)]
                        hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)]
                        before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:rounded-xl before:pointer-events-none`}
                    >
                      <span className="relative z-10 drop-shadow-lg">Learn More</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left rounded-xl"></div>
                      
                      {/* Button shine effects */}
                      <div className="absolute top-2 left-4 w-8 h-2 bg-white/30 rounded-full blur-sm"></div>
                      <div className="absolute top-2.5 left-5 w-4 h-1 bg-white/15 rounded-full blur-xs"></div>
                    </button>
                  </div>

                  {/* Glassmorphism overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-black/5 rounded-3xl pointer-events-none"></div>
                </div>

                {/* Shadow layer */}
                <div className="absolute inset-0 bg-black/20 rounded-3xl transform translate-y-1 -z-10 blur-sm"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
