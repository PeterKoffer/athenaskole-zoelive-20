
import { Button } from "@/components/ui/button";
import TeachingPerspectiveSettingsPanel from "@/components/school/TeachingPerspectiveSettings";

interface TeachingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TeachingSettingsModal = ({ isOpen, onClose }: TeachingSettingsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Teaching Perspective Settings</h2>
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ×
          </Button>
        </div>
        <TeachingPerspectiveSettingsPanel />
      </div>
    </div>
  );
};

export default TeachingSettingsModal;
