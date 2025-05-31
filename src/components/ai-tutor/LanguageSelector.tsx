
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Language } from "./types";

interface LanguageSelectorProps {
  onLanguageSelect: (languageCode: string) => void;
  onBack: () => void;
}

const LanguageSelector = ({ onLanguageSelect, onBack }: LanguageSelectorProps) => {
  const languages: Language[] = [
    { code: "spanish", name: "Spanish", flag: "🇪🇸", color: "bg-red-500" },
    { code: "french", name: "French", flag: "🇫🇷", color: "bg-blue-600" },
    { code: "german", name: "German", flag: "🇩🇪", color: "bg-yellow-500" },
    { code: "italian", name: "Italian", flag: "🇮🇹", color: "bg-green-500" },
    { code: "portuguese", name: "Portuguese", flag: "🇵🇹", color: "bg-green-600" },
    { code: "mandarin", name: "Mandarin", flag: "🇨🇳", color: "bg-red-600" },
    { code: "japanese", name: "Japanese", flag: "🇯🇵", color: "bg-red-400" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button
        variant="outline"
        onClick={onBack}
        className="text-white border-gray-600 hover:bg-gray-700"
      >
        ← Back to AI Tutor
      </Button>
      
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-center">
            <span className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🌍</span>
              <span>Choose Your Language</span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 text-center mb-6">
            Which language would you like to learn today?
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant="outline"
                className="h-24 bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-purple-400 text-white flex flex-col space-y-2 group"
                onClick={() => onLanguageSelect(lang.code)}
              >
                <span className="text-3xl">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguageSelector;
