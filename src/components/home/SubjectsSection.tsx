import { CardContent } from "@/components/ui/card";
import { SpeakableCard } from "@/components/ui/speakable-card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const SubjectsSection = () => {
  const navigate = useNavigate();
  const [expandedCards, setExpandedCards] = useState<number[]>([]);

  const subjects = [
    {
      title: "Mathematics",
      description: "Master advanced mathematical concepts through AI-powered personalized learning paths with real-world problem solving.",
      keyAreas: ["Algebra", "Geometry", "Statistics"],
      path: "/learn/mathematics",
      gradient: "from-blue-600 to-purple-600",
      icon: "📐"
    },
    {
      title: "English Language Arts",
      description: "Develop exceptional reading, writing, and communication skills through immersive storytelling and creative expression.",
      keyAreas: ["Creative Writing", "Literature", "Grammar"],
      path: "/learn/english",
      gradient: "from-blue-600 to-purple-600",
      icon: "📚"
    },
    {
      title: "Science & Technology",
      description: "Explore the wonders of science through virtual experiments, simulations, and hands-on discovery learning.",
      keyAreas: ["Physics", "Chemistry", "Biology"],
      path: "/learn/science",
      gradient: "from-blue-600 to-purple-600",
      icon: "🔬"
    },
    {
      title: "Computer Science",
      description: "Learn programming, AI, and computational thinking through gamified coding challenges and real projects.",
      keyAreas: ["Programming", "Algorithms", "AI/ML"],
      path: "/learn/computer-science",
      gradient: "from-blue-600 to-purple-600",
      icon: "💻"
    },
    {
      title: "Creative Arts",
      description: "Express your creativity through digital art, music composition, and multimedia storytelling projects.",
      keyAreas: ["Digital Art", "Music Theory", "Design"],
      path: "/learn/creative-arts",
      gradient: "from-blue-600 to-purple-600",
      icon: "🎨"
    },
    {
      title: "Music Discovery",
      description: "Explore rhythm, melody, and composition through interactive music theory and digital instrument mastery.",
      keyAreas: ["Music Theory", "Composition", "Performance"],
      path: "/learn/music",
      gradient: "from-blue-600 to-purple-600",
      icon: "🎵"
    },
    {
      title: "Mental Wellness",
      description: "Learn about understanding your feelings, developing healthy coping strategies, and supporting others. Nurture your mind for a balanced life.",
      keyAreas: ["Understanding Emotions", "Stress Management", "Mindfulness Practices", "Building Resilience", "Healthy Relationships"],
      path: "/learn/mental-wellness",
      gradient: "from-teal-500 to-cyan-500",
      icon: "🧠"
    },
    {
      title: "Language Lab",
      description: "Embark on a journey to learn new languages! Interactive lessons, vocabulary building, and grammar practice for languages around the world.",
      keyAreas: ["Vocabulary Practice", "Grammar Drills", "Pronunciation Basics", "Cultural Insights"],
      path: "/learn/language-lab",
      gradient: "from-lime-500 to-green-500",
      icon: "🌐"
    },
    {
      title: "World History & Global Religions",
      description: "Uncover the past to understand the present. This class takes you on a journey through world history, exploring pivotal events, influential figures, and the rise and fall of civilizations. We'll also delve into the rich tapestry of global religions, examining their origins, core beliefs, cultural impacts, and role in shaping societies across time.",
      keyAreas: ["Ancient Civilizations", "Major Empires", "World Wars", "Religious Studies", "Cultural Heritage"],
      path: "/learn/world-history-religions",
      gradient: "from-amber-600 to-orange-600",
      icon: "📜"
    },
    {
      title: "Global Geography",
      description: "Embark on an exploration of our planet. Global Geography goes beyond maps, teaching you about Earth's diverse landscapes, climates, and natural resources. Discover how human societies interact with their environment, the dynamics of population, urbanization, and the fascinating interplay between physical features and cultural development.",
      keyAreas: ["Physical Landscapes", "Climate Systems", "Human-Environment Interaction", "Population Dynamics", "Urban Studies"],
      path: "/learn/global-geography",
      gradient: "from-sky-600 to-cyan-600",
      icon: "🌍"
    },
    {
      title: "BodyLab: Healthy & Active Living",
      description: "Ignite your potential and energize your life! BodyLab is your interactive guide to healthy and active living. Through engaging lessons, we'll explore the benefits of nutrition, physical fitness, and mental well-being. Get ready for activities and insights that will inspire you to make informed choices for a vibrant, balanced life.",
      keyAreas: ["Nutrition Science", "Fitness Principles", "Mental Wellness", "Holistic Health", "Active Lifestyles"],
      path: "/learn/body-lab",
      gradient: "from-emerald-500 to-lime-500",
      icon: "💪"
    },
    {
      title: "Life Essentials: Navigating Adulthood",
      description: "Prepare for your future with confidence. Life Essentials: Navigating Adulthood is your comprehensive guide to the practical realities of independent living. This class covers vital topics such as personal finance (budgeting, banking, investments, loans), managing a household, understanding taxes and insurance, making informed decisions about mortgages and cars, and navigating the world of work and careers. Gain the knowledge and foresight you need to plan ahead and thrive.",
      keyAreas: ["Personal Finance", "Household Management", "Career Development", "Civic Responsibilities", "Future Planning"],
      path: "/learn/life-essentials",
      gradient: "from-slate-600 to-gray-600",
      icon: "🛠️"
    }
  ];

  const handleStartLearning = (path: string) => {
    console.log(`🚀 Starting learning for path: ${path}`);
    // Direct navigation without any auth checks
    navigate(path);
  };

  const toggleCardExpansion = (index: number) => {
    setExpandedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
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
          {subjects.map((subject, index) => {
            const isExpanded = expandedCards.includes(index);
            return (
              <SpeakableCard
                key={index}
                speakText={`${subject.title}. ${subject.description}. Key Areas: ${subject.keyAreas.join(', ')}`}
                context={`subject-card-${index}`}
                className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 backdrop-blur-sm h-[380px] flex flex-col"
              >
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-2">{subject.icon}</span>
                    <h3 className="text-lg font-bold text-white">
                      {subject.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-300 mb-3 flex-grow text-sm line-clamp-3">
                    {subject.description}
                  </p>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-semibold text-gray-400">
                        Key Areas:
                      </h4>
                      {subject.keyAreas.length > 3 && (
                        <button
                          onClick={() => toggleCardExpansion(index)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                    <ul className="space-y-1">
                      {(isExpanded ? subject.keyAreas : subject.keyAreas.slice(0, 3)).map((area, areaIndex) => (
                        <li key={areaIndex} className="flex items-center text-xs text-gray-300">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 flex-shrink-0"></div>
                          <span>{area}</span>
                        </li>
                      ))}
                      {!isExpanded && subject.keyAreas.length > 3 && (
                        <li className="text-xs text-gray-400">
                          +{subject.keyAreas.length - 3} more areas
                        </li>
                      )}
                    </ul>
                  </div>

                  <Button
                    onClick={() => handleStartLearning(subject.path)}
                    className={`w-full bg-gradient-to-r ${subject.gradient} hover:opacity-90 transition-opacity mt-auto text-sm py-2`}
                  >
                    Start Learning
                  </Button>
                </CardContent>
              </SpeakableCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;
