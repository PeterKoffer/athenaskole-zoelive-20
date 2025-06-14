
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onGetStarted: () => void;
}

const CTASection = ({ onGetStarted }: CTASectionProps) => {
  const handleGetStartedClick = () => {
    console.log("CTASection Get Started button clicked");
    onGetStarted();
  };

  const todaysDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <section className="py-16 relative z-10">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-white mb-4">
          Ready to start your daily learning?
        </h2>
        <p className="text-gray-400 mb-8">
          Your personalized program is waiting! Nelie has prepared today's lessons just for you.
        </p>
        <div className="space-y-3">
          <p className="text-pink-300 text-lg font-medium">{todaysDate}</p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white relative z-10 text-xl px-12 py-6 h-16 font-semibold"
            onClick={handleGetStartedClick}
          >
            Your Program for Today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
