
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageMigrationManager } from '@/components/admin/ImageMigrationManager';

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-6">Admin tools and management.</p>
            
            {/* Image Migration Manager */}
            <ImageMigrationManager />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
