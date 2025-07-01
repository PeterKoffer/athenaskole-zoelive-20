
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StudentPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Student Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">Access your assignments and progress.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentPage;
