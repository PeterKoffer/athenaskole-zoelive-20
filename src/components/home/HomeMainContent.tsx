
import HomepageWelcome from "@/components/home/HomepageWelcome";
import HeroSection from "@/components/home/HeroSection";
import SubjectsSection from "@/components/home/SubjectsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CTASection from "@/components/home/CTASection";

interface HomeMainContentProps {
  user?: any;
  onGetStarted: () => void;
}

const HomeMainContent = ({ user, onGetStarted }: HomeMainContentProps) => {
  return (
    <>
      {/* Show welcome message for logged-in users */}
      {user && (
        <div className="pt-8">
          <HomepageWelcome userName={user?.user_metadata?.name?.split(' ')[0] || 'Student'} />
        </div>
      )}
      <HeroSection onGetStarted={onGetStarted} />
      <SubjectsSection />
      <FeaturesSection />
      <div className="pb-20">
        <CTASection onGetStarted={onGetStarted} />
      </div>
    </>
  );
};

export default HomeMainContent;
