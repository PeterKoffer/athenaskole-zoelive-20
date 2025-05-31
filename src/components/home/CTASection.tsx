
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onGetStarted: () => void;
}

const CTASection = ({ onGetStarted }: CTASectionProps) => {
  return (
    <section className="py-16 relative z-10">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-white mb-4">
          Ready to meet Nelie?
        </h2>
        <p className="text-gray-400 mb-8">
          Create a free account and start your personal learning journey with Nelie today!
        </p>
        <Button
          size="lg"
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white relative z-10"
          onClick={onGetStarted}
        >
          Get Started with Nelie
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
