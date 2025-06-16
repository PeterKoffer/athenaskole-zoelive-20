
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CalendarPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Calendar</h1>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Schedule & Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">Calendar and scheduling features will be available here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;
