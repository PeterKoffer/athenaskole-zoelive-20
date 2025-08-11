import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, BarChart3, Shield } from "lucide-react";

// This page provides information about the NELIE application and its mission.
const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">About NELIE</h1>
          <p className="text-xl text-gray-400">
            Our mission is to provide a personalized and engaging learning
            experience for every student.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InfoCard
            icon={<BookOpen className="w-10 h-10 text-blue-400" />}
            title="Personalized Learning"
            description="NELIE adapts to each student's unique learning style and pace, providing a customized educational journey that maximizes their potential."
          />
          <InfoCard
            icon={<Users className="w-10 h-10 text-green-400" />}
            title="Collaborative Environment"
            description="We foster a collaborative learning environment where students can connect with peers, share knowledge, and learn together."
          />
          <InfoCard
            icon={<BarChart3 className="w-10 h-10 text-yellow-400" />}
            title="Real-time Analytics"
            description="Our platform provides real-time analytics to help students and educators track progress, identify areas for improvement, and make data-driven decisions."
          />
          <InfoCard
            icon={<Shield className="w-10 h-10 text-red-400" />}
            title="Safe and Secure"
            description="We are committed to providing a safe and secure learning environment for all our users. Our platform is GDPR-compliant and prioritizes user privacy."
          />
        </div>
      </div>
    </div>
  );
};

// A reusable component for displaying an information card.
interface InfoCardProps { icon: React.ReactNode; title: string; description: string }
const InfoCard = ({ icon, title, description }: InfoCardProps) => (
  <Card className="bg-gray-800 border-gray-700">
    <CardHeader className="flex flex-row items-center gap-4">
      {icon}
      <CardTitle className="text-white text-2xl">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-300">{description}</p>
    </CardContent>
  </Card>
);

export default AboutPage;
