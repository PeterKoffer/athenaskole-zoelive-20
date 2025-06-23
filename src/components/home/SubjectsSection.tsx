
import { CardContent } from "@/components/ui/card";
import { SpeakableCard } from "@/components/ui/speakable-card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Speaker } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SubjectsSection = () => {
  const navigate = useNavigate();

  const subjects = [
    {
      title: "Mathematics",
      description: "Master advanced mathematical concepts through AI-powered personalized learning paths with real-world problem solving.",
      keyAreas: ["Algebra", "Geometry", "Statistics"],
      path: "/learn/mathematics",
      gradient: "from-blue-500 to-blue-600",
      icon: "📐"
    },
    {
      title: "English Language Arts",
      description: "Develop exceptional reading, writing, and communication skills through immersive storytelling and creative expression.",
      keyAreas: ["Creative Writing", "Literature", "Grammar"],
      path: "/learn/english",
      gradient: "from-purple-500 to-purple-600",
      icon: "📚"
    },
    {
      title: "Science & Technology",
      description: "Explore the wonders of science through virtual experiments, simulations, and hands-on discovery learning.",
      keyAreas: ["Physics", "Chemistry", "Biology"],
      path: "/learn/science",
      gradient: "from-indigo-500 to-indigo-600",
      icon: "🔬"
    },
    {
      title: "Computer Science",
      description: "Learn programming, AI, and computational thinking through gamified coding challenges and real projects.",
      keyAreas: ["Programming", "Algorithms", "AI/ML"],
      path: "/learn/computer-science",
      gradient: "from-slate-500 to-slate-600",
      icon: "💻"
    },
    {
      title: "Creative Arts",
      description: "Express your creativity through digital art, music composition, and multimedia storytelling projects.",
      keyAreas: ["Digital Art", "Music Theory", "Design"],
      path: "/learn/creative-arts",
      gradient: "from-pink-500 to-pink-600",
      icon: "🎨"
    },
    {
      title: "Music Discovery",
      description: "Explore rhythm, melody, and composition through interactive music theory and digital instrument mastery.",
      keyAreas: ["Music Theory", "Composition", "Performance"],
      path: "/learn/music",
      gradient: "from-violet-500 to-violet-600",
      icon: "🎵"
    },
    {
      title: "Mental Wellness",
      description: "Learn about understanding your feelings, developing healthy coping strategies, and supporting others. Nurture your mind for a balanced life.",
      keyAreas: ["Understanding Emotions", "Stress Management", "Mindfulness Practices", "Building Resilience", "Healthy Relationships"],
      path: "/learn/mental-wellness",
      gradient: "from-teal-500 to-teal-600",
      icon: "🧠"
    },
    {
      title: "Language Lab",
      description: "Embark on a journey to learn new languages! Interactive lessons, vocabulary building, and grammar practice for languages around the world.",
      keyAreas: ["Vocabulary Practice", "Grammar Drills", "Pronunciation Basics", "Cultural Insights"],
      path: "/learn/language-lab",
      gradient: "from-green-500 to-green-600",
      icon: "🌐"
    },
    {
      title: "World History & Global Religions",
      description: "Uncover the past to understand the present. This class takes you on a journey through world history, exploring pivotal events, influential figures, and the rise and fall of civilizations. We'll also delve into the rich tapestry of global religions, examining their origins, core beliefs, cultural impacts, and role in shaping societies across time.",
      keyAreas: ["Ancient Civilizations", "Major Empires", "World Wars", "Religious Studies", "Cultural Heritage"],
      path: "/learn/world-history-religions",
      gradient: "from-amber-500 to-amber-600",
      icon: "📜"
    },
    {
      title: "Global Geography",
      description: "Embark on an exploration of our planet. Global Geography goes beyond maps, teaching you about Earth's diverse landscapes, climates, and natural resources. Discover how human societies interact with their environment, the dynamics of population, urbanization, and the fascinating interplay between physical features and cultural development.",
      keyAreas: ["Physical Landscapes", "Climate Systems", "Human-Environment Interaction", "Population Dynamics", "Urban Studies"],
      path: "/learn/global-geography",
      gradient: "from-cyan-500 to-cyan-600",
      icon: "🌍"
    },
    {
      title: "BodyLab: Healthy & Active Living",
      description: "Ignite your potential and energize your life! BodyLab is your interactive guide to healthy and active living. Through engaging lessons, we'll explore the benefits of nutrition, physical fitness, and mental well-being. Get ready for activities and insights that will inspire you to make informed choices for a vibrant, balanced life.",
      keyAreas: ["Nutrition Science", "Fitness Principles", "Mental Wellness", "Holistic Health", "Active Lifestyles"],
      path: "/learn/body-lab",
      gradient: "from-emerald-500 to-emerald-600",
      icon: "💪"
    },
    {
      title: "Life Essentials: Navigating Adulthood",
      description: "Prepare for your future with confidence. Life Essentials: Navigating Adulthood is your comprehensive guide to the practical realities of independent living. This class covers vital topics such as personal finance (budgeting, banking, investments, loans), managing a household, understanding taxes and insurance, making informed decisions about mortgages and cars, and navigating the world of work and careers. Gain the knowledge and foresight you need to plan ahead and thrive.",
      keyAreas: ["Personal Finance", "Household Management", "Career Development", "Civic Responsibilities", "Future Planning"],
      path: "/learn/life-essentials",
      gradient: "from-gray-500 to-gray-600",
      icon: "🛠️"
    }
  ];

  const handleStartLearning = (path: string) => {
    console.log(`🚀 Starting learning for path: ${path}`);
    // Direct navigation without any auth checks
    navigate(path);
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Choose Your Learning Adventure
          </h2>
          <p className="text-xl text-gray-300">
            Dive into interactive lessons tailored to your learning style
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <div key={index} className="flex h-48">
              <SpeakableCard
                speakText={`${subject.title}. ${subject.description}. Key Areas: ${subject.keyAreas.join(', ')}`}
                context={`subject-card-${index}`}
                className="border-2 border-gray-600 hover:border-gray-500 transition-all duration-300 backdrop-blur-sm w-full flex bg-gray-800/70"
              >
                <CardContent className="p-6 flex flex-col h-full w-full relative">
                  {/* Speaker Icon in top right */}
                  <div className="absolute top-4 right-4">
                    <Speaker className="w-5 h-5 text-blue-400" />
                  </div>

                  <div className="flex items-center justify-between mb-4 pr-8">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{subject.icon}</span>
                      <h3 className="text-xl font-bold text-white">
                        {subject.title}
                      </h3>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-gray-400 hover:text-white transition-colors p-1">
                          <ChevronDown className="w-5 h-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        className="w-80 bg-gray-800 border-gray-700 text-white p-4 z-50"
                        align="end"
                        side="bottom"
                      >
                        <div className="space-y-4">
                          <div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {subject.description}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold text-gray-400 mb-2">
                              Key Areas:
                            </h4>
                            <ul className="space-y-1">
                              {subject.keyAreas.map((area, areaIndex) => (
                                <li key={areaIndex} className="flex items-center text-sm text-gray-300">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></div>
                                  <span>{area}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex-1"></div>

                  <Button
                    onClick={() => handleStartLearning(subject.path)}
                    className={`w-full bg-gradient-to-r ${subject.gradient} hover:opacity-90 transition-opacity text-sm py-3 font-semibold mt-4`}
                  >
                    Start Learning
                  </Button>
                </CardContent>
              </SpeakableCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;
