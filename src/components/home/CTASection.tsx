import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import TextWithSpeaker from '../education/components/shared/TextWithSpeaker';
interface CTASectionProps {
  onGetStarted?: () => void;
}
const CTASection = ({
  onGetStarted
}: CTASectionProps) => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      navigate("/learn/mathematics");
    }
  };
  return <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <TextWithSpeaker text="Ready to Transform Your Learning Experience? Join thousands of students who have already discovered the power of AI-enhanced education with Nelie." context="cta-section" position="corner" showOnHover={false}>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Learning Experience?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students who have already discovered the power of AI-enhanced education with Nelie.
            </p>
            
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Button onClick={handleGetStarted} size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105">
                Start Your Journey
              </Button>
              
              <Button onClick={() => {
                console.log('CTA: Navigating to adventure page');
                navigate("/adventure");
              }} variant="outline" size="lg" className="w-full sm:w-auto border-2 border-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 bg-neutral-50 text-slate-950">
                Start Today's Adventure
              </Button>
            </div>
          </div>
        </TextWithSpeaker>
      </div>
    </section>;
};
export default CTASection;