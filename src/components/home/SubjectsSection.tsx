
import { CardContent } from "@/components/ui/card";
import { SpeakableCard } from "@/components/ui/speakable-card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import TextWithSpeaker from '../education/components/shared/TextWithSpeaker';

const SubjectsSection = () => {
  const navigate = useNavigate();

  const subjects = [
    {
      title: "Mathematics",
      description: "Master advanced mathematical concepts through AI-powered personalized learning paths with real-world problem solving.",
      keyAreas: ["Algebra", "Geometry", "Statistics"],
      path: "/education/mathematics",
      gradient: "from-blue-600 to-purple-600",
      icon: "📐"
    },
    {
      title: "English Language Arts",
      description: "Develop exceptional reading, writing, and communication skills through immersive storytelling and creative expression.",
      keyAreas: ["Creative Writing", "Literature", "Grammar"],
      path: "/education/english",
      gradient: "from-green-600 to-teal-600",
      icon: "📚"
    },
    {
      title: "Science & Technology",
      description: "Explore the wonders of science through virtual experiments, simulations, and hands-on discovery learning.",
      keyAreas: ["Physics", "Chemistry", "Biology"],
      path: "/education/science",
      gradient: "from-purple-600 to-pink-600",
      icon: "🔬"
    },
    {
      title: "Computer Science",
      description: "Learn programming, AI, and computational thinking through gamified coding challenges and real projects.",
      keyAreas: ["Programming", "Algorithms", "AI/ML"],
      path: "/education/computer-science",
      gradient: "from-indigo-600 to-blue-600",
      icon: "💻"
    },
    {
      title: "Creative Arts",
      description: "Express your creativity through digital art, music composition, and multimedia storytelling projects.",
      keyAreas: ["Digital Art", "Music Theory", "Design"],
      path: "/education/creative-arts",
      gradient: "from-pink-600 to-red-600",
      icon: "🎨"
    },
    {
      title: "Music Discovery",
      description: "Explore rhythm, melody, and composition through interactive music theory and digital instrument mastery.",
      keyAreas: ["Music Theory", "Composition", "Performance"],
      path: "/education/music",
      gradient: "from-orange-600 to-yellow-600",
      icon: "🎵"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <TextWithSpeaker 
            text="Choose Your Learning Adventure" 
            context="subjects-section-title"
            showOnHover={false}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Learning Adventure
            </h2>
          </TextWithSpeaker>
          <TextWithSpeaker 
            text="Dive into interactive lessons tailored to your learning style" 
            context="subjects-section-subtitle"
            showOnHover={false}
          >
            <p className="text-xl text-gray-300">
              Dive into interactive lessons tailored to your learning style
            </p>
          </TextWithSpeaker>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjects.map((subject, index) => (
            <SpeakableCard
              key={index}
              speakText={`${subject.title}. ${subject.description}. Key Areas: ${subject.keyAreas.join(', ')}`}
              context={`subject-card-${index}`}
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 backdrop-blur-sm h-full"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{subject.icon}</span>
                  <h3 className="text-xl font-bold text-white">
                    {subject.title}
                  </h3>
                </div>
                
                <p className="text-gray-300 mb-4">
                  {subject.description}
                </p>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">
                    Key Areas:
                  </h4>
                  <ul className="space-y-1">
                    {subject.keyAreas.map((area, areaIndex) => (
                      <li key={areaIndex} className="flex items-center text-sm text-gray-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => navigate(subject.path)}
                  className={`w-full bg-gradient-to-r ${subject.gradient} hover:opacity-90 transition-opacity`}
                >
                  Start Learning
                </Button>
              </CardContent>
            </SpeakableCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;
