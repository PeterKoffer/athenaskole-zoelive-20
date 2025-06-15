
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const SubjectsSection = () => {
  const navigate = useNavigate();

  const subjects = [
    {
      title: "Mathematics",
      description: "Master advanced mathematical concepts through AI-powered personalized learning paths with real-world problem solving.",
      icon: "🔢",
      color: "from-blue-500 to-cyan-500",
      route: "/learn/mathematics",
      skills: ["Algebra", "Geometry", "Statistics"],
    },
    {
      title: "English Language Arts",
      description: "Develop exceptional reading, writing, and communication skills through immersive storytelling and creative expression.",
      icon: "📚",
      color: "from-purple-500 to-violet-500",
      route: "/learn/english",
      skills: ["Creative Writing", "Literature", "Grammar"],
    },
    {
      title: "Science & Technology",
      description: "Explore the wonders of science through virtual experiments, simulations, and hands-on discovery learning.",
      icon: "🔬",
      color: "from-green-500 to-emerald-500",
      route: "/learn/science",
      skills: ["Physics", "Chemistry", "Biology"],
    },  
    {
      title: "Computer Science",
      description: "Learn programming, AI, and computational thinking through gamified coding challenges and real projects.",
      icon: "💻",
      color: "from-indigo-500 to-purple-500",
      route: "/learn/computer-science",
      skills: ["Programming", "Algorithms", "AI/ML"],
    },
    {
      title: "Creative Arts",
      description: "Express your creativity through digital art, music composition, and multimedia storytelling projects.",
      icon: "🎨",
      color: "from-pink-500 to-rose-500",
      route: "/learn/creative-arts",
      skills: ["Digital Art", "Music Theory", "Design"],
    },
    {
      title: "Music Discovery",
      description: "Explore rhythm, melody, and composition through interactive music theory and digital instrument mastery.",
      icon: "🎵",
      color: "from-orange-500 to-yellow-500",
      route: "/learn/music",
      skills: ["Music Theory", "Composition", "Performance"],
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
            World-Class AI-Powered Education
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Experience personalized learning that adapts to your pace, interests, and learning style. 
            Each subject features engaging content, interactive activities, and real-world applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjects.map((subject, index) => (
            <Card 
              key={index} 
              className="bg-gray-900 border-gray-700 hover:border-purple-500 transition-all duration-300 hover:scale-105 cursor-pointer group"
              onClick={() => handleSubjectClick(subject.route)}
            >
              <CardHeader className="pb-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${subject.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  {subject.icon}
                </div>
                <CardTitle className="text-white text-2xl mb-3 font-bold">{subject.title}</CardTitle>
                <p className="text-gray-300 leading-relaxed text-base">{subject.description}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <h4 className="text-white font-medium text-sm">Key Areas:</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {subject.skills.map((skill, idx) => (
                      <div 
                        key={idx} 
                        className="text-gray-300 text-sm flex items-center"
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${subject.color} mr-3 flex-shrink-0`}></div>
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-8 border border-purple-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Personalization</h3>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg">
              Our advanced AI system continuously adapts to your learning patterns, ensuring optimal challenge levels, 
              personalized content recommendations, and intelligent progress tracking across all subjects.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;
