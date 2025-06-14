
import { Button } from "@/components/ui/button";

interface ProfileFormActionsProps {
  loading: boolean;
}

const ProfileFormActions = ({ loading }: ProfileFormActionsProps) => {
  return (
    <Button 
      type="submit" 
      disabled={loading}
      className="bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
    >
      {loading ? "Saving..." : "Save Changes"}
    </Button>
  );
};

export default ProfileFormActions;
