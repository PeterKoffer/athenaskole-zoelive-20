
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface NavbarButtonProps {
  icon?: LucideIcon;
  children: React.ReactNode;
  onClick: () => void;
  variant?: "outline" | "default";
}

const NavbarButton = ({ icon: Icon, children, onClick, variant = "outline" }: NavbarButtonProps) => {
  return (
    <Button 
      variant="outline"
      onClick={onClick}
      className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-10 px-4 rounded-lg backdrop-blur-sm"
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  );
};

export default NavbarButton;
