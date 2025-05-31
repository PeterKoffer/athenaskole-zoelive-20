
import { Card, CardContent } from "@/components/ui/card";
import {
  LayoutDashboard,
  BookOpenCheck,
  Gamepad2,
  BrainCircuit,
} from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-white">
          Features
        </h2>
        <p className="text-gray-400">
          Experience the many ways Nelie can help you learn.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <LayoutDashboard className="w-6 h-6 text-blue-500 mb-2" />
            <h3 className="text-xl font-bold text-white mb-2">
              Personal Dashboard
            </h3>
            <p className="text-gray-300">
              Get an overview of your progress.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <BookOpenCheck className="w-6 h-6 text-green-500 mb-2" />
            <h3 className="text-xl font-bold text-white mb-2">
              Interactive Lessons
            </h3>
            <p className="text-gray-300">
              Engaging content that makes learning fun.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <Gamepad2 className="w-6 h-6 text-purple-500 mb-2" />
            <h3 className="text-xl font-bold text-white mb-2">
              Gamified Learning
            </h3>
            <p className="text-gray-300">
              Earn points and badges while you learn.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <BrainCircuit className="w-6 h-6 text-orange-500 mb-2" />
            <h3 className="text-xl font-bold text-white mb-2">
              AI-Powered Tutor
            </h3>
            <p className="text-gray-300">
              Get personalized help from our AI tutor.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FeaturesSection;
