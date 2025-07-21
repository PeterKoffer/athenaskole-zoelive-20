import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarEvent, KeywordEvent, KeywordScopeType } from '@/types/calendar';
import { calendarService } from '@/services/CalendarService';
import { useRoleAccess } from '@/hooks/useRoleAccess';

interface KeywordEventModalProps {
  event: CalendarEvent;
  onClose: () => void;
}

export default function KeywordEventModal({ event, onClose }: KeywordEventModalProps) {
  const { userRole } = useRoleAccess();
  const [keywordEvent, setKeywordEvent] = useState<KeywordEvent | null>(null);
  const [keyword, setKeyword] = useState('');
  const [start, setStart] = useState<Date>(new Date(event.date));
  const [end, setEnd] = useState<Date>(new Date(event.date));
  const [scope, setScope] = useState<KeywordScopeType>('school');
  const [target, setTarget] = useState<string>('');

  useEffect(() => {
    calendarService.getKeywordEventForCalendar(event.id).then((ke) => {
      if (ke) {
        setKeywordEvent(ke);
        setKeyword(ke.keyword);
        setStart(new Date(ke.date_start));
        setEnd(new Date(ke.date_end));
        setScope(ke.scope_type);
        setTarget((ke.scope_target as any)?.join(', ') || '');
      }
    });
  }, [event.id]);

  const save = async () => {
    const payload = {
      calendar_event_id: event.id,
      keyword,
      date_start: start.toISOString().slice(0,10),
      date_end: end.toISOString().slice(0,10),
      scope_type: scope as KeywordScopeType,
      scope_target: target ? target.split(',').map(t => t.trim()) : null,
    };
    if (keywordEvent) {
      await calendarService.updateKeywordEvent(keywordEvent.id, payload);
    } else {
      await calendarService.createKeywordEvent(payload);
    }
    onClose();
  };

  if (userRole === 'student') return null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyword Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Keyword</Label>
            <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          </div>
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">{format(start, 'PPP')}</Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar mode="single" selected={start} onSelect={(d) => d && setStart(d)} />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">{format(end, 'PPP')}</Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar mode="single" selected={end} onSelect={(d) => d && setEnd(d)} />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Scope</Label>
            <Select value={scope} onValueChange={(v) => setScope(v as KeywordScopeType)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="school">Whole school</SelectItem>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="class">Class</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {scope !== 'school' && (
            <div className="space-y-2">
              <Label>Target ({scope === 'year' ? 'Year number' : 'Class list'})</Label>
              <Input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="e.g. 4 or 4B,5A" />
            </div>
          )}
          <Button onClick={save}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
