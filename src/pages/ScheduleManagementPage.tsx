
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, Plus, Users } from 'lucide-react';

const ScheduleManagementPage = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // Mock schedule data
  const schedule = {
    Monday: [
      { time: '08:00-08:45', class: '3.A', subject: 'Mathematics', teacher: 'Ms. Johnson', room: 'Room 101' },
      { time: '09:00-09:45', class: '2.B', subject: 'English', teacher: 'Mr. Anderson', room: 'Room 102' },
      { time: '10:00-10:45', class: '4.A', subject: 'Science', teacher: 'Dr. Smith', room: 'Lab 1' },
      { time: '11:00-11:45', class: '3.A', subject: 'Art', teacher: 'Ms. Brown', room: 'Art Studio' },
      { time: '13:00-13:45', class: '2.B', subject: 'Mathematics', teacher: 'Ms. Johnson', room: 'Room 101' },
    ],
    Tuesday: [
      { time: '08:00-08:45', class: '2.B', subject: 'Science', teacher: 'Dr. Smith', room: 'Lab 1' },
      { time: '09:00-09:45', class: '3.A', subject: 'English', teacher: 'Mr. Anderson', room: 'Room 102' },
      { time: '10:00-10:45', class: '4.A', subject: 'Mathematics', teacher: 'Ms. Johnson', room: 'Room 101' },
      { time: '11:00-11:45', class: '2.B', subject: 'Art', teacher: 'Ms. Brown', room: 'Art Studio' },
    ],
    Wednesday: [
      { time: '08:00-08:45', class: '4.A', subject: 'English', teacher: 'Mr. Anderson', room: 'Room 102' },
      { time: '09:00-09:45', class: '3.A', subject: 'Science', teacher: 'Dr. Smith', room: 'Lab 1' },
      { time: '10:00-10:45', class: '2.B', subject: 'Mathematics', teacher: 'Ms. Johnson', room: 'Room 101' },
      { time: '11:00-11:45', class: '4.A', subject: 'Art', teacher: 'Ms. Brown', room: 'Art Studio' },
    ],
    Thursday: [
      { time: '08:00-08:45', class: '3.A', subject: 'Mathematics', teacher: 'Ms. Johnson', room: 'Room 101' },
      { time: '09:00-09:45', class: '4.A', subject: 'Science', teacher: 'Dr. Smith', room: 'Lab 1' },
      { time: '10:00-10:45', class: '2.B', subject: 'English', teacher: 'Mr. Anderson', room: 'Room 102' },
      { time: '11:00-11:45', class: '3.A', subject: 'Art', teacher: 'Ms. Brown', room: 'Art Studio' },
    ],
    Friday: [
      { time: '08:00-08:45', class: '2.B', subject: 'Mathematics', teacher: 'Ms. Johnson', room: 'Room 101' },
      { time: '09:00-09:45', class: '3.A', subject: 'English', teacher: 'Mr. Anderson', room: 'Room 102' },
      { time: '10:00-10:45', class: '4.A', subject: 'Art', teacher: 'Ms. Brown', room: 'Art Studio' },
      { time: '11:00-11:45', class: '2.B', subject: 'Science', teacher: 'Dr. Smith', room: 'Lab 1' },
    ],
  };

  const currentSchedule = schedule[selectedDay as keyof typeof schedule] || [];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/school-dashboard')}
              className="text-muted-foreground hover:text-foreground mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Schedule Management</h1>
              <p className="text-muted-foreground">Manage class schedules and school calendar</p>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Schedule
          </Button>
        </div>

        {/* Day Selector */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-2">
              {days.map((day) => (
                <Button
                  key={day}
                  variant={selectedDay === day ? "default" : "outline"}
                  onClick={() => setSelectedDay(day)}
                  className="flex-1"
                >
                  {day}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Schedule for Selected Day */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {selectedDay} Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentSchedule.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono text-sm">{item.time}</span>
                    </div>
                    <Badge variant="outline">{item.class}</Badge>
                    <div>
                      <p className="font-medium">{item.subject}</p>
                      <p className="text-sm text-muted-foreground">{item.teacher}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{item.room}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span>24 students</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
              
              {currentSchedule.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No classes scheduled</h3>
                  <p className="text-muted-foreground">Add classes to the {selectedDay} schedule.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScheduleManagementPage;
