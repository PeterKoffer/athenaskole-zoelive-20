
import { useNavigate } from "react-router-dom";

interface NavbarLogoProps {
  onLogoClick: () => void;
}

const NavbarLogo = ({ onLogoClick }: NavbarLogoProps) => {
  return (
    <div 
      className="flex items-center space-x-2 cursor-pointer" 
      onClick={onLogoClick}
    >
      <div className="w-8 h-8 bg-gradient-to-r from-lime-400 to-lime-600 rounded-lg flex items-center justify-center">
        <span className="text-gray-900 font-bold text-lg">N</span>
      </div>
      <span className="text-white text-xl font-bold">Nelie</span>
    </div>
  );
};

export default NavbarLogo;
