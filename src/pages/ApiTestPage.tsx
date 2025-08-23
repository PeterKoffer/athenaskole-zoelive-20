

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import OpenAIApiTest from '@/components/OpenAIApiTest';

const ApiTestPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">API Testing</h1>
          <p className="text-gray-600 mt-2">
            Test your API integrations to make sure everything is working correctly.
          </p>
        </div>

        <div className="space-y-6">
          <OpenAIApiTest />
        </div>
      </div>
    </div>
  );
};

export default ApiTestPage;
