
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { UserRole } from "@/types/auth";

interface RoleCardProps {
  role: UserRole;
  config: {
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
  };
  isRestricted: boolean;
  onClick: () => void;
}

const RoleCard = ({ role, config, isRestricted, onClick }: RoleCardProps) => {
  const Icon = config.icon;

  return (
    <Card 
      className="bg-gray-700 border-gray-600 hover:bg-gray-600 transition-colors cursor-pointer h-full"
      onClick={onClick}
    >
      <CardContent className="p-6 text-center h-full flex flex-col">
        {isRestricted && (
          <div className="flex justify-end mb-2">
            <Badge variant="secondary" className="bg-yellow-600 text-yellow-100 text-xs">
              🔒
            </Badge>
          </div>
        )}
        
        <div className="flex-1 flex flex-col justify-center items-center space-y-4">
          <div 
            className={`w-16 h-16 rounded-full flex items-center justify-center ${config.color}`}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">
              {config.title}
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed min-h-[2.5rem] flex items-center">
              {config.description}
            </p>
          </div>
        </div>
        
        {isRestricted && (
          <div className="mt-4">
            <p className="text-xs text-yellow-400">
              Requires clearance (1111)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoleCard;
