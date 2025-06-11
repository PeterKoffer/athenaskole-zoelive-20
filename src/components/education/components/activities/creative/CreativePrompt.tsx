
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Lightbulb } from 'lucide-react';

interface CreativePromptProps {
  prompt: {
    icon: any;
    title: string;
    content: string;
    placeholder: string;
  };
  response: string;
  onResponseChange: (value: string) => void;
  canRespond: boolean;
}

const CreativePrompt = ({ prompt, response, onResponseChange, canRespond }: CreativePromptProps) => {
  const IconComponent = prompt.icon;
  const hasWrittenSomething = response.trim().length >= 20;

  return (
    <div className="bg-purple-800/30 rounded-lg p-4 sm:p-6">
      <div className="flex items-center mb-4">
        <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-purple-300 mr-3" />
        <h4 className="text-purple-200 font-bold text-lg sm:text-xl">{prompt.title}</h4>
      </div>
      <p className="text-purple-100 text-base sm:text-lg leading-relaxed mb-6">{prompt.content}</p>
      
      <div className="space-y-4">
        <div className="bg-purple-700/30 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-400 mr-2" />
            <span className="text-purple-200 font-medium">Your Creative Response:</span>
          </div>
          <Textarea
            value={response}
            onChange={(e) => onResponseChange(e.target.value)}
            placeholder={prompt.placeholder}
            className="w-full min-h-[120px] bg-purple-800/50 border-purple-600 text-white placeholder:text-purple-300 resize-none"
            disabled={!canRespond}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-purple-300 text-sm">
              {response.length} characters
            </span>
            {hasWrittenSomething && (
              <div className="flex items-center text-green-400 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Great work!
              </div>
            )}
          </div>
        </div>
        
        {!canRespond && (
          <div className="bg-pink-800/20 rounded-lg p-3 border border-pink-600/30">
            <p className="text-pink-200 text-sm">
              💭 Please listen to Nelie's instructions first before writing your response.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreativePrompt;
