
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NavbarButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "ghost" | "outline" | "default";
  className?: string;
  showBadge?: boolean;
  badgeText?: string;
  badgeColor?: string;
}

const NavbarButton = ({ 
  onClick, 
  children, 
  variant = "ghost", 
  className,
  showBadge = false,
  badgeText = "",
  badgeColor = "bg-red-500"
}: NavbarButtonProps) => {
  return (
    <div className="relative">
      <Button
        variant={variant}
        onClick={onClick}
        className={cn(
          "text-white hover:text-lime-400 hover:bg-gray-800 transition-colors",
          className
        )}
      >
        {children}
      </Button>
      {showBadge && (
        <Badge 
          className={cn(
            "absolute -top-2 -right-2 px-1 min-w-[20px] h-5 text-xs text-white border-0",
            badgeColor
          )}
        >
          {badgeText}
        </Badge>
      )}
    </div>
  );
};

export default NavbarButton;
