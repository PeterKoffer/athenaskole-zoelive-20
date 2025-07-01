
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GameHubPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Game Hub</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">Play educational games to enhance your learning.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GameHubPage;
