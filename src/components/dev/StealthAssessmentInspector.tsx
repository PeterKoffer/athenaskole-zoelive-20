
// src/components/dev/StealthAssessmentInspector.tsx

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Download } from 'lucide-react';
import stealthAssessmentService from '@/services/stealthAssessment/StealthAssessmentService';
import { InteractionEvent } from '@/types/stealthAssessment';

const StealthAssessmentInspector = () => {
  const [recentEvents, setRecentEvents] = useState<InteractionEvent[]>([]);
  const [queueSize, setQueueSize] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRecentEvents(stealthAssessmentService.getRecentEvents(20));
      setQueueSize(stealthAssessmentService.getQueueSize());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClearQueue = () => {
    stealthAssessmentService.clearQueue();
    setRecentEvents([]);
    setQueueSize(0);
  };

  const handleExportEvents = () => {
    const events = stealthAssessmentService.getRecentEvents(100);
    const dataStr = JSON.stringify(events, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stealth-assessment-events-${Date.now()}.json`;
    link.click();
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      QUESTION_ATTEMPT: 'bg-blue-100 text-blue-800',
      HINT_USAGE: 'bg-yellow-100 text-yellow-800',
      CONTENT_VIEW: 'bg-green-100 text-green-800',
      REVISION: 'bg-purple-100 text-purple-800',
      NAVIGATION: 'bg-gray-100 text-gray-800',
      GAME_INTERACTION: 'bg-orange-100 text-orange-800',
      TUTOR_QUERY: 'bg-pink-100 text-pink-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-black/80 text-white border-gray-600 hover:bg-black/90"
        >
          <Eye className="w-4 h-4 mr-2" />
          Stealth Assessment ({queueSize})
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 z-50">
      <Card className="bg-black/90 text-white border-gray-600">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Stealth Assessment Inspector</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                Queue: {queueSize}
              </Badge>
              <Button
                onClick={() => setIsVisible(false)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                ×
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex space-x-2 mb-3">
            <Button
              onClick={handleClearQueue}
              variant="outline"
              size="sm"
              className="h-6 text-xs border-red-600 text-red-400 hover:bg-red-600/20"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear
            </Button>
            <Button
              onClick={handleExportEvents}
              variant="outline"
              size="sm"
              className="h-6 text-xs border-blue-600 text-blue-400 hover:bg-blue-600/20"
            >
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {recentEvents.length === 0 ? (
              <p className="text-gray-400 text-xs">No events captured yet</p>
            ) : (
              recentEvents.slice().reverse().map((event, index) => (
                <div key={event.eventId} className="border border-gray-700 rounded p-2 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <Badge className={`text-xs ${getEventTypeColor(event.type)}`}>
                      {event.type}
                    </Badge>
                    <span className="text-gray-400">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-gray-300">
                    <div>Source: {event.sourceComponentId}</div>
                    {event.type === 'QUESTION_ATTEMPT' && (
                      <div className="text-green-400">
                        ✓ {(event as any).isCorrect ? 'Correct' : 'Incorrect'} 
                        ({(event as any).timeTakenMs}ms)
                      </div>
                    )}
                    {event.type === 'REVISION' && (
                      <div className="text-purple-400">
                        "{(event as any).originalAnswer}" → "{(event as any).revisedAnswer}"
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StealthAssessmentInspector;
