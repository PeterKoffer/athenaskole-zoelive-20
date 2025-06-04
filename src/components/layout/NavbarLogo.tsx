
import { useNavigate } from "react-router-dom";

interface NavbarLogoProps {
  onResetNavigation?: () => void;
}

const NavbarLogo = ({ onResetNavigation }: NavbarLogoProps) => {
  return (
    <div 
      className="flex items-center space-x-2 cursor-pointer" 
      onClick={onResetNavigation}
    >
      <img 
        src="/lovable-uploads/50b77ea0-3474-47cb-8e98-16b77f963d10.png"
        alt="Nelie AI Tutor Robot"
        className="w-8 h-8 object-contain"
      />
      <span className="text-white text-xl font-bold">Nelie</span>
    </div>
  );
};

export default NavbarLogo;
