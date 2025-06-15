
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const SubjectsSection = () => {
  const navigate = useNavigate();

  const subjects = [
    {
      title: "Mathematics",
      description: "Master numbers, algebra, and problem-solving with personalized guidance from Nelie.",
      icon: "🔢",
      color: "from-blue-500 to-cyan-500",
      route: "/learn/mathematics"
    },
    {
      title: "English",
      description: "Strengthen your language skills with guidance from Nelie.",
      icon: "🌍",
      color: "from-purple-500 to-violet-500",
      route: "/learn/english"
    },
    {
      title: "Music Discovery",
      description: "Explore rhythm, melody, and music theory with Nelie as your musical guide.",
      icon: "🎵",
      color: "from-orange-500 to-yellow-500",
      route: "/learn/music"
    },
    {
      title: "Science & Technology",
      description: "Explore the wonders of science and technology with Nelie as your guide.",
      icon: "🔬",
      color: "from-green-500 to-emerald-500",
      route: "/learn/science"
    },
    {
      title: "Computer Science",
      description: "Learn programming and computational thinking with Nelie guiding your journey.",
      icon: "💻",
      color: "from-indigo-500 to-purple-500",
      route: "/learn/computer-science"
    },
    {
      title: "Creative Arts",
      description: "Express your creativity through art, design, and storytelling with Nelie's inspiration.",
      icon: "🎨",
      color: "from-pink-500 to-rose-500",
      route: "/learn/creative-arts"
    }
  ];

  const handleSubjectClick = (route: string) => {
    navigate(route);
  };

  return (
    <section className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Learn with Nelie across all subjects
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our AI-powered learning platform adapts to your individual needs and helps you excel in every subject.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjects.map((subject, index) => (
            <Card 
              key={index} 
              className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 cursor-pointer group"
              onClick={() => handleSubjectClick(subject.route)}
            >
              <CardHeader>
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${subject.color} flex items-center justify-center text-2xl mb-4`}>
                  {subject.icon}
                </div>
                <CardTitle className="text-white text-xl">{subject.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 leading-relaxed">{subject.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;
