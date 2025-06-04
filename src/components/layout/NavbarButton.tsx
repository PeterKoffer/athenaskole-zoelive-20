
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
      variant={variant}
      onClick={onClick}
      className="bg-blue-200 text-blue-800 border-blue-300 hover:bg-blue-300 h-10 px-4"
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  );
};

export default NavbarButton;
