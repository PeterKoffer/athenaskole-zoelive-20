
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">Admin tools and management.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
