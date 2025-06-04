
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SubjectsSection = () => {
  const subjects = [
    {
      title: "Mathematics",
      description: "Master numbers, algebra, and problem-solving with personalized guidance from Nelie.",
      icon: "🔢",
      level: "Beginner to Advanced",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "English",
      description: "Strengthen your language skills with guidance from Nelie.",
      icon: "🌍",
      level: "Intermediate",
      color: "from-purple-500 to-violet-500"
    },
    {
      title: "Science & Technology",
      description: "Explore the wonders of science and technology with Nelie as your guide.",
      icon: "🔬",
      level: "Progressive",
      color: "from-orange-500 to-red-500"
    }
  ];

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
            <Card key={index} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${subject.color} flex items-center justify-center text-2xl mb-4`}>
                  {subject.icon}
                </div>
                <CardTitle className="text-white text-xl">{subject.title}</CardTitle>
                <Badge variant="outline" className="w-fit text-gray-300 border-gray-600">
                  {subject.level}
                </Badge>
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
