
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Phase1FeaturesSectionProps {
  onShowAITutor: () => void;
}

const Phase1FeaturesSection = ({ onShowAITutor }: Phase1FeaturesSectionProps) => {
  return (
    <section className="py-20">
      <div className="text-center mb-16">
        <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 mb-4">
          🚀 Nye Features - Phase 1
        </Badge>
        <h2 className="text-4xl font-bold text-white mb-6">
          Forbedret Læring med AI
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Oplev de nyeste forbedringer til Athena med avanceret udtale-feedback, 
          daglige udfordringer og bedre forældre-kommunikation.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="text-4xl mb-4">🎤</div>
            <h3 className="text-xl font-bold text-white mb-3">Udtale Feedback</h3>
            <p className="text-gray-300 mb-4">
              Få øjeblikkelig feedback på din udtale med avanceret stemme-genkendelse.
            </p>
            <Badge variant="outline" className="bg-green-600 text-white border-green-600">
              Nye AI-funktioner
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white mb-3">Daglige Udfordringer</h3>
            <p className="text-gray-300 mb-4">
              Nye udfordringer hver dag med belønninger og streak-system for motivation.
            </p>
            <Badge variant="outline" className="bg-yellow-600 text-white border-yellow-600">
              Gamification
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-xl font-bold text-white mb-3">Forældre Rapporter</h3>
            <p className="text-gray-300 mb-4">
              Automatiske ugentlige rapporter til forældre med detaljeret fremskridts-tracking.
            </p>
            <Badge variant="outline" className="bg-purple-600 text-white border-purple-600">
              Smart Kommunikation
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-12">
        <Button
          onClick={onShowAITutor}
          className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-4 text-lg"
        >
          Prøv Forbedret AI Lærer
        </Button>
      </div>
    </section>
  );
};

export default Phase1FeaturesSection;
