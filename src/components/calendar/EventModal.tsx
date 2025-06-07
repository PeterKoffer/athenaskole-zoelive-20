
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface EventData {
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  subject: string;
  class: string;
  teacher: string;
  type: 'lesson' | 'exam' | 'event' | 'meeting';
  description?: string;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: EventData) => void;
  editingEvent?: EventData;
}

const EventModal = ({ isOpen, onClose, onSave, editingEvent }: EventModalProps) => {
  const [formData, setFormData] = useState<EventData>({
    title: editingEvent?.title || "",
    date: editingEvent?.date || new Date(),
    startTime: editingEvent?.startTime || "09:00",
    endTime: editingEvent?.endTime || "10:00",
    location: editingEvent?.location || "",
    subject: editingEvent?.subject || "",
    class: editingEvent?.class || "",
    teacher: editingEvent?.teacher || "",
    type: editingEvent?.type || "lesson",
    description: editingEvent?.description || ""
  });

  const classes = ["3A", "3B", "4A", "4B", "5A", "5B"];
  const subjects = ["Mathematics", "English", "Science", "Danish", "Music", "Art", "Physical Education"];
  const teachers = ["Mrs. Hansen", "Mr. Andersen", "Dr. Nielsen", "Ms. Larsen", "Mr. Petersen"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const updateFormData = (field: keyof EventData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingEvent ? "Edit Event" : "Create New Event"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                className="bg-gray-700 border-gray-600"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Event Type</Label>
              <Select value={formData.type} onValueChange={(value) => updateFormData('type', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="lesson">Lesson</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="event">School Event</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-gray-700 border-gray-600"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-700 border-gray-600">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && updateFormData('date', date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => updateFormData('startTime', e.target.value)}
                className="bg-gray-700 border-gray-600"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => updateFormData('endTime', e.target.value)}
                className="bg-gray-700 border-gray-600"
                required
              />
            </div>
          </div>

          {/* Class and Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select value={formData.class} onValueChange={(value) => updateFormData('class', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {classes.map(cls => (
                    <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={formData.subject} onValueChange={(value) => updateFormData('subject', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location and Teacher */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => updateFormData('location', e.target.value)}
                className="bg-gray-700 border-gray-600"
                placeholder="e.g., Room 201, Lab 1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacher">Teacher</Label>
              <Select value={formData.teacher} onValueChange={(value) => updateFormData('teacher', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {teachers.map(teacher => (
                    <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              className="bg-gray-700 border-gray-600"
              placeholder="Additional details about the event..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editingEvent ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
