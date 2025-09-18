import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, getWeek, getYear } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewType = "day" | "week" | "year";

const TeacherCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>("week");
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Sample events data
  const events = [
    { date: new Date(), time: "8:00 AM", title: "Math 6A", type: "class" },
    { date: new Date(), time: "10:00 AM", title: "Science 5B", type: "class" },
    { date: new Date(), time: "1:00 PM", title: "English 4A", type: "class" },
    { date: addWeeks(new Date(), 0), time: "3:00 PM", title: "Parent Conference", type: "meeting" },
    { date: addWeeks(new Date(), 0), time: "4:00 PM", title: "Faculty Meeting", type: "meeting" },
  ];

  const handleWeekChange = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleWeekChange("prev")}
              className="text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-sm font-medium text-slate-200">
              Week {getWeek(currentDate)} - {format(weekStart, "MMM d")} to {format(weekEnd, "MMM d, yyyy")}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleWeekChange("next")}
              className="text-slate-400 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-xs">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
            <div key={day} className="text-center text-slate-400 font-medium py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const dayEvents = events.filter(event => 
              format(event.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
            );
            const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

            return (
              <div 
                key={index} 
                className={cn(
                  "min-h-[80px] p-2 rounded-lg border transition-colors cursor-pointer",
                  isToday 
                    ? "bg-blue-500/20 border-blue-500/50" 
                    : "bg-slate-700/30 border-slate-600 hover:bg-slate-700/50"
                )}
              >
                <div className={cn(
                  "text-xs font-medium mb-1",
                  isToday ? "text-blue-300" : "text-slate-300"
                )}>
                  {format(day, "d")}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event, eventIndex) => (
                    <div 
                      key={eventIndex} 
                      className={cn(
                        "text-xs px-1 py-0.5 rounded text-white",
                        event.type === "class" ? "bg-green-600" : "bg-purple-600"
                      )}
                    >
                      {event.time.slice(0, -3)}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-slate-400">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = events.filter(event => 
      format(event.date, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
    );

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000))}
              className="text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-sm font-medium text-slate-200">
              {format(currentDate, "EEEE, MMMM d, yyyy")}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000))}
              className="text-slate-400 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {dayEvents.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">No events scheduled</p>
          ) : (
            dayEvents.map((event, index) => (
              <div key={index} className="p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{event.title}</p>
                    <p className="text-xs text-slate-400">{event.time}</p>
                  </div>
                  <Badge 
                    variant={event.type === "class" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {event.type}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1))}
              className="text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-sm font-medium text-slate-200">
              {getYear(currentDate)}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1))}
              className="text-slate-400 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className={cn("p-3 pointer-events-auto rounded-md border border-slate-600")}
          classNames={{
            months: "space-y-4",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center text-slate-200",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 text-slate-400 hover:text-white",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-slate-400 rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-slate-600 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-9 w-9 p-0 font-normal text-slate-300 hover:bg-slate-600 hover:text-white rounded-md",
            day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
            day_today: "bg-slate-600 text-white",
            day_outside: "text-slate-500 opacity-50",
          }}
        />
      </div>
    );
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg flex items-center">
            <CalendarIcon className="w-5 h-5 mr-3 text-blue-400" />
            Calendar
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600 text-slate-300">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Select Week
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600" align="start">
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={(date) => date && setCurrentDate(date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                  classNames={{
                    months: "space-y-4",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center text-slate-200",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-7 w-7 bg-transparent p-0 text-slate-400 hover:text-white",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-slate-400 rounded-md w-9 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-slate-600 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-9 w-9 p-0 font-normal text-slate-300 hover:bg-slate-600 hover:text-white rounded-md",
                    day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                    day_today: "bg-slate-600 text-white",
                    day_outside: "text-slate-500 opacity-50",
                  }}
                />
              </PopoverContent>
            </Popover>

            <div className="flex bg-slate-700 rounded-lg p-1">
              {(["day", "week", "year"] as ViewType[]).map((view) => (
                <Button
                  key={view}
                  variant={viewType === view ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewType(view)}
                  className={cn(
                    "px-3 py-1 text-xs capitalize",
                    viewType === view 
                      ? "bg-blue-600 text-white" 
                      : "text-slate-300 hover:text-white hover:bg-slate-600"
                  )}
                >
                  {view}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewType === "week" && renderWeekView()}
        {viewType === "day" && renderDayView()}
        {viewType === "year" && renderYearView()}
      </CardContent>
    </Card>
  );
};

export default TeacherCalendar;