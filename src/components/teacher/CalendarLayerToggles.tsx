import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Layers, Eye, EyeOff } from 'lucide-react';
import { Calendar as LayeredCalendarType } from '@/types/layered-calendar';
import { cn } from '@/lib/utils';

interface CalendarLayerTogglesProps {
  calendars: LayeredCalendarType[];
  visibleCalendars: Set<string>;
  onToggle: (calendarId: string, isVisible: boolean) => void;
}

const getCalendarTypeIcon = (type: string) => {
  switch (type) {
    case 'personal':
      return '👤';
    case 'class':
      return '🎓';
    case 'school':
      return '🏫';
    case 'shared':
      return '🤝';
    default:
      return '📅';
  }
};

const getCalendarTypeColor = (type: string) => {
  switch (type) {
    case 'personal':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'class':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'school':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'shared':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function CalendarLayerToggles({ 
  calendars, 
  visibleCalendars, 
  onToggle 
}: CalendarLayerTogglesProps) {
  const handleToggleAll = (visible: boolean) => {
    calendars.forEach(calendar => {
      if (calendar.id) {
        onToggle(calendar.id, visible);
      }
    });
  };

  const allVisible = calendars.length > 0 && calendars.every(cal => cal.id && visibleCalendars.has(cal.id));
  const noneVisible = calendars.every(cal => !cal.id || !visibleCalendars.has(cal.id));

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm">Calendar Layers</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {visibleCalendars.size}/{calendars.length} visible
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggleAll(true)}
              disabled={allVisible}
              className="text-xs h-7"
            >
              <Eye className="h-3 w-3 mr-1" />
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggleAll(false)}
              disabled={noneVisible}
              className="text-xs h-7"
            >
              <EyeOff className="h-3 w-3 mr-1" />
              None
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {calendars.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No calendars available. Create your first calendar to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {calendars.map((calendar) => {
              const isVisible = calendar.id ? visibleCalendars.has(calendar.id) : false;
              
              return (
                <div
                  key={calendar.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border transition-all',
                    isVisible 
                      ? 'bg-white border-border shadow-sm' 
                      : 'bg-muted/50 border-muted-foreground/20 opacity-60'
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                     <div className="text-sm">
                       {getCalendarTypeIcon(calendar.calendar_type || 'default')}
                     </div>
                    <div 
                      className="w-3 h-3 rounded-full border flex-shrink-0"
                      style={{ backgroundColor: calendar.color || '#3b82f6' }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm truncate">
                        {calendar.name}
                      </div>
                      <Badge 
                        variant="secondary" 
                         className={cn(
                           'text-xs h-4 px-1.5',
                           getCalendarTypeColor(calendar.calendar_type || 'default')
                         )}
                      >
                        {calendar.calendar_type}
                      </Badge>
                    </div>
                  </div>
                  <Switch
                    checked={isVisible}
                    onCheckedChange={(checked) => calendar.id && onToggle(calendar.id, checked)}
                    className="ml-2 flex-shrink-0"
                  />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}