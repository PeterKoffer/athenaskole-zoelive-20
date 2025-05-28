
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onGetStarted: () => void;
}

const CTASection = ({ onGetStarted }: CTASectionProps) => {
  return (
    <section className="py-12">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-white mb-4">
          Klar til at starte?
        </h2>
        <p className="text-gray-400 mb-8">
          Opret en gratis konto og begynd din læringsrejse i dag!
        </p>
        <Button
          size="lg"
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
          onClick={onGetStarted}
        >
          Tilmeld dig gratis
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
