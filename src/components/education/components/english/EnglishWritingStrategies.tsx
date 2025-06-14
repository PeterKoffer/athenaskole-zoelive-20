
import { Button } from '@/components/ui/button';
import { PenTool } from 'lucide-react';
import AskNelieButtons from '../shared/AskNelieButtons';

interface EnglishWritingStrategiesProps {
  studentName: string;
  onComplete: () => void;
}

const EnglishWritingStrategies = ({ studentName, onComplete }: EnglishWritingStrategiesProps) => {
  return (
    <div className="bg-gray-800 border-gray-700 rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
        <PenTool className="w-6 h-6 mr-3 text-cyan-400" />
        Writing Strategies
      </h2>
      
      <div className="text-gray-300 space-y-6">
        <div className="bg-blue-900/30 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-blue-200">Key Writing Strategies for {studentName}:</h3>
            <AskNelieButtons 
              content="Key writing strategies include planning your writing, using descriptive words, organizing ideas, and revising your work"
              context="writing-strategies-overview"
              className="ml-4"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-cyan-800/30 rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-cyan-200">📝 Planning Your Writing</h4>
                  <AskNelieButtons 
                    content="Planning helps you organize your thoughts before writing. Think about what you want to say, who you're writing for, and what order makes sense"
                    context="writing-planning"
                  />
                </div>
                <p className="text-sm text-cyan-100">Think before you write - organize your ideas</p>
                <p className="text-xs text-cyan-300 mt-1">Example: Make a list of main points before starting</p>
              </div>
              
              <div className="bg-green-800/30 rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-green-200">🎨 Descriptive Language</h4>
                  <AskNelieButtons 
                    content="Descriptive language uses adjectives and vivid words to paint a picture in the reader's mind. Instead of 'The dog ran,' try 'The golden retriever sprinted quickly'"
                    context="descriptive-language"
                  />
                </div>
                <p className="text-sm text-green-100">Use colorful words to paint pictures</p>
                <p className="text-xs text-green-300 mt-1">Example: 'Sparkling water' instead of 'clear water'</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-orange-800/30 rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-orange-200">📚 Story Structure</h4>
                  <AskNelieButtons 
                    content="Good stories have a beginning, middle, and end. The beginning introduces characters and setting, the middle has the main events, and the end wraps everything up"
                    context="story-structure"
                  />
                </div>
                <p className="text-sm text-orange-100">Beginning, middle, and end structure</p>
                <p className="text-xs text-orange-300 mt-1">Example: Introduction → Problem → Solution</p>
              </div>
              
              <div className="bg-red-800/30 rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-red-200">✏️ Revising & Editing</h4>
                  <AskNelieButtons 
                    content="Revising means making your writing better by changing words, adding details, or reorganizing. Editing focuses on fixing spelling and grammar mistakes"
                    context="revising-editing"
                  />
                </div>
                <p className="text-sm text-red-100">Make your writing better by reviewing</p>
                <p className="text-xs text-red-300 mt-1">Example: Read aloud to catch mistakes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-white">💡 Quick Tips for Better Writing:</h3>
            <AskNelieButtons 
              content="Here are quick tips for better writing: Read your work out loud, use a variety of sentence lengths, show don't just tell, and always check your spelling and punctuation"
              context="writing-tips"
            />
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span>Read your work out loud to hear how it sounds</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span>Use a variety of sentence lengths to keep it interesting</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span>Show, don't just tell - use examples and details</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span>Always check your spelling and punctuation</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <Button
          onClick={onComplete}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8"
        >
          Ready to Practice Writing, {studentName}!
        </Button>
      </div>
    </div>
  );
};

export default EnglishWritingStrategies;
