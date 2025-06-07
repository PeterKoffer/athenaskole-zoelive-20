
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, MapPin, Users, Plus } from "lucide-react";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import EventModal from "./EventModal";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  subject: string;
  class: string;
  teacher: string;
  type: 'lesson' | 'exam' | 'event' | 'meeting';
}

const JointCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [showEventModal, setShowEventModal] = useState(false);
  const { userRole, canAccessSchoolDashboard } = useRoleAccess();

  // Mock data - in real app, this would come from your database
  const events: CalendarEvent[] = [
    {
      id: "1",
      title: "Mathematics Lesson",
      date: new Date(),
      startTime: "09:00",
      endTime: "10:30",
      location: "Room 201",
      subject: "Mathematics",
      class: "3A",
      teacher: "Mrs. Hansen",
      type: "lesson"
    },
    {
      id: "2",
      title: "English Reading Test",
      date: new Date(),
      startTime: "11:00",
      endTime: "12:00",
      location: "Room 105",
      subject: "English",
      class: "3A",
      teacher: "Mr. Andersen",
      type: "exam"
    },
    {
      id: "3",
      title: "Science Experiment",
      date: new Date(Date.now() + 86400000), // Tomorrow
      startTime: "14:00",
      endTime: "15:30",
      location: "Lab 1",
      subject: "Science",
      class: "3B",
      teacher: "Dr. Nielsen",
      type: "lesson"
    }
  ];

  const classes = ["all", "3A", "3B", "4A", "4B", "5A", "5B"];
  const subjects = ["all", "Mathematics", "English", "Science", "Danish", "Music"];

  const filteredEvents = events.filter(event => {
    const matchesDate = event.date.toDateString() === selectedDate.toDateString();
    const matchesClass = selectedClass === "all" || event.class === selectedClass;
    const matchesSubject = selectedSubject === "all" || event.subject === selectedSubject;
    return matchesDate && matchesClass && matchesSubject;
  });

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'bg-blue-500';
      case 'exam': return 'bg-red-500';
      case 'event': return 'bg-green-500';
      case 'meeting': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'bg-blue-100 text-blue-800';
      case 'exam': return 'bg-red-100 text-red-800';
      case 'event': return 'bg-green-100 text-green-800';
      case 'meeting': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canCreateEvents = canAccessSchoolDashboard() || userRole === 'teacher';
  const isReadOnly = userRole === 'student' || userRole === 'parent';

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold">School Calendar</h1>
              <p className="text-gray-400">
                {isReadOnly ? "View school schedule" : "Manage school schedules and events"}
              </p>
            </div>
          </div>
          
          {canCreateEvents && (
            <Button 
              onClick={() => setShowEventModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-1 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border border-gray-600"
              />
            </CardContent>
          </Card>

          {/* Events List */}
          <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <CardTitle className="text-white">
                  Events for {selectedDate.toLocaleDateString('da-DK', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardTitle>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Class" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {classes.map(cls => (
                        <SelectItem key={cls} value={cls} className="text-white hover:bg-gray-600">
                          {cls === "all" ? "All Classes" : `Class ${cls}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject} className="text-white hover:bg-gray-600">
                          {subject === "all" ? "All Subjects" : subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No events scheduled for this day</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents.map(event => (
                    <div 
                      key={event.id}
                      className="bg-gray-700 rounded-lg p-4 border-l-4 border-blue-500 hover:bg-gray-650 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white text-lg">{event.title}</h3>
                        <Badge className={getEventTypeBadgeColor(event.type)}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {event.startTime} - {event.endTime}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Class {event.class}
                        </div>
                        <div className="text-gray-400">
                          Teacher: {event.teacher}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {showEventModal && (
        <EventModal 
          isOpen={showEventModal}
          onClose={() => setShowEventModal(false)}
          onSave={(eventData) => {
            console.log('Saving event:', eventData);
            setShowEventModal(false);
          }}
        />
      )}
    </div>
  );
};

export default JointCalendar;
