import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { calendarService } from '@/services/CalendarService';
import { CalendarEvent, CalendarLayer } from '@/types/calendar';
import { useRoleAccess } from '@/hooks/useRoleAccess';

const layerColors: Record<CalendarLayer, string> = {
  birthday: 'bg-pink-500',
  holiday: 'bg-yellow-500',
  general: 'bg-blue-500',
  league: 'bg-green-500',
  internal: 'bg-gray-500',
  keyword: 'bg-purple-500'
};

export default function MultiLayerCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [visibleLayers, setVisibleLayers] = useState<CalendarLayer[]>([
    'birthday','holiday','general','league','internal','keyword'
  ]);
  const { userRole } = useRoleAccess();

  useEffect(() => {
    const iso = selectedDate.toISOString().slice(0,10);
    calendarService.listEvents(iso, iso).then(setEvents);
  }, [selectedDate]);

  const filtered = events.filter(e => visibleLayers.includes(e.layer) && (e.layer !== 'internal' || userRole !== 'student'));

  const toggleLayer = (layer: CalendarLayer) => {
    setVisibleLayers(prev => prev.includes(layer) ? prev.filter(l => l!==layer) : [...prev, layer]);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar mode="single" selected={selectedDate} onSelect={(d)=>d && setSelectedDate(d)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layers</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {Object.keys(layerColors).map(l => (
            <Button key={l} size="sm" variant={visibleLayers.includes(l as CalendarLayer) ? 'default':'outline'} onClick={()=>toggleLayer(l as CalendarLayer)}>
              {(l as string).toUpperCase()}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Events on {selectedDate.toDateString()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {filtered.length === 0 && <p className="text-muted-foreground">No events.</p>}
          {filtered.map(ev => (
            <div key={ev.id} className={`p-2 rounded border-l-4 ${layerColors[ev.layer]}`}>\
              <div className="flex justify-between">
                <span className="font-medium">{ev.title}</span>
                <Badge>{ev.layer}</Badge>
              </div>
              {ev.description && <p className="text-sm">{ev.description}</p>}
              {ev.keywords && <p className="text-xs mt-1 text-muted-foreground">Keywords: {ev.keywords.join(', ')}</p>}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
