
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onGetStarted: () => void;
}

const CTASection = ({ onGetStarted }: CTASectionProps) => {
  return (
    <section className="py-16">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-white mb-4">
          Klar til at møde Nelie?
        </h2>
        <p className="text-gray-400 mb-8">
          Opret en gratis konto og start din personlige læringsrejse med Nelie i dag!
        </p>
        <Button
          size="lg"
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
          onClick={onGetStarted}
        >
          Kom i gang
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
