
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
      className="bg-blue-200 text-blue-800 border-blue-300 hover:bg-blue-300 h-10 px-4"
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
};

export default NavbarButton;
