
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

const MathPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Calculator className="w-8 h-8 mr-3" />
            Mathematics
          </h1>
          <p className="text-muted-foreground">Practice and learn mathematics</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Math Practice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Math practice features will be implemented here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MathPage;
