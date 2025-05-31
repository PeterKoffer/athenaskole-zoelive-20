
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface NavbarButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "outline" | "default";
}

const NavbarButton = ({ icon: Icon, label, onClick, variant = "outline" }: NavbarButtonProps) => {
  return (
    <Button 
      variant={variant}
      onClick={onClick}
      className="bg-white text-black border-gray-300 hover:bg-gray-100 h-10 px-4"
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
};

export default NavbarButton;
