
import { Card, CardContent } from '@/components/ui/card';
import { Book } from 'lucide-react';

const CurriculumLoadingState = () => {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-center">
          <Book className="w-6 h-6 text-lime-400 animate-pulse mr-2" />
          <span className="text-white">Loading curriculum content...</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurriculumLoadingState;
