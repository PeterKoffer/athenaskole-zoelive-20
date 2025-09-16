import { useNavigate } from "react-router-dom";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CTASection from "@/components/home/CTASection";

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <HeroSection onGetStarted={handleGetStarted} />
      <FeaturesSection />
      <div className="pb-20">
        <CTASection onGetStarted={handleGetStarted} />
      </div>
    </div>
  );
};

export default WelcomePage;