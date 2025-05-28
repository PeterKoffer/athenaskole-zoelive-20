
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
          Funktioner
        </h2>
        <p className="text-gray-400">
          Oplev de mange måder, Athena kan hjælpe dig med at lære.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <LayoutDashboard className="w-6 h-6 text-blue-500 mb-2" />
            <h3 className="text-xl font-bold text-white mb-2">
              Personligt Dashboard
            </h3>
            <p className="text-gray-300">
              Få et overblik over dine fremskridt.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <BookOpenCheck className="w-6 h-6 text-green-500 mb-2" />
            <h3 className="text-xl font-bold text-white mb-2">
              Interaktive Lektioner
            </h3>
            <p className="text-gray-300">
              Engagerende indhold, der gør læring sjov.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <Gamepad2 className="w-6 h-6 text-purple-500 mb-2" />
            <h3 className="text-xl font-bold text-white mb-2">
              Gamificeret Læring
            </h3>
            <p className="text-gray-300">
              Tjen point og badges, mens du lærer.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <BrainCircuit className="w-6 h-6 text-orange-500 mb-2" />
            <h3 className="text-xl font-bold text-white mb-2">
              AI-drevet Tutor
            </h3>
            <p className="text-gray-300">
              Få personlig hjælp fra vores AI-tutor.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FeaturesSection;
