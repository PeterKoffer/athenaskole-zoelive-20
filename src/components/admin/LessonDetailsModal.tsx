import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Clock, Target, CheckCircle, AlertTriangle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { LessonCoverage } from "@/types/lessonCoverage";

interface LessonDetailsModalProps {
  coverage: LessonCoverage | null;
  onClose: () => void;
}

const LessonDetailsModal = ({ coverage, onClose }: LessonDetailsModalProps) => {
  if (!coverage) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'text-green-400';
      case 'missing':
        return 'text-red-400';
      case 'incomplete':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'missing':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'incomplete':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Lesson Details</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-white">{coverage.className}</h3>
            <p className="text-gray-400">{format(parseISO(coverage.date), 'MMMM dd, yyyy')}</p>
          </div>

          <div className="flex items-center gap-2">
            {getStatusIcon(coverage.status)}
            <span className={`font-medium capitalize ${getStatusColor(coverage.status)}`}>
              {coverage.status}
            </span>
          </div>

          {coverage.lesson ? (
            <div className="space-y-3">
              <div>
                <h4 className="text-white font-medium">Lesson Title</h4>
                <p className="text-gray-300">{coverage.lesson.title}</p>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{coverage.lesson.duration} minutes</span>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Learning Objectives
                </h4>
                <ul className="space-y-1">
                  {coverage.lesson.objectives.map((objective, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-gray-500">•</span>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-700 rounded-lg">
              <p className="text-gray-300 text-center">
                {coverage.status === 'missing' 
                  ? 'No lesson was conducted on this date.' 
                  : 'Lesson details not available.'}
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-700">
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonDetailsModal;