import { useNavigate } from "react-router-dom";
import HomeMainContent from "@/components/home/HomeMainContent";

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <HomeMainContent user={null} onGetStarted={handleGetStarted} />
    </div>
  );
};

export default WelcomePage;