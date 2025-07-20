
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Calendar, 
  Target,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SiteMap = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Main Pages",
      icon: <Home className="w-5 h-5" />,
      pages: [
        { name: "Home", path: "/", description: "Welcome page and overview" },
        { name: "Training Ground", path: "/training-ground", description: "Subject-focused learning" },
        { name: "Daily Program", path: "/daily-program", description: "Structured daily activities" },
      ]
    },
    {
      title: "Learning Subjects", 
      icon: <Target className="w-5 h-5" />,
      pages: [
        { name: "Mathematics", path: "/learn/mathematics", description: "Math concepts and problem solving" },
        { name: "English", path: "/learn/english", description: "Language arts and literature" },
        { name: "Science", path: "/learn/science", description: "Scientific exploration and discovery" },
        { name: "Computer Science", path: "/learn/computer-science", description: "Programming and technology" },
        { name: "Creative Arts", path: "/learn/creative-arts", description: "Artistic expression and creativity" },
        { name: "Music", path: "/learn/music", description: "Musical theory and practice" },
        { name: "Mental Wellness", path: "/learn/mental-wellness", description: "Mental health and wellbeing" },
        { name: "Language Lab", path: "/learn/language-lab", description: "World languages learning" },
      ]
    },
    {
      title: "Additional Subjects",
      icon: <Globe className="w-5 h-5" />,
      pages: [
        { name: "History & Religion", path: "/learn/history-religion", description: "Historical and religious studies" },
        { name: "Geography", path: "/learn/geography", description: "World geography and cultures" },
        { name: "Body Lab", path: "/learn/body-lab", description: "Health and physical education" },
        { name: "Life Essentials", path: "/learn/life-essentials", description: "Practical life skills" },
        { name: "Global Geography", path: "/learn/global-geography", description: "International geography" },
        { name: "World History & Religions", path: "/learn/world-history-religions", description: "Global historical perspectives" },
      ]
    },
    {
      title: "System Pages",
      icon: <Calendar className="w-5 h-5" />,
      pages: [
        { name: "Authentication", path: "/auth", description: "Login and registration" },
        { name: "Profile", path: "/profile", description: "User profile management" },
        { name: "School Dashboard", path: "/school-dashboard", description: "Administrative dashboard" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Site Map</h1>
          <p className="text-gray-400">Navigate to any page in the application</p>
        </div>

        <div className="grid gap-8">
          {sections.map((section, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  {section.icon}
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {section.pages.map((page, pageIndex) => (
                    <div key={pageIndex} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-white">{page.name}</h3>
                        <p className="text-sm text-gray-400">{page.description}</p>
                        <code className="text-xs text-blue-300">{page.path}</code>
                      </div>
                      <Button
                        onClick={() => navigate(page.path)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Visit
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SiteMap;
