
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { openAIService } from '@/services/OpenAIService';

const OpenAIApiTest = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const testOpenAIConnection = async () => {
    setTesting(true);
    setResult(null);

    try {
      console.log('🔄 Testing OpenAI API connection...');
      
      // Test with a simple universe generation request
      const testPrompt = "Generate a simple test universe about learning mathematics";
      const universe = await openAIService.generateUniverse(testPrompt);

      if (universe && universe.title) {
        setResult({
          success: true,
          message: 'OpenAI API key is working correctly!',
          details: {
            title: universe.title,
            description: universe.description?.substring(0, 100) + '...',
            hasCharacters: universe.characters?.length > 0,
            hasLocations: universe.locations?.length > 0,
            hasActivities: universe.activities?.length > 0
          }
        });
        console.log('✅ OpenAI API test successful:', universe);
      } else {
        throw new Error('Invalid response structure from OpenAI');
      }
    } catch (error: any) {
      console.error('❌ OpenAI API test failed:', error);
      setResult({
        success: false,
        message: 'OpenAI API test failed',
        details: {
          error: error.message,
          type: error.name || 'Unknown Error'
        }
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>OpenAI API Connection Test</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          This will test if your OpenAI API key is properly configured and working.
        </div>

        <Button
          onClick={testOpenAIConnection}
          disabled={testing}
          className="w-full"
        >
          {testing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testing Connection...
            </>
          ) : (
            'Test OpenAI API Key'
          )}
        </Button>

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-medium ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.message}
              </span>
            </div>

            {result.details && (
              <div className="mt-3 text-sm">
                {result.success ? (
                  <div className="space-y-1">
                    <div><strong>Generated Title:</strong> {result.details.title}</div>
                    <div><strong>Description:</strong> {result.details.description}</div>
                    <div className="flex gap-4 mt-2">
                      <span>Characters: {result.details.hasCharacters ? '✅' : '❌'}</span>
                      <span>Locations: {result.details.hasLocations ? '✅' : '❌'}</span>
                      <span>Activities: {result.details.hasActivities ? '✅' : '❌'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div><strong>Error Type:</strong> {result.details.type}</div>
                    <div><strong>Error Message:</strong> {result.details.error}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <strong>Note:</strong> This test generates a small universe using OpenAI's GPT-4o-mini model. 
          A successful test means your API key is configured correctly and the service is accessible.
        </div>
      </CardContent>
    </Card>
  );
};

export default OpenAIApiTest;
