
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Code2, Database, Loader2, Copy, Check } from 'lucide-react';
import { useCodeSuggestions } from '@/hooks/useCodeSuggestions';
import { useToast } from '@/hooks/use-toast';

const CodeSuggestionPanel = () => {
  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [includeSupabase, setIncludeSupabase] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [copied, setCopied] = useState(false);

  const { generateCodeSuggestion, isLoading, error } = useCodeSuggestions();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description of what you want to generate.",
        variant: "destructive"
      });
      return;
    }

    const result = await generateCodeSuggestion({
      prompt: prompt.trim(),
      context: context.trim() || undefined,
      language,
      includeSupabase
    });

    if (result) {
      setSuggestion(result);
      toast({
        title: "Code Generated",
        description: "Your code suggestion has been generated successfully!",
      });
    } else if (error) {
      toast({
        title: "Generation Failed",
        description: error,
        variant: "destructive"
      });
    }
  };

  const handleCopy = async () => {
    if (suggestion) {
      await navigator.clipboard.writeText(suggestion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Code has been copied to clipboard.",
      });
    }
  };

  const quickPrompts = [
    { label: "React Hook", prompt: "Create a custom React hook for managing form state" },
    { label: "Supabase Query", prompt: "Generate a Supabase query to fetch user profiles with pagination", supabase: true },
    { label: "Utility Function", prompt: "Create a utility function to format dates" },
    { label: "API Handler", prompt: "Create an API route handler for user authentication" },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="w-5 h-5" />
          AI Code Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Prompts */}
        <div>
          <label className="text-sm font-medium mb-2 block">Quick Prompts</label>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((item, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setPrompt(item.prompt);
                  setIncludeSupabase(item.supabase || false);
                }}
              >
                {item.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">What do you want to generate?</label>
              <Textarea
                placeholder="Describe the code you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Additional Context (Optional)</label>
              <Textarea
                placeholder="Provide any additional context, existing code, or requirements..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="sql">SQL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="supabase"
                checked={includeSupabase}
                onChange={(e) => setIncludeSupabase(e.target.checked)}
              />
              <label htmlFor="supabase" className="text-sm font-medium flex items-center gap-1">
                <Database className="w-4 h-4" />
                Include Supabase patterns
              </label>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Code2 className="w-4 h-4 mr-2" />
                  Generate Code
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Output Section */}
        {suggestion && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Generated Code</label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-1"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                <code>{suggestion}</code>
              </pre>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CodeSuggestionPanel;
