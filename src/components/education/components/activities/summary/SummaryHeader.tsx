
import { Award, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SummaryHeaderProps {
  title: string;
  phaseDescription: string;
  onNelieRead: () => void;
  isSpeaking: boolean;
  isEnabled: boolean;
}

const SummaryHeader = ({ 
  title, 
  phaseDescription, 
  onNelieRead, 
  isSpeaking, 
  isEnabled 
}: SummaryHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
      <div className="flex items-center">
        <Award className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 mr-3" />
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">{title}</h3>
          <p className="text-emerald-200 text-sm">{phaseDescription}</p>
        </div>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onNelieRead}
        disabled={isSpeaking || !isEnabled}
        className="bg-white text-emerald-900 border-emerald-400 hover:bg-emerald-50 flex items-center gap-2 whitespace-nowrap"
      >
        {isEnabled ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
        {isSpeaking ? 'Nelie is reading...' : 'Let Nelie Read'}
      </Button>
    </div>
  );
};

export default SummaryHeader;
