
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface ProfileFormActionsProps {
  loading: boolean;
}

const ProfileFormActions = ({ loading }: ProfileFormActionsProps) => {
  return (
    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
      <Button
        type="submit"
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6"
      >
        {loading ? (
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Saving...
          </div>
        ) : (
          <div className="flex items-center">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </div>
        )}
      </Button>
    </div>
  );
};

export default ProfileFormActions;
