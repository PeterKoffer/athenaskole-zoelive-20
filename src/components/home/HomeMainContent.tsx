
import HeroSection from "@/components/home/HeroSection";
// import SubjectsSection from "@/components/home/SubjectsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CTASection from "@/components/home/CTASection";

interface HomeMainContentProps {
  user?: any;
  onGetStarted: () => void;
}

const HomeMainContent = ({ user: _user, onGetStarted }: HomeMainContentProps) => {
  return (
    <>
      <HeroSection onGetStarted={onGetStarted} />
      {/* SubjectsSection removed per request - available in Training Ground */}
      <FeaturesSection />
      <div className="pb-20">
        <CTASection onGetStarted={onGetStarted} />
      </div>
      {/* NELIE Floating AI Tutor */}
      
    </>
  );
};

export default HomeMainContent;
