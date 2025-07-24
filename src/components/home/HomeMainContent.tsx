
import HeroSection from "@/components/home/HeroSection";
import SubjectsSection from "@/components/home/SubjectsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CTASection from "@/components/home/CTASection";
import NELIE from "@/components/NELIE";

interface HomeMainContentProps {
  user?: any;
  onGetStarted: () => void;
}

const HomeMainContent = ({ user, onGetStarted }: HomeMainContentProps) => {
  return (
    <>
      <HeroSection onGetStarted={onGetStarted} />
      <SubjectsSection />
      <FeaturesSection />
      <div className="pb-20">
        <CTASection onGetStarted={onGetStarted} />
      </div>
      {/* NELIE Floating AI Tutor */}
      <NELIE />
    </>
  );
};

export default HomeMainContent;
