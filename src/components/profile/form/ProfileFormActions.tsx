
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface ProfileFormActionsProps {
  loading: boolean;
}

const ProfileFormActions = ({ loading }: ProfileFormActionsProps) => {
  return (
    <div className="flex justify-end">
      <Button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-purple-400 to-cyan-400 text-white hover:from-purple-500 hover:to-cyan-500"
      >
        <Save className="w-4 h-4 mr-2" />
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
};

export default ProfileFormActions;
